export function generateRandomHex() {
  const hexChars = '0123456789ABCDEF';

  let hexString = '';
  const length = 10
  for (let i = 0; i < length; i++) {
    const charIndex = Math.floor(Math.random() * hexChars.length);
    hexString += hexChars[charIndex];
  }

  return hexString;
}