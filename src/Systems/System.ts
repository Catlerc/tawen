declare global {
  interface Memory {
    systems: any
  }
}

interface Dictionary<T> {
  [Key: string]: T;
}

export class Systems {

  static all: Map<string, System<any>> = new Map<string, System<any>>();

  static register(system: System<any>): void {
    if (Memory.systems == undefined) Memory.systems = {};
    const name = system.constructor.name
    if (!(name in Memory.systems)) Memory.systems[name] = []
    Systems.all.set(name, system);
  }

  static start(): void {

    this.all.forEach((system: System<any>) => system.loadCache())
  }

  static update(): void {
    Systems.all.forEach((system: System<any>): void => system.cache.forEach(system.update))
  }

  static dump(): void {
    Systems.all.forEach((system: System<any>): void => system.saveCache())
  }
}

export abstract class System<T> {
  label: string = this.constructor.name;
  cache: T[] = []


  loadCache() {
    this.cache = Memory.systems[this.label]
  }

  saveCache() {
    Memory.systems[this.label] = this.cache
  }

  start() {
  }

  abstract update(t: T): any

  instantiate(t: T): void {
    this.cache.push(t)
  }
}
