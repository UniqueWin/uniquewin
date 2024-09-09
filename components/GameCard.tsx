import React, { useState } from 'react';
import { GamePlay } from './GamePlay';

interface GameCardProps {
  game: any;
  onUpdate: () => void;
  onEdit: () => void;
  onStatusChange: (newStatus: string) => void;
  userId: string | null;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onUpdate, onEdit, onStatusChange, userId }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{game.question}</h3>
      <p>Status: {game.status}</p>
      <p>Current Prize: £{game.current_prize}</p>
      <div className="mt-2">
        <h4 className="font-semibold">Instant Win Prizes:</h4>
        <ul>
          {game.game_instant_win_prizes.map((prize: any) => (
            <li key={prize.instant_win_prize_id}>
              {prize.instant_win_prizes.prize_type}: £{prize.instant_win_prizes.prize_amount} 
              (Quantity: {prize.quantity}, Probability: {prize.custom_probability}%)
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 space-x-2">
        {game.status === 'pending' && (
          <button
            onClick={() => handleStatusChange('active')}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Start
          </button>
        )}
        {game.status === 'active' && (
          <button
            onClick={() => handleStatusChange('paused')}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Pause
          </button>
        )}
        {game.status === 'paused' && (
          <button
            onClick={() => handleStatusChange('active')}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Resume
          </button>
        )}
        <button
          onClick={() => handleStatusChange('stopped')}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Stop
        </button>
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        {game.status === 'active' && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
          >
            {isPlaying ? 'Close' : 'Play'}
          </button>
        )}
      </div>
      {isPlaying && <GamePlay game={game} userId={userId} />}
    </div>
  );
};