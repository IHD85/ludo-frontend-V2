import React, { useState } from 'react';
import type { Piece as PieceType } from '../types/gameTypes';

interface PieceProps {
  piece: PieceType;
  color: string;
  onClick?: (pieceId: number) => void;
  highlight?: boolean;
  showId?: boolean;
  isCurrentPlayer?: boolean; // 👈 vigtigt!
}

export const Piece: React.FC<PieceProps> = ({
  piece,
  color,
  onClick,
  highlight = false,
  showId = false,
  isCurrentPlayer = false, // 👈 brugt her
}) => {
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = () => {
    if (onClick) onClick(piece.id);

    // POP animation
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 150);
  };

  const colorMap: Record<string, string> = {
    red: '#f44336',
    green: '#4caf50',
    yellow: '#ffcc00',
    blue: '#03a9f4',
  };

  const backgroundColor = colorMap[color.toLowerCase()] || 'gray';

  return (
    <div
      onClick={handleClick}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, white 15%, ${backgroundColor} 100%)`,

        boxShadow: highlight
          ? '0 0 0 3px white, 0 3px 8px rgba(0,0,0,0.4)'

          : '0 3px 6px rgba(0,0,0,0.3)',

        cursor: highlight ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        transform: isPopping ? 'scale(1.3)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        color: '#fff',
        position: 'absolute',
        top: '2px',
        left: '2px',
        animation: isCurrentPlayer ? 'jump 0.6s infinite ease-in-out' : 'none',
      }}
    >
      {showId && piece.id}
      <style>
        {`
          @keyframes jump {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1) translateY(-6px); }
          }
        `}
      </style>
    </div>
  );
};
