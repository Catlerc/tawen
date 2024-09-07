import "proto"
import {System, ECS} from "./ECS";
import  "./ECSRegistry";
import {Debug} from "./Debug";

function start() {
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
