import React from 'react';

type GameControlsProps = {
  currentPlayer: number;
  winnerId: number | null;
  players: Player[];
  onNextTurn: () => void;
  onReset: () => void;
  onSave?: () => void;
  onLoad?: () => void;
};

type Player = {
  id: number;
  color: string;
  name?: string;
};

export const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  winnerId,
  players,
  onNextTurn,
  onReset,
  onSave,
  onLoad
}) => {
  const getPlayerColor = (id: number | null): string => {
    if (id === null || id < 0) return 'gray';
    return players.find(p => p.id === id)?.color.toLowerCase() || 'gray';
  };

  return (
    <div className="game-controls">
      <div className="game-status">
        {winnerId === null ? (
          <div className="player-turn">
            <span
              className="color-indicator"
              style={{ backgroundColor: getPlayerColor(currentPlayer) }}
            />
            <p>Spiller {players[currentPlayer]?.color ?? `#${currentPlayer + 1}`}s tur</p>
          </div>
        ) : (
          <div className="winner-announcement">
            <span
              className="color-indicator"
              style={{ backgroundColor: getPlayerColor(winnerId) }}
            />
            <h2>
            Spiller {winnerId !== null && winnerId >= 0 && winnerId < players.length ? winnerId + 1 : '??'} har vundet!
            </h2>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={onReset} className="control-button reset-game">
          Nyt spil
        </button>

        {onSave && (
          <button onClick={onSave} className="control-button secondary">
            Gem spil
          </button>
        )}
        {onLoad && (
          <button onClick={onLoad} className="control-button secondary">
            Indlæs spil
          </button>
        )}
      </div>
    </div>
  );
};
