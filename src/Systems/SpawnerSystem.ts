import {System} from "./System";
import {DataType} from "../DataType";

interface Kek extends DataType {
  g: string
}

interface SpawnEntity extends DataType {
  a: number[],
  keks: Kek[]
}

export class SpawnerSystem extends System<SpawnEntity> {
  update(t: SpawnEntity) {
    console.log(t)
  }
}

//<editor-fold desc="Generated">
class Kek {
  g: string;
  constructor(g: string, ) {
    this.g = g;
  }
  encode() {
    return JSON.stringify(this)
  }
  static decode(json: string) {
    return Kek.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new Kek(
      obj.g,
    )
  }
}
class SpawnEntity {
  a: number[];
  keks: Kek[];
  constructor(a: number[], keks: Kek[], ) {
    this.a = a;
    this.keks = keks;
  }
  encode() {
    return JSON.stringify(this)
  }
  static decode(json: string) {
    return SpawnEntity.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnEntity(
      obj.a,
      obj.keks.map((item:any) => Kek.fromObj(item)),
    )
  }
}

//</editor-fold>