import ts from "typescript";

import fs from 'fs';
import path from 'path';


const domainFile = "./src/_domain.ts"
const domainDestinationFile = "./src/domain.ts"

//parse

const program = ts.createProgram([domainFile], {})
const typeChecker = program.getTypeChecker()
const sourceFile = program.getSourceFile(domainFile)

const resultFile = ts.createSourceFile(
    domainDestinationFile,
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX
);

//get info

let interfaces = []
ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node)) {
        const interfaceName = node.name.escapedText
        let members = []

        node.members.forEach(member => {
            const memberName = member.name.escapedText
            const memberType = typeChecker.getTypeAtLocation(member)
            const memberTypeStr = typeChecker.typeToString(memberType)
            // console.log(member.type)
            // ts.isTypeOfExpression(memberType.type)


            members.push({
                name: memberName,
                type: memberTypeStr
            })
        })
        interfaces.push({
            name: interfaceName,
            members: members
        })
    }
})


// utils

function isKnownName(name) {
    return interfaces.some((value, _, __) => value.name === name)
}

// gen

let generated = ""
interfaces.forEach((intr) => {
    const name = intr.name
    const members = intr.members
    generated += `export class ${name} {\n`
    members.forEach(member => {
        generated += `  ${member.name}: ${member.type};\n`
    })
    generated += "  constructor("

    members.forEach(member => {
        generated += `${member.name}: ${member.type}, `
    })
    generated += ") {\n"
    members.forEach(member => {
        generated += `    this.${member.name} = ${member.name};\n`
    })
    generated += "  }\n"
    generated += "  encode() {\n"
    generated += "    return JSON.stringify(this)\n"
    generated += "  }\n"
    generated += "  static decode(json: string) {\n"
    generated += `    return ${name}.fromObj(JSON.parse(json))\n`
    generated += "  }\n"
    generated += "  static fromObj(obj: any) {\n"
    generated += `    return new ${name}(\n`
    members.forEach(member => {
        if (isKnownName(member.type))
            generated += `      ${member.type}.fromObj(obj.${member.name}),\n`
        else
            generated += `      obj.${member.name},\n`
    })
    generated += "    )\n"
    generated += "  }\n"
    generated += `}\n`
})

//save


fs.writeFile(domainDestinationFile, generated, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
})
