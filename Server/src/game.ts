export type PlayerSymbol = "X" | "O";

export interface GameState {
  board: (PlayerSymbol | null)[];
  currentTurn: PlayerSymbol;
  winner: PlayerSymbol | null;
}

export function createInitialState(): GameState {
  return {
    board: Array(9).fill(null),
    currentTurn: "X",
    winner: null,
  };
}
