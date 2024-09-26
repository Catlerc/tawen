import {ECS, registerSystem} from "../ECS";
import {Spawns, SpawnOrder, SpawnOrderInProgress, FreeCreep} from "./data";
import * as _ from "lodash";
import {mapError, logError} from "../utils";



registerSystem(
  "CreepFactoryOutbox",
  [Spawns, SpawnOrderInProgress],
  query => {

    console.log("kek WIP ", query.spawnOrderInProgress.spawn.spawning)
    if (query.spawnOrderInProgress.spawn.spawning === null) {
      ECS.removeComponent(query.entityId, query.spawnOrderInProgress)
      ECS.addComponent(query.spawnOrderInProgress.parentEntity, new FreeCreep(Game.creeps[query.spawnOrderInProgress.creepName]))
      console.log("DONE ", query.spawnOrderInProgress.creepName, "  " + Game.creeps[query.spawnOrderInProgress.creepName])
    }
  }
)

registerSystem(
  "CreepFactory",
  [Spawns, SpawnOrder],
  query => {

    const freeSpawn = _.find(query.spawns.spawns, spawn => spawn.spawning === null)
    if (freeSpawn) {
      const res = freeSpawn.spawnCreep(query.spawnOrder.parts, query.spawnOrder.creepName)
      if (res === OK) {
        ECS.removeComponent(query.entityId, query.spawnOrder)
        ECS.addComponent(query.entityId, new SpawnOrderInProgress(query.spawnOrder.creepName, "nope", freeSpawn))
      } else logError(`Cannot spawn creep. code:${mapError(res)}`)
    }
  }
)
