import "patches"
import {System, ECS} from "./ECS";
import "./ECSRegistry";
import {Debug} from "./Debug";
import "./ECS/systems"
import {logError} from "./utils";

function start() {
  console.log("starting...");
  try {
    ECS.start()
  } catch (e) {
    logError("ERROR", e)
    logError("PURGE")
    ECS.purge()
  }
}

function update() {
  ECS.update()
  ECS.saveCache()
  Debug.drawCPU()
  Debug.clearDebugData()
}


start();
export const loop = update;

