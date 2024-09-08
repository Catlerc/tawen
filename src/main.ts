import "proto"
import {System, ECS} from "./ECS";
import "./ECSRegistry";
import {Debug} from "./Debug";
import {drawRate} from "./Statist";

function start() {
  console.log("starting...");
  ECS.start()


}

function update() {
  const room = new Room("W45S12")

  drawRate(room)

  ECS.update()
  ECS.saveCache()
  // Debug.drawCPU()
  Debug.clearDebugData()
}


start();
export const loop = update;
