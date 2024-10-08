import {Component} from "../../Component";
import {EntityId} from "../../ECS";

export interface SpawnOrder extends Component {
  parts: BodyPartConstant[]
  creepName: string
  parentEntity: EntityId
}

export interface Spawns extends Component {
  spawns: StructureSpawn[],
}
export interface SpawnOrderInProgress extends Component {
  creepName: string
  parentEntity: EntityId
  spawn: StructureSpawn
}

//<editor-fold desc="Generated">
export class SpawnOrder implements SpawnOrder {
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
      obj.parentEntity,
      obj.id,
    )
  }
  reload() {
  }
}
export class Spawns implements Spawns {
  spawns: StructureSpawn[];
  id: string;
  constructor(spawns: StructureSpawn[], id: string = Component.generateId(), ) {
    this.spawns = spawns;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "Spawns" {
    return "Spawns"
  }
  static typeName = "Spawns"
  static decode(json: string) {
    return Spawns.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new Spawns(
      obj.spawns.map((item:any) => Game.spawns[item]),
      obj.id,
    )
  }
  reload() {
    this.spawns = this.spawns.map((item:any) => Game.spawns[item.name])
  }
}
export class SpawnOrderInProgress implements SpawnOrderInProgress {
  creepName: string;
  parentEntity: string;
  spawn: StructureSpawn;
  id: string;
  constructor(creepName: string, parentEntity: string, spawn: StructureSpawn, id: string = Component.generateId(), ) {
    this.creepName = creepName;
    this.parentEntity = parentEntity;
    this.spawn = spawn;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "SpawnOrderInProgress" {
    return "SpawnOrderInProgress"
  }
  static typeName = "SpawnOrderInProgress"
  static decode(json: string) {
    return SpawnOrderInProgress.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SpawnOrderInProgress(
      obj.creepName,
      obj.parentEntity,
      Game.spawns[obj.spawn],
      obj.id,
    )
  }
  reload() {
    this.spawn = Game.spawns[this.spawn.name]
  }
}

//</editor-fold>