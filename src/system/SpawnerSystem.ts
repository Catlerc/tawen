import {registerSystem, System} from "../ECS";
import {generateRandomHex} from "../utils";
import {Component} from "../Component";
import {DataType} from "../DataType";

export interface SpawnOrder extends DataType {
  parts: BodyPartConstant[]
  creepName: string
}

export interface SpawnerComponent extends Component {
  queue: SpawnOrder[],
  spawner: StructureSpawn,
}


//<editor-fold desc="Generated">
export class SpawnOrder implements SpawnOrder {
  parts: BodyPartConstant[];
  creepName: string;
  constructor(parts: BodyPartConstant[], creepName: string, ) {
    this.parts = parts;
    this.creepName = creepName;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "SpawnOrder" {
    return "SpawnOrder"
  }
  static typeName = "SpawnOrder"
  static decode(json: string) {
    return SpawnOrder.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnOrder(
      obj.parts,
      obj.creepName,
    )
  }
}
export class SpawnerComponent implements SpawnerComponent {
  queue: SpawnOrder[];
  spawner: StructureSpawn;
  constructor(queue: SpawnOrder[], spawner: StructureSpawn, ) {
    this.queue = queue;
    this.spawner = spawner;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "SpawnerComponent" {
    return "SpawnerComponent"
  }
  static typeName = "SpawnerComponent"
  static decode(json: string) {
    return SpawnerComponent.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnerComponent(
      obj.queue.map((item:any) => SpawnOrder.fromObj(item)),
      Game.spawns[obj.spawner],
    )
  }
}

//</editor-fold>

registerSystem(
  "SpawnerSystem",
  [SpawnerComponent],
  function* (query) {
    console.log("1")
    yield 1
    console.log("2")
    yield 3
    console.log("3")
    yield 4


    const toSpawn = query.spawner.queue.shift()
    if (toSpawn === undefined) return
    const res = query.spawner.spawner.spawnCreep(toSpawn.parts, toSpawn.creepName)
    if (res === OK) return;

    query.spawner.queue.push(toSpawn)
    console.log("cannot spawn creep. code:"+res)
  }
)