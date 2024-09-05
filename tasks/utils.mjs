import fs from "fs";

export function recDirWalker(path) {
  let files = []
  fs.readdirSync(path).forEach(fileName => {
    const filePath = path + "/" + fileName
    const stats = fs.statSync(filePath)

    if (stats.isFile())
      files.push(filePath)
    else
      files.push(...recDirWalker(filePath))
  });
  return files;
}

export function replaceFromTo(str, startIndex, endIndex, newContent) {
  return str.slice(0, startIndex)  + newContent + str.slice(endIndex)
}

export function readFile(path) {
  return fs.readFileSync(path).toString()
}

export function writeFile(path, str) {
  fs.writeFileSync(path, str)
}
