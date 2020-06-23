import { Scene } from 'phaser'
import {plethoric, cyanosis, congested, bilious, grey} from '../colors'

export type TurnStateT = ReturnType<typeof TurnState>

function turnEnded(t: TurnStateT) {
  console.log(t.currentPlayer)
  t.currentPlayer = advance(t.currentPlayer, t)
}

export type Player = 0 | 1 | 2 | 3 | 4

export function advance(p: Player, t) {
  if (p < t.totalPlayers){
      return (p + 1) as Player
  } else {
      return 1 as Player
  }
}

const colors = [grey, congested, plethoric, cyanosis, bilious]
export function colorForPlayer(p: Player) {
  return colors[p]
}

export const TurnState = (s: Scene, startingPlayer: Player, numP: Number = 2) => {
  return {
    turnEnded,
    currentPlayer: startingPlayer,
    totalPlayers: numP
  }
}
