import React, { useEffect, useState } from 'react';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { GameControls } from './components/GameControls';
import { api } from './api/apiConfig';
import type { GameState } from './types/gameTypes';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshGameState = async () => {
    try {
      const state = await api.fetchGameState();
      setGameState(state);
    } catch (err) {
      console.error(err);
      setError('Kunne ikke hente spilstatus.');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await api.resetGame();
      await refreshGameState();
      setLoading(false);
    };
    init();
  }, []);

  const handleRoll = async () => {
    try {
      const value = await api.rollDice();
      setDiceValue(value);
  
      const valid = await api.getValidMoves(value);
  
      // Hent ny state efter kast
      const state = await api.fetchGameState();
      setGameState(state);
  
      const current = state.players[state.currentPlayer];
      const piecesAtHome = current.pieces.filter(p => p.position === -1);
  
      // Hvis alle er hjemme og det er en 6’er → vis kun én brik
      if (value === 6 && valid.length > 1 && piecesAtHome.length === 4) {
        setValidMoves([valid[0]]);
      } else {
        setValidMoves(valid);
      }
  
      // Hvis ingen gyldige træk og ikke 6 → næste tur
      if (valid.length === 0 && value !== 6) {
        await api.nextTurn();
        setDiceValue(null);
        setValidMoves([]);
        await refreshGameState();
      }
  
      return value;
    } catch (err) {
      setError('Fejl ved terningekast.');
      throw err;
    }
  };
  

  const handlePieceClick = async (pieceId: number) => {
    if (diceValue === null || !validMoves.includes(pieceId)) return;
    try {
      const moved = await api.movePiece(pieceId, diceValue);
      if (moved) {
        const rolledSix = diceValue === 6;
        setDiceValue(null);
        setValidMoves([]);
        await refreshGameState();

        // Hvis ikke 6, og ingen vinder, så næste tur
        if (!rolledSix && !gameState?.winnerId) {
          await api.nextTurn();
          await refreshGameState();
        }
      }
    } catch (err) {
      setError('Fejl ved flytning af brik.');
    }
  };

  const handleNextTurn = async () => {
    await api.nextTurn();
    setDiceValue(null);
    setValidMoves([]);
    await refreshGameState();
  };

  const handleReset = async () => {
    await api.resetGame();
    setDiceValue(null);
    setValidMoves([]);
    await refreshGameState();
  };

  if (loading) return <div>⏳ Indlæser spil ...</div>;
  if (!gameState) return <div>❌ Kunne ikke loade spil.</div>;

  return (
    <div className="ludo-game">
      <h1>Ludo Spil</h1>

      <Board
        players={gameState.players}
        currentPlayer={gameState.currentPlayer}
        onPieceClick={handlePieceClick}
        validMoves={validMoves}
      />

      <Dice
        onRoll={handleRoll}
        disabled={gameState.winnerId !== null || validMoves.length > 0}
        currentPlayer={gameState.currentPlayer}
        players={gameState.players}
      />

      <GameControls
        currentPlayer={gameState.currentPlayer}
        winnerId={gameState.winnerId}
        players={gameState.players}
        onNextTurn={handleNextTurn}
        onReset={handleReset}
      />

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default App;
