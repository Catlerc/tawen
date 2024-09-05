import {Component} from "./Component";
import {SpawnerComponent} from "./system/SpawnerSystem";
Component.ECSRef.registerComponent("SpawnerComponent", SpawnerComponent.fromObj)
