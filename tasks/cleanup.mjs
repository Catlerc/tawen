import fs from 'fs';


const TMP_DIR = "./_tmp"

fs.rmSync(TMP_DIR, {recursive: true})