import { Vec2d, Vec } from '../types'

import { Scene, Structs } from 'phaser'
import { peach } from '../colors'

export type NextNumberT = ReturnType<typeof NextNumber>

function generateRandomInt(cap: number) {
  return Math.round(Math.random() * (cap - 1)) + 1
}

function update(c: NextNumberT) {
  c.obj.setPosition(c.pos.x, c.pos.y)
  c.obj.text = `Next: ${c.number}`
  c.img.setTexture(`dice${this.number}`)
}

function generate(c: NextNumberT) {
  c.number = generateRandomInt(6)
}

export const NextNumber = (s: Scene, pos: Vec2d = Vec(0, 0)) => {
  const c = s.add.text(pos.x, pos.y, '')
  c.setFill(peach)

  const img = s.add.image(580, 90, `dice${this.number}`)

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
