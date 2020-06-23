import { map, Board } from './board'
import { Cell } from './cell'
import { GRID } from '../const'
import { anaemia, pallor } from '../colors'
import { Scene } from 'phaser'

export const CheckerBoard = (s: Scene, b: Board<Cell>) =>
  map(b, (n, p) => {
    const rect = s.add.graphics()
    rect.setPosition(p.x * GRID, p.y * GRID)
    rect.fillStyle((p.x + p.y) % 2 === 0 ? anaemia : pallor)
    rect.fillRect(0, 0, GRID, GRID)
    return rect
  })
