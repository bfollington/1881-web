import { Vec } from '../types'
import { GameObjects, Scene } from 'phaser'
import { Board, initBoard, zones, map, iter, read, write } from '../modules/board'
import { CursorT, Cursor } from '../modules/cursor'
import { GRID } from '../const'
import { anaemia, pallor } from '../colors'
import { NextNumberT, NextNumber } from '../modules/nextNumber'

// Util
interface Updateable<T> {
  update: (a: T) => void
}

function runUpdate<T>(a: T & Updateable<T>) {
  a.update(a)
}

export default class Demo extends Phaser.Scene {
  board = initBoard(0)
  cursor: CursorT = null
  nextNumber: NextNumberT = null
  texts: Board<GameObjects.Text>
  checkerBoard: Board<GameObjects.Graphics>

  constructor() {
    super('GameScene')
    console.log(this.board, zones)
  }

  init() {
    this.input.on('pointerup', () => (this.cursor.pos.x += 1))
    this.input.keyboard.on('keydown-RIGHT', () => (this.cursor.pos.x += 1))
    this.input.keyboard.on('keydown-LEFT', () => (this.cursor.pos.x -= 1))
    this.input.keyboard.on('keydown-UP', () => (this.cursor.pos.y -= 1))
    this.input.keyboard.on('keydown-DOWN', () => (this.cursor.pos.y += 1))
    this.input.keyboard.on('keydown-SPACE', () => {
      if (read(this.board, this.cursor.pos) > 0) {
        // Invalid
      } else {
        write(this.board, this.cursor.pos, this.nextNumber.number)
        this.nextNumber.generate(this.nextNumber)
      }
    })
  }

  preload() {
    this.load.image('twopm', 'assets/twopm.png')
  }

  create() {
    const CheckerBoard = (b: Board<number>) =>
      map(b, (n, p) => {
        const rect = this.add.graphics()
        rect.setPosition(p.x * GRID, p.y * GRID)
        rect.fillStyle((p.x + p.y) % 2 === 0 ? anaemia : pallor)
        rect.fillRect(0, 0, GRID, GRID)
        return rect
      })

    this.checkerBoard = CheckerBoard(this.board)

    const TextBoard = (b: Board<number>) =>
      map(b, (n, p) => {
        const txt = this.add.text(GRID * p.x, GRID * p.y, `${n}`)
        txt.setFill('red')
        return txt
      })
    this.texts = TextBoard(this.board)

    this.cursor = Cursor(this)
    this.nextNumber = NextNumber(this, Vec(530, 32))

    const game = []
    iter(this.checkerBoard, (a) => game.push(a))
    iter(this.texts, (a) => game.push(a))
    game.push(this.nextNumber.obj)
    game.push(this.cursor.obj)

    let container = this.add.container(32, 32, game)
  }

  update() {
    ;[this.cursor, this.nextNumber].map(runUpdate)

    iter(this.texts, (t, p) => (t.text = `${this.board[p.x][p.y]}`))
  }
}
