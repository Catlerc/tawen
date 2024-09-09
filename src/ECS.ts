import {generateRandomHex} from "./utils";
import {Component} from "./Component";
import {Debug} from "./Debug";

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

  static addEntity(): EntityId {
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

  static removeComponent(entityId: EntityId, component: Component) {
    if (component.typeName in ECS.components && entityId in ECS.components[component.typeName])
      ECS.components[component.typeName][entityId].filter((someComp) => someComp.id === component.id)
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

  private static uncapitalizeFirstLetter(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private static shortenComponentName(fullName: string) {
    return ECS.uncapitalizeFirstLetter(fullName.slice(0, -("Component".length)))
  }

  static getQueryBySelector(selector: Component[]) {
    const componentNames = selector.map(comp => comp.typeName)
    let res = []
    outer: for (const entityId of ECS.entities) {
      let query: { [key: string]: any } = {}
      for (const componentName of componentNames) {
        const componentsOfThisEntity = ECS.components[componentName][entityId]
        if (componentsOfThisEntity === undefined) continue outer; // not fully equipped entity
        query[ECS.shortenComponentName(componentName)] = componentsOfThisEntity[0]//TODO
        query.entityId = entityId
        res.push(query)
      }

    }
    return res
  }

  static update(): void {
    for (const systemName in ECS.systemRegistry) {
      Debug.time(systemName, () => {
        const system = ECS.systemRegistry[systemName]
        const queries = ECS.getQueryBySelector(system.selector)
        for (const data of queries) system.update(data as DataOf<typeof system.selector>)
      })
    }
  }

  static saveCache(): void {
    Debug.time("saveCache", () => {
      RawMemory.set(JSON.stringify({
        componentsMemory: ECS.components,
        entityIds: ECS.entities
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

export abstract class System<S extends (abstract new (...args: any) => any)[]> {
  abstract name: System.Name
  abstract selector: S

  abstract update(data: DataOf<S>): void
}

export namespace System {
  export type Name = string
}

export type EntityId = string


type WithTypeName = { typeName: string }
type getTypeNameOfDataType<C> = C extends { typeName: infer T } ? T : never
type unwrapArray<Array> = Array extends (infer Elem)[] ? Elem : never
type removeJunk<String> = String extends `${infer A}Component` ? A : never
type toObject<Orred extends WithTypeName> = {
  [Property in Orred as Uncapitalize<removeJunk<getTypeNameOfDataType<Property>>>]: Property
} & { entityId: EntityId }
export type DataOf<S extends (abstract new (...args: any) => any)[]> = toObject<InstanceType<unwrapArray<S>>>

export function registerSystem<S extends (abstract new (...args: any) => any)[]>(name: System.Name, selector: S, update: (query: DataOf<S>) => any) {
  class OutSystem extends System<typeof selector> {
    name = name
    selector = selector

    update(data: DataOf<S>): any {
      update(data)
    }
  }

  const instance = new OutSystem() as System<typeof selector>
  ECS.registerSystem(instance)
  return instance
}
