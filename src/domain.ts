import {DataType} from "./DataType/DataType";

interface Lol extends DataType {
  lol:number
}

interface Kek extends DataType {
  loler: Lol
}


//<editor-fold desc="Generated">
class Lol {
  lol: number;
  constructor(lol: number, ) {
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
class Kek {
  loler: Lol;
  constructor(loler: Lol, ) {
    this.loler = loler;
  }
  encode() {
    return JSON.stringify(this)
  }
  static decode(json: string) {
    return Kek.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new Kek(
      Lol.fromObj(obj.loler),
    )
  }
}

//</editor-fold>