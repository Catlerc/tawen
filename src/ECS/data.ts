import {Component} from "../Component";
import {EntityId} from "../ECS";


export interface RoomLink extends Component {
  room: Room
}




export interface CreepLink extends Component {
  creep: Creep
}




//<editor-fold desc="Generated">
export class RoomLink implements RoomLink {
  room: Room;
  id: string;
  constructor(room: Room, id: string = Component.generateId(), ) {
    this.room = room;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "RoomLink" {
    return "RoomLink"
  }
  static typeName = "RoomLink"
  static decode(json: string) {
    return RoomLink.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new RoomLink(
      Game.rooms[obj.room],
      obj.id,
    )
  }
  reload() {
    this.room = Game.rooms[this.room.name]
  }
}
export class CreepLink implements CreepLink {
  creep: Creep;
  id: string;
  constructor(creep: Creep, id: string = Component.generateId(), ) {
    this.creep = creep;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "CreepLink" {
    return "CreepLink"
  }
  static typeName = "CreepLink"
  static decode(json: string) {
    return CreepLink.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new CreepLink(
      Game.creeps[obj.creep],
      obj.id,
    )
  }
  reload() {
    this.creep = Game.creeps[this.creep.name]
  }
}

//</editor-fold>