import { Vec, Vec2d } from '../types'

export type Board<T> = T[][]

export function initBoard<T>(def: T): Board<T> {
  const b = []

  for (let i = 0; i < 6; i++) {
    b.push([])
    for (let j = 0; j < 6; j++) {
      b[i].push(def)
    }
  }

  return b
}

export function read<T>(b: Board<T>, cell: Vec2d): T {
  return b[cell.x][cell.y]
}

export function write<T>(b: Board<T>, cell: Vec2d, val: T): T {
  return (b[cell.x][cell.y] = val)
}

export function iter<T>(b: Board<T>, a: (t: T, v: Vec2d) => void) {
  for (let x = 0; x < b.length; x++) {
    for (let y = 0; y < b[x].length; y++) {
      a(b[x][y], Vec(x, y))
    }
  }
}
export function map<T, U>(b: Board<T>, m: (t: T, p: Vec2d) => U) {
  const r = initBoard<U>(null)
  iter(b, (n, p) => (r[p.x][p.y] = m(n, p)))
  return r
}

const makeQuad = (start: Vec2d) =>
  [
    Vec(0, 0),
    Vec(0, 1),
    Vec(0, 2),
    Vec(1, 0),
    Vec(1, 1),
    Vec(1, 2),
    Vec(2, 0),
    Vec(2, 1),
    Vec(2, 2),
  ].map((v) => v.add(start))
const makeRow = (y: number) => [0, 1, 2, 3, 4, 5].map((n) => Vec(n, y))
const makeCol = (x: number) => [0, 1, 2, 3, 4, 5].map((n) => Vec(x, n))

export const zones = {
  q1: makeQuad(Vec(0, 0)),
  q2: makeQuad(Vec(0, 3)),
  q3: makeQuad(Vec(3, 0)),
  q4: makeQuad(Vec(3, 3)),
  r1: makeRow(0),
  r2: makeRow(1),
  r3: makeRow(2),
  r4: makeRow(3),
  r5: makeRow(4),
  r6: makeRow(5),
  c1: makeCol(0),
  c2: makeCol(1),
  c3: makeCol(2),
  c4: makeCol(3),
  c5: makeCol(4),
  c6: makeCol(5),
}
