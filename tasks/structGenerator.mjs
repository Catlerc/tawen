import ts from "typescript";

import {readFile, recDirWalker, replaceFromTo, writeFile, partsToName} from "./utils.mjs";

const SRC = "./src"
const ECS_REGISTRY_FILE = "./src/ECSRegistry.ts"
const GEN_COMMENT_START = '//<editor-fold desc="Generated">'
const GEN_COMMENT_END = '//</editor-fold>'
const DATATYPE_NAMES = ["DataType", "Component"]


function isArray(node) {
  return typeChecker.isArrayType(node)
}

function getDataTypeType(node) {
  for (const baseType of typeChecker.getBaseTypes(node)) {
    if (DATATYPE_NAMES.includes(baseType.symbol?.escapedName)) return baseType.symbol?.escapedName
  }
}

function isDataTypeForType(node) {
  if (node.symbol === undefined) return false
  for (const baseType of typeChecker.getBaseTypes(node)) {
    if (DATATYPE_NAMES.includes(baseType.symbol?.escapedName)) return true
  }
  return false
}


let toRegister = []

const fileNames = recDirWalker(SRC)

const program = ts.createProgram(fileNames, {})
const typeChecker = program.getTypeChecker()
let allInterfaces = []
for (const fileName of fileNames) {
  const sourceFile = program.getSourceFile(fileName)
  let interfaces = []
  ts.forEachChild(sourceFile, (node) => {

    if (ts.isInterfaceDeclaration(node) && isDataTypeForType(node)) {

      const interfaceName = node.name.escapedText
      let members = []

      for (const member of node.members) {
        const memberName = member.name.escapedText
        const memberType = typeChecker.getTypeAtLocation(member)
        const isArrayFlag = isArray(memberType)
        const isDataTypeFlag = isArrayFlag ? isDataTypeForType(memberType.resolvedTypeArguments[0]) : isDataTypeForType(memberType)
        const isOptional = member.questionToken !== undefined
        const memberTypeStr = isArrayFlag ? typeChecker.typeToString(memberType.resolvedTypeArguments[0]) : typeChecker.typeToString(memberType, ts.TypeFormatFlags.UseFullyQualifiedType | ts.InTypeAlias)
        members.push({
          name: memberName,
          type: memberTypeStr,
          isDataType: isDataTypeFlag,
          isArray: isArrayFlag,
          isOptional: isOptional
        })
      }

      const isExport = (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0
      const tpe = getDataTypeType(node)

      if (tpe === "Component") {
        members.push({
          name: "id", type: "string", isDataType: false, isArray: false, isId: true
        })
      }

      const intr = {
        name: interfaceName, members: members, isExport: isExport | tpe === "Component", tpe: tpe, fileName: fileName
      }
      interfaces.push(intr)
      allInterfaces.push(intr)
    }
  })

  //GENERATE

  let generated = ""

  for (const intr of interfaces) {
    const name = intr.name
    const members = intr.members
    if (intr.isExport)
      generated += `export `
    generated += `class ${name} implements ${name} {\n`

    for (const member of members) {
      const arrayPart = member.isArray ? "[]" : ""
      generated += `  ${member.name}${member.isOptional ? "?" : ""}: ${member.type}${arrayPart};\n`
    }
    generated += "  constructor("
    for (const member of members) {

      if (member.isId) {
        generated += `${member.name}${member.isOptional ? "?" : ""}: ${member.type} = Component.generateId(), `
      } else {
        const arrayPart = member.isArray ? "[]" : ""
        generated += `${member.name}${member.isOptional ? "?" : ""}: ${member.type}${arrayPart}, `
      }
    }
    generated += ") {\n"
    for (const member of members) {
      generated += `    this.${member.name} = ${member.name};\n`
    }
    generated += "  }\n"
    // encode
    generated += "  encode() {\n"
    generated += "    return JSON.stringify(this)\n"
    generated += "  }\n"
    // function typeName
    generated += `  public get typeName(): "${name}" {\n`
    generated += `    return "${name}"\n`
    generated += "  }\n"
    // constant typeName
    generated += `  static typeName = "${name}"\n`
    // decode
    generated += "  static decode(json: string) {\n"
    generated += `    return ${name}.fromObj(JSON.parse(json))\n`
    generated += "  }\n"
    // fromObj
    generated += "  static fromObj(obj: any) {\n"
    generated += `    return new ${name}(\n`

    const decoderMapper = {
      "Room": (x) => `Game.rooms[${x}]`,
      "StructureSpawn": (x) => `Game.spawns[${x}]`,
      "Creep": (x) => `Game.creeps[${x}]`
    }

    for (const member of members) {
      if (member.isDataType)
        if (member.isArray)
          generated += `      obj.${member.name}.map((item:any) => ${member.type}.fromObj(item)),\n`
        else
          generated += `      ${member.type}.fromObj(obj.${member.name}),\n`
      else if (member.type in decoderMapper) {
        const decoder = decoderMapper[member.type]
        if (member.isArray)
          if (member.isOptional)
            generated += `      obj.${member.name}.map((item:any) => item === undefined ? undefined : ${decoder("item")}),\n`
          else
            generated += `      obj.${member.name}.map((item:any) => ${decoder("item")}),\n`
        else if (member.isOptional)
          generated += `      obj.${member.name} === undefined ? undefined : ${decoder(`obj.${member.name}`)},\n`
        else
          generated += `      ${decoder(`obj.${member.name}`)},\n`
      } else
        generated += `      obj.${member.name},\n`
    }
    generated += "    )\n"
    generated += "  }\n"
    // reload
    generated += "  reload() {\n"
    for (const member of members) {
      if (member.type in decoderMapper) {
        const decoder = decoderMapper[member.type]
        if (member.isArray)
          if (member.isOptional)
            generated += `    this.${member.name} = this.${member.name}.map((item:any) => item === undefined ? undefined :  ${decoder("item.name")})\n`
          else
            generated += `    this.${member.name} = this.${member.name}.map((item:any) => ${decoder("item.name")})\n`
        else if (member.isOptional)
          generated += `    this.${member.name} = this.${member.name} === undefined ? undefined : ${decoder(`this.${member.name}.name`)}\n`
        else
          generated += `    this.${member.name} = ${decoder(`this.${member.name}.name`)}\n`
      }
    }
    generated += "  }\n"
    // end
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

let registryGenerated = ""
registryGenerated += `import {Component} from "./Component";\n`
registryGenerated += `\n// IT'S ALL GENERATED!\n\n`
for (const intr of allInterfaces) {
  if (intr.tpe === "Component") {
    const importPath = intr.fileName.slice(SRC.length + 1, -3)
    registryGenerated += `import {${intr.name}} from "./${importPath}";\n`
    registryGenerated += `Component.ECSRef.registerComponent("${intr.name}", ${intr.name}.fromObj)\n`
  }
}

writeFile(ECS_REGISTRY_FILE, registryGenerated)