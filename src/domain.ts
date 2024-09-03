export class Lol {
  lol: string;
  constructor(lol: string, ) {
    this.lol = lol;
  }
  encode() {
    return JSON.stringify(this)
  }
  static decode(json: string) {
    return Lol.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new Lol(
      obj.lol,
    )
  }
}
export class Kek {
  a: number;
  b: Lol;
  constructor(a: number, b: Lol, ) {
    this.a = a;
    this.b = b;
  }
  encode() {
    return JSON.stringify(this)
  }
  static decode(json: string) {
    return Kek.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new Kek(
      obj.a,
      Lol.fromObj(obj.b),
    )
  }
}
