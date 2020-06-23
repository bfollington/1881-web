import { Scene } from 'phaser'

export type TurnStateT = ReturnType<typeof TurnState>

function generateRandomInt(cap: number) {
  return Math.floor(Math.random() * (cap - 1)) + 1
}

function turnEnded(t: TurnStateT) {
  t.currentPlayer = inverse(t.currentPlayer)
}

export type Player = 'player1' | 'player2'
export function inverse(p: Player) {
  switch (p) {
    case 'player1':
      return 'player2'
    case 'player2':
      return 'player1'
  }
}

export const TurnState = (s: Scene, startingPlayer: Player) => {
  return {
    turnEnded,
    currentPlayer: startingPlayer,
  }
}
