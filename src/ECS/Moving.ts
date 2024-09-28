import {Component} from "../Component";
import {registerSystem} from "../ECS";
import {CreepLink} from "./data";
import {one} from "../ComponentSelector";

export interface MoveTarget extends Component {
  pos: RoomPosition
}

//<editor-fold desc="Generated">
export class MoveTarget implements MoveTarget {
  pos: RoomPosition;
  id: string;
  constructor(pos: RoomPosition, id: string = Component.generateId(), ) {
    this.pos = pos;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "MoveTarget" {
    return "MoveTarget"
  }
  static typeName = "MoveTarget"
  static decode(json: string) {
    return MoveTarget.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new MoveTarget(
      obj.pos,
      obj.id,
    )
  }
  reload() {
  }
}

//</editor-fold>


registerSystem("MovingSystem", one(MoveTarget).one(CreepLink),
  query => {
    query.creepLink.creep.moveTo(query.moveTarget.pos, {
      visualizePathStyle: {
        fill: "gray"
      }
    })
  }
)