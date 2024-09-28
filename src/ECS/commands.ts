import {ECS} from "../ECS";
import {RoomLink} from "./data";
import {Spawns, SpawnOrder} from "./data/creepFactory";
import {generateRandomHex} from "../utils";


export function initRoom(roomName: string) {
  const room = Game.rooms[roomName]
  if (!room) return "No room with name " + roomName


  const spawns = room.find(FIND_MY_SPAWNS)

  const spawner = ECS.createEntity()
  ECS.addComponent(spawner, new Spawns(spawns))
  ECS.addComponent(spawner, new RoomLink(room))

  ECS.addComponent(spawner, new SpawnOrder([WORK, MOVE, CARRY], generateRandomHex(), "kek"))
  return "Ok"
}