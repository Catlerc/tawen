import {System} from "./System";
import {DataType} from "../DataType";

interface SpawnOrder extends DataType {
  parts: string[]
}

interface SpawnerData extends DataType {
  queue: SpawnOrder[],
  spawner: StructureSpawn,
}

export class SpawnerSystem extends System<SpawnerData> {
  update(spawnerData: SpawnerData) {

  }
}

//<editor-fold desc="Generated">
class SpawnOrder {
  parts: string[];
  constructor(parts: string[], ) {
    this.parts = parts;
  }
  encode() {
    return JSON.stringify(this)
  }
  static decode(json: string) {
    return SpawnOrder.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnOrder(
      obj.parts,
    )
  }
}
class SpawnerData {
  queue: SpawnOrder[];
  spawner: StructureSpawn;
  constructor(queue: SpawnOrder[], spawner: StructureSpawn, ) {
    this.queue = queue;
    this.spawner = spawner;
  }
  encode() {
    return JSON.stringify(this)
  }
  static decode(json: string) {
    return SpawnerData.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnerData(
      obj.queue.map((item:any) => SpawnOrder.fromObj(item)),
      Game.spawns[obj.spawner],
    )
  }
}

//</editor-fold>