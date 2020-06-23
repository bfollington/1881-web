import { Vec, Vec2d } from '../types'
import { GameObjects, Scene } from 'phaser'
import { Board, initBoard, zones, map, iter, read, write } from '../modules/board'
import { CursorT, Cursor } from '../modules/cursor'
import { GRID } from '../const'
import { anaemia, pallor, plethoric, peach } from '../colors'
import { NextNumberT, NextNumber } from '../modules/nextNumber'
import { TurnState, TurnStateT } from '../modules/turn'
import { GridLines, GridLinesT } from '../modules/grid'
import { drawDice, redrawDice } from '../modules/dice'
import { Cell } from '../modules/cell'

// Util
interface Updateable<T> {
  update: (a: T) => void
}

function runUpdate<T>(a: T & Updateable<T>) {
  a.update(a)
}

export default class Demo extends Phaser.Scene {
  board = initBoard<Cell>({ content: 0, placedBy: null })
  cursor: CursorT = null
  nextNumber: NextNumberT = null
  texts: Board<GameObjects.Text>
  checkerBoard: Board<GameObjects.Graphics>
  spriteBoard: Board<GameObjects.Graphics>
  test: GameObjects.Image
  turn: TurnStateT
  gridLines: GridLinesT

  constructor() {
    super('GameScene')
  }

  init() {
    //this.input.on('pointerup', () => (this.cursor.pos.x += 1))
    const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    const leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    const rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

    rightKey.on('down', () => (this.cursor.pos.x += 1))
    leftKey.on('down', () => (this.cursor.pos.x -= 1))
    upKey.on('down', () => (this.cursor.pos.y -= 1))
    downKey.on('down', () => (this.cursor.pos.y += 1))
    spaceBar.on('down', () => {
      // TODO: gross logic all in one place here, needs to be split up and have
      // formal gameplay events modelled. i.e. CursorMoved and DicePlayed
      if (read(this.board, this.cursor.pos).content > 0) {
        // Invalid
      } else {
        write(this.board, this.cursor.pos, {
          content: this.nextNumber.number,
          placedBy: this.turn.currentPlayer,
        })
        this.nextNumber.generate(this.nextNumber)
        this.turn.turnEnded(this.turn)
        this.redrawDice()
      }
    })
  }

  preload() {
    this.load.image('twopm', 'assets/twopm.png')
    this.load.image('dice1', 'assets/dice/1.png')
    this.load.image('dice2', 'assets/dice/2.png')
    this.load.image('dice3', 'assets/dice/3.png')
    this.load.image('dice4', 'assets/dice/4.png')
    this.load.image('dice5', 'assets/dice/5.png')
    this.load.image('dice6', 'assets/dice/6.png')
  }

  create() {
    this.turn = TurnState(this, 'player1')

    const CheckerBoard = (b: Board<Cell>) =>
      map(b, (n, p) => {
        const rect = this.add.graphics()
        rect.setPosition(p.x * GRID, p.y * GRID)
        rect.fillStyle((p.x + p.y) % 2 === 0 ? anaemia : pallor)
        rect.fillRect(0, 0, GRID, GRID)
        return rect
      })

    this.checkerBoard = CheckerBoard(this.board)
    this.gridLines = GridLines(this, 4)

    const SpriteBoard = (b: Board<Cell>) => map(b, (t, p) => drawDice(this, t.content, p))

    this.spriteBoard = SpriteBoard(this.board)

    const TextBoard = (b: Board<Cell>) =>
      map(b, (n, p) => {
        const txt = this.add.text(GRID * p.x, GRID * p.y, `${n}`)
        txt.setFill('red')
        return txt
      })
    this.texts = TextBoard(this.board)

    this.cursor = Cursor(this)
    this.nextNumber = NextNumber(this, Vec(530, 0))

    const nums = [1, 2, 3, 4, 5, 6]
    //nums.map((i) => this.add.image(596, 50 + i * 80, `dice${i}`))

    const game = []
    iter(this.checkerBoard, (a) => game.push(a))
    iter(this.texts, (a) => game.push(a))
    iter(this.spriteBoard, (a) => game.push(a))
    game.push(this.nextNumber.obj)
    game.push(this.cursor.obj)
    game.push(this.gridLines)

    // let container = this.add.container(8, 32, game)
  }

  scoreZone(zone: Vec2d[]) {
    return zone
      .map((p) => read(this.board, p)) // grab values from board
      .reduce((accumulator, n) => accumulator + n.content, 0) // sum them all up
  }

  redrawDice() {
    iter(this.spriteBoard, (t, p) => {
      const n = this.board[p.x][p.y]
      redrawDice(n.content, p, t)
    })
  }

  update() {
    ;[this.cursor, this.nextNumber].map(runUpdate)
    iter(this.texts, (t, p) => (t.text = `${this.board[p.x][p.y].content}`))
  }
}
