import {Component} from "./Component";
import {SpawnOrderComponent} from "./system/SpawnerSystem";
Component.ECSRef.registerComponent("SpawnOrderComponent", SpawnOrderComponent.fromObj)
import {SpawnOrderDoneComponent} from "./system/SpawnerSystem";
Component.ECSRef.registerComponent("SpawnOrderDoneComponent", SpawnOrderDoneComponent.fromObj)
import {SpawnerComponent} from "./system/SpawnerSystem";
Component.ECSRef.registerComponent("SpawnerComponent", SpawnerComponent.fromObj)
