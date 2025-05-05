import React from 'react';
import type { Player } from '../types/gameTypes';
import { Piece } from './Piece';

interface BoardProps {
  players: Player[];
  onPieceClick?: (pieceId: number) => void;
  validMoves?: number[];
  currentPlayer: number;
}

const GRID_SIZE = 15;

export const Board: React.FC<BoardProps> = ({
  players,
  onPieceClick,
  validMoves = [],
  currentPlayer,
}) => {
  const handlePieceClick = (pieceId: number) => {
    if (onPieceClick) onPieceClick(pieceId);
  };

  const getPieceAt = (x: number, y: number) => {
    for (const player of players) {
      for (const piece of player.pieces) {
        const pos = piece.position;

        if (pos === -1) {
          const home = getHomeCoordinates(player.id, piece.id);
          if (home.x === x && home.y === y) {
            return { ...piece, color: player.color, playerId: player.id };
          }
        }

        if (pos >= 100) {
          const goal = getGoalCoordinates(player.id, piece.id);
          if (goal.x === x && goal.y === y) {
            return { ...piece, color: player.color, playerId: player.id };
          }
        }

        if (pos >= 0 && pos < 52) {
          const absPos = getAbsoluteBoardPosition(player.id, pos);
          const coord = getCoordinatesFromAbsolutePosition(absPos);
          if (coord.x === x && coord.y === y) {
            return { ...piece, color: player.color, playerId: player.id };
          }
        }
      }
    }
    return null;
  };

  const getBackgroundColor = (x: number, y: number) => {
    if ((x >= 0 && x <= 5) && (y >= 0 && y <= 5)) return '#f44336'; // Rød område
    if ((x >= 9 && x <= 14) && (y >= 0 && y <= 5)) return '#4caf50'; // Grøn område
    if ((x >= 9 && x <= 14) && (y >= 9 && y <= 14)) return '#ffcc00'; // Gul område
    if ((x >= 0 && x <= 5) && (y >= 9 && y <= 14)) return '#03a9f4'; // Blå område
    return '#e0e0e0';
  };

  const startCells = [
    { x: 1, y: 6, color: 'red' },
    { x: 8, y: 1, color: 'green' },
    { x: 13, y: 8, color: 'yellow' },
    { x: 6, y: 13, color: 'blue' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 40px)`,
        gap: '2px',
        margin: '1rem auto',
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);
        const piece = getPieceAt(x, y);
        const isClickable = piece && validMoves.includes(piece.id);

        return (
          <div
            key={`cell-${x}-${y}`}
            onClick={() => piece && isClickable && handlePieceClick(piece.id)}
            style={{
              backgroundColor: piece
  ? piece.color?.toLowerCase() ?? 'gray'
  : getBackgroundColor(x, y),

              width: '40px',
              height: '40px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: isClickable ? 'pointer' : 'default',
              color: piece ? '#fff' : '#555',
              position: 'relative',
            }}
          >
            {piece && (
              <Piece
              piece={piece}
              color={danishToEnglishColorMap[piece.color] ?? 'gray'}
              onClick={handlePieceClick}
              highlight={validMoves.includes(piece.id) && piece.playerId === currentPlayer}
              isCurrentPlayer={piece.playerId === currentPlayer}
            />                   
            )}

            {!piece && (() => {
              const start = startCells.find(c => c.x === x && c.y === y);
              if (start) {
                return (
                  <span style={{ color: start.color, fontSize: '1.2rem', fontWeight: 'bold' }}>★</span>
                );
              }

              const entry = entryToGoalCells.find(c => c.x === x && c.y === y);
              if (entry) {
                const rotationMap: Record<string, string> = {
                  up: 'rotate(270deg)',
                  down: 'rotate(90deg)',
                  left: 'rotate(180deg)',
                  right: 'rotate(0deg)',
                };
                return (
                  <span
                    style={{
                      color: entry.color,
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      transform: rotationMap[entry.direction],
                    }}
                  >
                    ▶
                  </span>
                );
              }

              const goalCells = [
                { x: 1, y: 7, color: 'red' },
                { x: 2, y: 7, color: 'red' },
                { x: 3, y: 7, color: 'red' },
                { x: 4, y: 7, color: 'red' },
                { x: 5, y: 7, color: 'red' },
                { x: 6, y: 7, color: 'red' },
                { x: 7, y: 1, color: 'green' },
                { x: 7, y: 2, color: 'green' },
                { x: 7, y: 3, color: 'green' },
                { x: 7, y: 4, color: 'green' },
                { x: 7, y: 5, color: 'green' },
                { x: 7, y: 6, color: 'green' },
                { x: 7, y: 13, color: 'blue' },
                { x: 7, y: 12, color: 'blue' },
                { x: 7, y: 11, color: 'blue' },
                { x: 7, y: 10, color: 'blue' },
                { x: 7, y: 9, color: 'blue' },
                { x: 7, y: 8, color: 'blue' },
                { x: 13, y: 7, color: 'yellow' },
                { x: 12, y: 7, color: 'yellow' },
                { x: 11, y: 7, color: 'yellow' },
                { x: 10, y: 7, color: 'yellow' },
                { x: 9, y: 7, color: 'yellow' },
                { x: 8, y: 7, color: 'yellow' },
              ];

              const goal = goalCells.find(g => g.x === x && g.y === y);
              if (goal) {
                return (
                  <div
                    style={{
                      backgroundColor: goal.color,
                      width: '100%',
                      height: '100%',
                      borderRadius: '4px',
                      opacity: 0.5,
                    }}
                  />
                );
              }

              if (x === 6 && y === 6) {
                return (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0px',
                      left: '0px',
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle, #ffffff, #eee)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.8rem',
                      color: '#333',
                      border: '3px solid #888',
                      borderRadius: '16px',
                      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
                      zIndex: 5,
                      gridColumnStart: 7,
                      gridColumnEnd: 10,
                      gridRowStart: 7,
                      gridRowEnd: 10,
                    }}
                  >
                    🎯 End
                  </div>
                );
              }

              return null;
            })()}
          </div>
        );
      })}
    </div>
  );
};

// Helpers

const getCoordinatesFromAbsolutePosition = (absPos: number): { x: number, y: number } => {
  const path = [
    { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
    { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 },
    { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 },
    { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 9, y: 6 }, { x: 10, y: 6 },
    { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 }, { x: 14, y: 7 },
    { x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 },
    { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 },
    { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 7, y: 14 }, { x: 6, y: 14 },
    { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 },
    { x: 6, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 },
    { x: 1, y: 8 }, { x: 0, y: 8 }, { x: 0, y: 7 }
  ];
  return path[absPos % 52];
};

const getAbsoluteBoardPosition = (playerId: number, relativePos: number): number => {
  const startIndices: Record<number, number> = {
    0: 0,    // Rød
    1: 13,   // Grøn
    2: 26,   // Gul
    3: 39,   // Blå
  };
  return (startIndices[playerId] + relativePos) % 52;
};

const getGoalCoordinates = (playerId: number, pieceId: number): { x: number, y: number } => {
  switch (playerId) {
    case 0: return { x: 7, y: 1 + pieceId };         // Rød mål
    case 1: return { x: 13 - pieceId, y: 7 };        // Grøn mål
    case 2: return { x: 7, y: 13 - pieceId };        // Gul mål
    case 3: return { x: 1 + pieceId, y: 7 };         // Blå mål
    default: return { x: -1, y: -1 };
  }
};

const getHomeCoordinates = (playerId: number, pieceId: number): { x: number, y: number } => {
  switch (playerId) {
    case 0: return { x: 2 + (pieceId % 2), y: 2 + Math.floor(pieceId / 2) }; // Rød
    case 1: return { x: 12 - (pieceId % 2), y: 2 + Math.floor(pieceId / 2) }; // Grøn
    case 2: return { x: 12 - (pieceId % 2), y: 12 - Math.floor(pieceId / 2) }; // Gul
    case 3: return { x: 2 + (pieceId % 2), y: 12 - Math.floor(pieceId / 2) }; // Blå
    default: return { x: -1, y: -1 };
  }
};

const danishToEnglishColorMap: Record<string, string> = {
  'Rød': 'red',
  'Grøn': 'green',
  'Blå': 'blue',
  'Gul': 'yellow',
};

const entryToGoalCells = [
  { x: 14, y: 7, color: 'yellow', direction: 'left' },
  { x: 7, y: 0,  color: 'green',  direction: 'down' },
  { x: 0, y: 7,  color: 'red',    direction: 'right' },
  { x: 7, y: 14, color: 'blue',   direction: 'up' },
];
