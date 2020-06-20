import { Vec2d, Vec } from '../types'

import { Scene, Structs } from 'phaser'
import { GRID } from '../const'

export type CursorT = ReturnType<typeof Cursor>

function update(c: CursorT) {
  c.pos = Vec(Math.min(Math.max(0, c.pos.x), 5), Math.min(Math.max(0, c.pos.y), 5))

  c.gfx.setPosition(c.pos.x * GRID, c.pos.y * GRID)
}

export const Cursor = (s: Scene, start: Vec2d = Vec(0, 0)) => {
  const c = s.add.graphics()
  c.lineStyle(1, 0x00ff00, 1)
  c.strokeRect(0, 0, GRID, GRID)

  const cursor = {
    gfx: c,
    pos: start,
    update: update,
  }

  return cursor
}
