import { Player } from './turn'

export type Cell = {
  content: number
  placedBy?: Player
}
