import {ECS, EntityId, registerSystem, System} from "../ECS";
import {generateRandomHex} from "../utils";
import {Component} from "../Component";
import {DataType} from "../DataType";

export interface SpawnOrderComponent extends Component {
  parts: BodyPartConstant[]
  creepName: string
  parentEntity: EntityId
}
export interface SpawnOrderDoneComponent extends Component {
  creep: Creep
}

export interface SpawnerComponent extends Component {
  spawner: StructureSpawn,
}


//<editor-fold desc="Generated">
export class SpawnOrderComponent implements SpawnOrderComponent {
  parts: BodyPartConstant[];
  creepName: string;
  parentEntity: string;
  id: string;
  constructor(parts: BodyPartConstant[], creepName: string, parentEntity: string, id: string = Component.generateId(), ) {
    this.parts = parts;
    this.creepName = creepName;
    this.parentEntity = parentEntity;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "SpawnOrderComponent" {
    return "SpawnOrderComponent"
  }
  static typeName = "SpawnOrderComponent"
  static decode(json: string) {
    return SpawnOrderComponent.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnOrderComponent(
      obj.parts,
      obj.creepName,
      obj.parentEntity,
      obj.id,
    )
  }
}
export class SpawnOrderDoneComponent implements SpawnOrderDoneComponent {
  creep: Creep;
  id: string;
  constructor(creep: Creep, id: string = Component.generateId(), ) {
    this.creep = creep;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "SpawnOrderDoneComponent" {
    return "SpawnOrderDoneComponent"
  }
  static typeName = "SpawnOrderDoneComponent"
  static decode(json: string) {
    return SpawnOrderDoneComponent.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnOrderDoneComponent(
      Game.creeps[obj.creep],
      obj.id,
    )
  }
}
export class SpawnerComponent implements SpawnerComponent {
  spawner: StructureSpawn;
  id: string;
  constructor(spawner: StructureSpawn, id: string = Component.generateId(), ) {
    this.spawner = spawner;
    this.id = id;
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
      Game.spawns[obj.spawner],
      obj.id,
    )
  }
}

//</editor-fold>

registerSystem(
  "SpawnerSystem",
  [SpawnerComponent, SpawnOrderComponent],
  query => {
    const res = query.spawner.spawner.spawnCreep(query.spawnOrder.parts, query.spawnOrder.creepName)
    if (res === OK) {
      const spawning = query.spawner.spawner.spawning
      console.log(spawning)
      // ECS.getComponent(SpawnOrderComponent, query.spawnOrder.)
      // ECS.addComponent(query.spawnOrder.parentEntity, new SpawnOrderDoneComponent(Game.creeps[spawning!.name]))

      ECS.removeComponent(query.entityId, query.spawnOrder)
      return;
    } else
      console.log("cannot spawn creep. code:" + res)
  }
)