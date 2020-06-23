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

export type GameState = {
  board: Board<Cell>
  rendering: {
    text: Board<GameObjects.Text>
    checker: Board<GameObjects.Graphics>
    sprite: Board<GameObjects.Graphics>
  }
  cursor: CursorT
  nextNumber: NextNumberT
  turn: TurnStateT
  grid: GridLinesT
}

export default class Demo extends Phaser.Scene {
  state: GameState
  inputEvents: GameInput

  constructor() {
    super('GameScene')
  }

  getState() {
    return this.state
  }

  init() {
    this.inputEvents = initEvents(this)
    const ev = this.inputEvents

    ev.cursorMoved.subscribe((c) => {
      const s = this.state

      s.cursor.pos = s.cursor.pos.add(c)
    })

    // TODO: gross logic all in one place here, needs to be split up further
    // Ideal event chain: DiePlaced -> TurnEnded -> NextNumberGenerated -> RedrawBoard
    ev.diePlaced.subscribe((_) => {
      const s = this.state

      if (read(s.board, s.cursor.pos).content > 0) {
        // Invalid
      } else {
        write(s.board, s.cursor.pos, {
          content: s.nextNumber.number,
          placedBy: s.turn.currentPlayer,
        })
        s.nextNumber.generate(s.nextNumber)
        s.turn.turnEnded(s.turn)
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
    const scene = this

    const SpriteBoard = (b: Board<Cell>) =>
      map(b, (t, p) => drawDice(this, t.content, p, t.placedBy))

    const TextBoard = (b: Board<Cell>) =>
      map(b, (n, p) => {
        const txt = this.add.text(GRID * p.x, GRID * p.y, `${n}`)
        txt.setFill('red')
        return txt
      })

    const board = initBoard<Cell>({ content: 0, placedBy: null })
    this.state = {
      board,
      cursor: Cursor(scene),
      rendering: {
        text: TextBoard(board),
        checker: CheckerBoard(scene, board),
        sprite: SpriteBoard(board),
      },
      nextNumber: NextNumber(scene, Vec(530, 0)),
      turn: TurnState(scene, 1),
      grid: GridLines(scene, 4),
    }

    const state = this.state

    const game = []
    iter(state.rendering.checker, (a) => game.push(a))
    iter(state.rendering.text, (a) => game.push(a))
    iter(state.rendering.sprite, (a) => game.push(a))
    game.push(state.nextNumber.obj)
    game.push(state.cursor.obj)
    game.push(state.grid.obj)

    let container = this.add.container(8, 32, game)
  }

  scoreZone(zone: Vec2d[]) {
    const { board } = this.state

    return zone
      .map((p) => read(board, p)) // grab values from board
      .reduce((accumulator, n) => accumulator + n.content, 0) // sum them all up
  }

  redrawDice() {
    const {
      board,
      rendering: { sprite },
    } = this.state

    iter(sprite, (t, p) => {
      const n = board[p.x][p.y]
      redrawDice(n.content, p, t, n.placedBy)
    })
  }

  update() {
    const {
      board,
      cursor,
      nextNumber,
      rendering: { text },
    } = this.state
    ;[cursor, nextNumber].map(runUpdate)
    iter(text, (t, p) => (t.text = `${board[p.x][p.y].content}`))
  }
}
