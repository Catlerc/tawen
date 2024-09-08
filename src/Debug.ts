export class Debug {
  static debugState: { name: string; cpu: number; }[] = []

  static time<T>(name: string, func: () => T) {
    const start = Game.cpu.getUsed()
    const res = func()
    const end = Game.cpu.getUsed()

    // console.log(`${name} took ${(end-start).toFixed(2)} cpu`)
    Debug.debugState.push({
      name: name,
      cpu: end - start
    })
    return res
  }

  static drawCPU() {
    const visual = new RoomVisual()
    visual.clear()
    let sum = 0
    let y = 0.5
    for (const data of Debug.debugState) {
      const text = `${data.name}: ${data.cpu.toFixed(2)}\n`
      sum += data.cpu
      visual.text(text, 0, y, {align: "left"})
      y += 1
    }
    const lastUsed = Game.cpu.getUsed()
    let unknownTime = lastUsed -sum
    visual.text(`Unknown: ${unknownTime.toFixed(2)}`, 0, y, {align: "left"})
    y += 1

    const text = `TOTAL CPU USAGE: ${lastUsed.toFixed(2)} aka ${(lastUsed / Game.cpu.limit * 100).toFixed(2)}%`
    visual.text(text, 0, y + 1, {align: "left"})
  }

  static clearDebugData() {
    Debug.debugState = []
  }
}