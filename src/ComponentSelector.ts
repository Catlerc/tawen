import {MoveTarget} from "./ECS/Moving";
import {ECS, EntityId} from "./ECS";
import {Component} from "./Component";
import {DeliveryTarget} from "./ECS/Delivering";
import {HarvestTarget} from "./ECS/Harvesting";


type ComponentClass = (abstract new (...args: any) => any) & { typeName: string }


export abstract class Selector<T extends ComponentClass> {
  clazz: T

  constructor(clazz: T) {
    this.clazz = clazz;
  }

  abstract validateComponents(components: Component[]): boolean

  extract(components: Component[]): any | undefined {
    return undefined
  }

  getComponents(entityId: EntityId): Component[] {
    return ECS.getComponentList(entityId, this.clazz.typeName)
  }
}

export class One<T extends ComponentClass> extends Selector<T> {
  _discriminator!: 'one'

  validateComponents(components: Component[]): boolean {
    return components.length > 0
  }

  extract(components: Component[]): any | undefined {
    return components[0]
  }

}

export class Opt<T extends ComponentClass> extends Selector<T> {
  _discriminator!: 'opt'

  validateComponents(components: Component[]): boolean {
    return true
  }

  extract(components: Component[]): any | undefined {
    return components[0]
  }
}

export class Not<T extends ComponentClass> extends Selector<T> {
  _discriminator!: 'not'

  validateComponents(components: Component[]): boolean {
    return components.length === 0
  }

  extract(components: Component[]): any | undefined {
    return undefined
  }
}


export class SelectorSet<AST> {

  selectors: Selector<any>[]

  constructor(selectors: Selector<any>[]) {
    this.selectors = selectors;
  }


  one<T extends ComponentClass>(clazz: T): SelectorSet<AST | One<InstanceType<T>>> {
    this.selectors.push(new One(clazz))
    return this as SelectorSet<AST | One<InstanceType<T>>>
  }

  opt<T extends ComponentClass>(clazz: T): SelectorSet<AST | Opt<InstanceType<T>>> {
    this.selectors.push(new Opt(clazz))
    return this as SelectorSet<AST | Opt<InstanceType<T>>>
  }

  not<T extends ComponentClass>(clazz: T): SelectorSet<AST | Not<InstanceType<T>>> {
    this.selectors.push(new Not(clazz))
    return this as SelectorSet<AST | Not<InstanceType<T>>>
  }

  private uncapitalizeFirstLetter(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  select(): SelectASTToObj<AST>[] {
    let res = []
    for (const entityId of ECS.entities) {
      let query: { [key: string]: any } = {}
      let goodEntity = true
      for (const selector of this.selectors) {
        const componentsOfThisEntity = selector.getComponents(entityId)
        goodEntity = selector.validateComponents(componentsOfThisEntity)
        if (!goodEntity) break;
        query[this.uncapitalizeFirstLetter(selector.clazz.typeName)] = selector.extract(componentsOfThisEntity)
      }
      query.entityId = entityId
      if (goodEntity) res.push(query)
    }
    return res as SelectASTToObj<AST>[]
  }

}

type optComponent<T> = T extends Opt<infer C> ? C | undefined : T
type RemoveNot<T> = T extends Not<any> ? undefined : T
type getTypeNameOfDataType<C> = C extends { typeName: infer T } ? T : never
type getComponent<T> = T extends { _discriminator: 'opt' } ? (T extends {
  clazz: infer C
} ? C : never) | undefined : (T extends { clazz: infer C } ? C : never)
type asString<T> = T extends string ? T : never
type prepare<T> = Uncapitalize<asString<getTypeNameOfDataType<getComponent<T>>>>
export type SelectASTToObj<T> = toObject<NonNullable<RemoveNot<T>>>
type toObject<T> =
  {
    [Property in T as prepare<Property>]: getComponent<Property>
  } & { entityId: EntityId }


export function one<T extends ComponentClass>(clazz: T): SelectorSet<One<InstanceType<T>>> {
  return new SelectorSet([new One(clazz)])
}

export function opt<T extends ComponentClass>(clazz: T): SelectorSet<Opt<InstanceType<T>>> {
  return new SelectorSet([new Opt(clazz)])
}

export function not<T extends ComponentClass>(clazz: T): SelectorSet<Not<InstanceType<T>>> {
  return new SelectorSet([new Not(clazz)])
}

//
// const a = one(MoveTarget).not(DeliveryTarget).opt(HarvestTarget)
// const b = a.select()
// const s = b[0].