import React, { useState } from 'react';

type DiceProps = {
  onRoll: () => Promise<number>;
  disabled?: boolean;
  currentPlayer: number;
  players: { color: string }[];
};

// Match frontendfarverne fra Board.tsx
const playerColorMap: Record<string, string> = {
  rød: '#f44336',
  grøn: '#4caf50',
  gul: '#ffcc00',
  blå: '#03a9f4',
};


export const Dice: React.FC<DiceProps> = ({
  onRoll,
  disabled = false,
  currentPlayer = 0,
  players,
}) => {
  const [value, setValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [showValue, setShowValue] = useState(false);

  const handleRoll = async () => {
    if (disabled) return;

    setRolling(true);
    setShowValue(false);

    const result = await onRoll();

    setValue(result);
    setRolling(false);
    setShowValue(true);

    setTimeout(() => setShowValue(false), 2000);
  };

  const playerColorKey = players[currentPlayer]?.color.toLowerCase() ?? 'gray';
  const backgroundColor = playerColorMap[playerColorKey] || 'gray';

  return (
    <div className="dice-container" style={{ textAlign: 'center', margin: '1rem' }}>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        {`Spiller ${players[currentPlayer]?.color ?? 'ukendt'} tur`}
      </p>
      <button
        className={`dice ${rolling ? 'rolling' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleRoll}
        disabled={disabled || rolling}
        aria-label="Kast terning"
        style={{
          backgroundColor: rolling ? '#4CAF50' : backgroundColor,
          border: 'none',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#fff',
          cursor: rolling ? 'wait' : 'pointer',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease',
        }}
      >
        {showValue ? (
          <span>{value}</span>
        ) : (
          <span style={{ fontSize: '3rem' }}>🎲</span>
        )}
      </button>
    </div>
  );
};
