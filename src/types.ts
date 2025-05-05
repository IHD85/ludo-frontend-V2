// src/types.ts

export interface PieceDto {
    id: number;
    position: number;
  }
  
  export interface PlayerDto {
    id: number;
    color: string;
    pieces: PieceDto[];
  }
  
  export interface BoardStatusDto {
    players: PlayerDto[];
  }
  
  export interface GameStateDto {
    currentPlayer: number;
    players: PlayerDto[];
    winnerId: number | null;
  }
  