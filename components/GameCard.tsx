import React, { useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
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
  };
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onUpdate,
  onEdit,
  onStatusChange,
  userId,
  icons
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">
        <Link href={`/games/${game.id}`}>{game.question}</Link> {/* Link to game details */}
      </h3>
      <p>Status: {game.status}</p>
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
      </div>
      {/* {isPlaying && <GamePlay game={game} userId={userId} />} */}
    </div>
  );
};