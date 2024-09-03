import {Kek, Lol} from "./domain";
// import realLoop from "./Loop";
//
// realLoop.start()
// export const loop = realLoop.update
//



const json = new Kek(42, new Lol("test")).encode()

console.log(json)
console.log(Kek.decode(json).encode()+"!!!!")