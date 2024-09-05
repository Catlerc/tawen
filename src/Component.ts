import {ECS} from "./ECS";

export interface Component {
  typeName: Component.Name;
}
export namespace Component {
  export type Name = string
  export const ECSRef = ECS
}
