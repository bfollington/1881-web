import { Vec } from '../types'
import { GameObjects, Scene } from 'phaser'
import { Board, initBoard, zones, map, iter, read, write } from '../modules/board'
import { CursorT, Cursor } from '../modules/cursor'
import { GRID } from '../const'
import { anaemia, pallor, plethoric } from '../colors'
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
  spriteBoard: Board<GameObjects.Graphics>

  constructor() {
    super('GameScene')  }

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
    this.load.image('dice 1', 'assets/dice/1.png')
    this.load.image('dice2', 'assets/dice/2.png')
    this.load.image('dice3', 'assets/dice/3.png')
    this.load.image('dice4', 'assets/dice/4.png')
    this.load.image('dice5', 'assets/dice/5.png')
    this.load.image('dice6', 'assets/dice/6.png')
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

    const SpriteBoard = (b: Board<number>) =>
      map(b, (n, p) => {
        const sprt = this.add.graphics()
        sprt.setPosition(p.x * GRID + 8, p.y * GRID + 8)
        sprt.fillStyle(plethoric)
        sprt.fillRoundedRect(0, 0, 72, 72, 8)
        sprt.fillStyle(pallor)
        sprt.fillCircle(36,36,8)
        sprt.fillCircle(20,20,8)
        sprt.fillCircle(52,52,8)
        return sprt
      })

    this.spriteBoard = SpriteBoard(this.board)

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
    iter(this.spriteBoard, (a) => game.push(a))
    game.push(this.nextNumber.obj)
    game.push(this.cursor.obj)

    let container = this.add.container(32, 32, game)
  }

  update() {
    ;[this.cursor, this.nextNumber].map(runUpdate)

    iter(this.texts, (t, p) => (t.text = `${this.board[p.x][p.y]}`))
    //iter(this.spriteBoard, (s, p) => (s. = `${this.board[p.x][p.y]}`))
  }
}
