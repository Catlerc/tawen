import {ECS} from "./ECS"
import {initRoom} from "./ECS/commands";

// @ts-ignore
Room.prototype.toJSON = function () {
  return this.name // rooms
}
// @ts-ignore
Creep.prototype.toJSON = function () {
  return this.name // creeps
}
// @ts-ignore
StructureSpawn.prototype.toJSON = function () {
  return this.name // spawns
}

declare global {
  let global: any
}


global.purge = ECS.purge
global.ECS = ECS
global.initRoom = initRoom
global.kill = false
