import {Component} from "../Component";
import {registerSystem, ECS} from "../ECS";
import {CreepLink} from "./data";
import {MoveTarget} from "./Moving";
import {logError, mapError} from "../utils";
import {one} from "../ComponentSelector";


export interface HarvestTarget extends Component {
  source: Source
}


//<editor-fold desc="Generated">
export class HarvestTarget implements HarvestTarget {
  source: Source;
  id: string;
  constructor(source: Source, id: string = Component.generateId(), ) {
    this.source = source;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "HarvestTarget" {
    return "HarvestTarget"
  }
  static typeName = "HarvestTarget"
  static decode(json: string) {
    return HarvestTarget.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new HarvestTarget(
      obj.source,
      obj.id,
    )
  }
  reload() {
  }
}

//</editor-fold>

registerSystem("HarvestingSystem", one(HarvestTarget).one(CreepLink).not(MoveTarget),
  query => {
    const res = query.creepLink.creep.harvest(query.harvestTarget.source)
    switch (res) {
      case OK:
        break;
      case ERR_NOT_IN_RANGE:
        ECS.addComponent(query.entityId, new MoveTarget(query.harvestTarget.source.pos))
        break;
      default:
        logError(`HarvestingSystem: failed with ${mapError(res)}`)
        break;
    }
  }
)