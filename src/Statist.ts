const SIDES = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]
const MAX_ROOM_SIZE = 50

type RateTarget = {
  x: number;
  y: number;
  id: string
}

export function rateRoom(terrain: RoomTerrain, targets: RateTarget[]) {
  type Cell = {
    distance: number,
    ids: string[]
  } | null

  type Walker = {
    x: number,
    y: number,
    id: string,
    distance: number,
    cooldown: number
  }

  const map: Cell[][] = Array.from({length: MAX_ROOM_SIZE}, () => Array(MAX_ROOM_SIZE).fill(null))


  let toCheck: Walker[] = []
  for (const target of targets) {
    map[target.x][target.y] = {
      distance: 0,
      ids: [target.id]
    }
    toCheck.push({
      x: target.x,
      y: target.y,
      id: target.id,
      distance: 0,
      cooldown: 0
    })
  }

  while (toCheck.length > 0) {

    const item = toCheck.shift()!
    if (item.cooldown > 0) {
      item.cooldown -= 1
      toCheck.push(item)
    } else
      for (const side of SIDES) {
        const nx = item.x + side[0]
        const ny = item.y + side[1]
        if (nx == -1 || nx == MAX_ROOM_SIZE || ny == -1 || ny == MAX_ROOM_SIZE) continue
        const onMap = map[nx][ny]
        const isNotWall = terrain.get(nx, ny) !== TERRAIN_MASK_WALL
        const isWalked = onMap !== null

        if (isNotWall) {
          if (isWalked) {
            console.log(onMap.ids)
            if (!(onMap.ids.includes(item.id)))
              onMap.ids.push(item.id)
          } else {
            const isSwamp = terrain.get(nx, ny) == TERRAIN_MASK_SWAMP
            map[nx][ny] = {
              distance: item.distance + 1,
              ids: [item.id]
            }
            toCheck.push({
              x: nx,
              y: ny,
              id: item.id,
              distance: item.distance + 1,
              cooldown: isSwamp ? 1 : 0
            })
          }
        }
      }
  }
  return map
}


function sourceToTarget(sources: Source[]) {
  return sources.map(source => {
    return {
      x: source.pos.x,
      y: source.pos.y,
      id: source.id
    }
  })
}

export function drawRate(room: Room) {
  const ratedMap = rateRoom(room.getTerrain(), sourceToTarget(room.find(FIND_SOURCES)))
  const visual = room.visual
  visual.clear()
  for (let x = 0; x < MAX_ROOM_SIZE; x++) {
    for (let y = 0; y < MAX_ROOM_SIZE; y++) {
      const obj = ratedMap[x][y]
      if (obj != null)
        if (obj.ids.length > 1)
          visual.text(obj.distance.toString(), x - 0.5, y + 0.25, {align: "left"})
    }
  }
}


// export function getBestSourceSpot(room: Room) {
//   const ratedMap = rateRoom(room.getTerrain(), sourceToTarget(room.find(FIND_SOURCES)))
//
// }