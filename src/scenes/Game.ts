import { Vec } from '../types'
import { GameObjects, Scene } from 'phaser'
import { Board, initBoard, zones, map, iter, read, write } from './board'
import { CursorT, Cursor } from './cursor'
import { GRID } from '../const'
import { anaemia, pallor } from '../colors'

function generateRandomInt(cap: number) {
  return Math.floor(Math.random() * (cap - 1)) + 1
}

export default class Demo extends Phaser.Scene {
  board = initBoard(0)
  cursor: CursorT = null
  nextNumber: number = generateRandomInt(6)
  texts: Board<GameObjects.Text>
  nextNum: GameObjects.Text
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
        write(this.board, this.cursor.pos, this.nextNumber)
        this.nextNumber = generateRandomInt(6)
      }
    })
  }

  preload() {
    this.load.image('twopm', 'assets/twopm.png')
  }

  create() {
    this.checkerBoard = map(this.board, (n, p) => {
      const rect = this.add.graphics()
      rect.fillStyle(0x00ff00, 1)
      rect.fillRect(0, 0, GRID, GRID)
      return rect
    })

    // map(this.board)((c) => console.log(c))
    this.texts = map(this.board, (n, p) => {
      const txt = this.add.text(GRID * p.x, GRID * p.y, `${n}`)
      txt.setFill('red')
      return txt
    })

    this.nextNum = this.add.text(530, 32, `Next Up: ${this.nextNumber}`)
    this.nextNum.setFill('blue')

    this.cursor = Cursor(this)

    const game = []
    iter(this.checkerBoard, (a) => game.push(a))
    iter(this.texts, (a) => game.push(a))
    game.push(this.nextNum)
    game.push(this.cursor.gfx)

    let container = this.add.container(32, 32, game)
  }

  update() {
    this.cursor.update(this.cursor)
    iter(this.texts, (t, p) => (t.text = `${this.board[p.x][p.y]}`))
    iter(this.checkerBoard, (c, p) => {
      c.fillStyle((p.x + p.y) % 2 === 0 ? anaemia : pallor)
      c.fillRect(0, 0, GRID, GRID)
      c.setPosition(p.x * GRID, p.y * GRID)
    })
    // TODO: gross
    this.nextNum.text = `` + this.nextNumber
  }
}
