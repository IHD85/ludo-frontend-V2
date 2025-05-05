const API_BASE_URL = 'https://localhost:7070/api/GameControllerApi';

export const fetchGameState = async (): Promise<GameState> => {
  const response = await fetch(`${API_BASE_URL}/board`);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const rollDice = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/roll`, { method: 'POST' });
  return await response.json();
};

export const movePiece = async (pieceId: number, diceValue: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/move/${pieceId}?dice=${diceValue}`, { method: 'POST' });
  return await response.json();
};

export const nextTurn = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/next`, { method: 'POST' });
};

export const resetGame = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/reset`, { method: 'POST' });
};

export const getValidMoves = async (diceValue: number): Promise<number[]> => {
  const response = await fetch(`${API_BASE_URL}/validmoves/${diceValue}`);
  return await response.json();
};

// Typer (kan flyttes til separate typefiler)
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
