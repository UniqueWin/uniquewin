import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  game: any;
  onUpdate: () => void;
  onEdit: () => void;
  onStatusChange: (newStatus: string) => void;
  userId: string;
  icons: {
    play: React.ReactElement;
    pause: React.ReactElement;
    stop: React.ReactElement;
    edit: React.ReactElement;
    delete: React.ReactElement;
  };
  onDelete: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onUpdate,
  onEdit,
  onStatusChange,
  userId,
  icons,
  onDelete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paused':
        return 'text-orange-500';
      case 'ended':
        return 'text-red-500';
      case 'completed':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{game.question}</h3>
      <p>Status: <span className={getStatusColor(game.status)}>{game.status}</span></p>
      <p>Current Prize: £{game.current_prize.toFixed(2)}</p>
      <div className="mt-4 flex space-x-2">
        {game.status !== 'active' && (
          <button
            onClick={() => handleStatusChange('active')}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
            title="Activate"
          >
            {icons.play}
          </button>
        )}
        {game.status === 'active' && (
          <button
            onClick={() => handleStatusChange('paused')}
            className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600"
            title="Pause"
          >
            {icons.pause}
          </button>
        )}
        <button
          onClick={() => handleStatusChange('ended')}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          title="End"
        >
          {icons.stop}
        </button>
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
          title="Edit"
        >
          {icons.edit}
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          title="Delete"
        >
          {icons.delete}
        </button>
      </div>
      {isPlaying && <GamePlay game={game} userId={userId} />}
    </div>
  );
};