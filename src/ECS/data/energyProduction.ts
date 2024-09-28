import {Component} from "../../Component";
import {EntityId} from "../../ECS";

export interface SourceLine extends Component {
  source: Source
  miner?: Creep
  currier?: Creep
}



//<editor-fold desc="Generated">
export class SourceLine implements SourceLine {
  source: Source;
  miner?: Creep;
  currier?: Creep;
  id: string;
  constructor(source: Source, miner?: Creep, currier?: Creep, id: string = Component.generateId(), ) {
    this.source = source;
    this.miner = miner;
    this.currier = currier;
    this.id = id;
  }
  encode() {
    return JSON.stringify(this)
  }
  public get typeName(): "SourceLine" {
    return "SourceLine"
  }
  static typeName = "SourceLine"
  static decode(json: string) {
    return SourceLine.fromObj(JSON.parse(json))
  }
  static fromObj(obj: any) {
    return new SourceLine(
      obj.source,
      obj.miner === undefined ? undefined : Game.creeps[obj.miner],
      obj.currier === undefined ? undefined : Game.creeps[obj.currier],
      obj.id,
    )
  }
  reload() {
    this.miner = this.miner === undefined ? undefined : Game.creeps[this.miner.name]
    this.currier = this.currier === undefined ? undefined : Game.creeps[this.currier.name]
  }
}

//</editor-fold>