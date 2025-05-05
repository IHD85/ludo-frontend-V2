// src/components/PlayerInfo.tsx
import React from 'react';

interface PlayerInfoProps {
  // Tilføj dine props her
}

// Tilføj enten en eksport
export const PlayerInfo: React.FC<PlayerInfoProps> = ({ /* props */ }) => {
  return (
    <div className="player-info">
      {/* Din komponentkode her */}
    </div>
  );
};

// ELLER eksportér tomt objekt hvis filen ikke bruges endnu
// export {};