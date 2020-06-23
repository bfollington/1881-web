import { Vec2d } from '../types'
import { GRID } from '../const'
import { plethoric, pallor, grey } from '../colors'
import { GameObjects, Scene } from 'phaser'
import { colorForPlayer, Player } from './turn'

const RADIUS = 8

export function drawDice(s: Scene, n: number, p: Vec2d, player: Player = 0) {
  const sprt = s.add.graphics()
  redrawDice(n, p, sprt, player)
  return sprt
}

export function redrawDice(
  n: number,
  p: Vec2d,
  gfx: GameObjects.Graphics,
  player: Player = 0
) {
  drawCustomDie(n, p.x * GRID + 8, p.y * GRID + 8, gfx, colorForPlayer(player))
}

export function drawCustomDie(
  n: number,
  x: number,
  y: number,
  gfx: GameObjects.Graphics,
  c: number = grey
) {
  gfx.setPosition(x, y)
  gfx.clear()

  if (n != 0) {
    gfx.fillStyle(c)
    gfx.fillRoundedRect(0, 0, GRID - RADIUS * 2, GRID - RADIUS * 2, RADIUS)
  }
  gfx.fillStyle(pallor)
  if (n == 1 || n == 3 || n == 5) {
    gfx.fillCircle(36, 36, RADIUS)
  }
  if (n == 2 || n == 3 || n == 4 || n == 5 || n == 6) {
    gfx.fillCircle(16, 16, RADIUS)
    gfx.fillCircle(56, 56, RADIUS)
  }
  if (n == 4 || n == 5 || n == 6) {
    gfx.fillCircle(16, 56, RADIUS)
    gfx.fillCircle(56, 16, RADIUS)
  }
  if (n == 6) {
    gfx.fillCircle(56, 36, RADIUS)
    gfx.fillCircle(16, 36, RADIUS)
  }
}
