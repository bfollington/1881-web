export type Vec2d = { x: number; y: number; add: (v: Vec2d) => Vec2d }
export const Vec = (x: number, y: number) => ({
  x,
  y,
  add: (v: Vec2d) => Vec(x + v.x, y + v.y),
})
