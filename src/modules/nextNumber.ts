import { Vec2d, Vec } from '../types'

import { Scene, Structs } from 'phaser'
import { peach } from '../colors'
import { drawCustomDie } from '../modules/dice'
import { colorForPlayer, Player, TurnStateT,} from './turn'

export type NextNumberT = ReturnType<typeof NextNumber>

function generateRandomInt(cap: number) {
  return Math.ceil(Math.random() * cap)
}

function update(c: NextNumberT, t:TurnStateT) {
  c.obj.setPosition(c.pos.x, c.pos.y)
  c.obj.text = `Next: ${c.number}`
  drawCustomDie(c.number, c.pos.x + 20, c.pos.y + 54, c.img, colorForPlayer(t.currentPlayer))
}

function generate(c: NextNumberT) {
  c.number = generateRandomInt(6)
}

export const NextNumber = (s: Scene, pos: Vec2d = Vec(0, 0)) => {
  const c = s.add.text(pos.x, pos.y, '')
  c.setFill(peach)

  const img = s.add.graphics()

  const num = {
    pos,
    update,
    generate,
    obj: c,
    img: img,
    number: generateRandomInt(6),
  }

  return num
}
