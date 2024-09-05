import {System} from "./System";



export class EnergyHarvestSystem extends System<number> {
  update(t: number) {
    console.log(t)
  }
}