import "proto"
import {System, Systems} from "./Systems/System";
import {EnergyHarvestSystem} from "./Systems/EnergyHarvestSystem";
import {DataType} from "./DataType";
import {SpawnerData, SpawnerSystem} from "./Systems/SpawnerSystem";

function start() {
  console.log("starting...");

  console.log(JSON.stringify(Game.spawns["Spawn1"].room));

  const spawn = new SpawnerSystem
  spawn.instantiate(new SpawnerData([], Game.spawns["Spawn1"]))
  Systems.register(spawn)
  Systems.start()
}

function update() {
  console.log("update..")
  Systems.update()
  Systems.dump()
}


start();
export const loop = update;
