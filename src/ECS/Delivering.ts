import {Component} from "../Component";
import {ECS, registerSystem} from "../ECS";
import {CreepLink} from "./data";
import {MoveTarget} from "./Moving";
import {logError, mapError} from "../utils";
import {HarvestTarget} from "./Harvesting";

export interface DeliveryTarget extends Component {
  structure: Structure
}



//<editor-fold desc="Generated">
export class DeliveryTarget implements DeliveryTarget {
  structure: Structure<StructureConstant>;
  id: string;
  constructor(structure: Structure<StructureConstant>, id: string = Component.generateId(), ) {
    this.structure = structure;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "DeliveryTarget" {
    return "DeliveryTarget"
  }
  static typeName = "DeliveryTarget"
  static decode(json: string) {
    return DeliveryTarget.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new DeliveryTarget(
      obj.structure,
      obj.id,
    )
  }
  reload() {
  }
}

//</editor-fold>

// registerSystem("DeliverySystem", [DeliveryTarget, CreepLink, not(MoveTarget)], //NOT MoveTarget
//   query => {
//     query.
//   }
// )