import {Component} from "./Component";
import {SpawnOrder} from "./ECS/data";
Component.ECSRef.registerComponent("SpawnOrder", SpawnOrder.fromObj)
import {FreeCreep} from "./ECS/data";
Component.ECSRef.registerComponent("FreeCreep", FreeCreep.fromObj)
import {Spawns} from "./ECS/data";
Component.ECSRef.registerComponent("Spawns", Spawns.fromObj)
import {RoomLink} from "./ECS/data";
Component.ECSRef.registerComponent("RoomLink", RoomLink.fromObj)
import {SpawnOrderInProgress} from "./ECS/data";
Component.ECSRef.registerComponent("SpawnOrderInProgress", SpawnOrderInProgress.fromObj)
