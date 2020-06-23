import { GameObjects } from 'phaser'
import { GRID } from '../const'
import { Board, initBoard, iter, map, read, write } from '../modules/board'
import { Cell } from '../modules/cell'
import { CheckerBoard } from '../modules/checkered'
import { Cursor, CursorT } from '../modules/cursor'
import { drawDice, redrawDice } from '../modules/dice'
import { GridLines, GridLinesT } from '../modules/grid'
import { GameInput, initEvents } from '../modules/initEvents'
import { NextNumber, NextNumberT } from '../modules/nextNumber'
import { TurnState, TurnStateT } from '../modules/turn'
import { Vec, Vec2d } from '../types'

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
  inputEvents: GameInput

  constructor() {
    super('GameScene')
  }

  init() {
    this.inputEvents = initEvents(this)

    this.inputEvents.cursorMoved.subscribe((c) => {
      this.cursor.pos = this.cursor.pos.add(c)
    })

    // TODO: gross logic all in one place here, needs to be split up further
    // Ideal event chain: DiePlaced -> TurnEnded -> NextNumberGenerated -> RedrawBoard
    this.inputEvents.diePlaced.subscribe(() => {
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
    this.turn = TurnState(this, 1)

    this.checkerBoard = CheckerBoard(this, this.board)
    this.gridLines = GridLines(this, 4)

    const SpriteBoard = (b: Board<Cell>) =>
      map(b, (t, p) => drawDice(this, t.content, p, t.placedBy))

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

    const game = []
    iter(this.checkerBoard, (a) => game.push(a))
    iter(this.texts, (a) => game.push(a))
    iter(this.spriteBoard, (a) => game.push(a))
    game.push(this.nextNumber.obj)
    game.push(this.cursor.obj)
    game.push(this.gridLines.obj)

    let container = this.add.container(8, 32, game)
  }

  scoreZone(zone: Vec2d[]) {
    return zone
      .map((p) => read(this.board, p)) // grab values from board
      .reduce((accumulator, n) => accumulator + n.content, 0) // sum them all up
  }

  redrawDice() {
    iter(this.spriteBoard, (t, p) => {
      const n = this.board[p.x][p.y]
      redrawDice(n.content, p, t, n.placedBy)
    })
  }

  update() {
    ;[this.cursor, this.nextNumber].map(runUpdate)
    iter(this.texts, (t, p) => (t.text = `${this.board[p.x][p.y].content}`))
  }
}
