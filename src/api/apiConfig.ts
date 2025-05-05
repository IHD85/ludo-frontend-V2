const API_BASE_URL = process.env.REACT_APP_API_BASE + '/api/GameControllerApi';

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

// 🛠️ Generisk fetch-funktion med korrekt return-type
async function fetchApi<T = void>(endpoint: string, options?: RequestInit): Promise<T | void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const contentType = response.headers.get("content-type");

  if (response.status === 204 || !contentType?.includes("application/json")) {
    return; // ingen indhold = ok
  }

  return await response.json();
}

// 📦 Eksporteret API-objekt
export const api = {
  fetchGameState: (): Promise<GameState> => fetchApi<GameState>('/board') as Promise<GameState>,
  rollDice: (): Promise<number> => fetchApi<number>('/roll', { method: 'POST' }) as Promise<number>,
  movePiece: (pieceId: number, diceValue: number): Promise<boolean> =>
    fetchApi<boolean>(`/move/${pieceId}?dice=${diceValue}`, { method: 'POST' }) as Promise<boolean>,
  getValidMoves: (dice: number): Promise<number[]> =>
    fetchApi<number[]>(`/validmoves/${dice}`) as Promise<number[]>,
  nextTurn: (): Promise<void> => fetchApi<void>('/next', { method: 'POST' }),
  resetGame: (): Promise<void> => fetchApi<void>('/reset', { method: 'POST' }),
};
