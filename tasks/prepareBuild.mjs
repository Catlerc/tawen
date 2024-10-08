import fs from 'fs';
import {replaceFromTo, recDirWalker, readFile, writeFile, partsToName} from "./utils.mjs";


const SRC_DIR = "./src"
const TMP_DIR = "./_tmp"
const DIST_DIR = "./dist"

const importRegEx = /(from|import)(\s+)"(.+?)"/g

function findMatches(regex, str) {
  return [...str.matchAll(regex)]
}

function getImports(code) {
  let imports = []
  let matches = findMatches(importRegEx, code)
  matches.forEach(match => {
    imports.push({
      index: match.index + 1 + match[2].length + match[1].length, //5 because 'from' and " in regex
      length: match[3].length,
      value: match[3]
    })
  })
  return imports.reverse()
}


function shortenPath(pathParts) {
  let res = []
  pathParts.forEach(part => {
    switch (part) {
      case ".":
        break;
      case "..":
        res.pop()
        break;
      default:
        res.push(part)
    }
  })
  return res
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
    const importNormLocal = value.split("/")
    const importNorm = shortenPath(file.importParts.concat(importNormLocal))


    let importRes
    const path = SRC_DIR + "/" + importNorm.join("/")
    if (fs.existsSync(path + ".ts") || fs.existsSync(path + ".js"))
      importRes = partsToName(importNorm)
    else
      importRes = partsToName(importNormLocal)
    const isGlobalImport = !value.startsWith("./")
    codeWithImports = replaceFromTo(codeWithImports, imprt.index, imprt.index + imprt.length, (isGlobalImport ? "" : "./") + importRes)
  })
  writeFile(TMP_DIR + "/" + file.flattenName + "." + file.extension, codeWithImports)
})

