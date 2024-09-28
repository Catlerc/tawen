import {generateRandomHex} from "./utils";
import {Component} from "./Component";
import {SelectorSet, SelectASTToObj} from "./ComponentSelector";
import {Debug} from "./Debug";
import * as _ from "lodash";

declare global {
  type ComponentCache = {
    [componentName: Component.Name]: {
      [entityId: EntityId]: Component[]
    }
  }

  interface Memory {
    componentsMemory: ComponentCache
    entityIds: EntityId[]
  }
}


export class ECS {
  //registers
  static systemRegistry: { [systemName: System.Name]: System<any> } = {}
  static componentRegistry: { [componentName: Component.Name]: (obj: any) => Component } = {}

  //actual data
  static entities: EntityId[] = [];
  static components: ComponentCache

  static createEntity(): EntityId {
    const id = generateRandomHex()
    ECS.entities.push(id)
    return id
  }

  static addComponent(entityId: EntityId, component: Component) {
    if (!(component.typeName in ECS.components))
      ECS.components[component.typeName] = {}
    if (!(entityId in ECS.components[component.typeName]))
      ECS.components[component.typeName][entityId] = []
    ECS.components[component.typeName][entityId].push(component)
  }


  static getComponentList(entityId: EntityId, componentName: string): Component[] {
    if (ECS.components[componentName] === undefined) return [];
    const componentsOfThisEntity = ECS.components[componentName][entityId]
    if (componentsOfThisEntity === undefined) return []
    return componentsOfThisEntity
  }

  static removeComponent(entityId: EntityId, component: Component) {
    if (component.typeName in ECS.components && entityId in ECS.components[component.typeName]) {
      ECS.components[component.typeName][entityId] = ECS.components[component.typeName][entityId].filter((someComp) => someComp.id !== component.id)
      if (ECS.components[component.typeName][entityId].length === 0)
        delete ECS.components[component.typeName][entityId]
    }
  }

  static getComponent(clazz: Component, id: Component.Id): Component | null {
    if (clazz.typeName in ECS.components) {
      for (const entityId in ECS.components[clazz.typeName]) {
        for (const component of ECS.components[clazz.typeName][entityId])
          if (component.id === id) return component;
      }
    }
    return null
  }

  static registerSystem(system: System<any>): void {
    ECS.systemRegistry[system.name] = system
  }

  static registerComponent(componentName: Component.Name, fromObj: (obj: any) => Component): void {
    ECS.componentRegistry[componentName] = fromObj
  }


  static start(): void {
    if (Memory.componentsMemory === undefined) Memory.componentsMemory = {}
    if (Memory.entityIds === undefined) Memory.entityIds = []
    ECS.loadCache()
  }

  static update(): void {
    for (const systemName in ECS.systemRegistry) {
      Debug.time(systemName, () => {
        const system = ECS.systemRegistry[systemName]
        const queries = system.selector.select()
        for (const data of queries) {
          for (const key in data) {
            (data as any)[key].reload?.()
          }
          system.update(data)
        }
      })
    }
  }

  static saveCache(): void {
    Debug.time("saveCache", () => {
      RawMemory.set(JSON.stringify({
        componentsMemory: ECS.components,
        entityIds: ECS.entities,
        creeps: Memory.creeps || {},
        rooms: Memory.rooms || {},
        flags: Memory.flags || {},
        powerCreeps: Memory.powerCreeps || {},
        spawns: Memory.spawns || {},
      }))
    })
  }

  static loadCache(): void {
    const memory = JSON.parse(RawMemory.get())
    Debug.time("loadCache", () => {
      let res: ComponentCache = {}
      for (const componentName in memory.componentsMemory) {
        res[componentName] = {}
        for (const entityId in memory.componentsMemory[componentName]) {
          const arr: any[] = memory.componentsMemory[componentName][entityId]
          res[componentName][entityId] = arr.map(obj => {
            return ECS.componentRegistry[componentName]!(obj)
          });
        }
      }
      ECS.components = res
      for (const componentName in ECS.componentRegistry) {
        if (ECS.components[componentName] === undefined)
          ECS.components[componentName] = {}
      }
      ECS.entities = Memory.entityIds
    })
  }

  static purge() {
    ECS.entities = []
    ECS.components = {}
    for (const componentName in ECS.componentRegistry) {
      if (ECS.components[componentName] === undefined)
        ECS.components[componentName] = {}
    }
    ECS.saveCache()
  }
}

export abstract class System<S> {
  abstract name: System.Name
  abstract selector: SelectorSet<S>

  abstract update(data: SelectASTToObj<S>): void
}

export namespace System {
  export type Name = string
}

export type EntityId = string


type WithTypeName = { typeName: string }
type getTypeNameOfDataType<C> = C extends { typeName: infer T } ? T : never
type unwrapArray<Array> = Array extends (infer Elem)[] ? Elem : never
type removeJunk<String> = String extends `${infer A}Component` ? A : String
type toObject<Orred extends WithTypeName> = {
  [Property in Orred as Uncapitalize<removeJunk<getTypeNameOfDataType<Property>>>]: Property
} & { entityId: EntityId }
export type DataOf<S extends (abstract new (...args: any) => any)[]> = toObject<InstanceType<unwrapArray<S>>>

export function registerSystem<S>(name: System.Name, selector: SelectorSet<S>, update: (query: SelectASTToObj<S>) => any) {
  class OutSystem extends System<S> {
    name = name
    selector = selector

    update(data: SelectASTToObj<S>): any {
      update(data)
    }
  }

  const instance = new OutSystem() as System<typeof selector>
  ECS.registerSystem(instance)
  return instance
}
