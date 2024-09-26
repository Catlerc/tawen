import {Component} from "../Component";
import {EntityId} from "../ECS";


export interface RoomLink extends Component {
  room: Room
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

//</editor-fold>