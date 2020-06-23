import { Scene } from 'phaser'
import { Vec, Vec2d } from '../types'

type InputEventListener<T> = (t: T) => void
type Unsubscribe = () => void

type InputEventSource<T> = {
  subscribe: (l: InputEventListener<T>) => Unsubscribe
}

type CursorMoved = Vec2d
type DiePlaced = void

export type GameInput = {
  cursorMoved: InputEventSource<CursorMoved>
  diePlaced: InputEventSource<DiePlaced>
}

class EventSource<T> {
  listeners: { [id: number]: InputEventListener<T> }
  lastId: number

  constructor() {
    this.listeners = {}
    this.lastId = 0
  }

  subscribe(l: InputEventListener<T>) {
    this.lastId++
    this.listeners[this.lastId] = l

    return () => this.unsubscribe(this.lastId)
  }

  unsubscribe(id: number) {
    delete this.listeners[id]
  }

  emit(t: T) {
    Object.values(this.listeners).forEach((v) => v(t))
  }
}

export function initEvents(s: Scene): GameInput {
  const spaceBar = s.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  const upKey = s.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
  const downKey = s.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
  const leftKey = s.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
  const rightKey = s.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

  const events = {
    cursorMoved: new EventSource<CursorMoved>(),
    diePlaced: new EventSource<DiePlaced>(),
  }

  rightKey.on('down', () => events.cursorMoved.emit(Vec(1, 0)))
  leftKey.on('down', () => events.cursorMoved.emit(Vec(-1, 0)))
  upKey.on('down', () => events.cursorMoved.emit(Vec(0, -1)))
  downKey.on('down', () => events.cursorMoved.emit(Vec(0, 1)))
  spaceBar.on('down', () => events.diePlaced.emit())

  return events
}
