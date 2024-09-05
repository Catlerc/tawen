import {System} from "./System";
import {DataType} from "../DataType";
import {generateRandomHex} from "../utils";

interface SpawnOrder extends DataType {
  parts: BodyPartConstant[]
}

export interface SpawnerData extends DataType {
  queue: SpawnOrder[],
  spawner: StructureSpawn,
}

export class SpawnerSystem extends System<SpawnerData> {
  update(spawnerData: SpawnerData) {
    if (spawnerData.spawner.spawning === null)
    {
      const toSpawn = spawnerData.queue.shift()!
      spawnerData.spawner.spawnCreep(toSpawn.parts, generateRandomHex() )
    }
  }
}

//<editor-fold desc="Generated">
class SpawnOrder {
  parts: BodyPartConstant[];
  constructor(parts: BodyPartConstant[], ) {
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
export class SpawnerData {
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