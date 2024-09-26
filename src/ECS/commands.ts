import {ECS} from "../ECS";
import {RoomLink, Spawns, SpawnOrder} from "./data";
import {generateRandomHex} from "../utils";


export function initRoom(roomName: string) {
  const room = Game.rooms[roomName]
  if (!room) return "No room with name " + roomName


  const spawns = room.find(FIND_MY_SPAWNS)

  const spawnerSystem = ECS.createEntity()
  ECS.addComponent(spawnerSystem, new Spawns(spawns))
  ECS.addComponent(spawnerSystem, new RoomLink(room))

  ECS.addComponent(spawnerSystem, new SpawnOrder([WORK, MOVE, CARRY], generateRandomHex(), "kek"))
  return "Ok"
}