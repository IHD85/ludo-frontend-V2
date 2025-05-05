// src/types/gameTypes.ts
export interface GameState {
    currentPlayer: number;
    players: Player[];
    winnerId: number | null;
  }
  
  export interface Player {
    id: number;
    color: string;
    pieces: Piece[];
  }
  
  export interface Piece {
    id: number;
    position: number;
  }
  
  // Alternativt hvis du ikke bruger dem endnu:
  // export {};