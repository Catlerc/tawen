export function generateRandomHex() {
  const hexChars = '0123456789ABCDEF';

  let hexString = '';
  const length = 5
  for (let i = 0; i < length; i++) {
    const charIndex = Math.floor(Math.random() * hexChars.length);
    hexString += hexChars[charIndex];
  }

  return hexString;
}


const errors: {
  [key: number]: string
} = {
  [0]: "OK",
  [-1]: "ERR_NOT_OWNER",
  [-2]: "ERR_NO_PATH",
  [-3]: "ERR_NAME_EXISTS",
  [-4]: "ERR_BUSY",
  [-5]: "ERR_NOT_FOUND",
  [-6]: "ERR_NOT_ENOUGH_RES",
  [-7]: "ERR_INVALID_TARGET",
  [-8]: "ERR_FULL",
  [-9]: "ERR_NOT_IN_RANGE",
  [-10]: "ERR_INVALID_ARGS",
  [-11]: "ERR_TIRED",
  [-12]: "ERR_NO_BODYPART",
  [-14]: "ERR_RCL_NOT_ENOUGH",
  [-15]: "ERR_GCL_NOT_ENOUGH",
}

export function mapError(errInt: number): string {
  return errors[errInt]
}


export function logInfo(...strs: any[]) {
  console.log(strs.join(" "))
}

export function logWarn(...strs: any[]) {
  console.log(`<span style="color: #DDDD33; ">${strs.join(" ")}</span>`)
}

export function logError(...strs: any[]) {
  console.log(`<span style="color: #FF3333; ">${strs.join(" ")}</span>`)
}