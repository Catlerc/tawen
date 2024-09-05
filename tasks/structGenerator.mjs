import ts from "typescript";

import {readFile, recDirWalker, replaceFromTo, writeFile} from "./utils.mjs";

const SRC = "./src"
const GEN_COMMENT_START = '//<editor-fold desc="Generated">'
const GEN_COMMENT_END = '//</editor-fold>'

function isDataTypeForInterface(node) {
  if (ts.isInterfaceDeclaration(node)) {
    //FOR INTERFACE
    if (node.heritageClauses === undefined) return false
    for (let i = 0; i < node.heritageClauses.length; i++) {
      for (let j = 0; j < node.heritageClauses[i].types.length; j++) {
        if (node.heritageClauses[i].types[j].expression.escapedText === "DataType") return true
      }
    }
    return false
  }
  return false


}

function isArray(node) {
  return typeChecker.isArrayType(node)

}


function isDataTypeForType(node) {
  if (node.symbol === undefined) return false
  for (const baseType of typeChecker.getBaseTypes(node)) {
    if (baseType.symbol?.escapedName === "DataType") return true
  }
  return false
}


const fileNames = recDirWalker(SRC)

const program = ts.createProgram(fileNames, {})
const typeChecker = program.getTypeChecker()
for (const fileName of fileNames) {
  const sourceFile = program.getSourceFile(fileName)
  let interfaces = []
  ts.forEachChild(sourceFile, (node) => {

    if (ts.isInterfaceDeclaration(node) && isDataTypeForInterface(node)) {
      const interfaceName = node.name.escapedText
      let members = []
      for (const member of node.members) {
        const memberName = member.name.escapedText
        const memberType = typeChecker.getTypeAtLocation(member)
        const isArrayFlag = isArray(memberType)
        const isDataTypeFlag = isArrayFlag ? isDataTypeForType(memberType.resolvedTypeArguments[0]) : isDataTypeForType(memberType)

        const memberTypeStr = isArrayFlag ? typeChecker.typeToString(memberType.resolvedTypeArguments[0]) : typeChecker.typeToString(memberType)
        members.push({
          name: memberName, type: memberTypeStr, isDataType: isDataTypeFlag, isArray: isArrayFlag
        })
      }
      interfaces.push({
        name: interfaceName, members: members
      })
    }
  })

  //GENERATE

  let generated = ""

  for (const intr of interfaces) {
    const name = intr.name
    const members = intr.members
    generated += `class ${name} {\n`

    for (const member of members) {
      const arrayPart = member.isArray ? "[]" : ""
      generated += `  ${member.name}: ${member.type}${arrayPart};\n`
    }
    generated += "  constructor("

    for (const member of members) {
      const arrayPart = member.isArray ? "[]" : ""
      generated += `${member.name}: ${member.type}${arrayPart}, `
    }
    generated += ") {\n"
    for (const member of members) {
      generated += `    this.${member.name} = ${member.name};\n`
    }
    generated += "  }\n"
    generated += "  encode() {\n"
    generated += "    return JSON.stringify(this)\n"
    generated += "  }\n"
    generated += "  static decode(json: string) {\n"
    generated += `    return ${name}.fromObj(JSON.parse(json))\n`
    generated += "  }\n"
    generated += "  static fromObj(obj: any) {\n"
    generated += `    return new ${name}(\n`

    const decoderMapper = {
      "Room": (x) => `Game.rooms[${x}]`,
      "StructureSpawn": (x) => `Game.spawns[${x}]`,
      "Creep": (x) => `Game.creeps[${x}]`
    }
    members.forEach(member => {

      if (member.isDataType)
        if (member.isArray)
          generated += `      obj.${member.name}.map((item:any) => ${member.type}.fromObj(item)),\n`
        else
          generated += `      ${member.type}.fromObj(obj.${member.name}),\n`
      else

        if (member.type in decoderMapper) {
          const decoder = decoderMapper[member.type]
          if (member.isArray)
            generated += `      obj.${member.name}.map((item:any) => ${decoder("item")}),,\n`
          else
            generated += `      ${decoder(`obj.${member.name}`)},\n`
        }
        else
          generated += `      obj.${member.name},\n`
    })
    generated += "    )\n"
    generated += "  }\n"
    generated += "}\n"
  }
  // SAVE
  const oldFile = readFile(fileName)
  const insert = GEN_COMMENT_START + "\n" + generated + "\n" + GEN_COMMENT_END
  const startIndex = oldFile.indexOf(GEN_COMMENT_START)
  const endIndexRaw = oldFile.indexOf(GEN_COMMENT_END)
  const endIndex = endIndexRaw === -1 ? oldFile.length : endIndexRaw + GEN_COMMENT_END.length
  let generatedFileContent
  if (startIndex >= 0) {
    if (interfaces.length === 0)
      generatedFileContent = replaceFromTo(oldFile, startIndex, endIndex, "")
    else
      generatedFileContent = replaceFromTo(oldFile, startIndex, endIndex, insert)
  } else {
    if (interfaces.length === 0)
      generatedFileContent = oldFile
    else
      generatedFileContent = oldFile + "\n" + insert
  }


  writeFile(fileName, generatedFileContent)
}