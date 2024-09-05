import {registerSystem, System} from "../ECS";
import {generateRandomHex} from "../utils";
import {Component} from "../Component";

export interface SpawnOrder extends DataType {
  parts: BodyPartConstant[]
}

export interface SpawnerComponent extends Component {
  queue: SpawnOrder[],
  spawner: StructureSpawn,
}


//<editor-fold desc="Generated">
export class SpawnOrder implements SpawnOrder {
  parts: BodyPartConstant[];
  constructor(parts: BodyPartConstant[], ) {
    this.parts = parts;
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
  query => {
    const toSpawn = query.spawner.queue.shift()
    if (toSpawn === undefined) return
    query.spawner.spawner.spawnCreep(toSpawn.parts, generateRandomHex())
  }
)