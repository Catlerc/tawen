import "proto"
import {System, ECS} from "./ECS";
import  "./ECSRegistry";

function start() {
  console.log("starting...");
  ECS.start()
}

function update() {
  ECS.update()
  ECS.saveCache()
}


start();
export const loop = update;

declare global {
  interface DataType {
    typeName: string;
  }
}

