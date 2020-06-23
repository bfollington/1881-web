import { Vec, Vec2d } from '../types'
import { GameObjects, Scene } from 'phaser'
import { Board, initBoard, zones, map, iter, read, write } from '../modules/board'
import { CursorT, Cursor } from '../modules/cursor'
import { GRID } from '../const'
import { anaemia, pallor, plethoric, peach } from '../colors'
import { NextNumberT, NextNumber } from '../modules/nextNumber'
import { TurnState } from '../modules/turn'

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
  gridLines: GameObjects.Graphics
  test: GameObjects.Image
  turn: { turnEnded: (t: any) => void; currentPlayer: "player1" | "player2" }

  constructor() {
    super('GameScene')
  }

  init() {
    //this.input.on('pointerup', () => (this.cursor.pos.x += 1))
    var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    var upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    var downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    var leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    var rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
   
    
    rightKey.on('down', () => (this.cursor.pos.x += 1))
    leftKey.on('down', () => (this.cursor.pos.x -= 1))
    upKey.on('down', () => (this.cursor.pos.y -= 1))
    downKey.on('down', () => (this.cursor.pos.y += 1))
    spaceBar.on('down', () => {
      if (read(this.board, this.cursor.pos) > 0) {
        // Invalid
      } else {
        write(this.board, this.cursor.pos, this.nextNumber.number)
        this.nextNumber.generate(this.nextNumber)
        this.turn.turnEnded(this.turn)
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

    const CheckerBoard = (b: Board<number>) =>
      map(b, (n, p) => {
        const rect = this.add.graphics()
        rect.setPosition(p.x * GRID, p.y * GRID)
        rect.fillStyle((p.x + p.y) % 2 === 0 ? anaemia : pallor)
        rect.fillRect(0, 0, GRID, GRID)
        return rect
      })

    this.checkerBoard = CheckerBoard(this.board)

    const gridLines = this.add.graphics()
      gridLines.lineStyle(4, peach);
      gridLines.beginPath();
      gridLines.moveTo(264, 0);
      gridLines.lineTo(264, 528);
      gridLines.moveTo(0, 264);
      gridLines.lineTo(528, 264);
      gridLines.closePath();
      gridLines.strokePath();
    this.gridLines = gridLines

    const SpriteBoard = (b: Board<number>) =>
      map(b, (n, p) => {
        const sprt = this.add.graphics()
        sprt.setPosition(p.x * GRID + 8, p.y * GRID + 8)
        if (n != 0) {
          sprt.fillStyle(plethoric)
          sprt.fillRoundedRect(0, 0, 72, 72, 8)
        }
        sprt.fillStyle(pallor)
        if (n == 1 || n == 3 || n == 5) {
          sprt.fillCircle(36, 36, 8)
        }
        if (n == 2 || n == 3 || n == 4 || n == 5 || n == 6) {
          sprt.fillCircle(16, 16, 8)
          sprt.fillCircle(56, 56, 8)
        }
        if (n == 4 || n == 5 || n == 6) {
          sprt.fillCircle(16, 56, 8)
          sprt.fillCircle(56, 16, 8)
        }
        if (n == 6) {
          sprt.fillCircle(56, 36, 8)
          sprt.fillCircle(16, 36, 8)
        }
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

    let container = this.add.container(8, 32, game)
  }

  scoreZone(zone: Vec2d[]) {
    return zone
      .map((p) => read(this.board, p)) // grab values from board
      .reduce((accumulator, n) => accumulator + n) // sum them all up
  }

  update() {
    ;[this.cursor, this.nextNumber].map(runUpdate)

    iter(this.texts, (t, p) => (t.text = `${this.board[p.x][p.y]}`))
    iter(this.spriteBoard, (t, p) => {
      var n = this.board[p.x][p.y]
      if (n != 0) {
        t.fillStyle(plethoric)
        t.fillRoundedRect(0, 0, 72, 72, 8)
      }

      t.fillStyle(pallor)
      if (n == 1 || n == 3 || n == 5) {
        t.fillCircle(36, 36, 8)
      }
      if (n == 2 || n == 3 || n == 4 || n == 5 || n == 6) {
        t.fillCircle(16, 16, 8)
        t.fillCircle(56, 56, 8)
      }
      if (n == 4 || n == 5 || n == 6) {
        t.fillCircle(16, 56, 8)
        t.fillCircle(56, 16, 8)
      }
      if (n == 6) {
        t.fillCircle(56, 36, 8)
        t.fillCircle(16, 36, 8)
      }
    })
  }
}
