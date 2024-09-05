import fs from 'fs';
import {replaceFromTo, recDirWalker, readFile, writeFile} from "./utils.mjs";


const SRC_DIR = "./src"
const TMP_DIR = "./_tmp"
const DIST_DIR = "./dist"

const importRegEx = /from(\s+)"(.+?)"/g

function findMatches(regex, str) {
  return [...str.matchAll(regex)]
}

function getImports(code) {
  let imports = []
  let matches = findMatches(importRegEx, code)
  matches.forEach(match => {
    imports.push({
      index: match.index + 5 + match[1].length, //5 because 'from' and " in regex
      length: match[2].length,
      value: match[2]
    })
  })
  return imports.reverse()
}


function partsToName(parts) {
  return parts.join("__")
}




// fs.rmSync(DIST_DIR, { recursive: true })

const files = recDirWalker(SRC_DIR)

let nestedFiles = []

files.forEach(fileName => {
  const nameParts = fileName.split("/").slice(2)
  const nameSplit = nameParts.at(-1).split(".")
  nestedFiles.push({
    path: fileName,
    importParts: nameParts.slice(0, -1),
    moduleName: nameSplit[0],
    flattenName: partsToName(nameParts).split(".")[0],
    extension: nameSplit[1]
  })
})

if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, {recursive: true})
fs.mkdirSync(TMP_DIR)


nestedFiles.forEach(file => {
  const code = readFile(file.path)
  const imports = getImports(code)

  let codeWithImports = code

  imports.forEach(imprt => {
    let value = imprt.value
    if (value.startsWith("./")) value = value.substring(2)
    const importNormLocal = value.split("/")
    const importNorm = file.importParts.concat(importNormLocal)


    let importRes
    if (fs.existsSync(SRC_DIR + "/" + importNorm.join("/") + ".ts"))
      importRes = partsToName(importNorm)
    else
      importRes = partsToName(importNormLocal)
    codeWithImports = replaceFromTo(codeWithImports, imprt.index, imprt.index + imprt.length, "./" + importRes)
  })
  writeFile(TMP_DIR + "/" + file.flattenName + "." + file.extension, codeWithImports)
})

