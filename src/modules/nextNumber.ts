import { Vec2d, Vec } from '../types'

import { Scene, Structs } from 'phaser'
import { peach } from '../colors'
import { drawCustomDie } from '../modules/dice'

export type NextNumberT = ReturnType<typeof NextNumber>

function generateRandomInt(cap: number) {
  return Math.ceil(Math.random() * cap)
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
//TODO: change this to `drawCustomDie` so the dice displays the colour of the player whose turn it is

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
