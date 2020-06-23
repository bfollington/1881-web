import { Scene } from 'phaser'
import { GRID } from '../const'
import { peach } from '../colors'

export type GridLinesT = ReturnType<typeof GridLines>

export const GridLines = (s: Scene, thickness: number) => {
  const gridLines = s.add.graphics()
  gridLines.lineStyle(thickness, peach)
  gridLines.beginPath()
  gridLines.moveTo(3 * GRID, 0)
  gridLines.lineTo(3 * GRID, 6 * GRID)
  gridLines.moveTo(0, 3 * GRID)
  gridLines.lineTo(6 * GRID, 3 * GRID)
  gridLines.moveTo(0, 0)
  gridLines.lineTo(0, 6 * GRID)
  gridLines.lineTo(6 * GRID,6 * GRID)
  gridLines.lineTo(6 * GRID,0)
  gridLines.closePath()
  gridLines.strokePath()

  const cursor = {
    obj: gridLines,
  }

  return cursor
}
