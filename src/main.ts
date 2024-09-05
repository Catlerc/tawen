import {System, Systems} from "./Systems/System";
import {EnergyHarvestSystem} from "./Systems/EnergyHarvestSystem";

function start() {
  console.log("starting...");

  Systems.register(new EnergyHarvestSystem)
  Systems.start()
}

function update() {
  console.log("update..")
  Systems.update()
  Systems.dump()
}


start();
export const loop = update;