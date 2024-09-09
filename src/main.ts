import "proto"
import {System, ECS} from "./ECS";
import "./ECSRegistry";
import {Debug} from "./Debug";
import {drawRate} from "./Statist";
import * as _ from "lodash";

function start() {
  _.filter([], a=>true)
  console.log("starting...");
  ECS.start()
}

function update() {
  ECS.update()
  ECS.saveCache()
  Debug.drawCPU()
  Debug.clearDebugData()
}


start();
export const loop = update;

