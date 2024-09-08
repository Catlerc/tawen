import {ECS} from "./ECS";
import {generateRandomHex} from "./utils";

export interface Component {
  id: Component.Id;
  typeName: Component.Name;
}
export namespace Component {
  export type Name = string
  export type Id = string
  export const ECSRef = ECS

  export function generateId() {
    return generateRandomHex()
  }
}
