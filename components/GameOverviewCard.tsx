import React from 'react';
import { GameCard } from './GameCard';

interface GameOverviewCardProps {
  games: any[];
  onEdit: (game: any) => void;
  onDelete: (gameId: string) => void;
  onStatusChange: (gameId: string, newStatus: string) => void;
  userId: string;
  title: string;
  onUpdate: () => void;
  setIsAddGameModalOpen: (isOpen: boolean) => void;
  icons: {
    play: React.ReactElement;
    pause: React.ReactElement;
    stop: React.ReactElement;
    edit: React.ReactElement;
    delete: React.ReactElement;
  };
}

const GameOverviewCard: React.FC<GameOverviewCardProps> = ({
  games,
  onEdit,
  onDelete,
  onStatusChange,
  userId,
  title,
  onUpdate,
  setIsAddGameModalOpen,
  icons,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      {games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="border p-4 rounded-lg">
              <GameCard
                game={game}
                onUpdate={onUpdate}
                onEdit={() => onEdit(game)}
                onStatusChange={(newStatus) => onStatusChange(game.id, newStatus)}
                userId={userId}
                icons={icons}
                onDelete={() => onDelete(game.id)}
              />
              <div className="mt-2 text-sm text-gray-600">
                <p>Start Time: {game.start_time}</p>
                <p>End Time: {game.end_time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsAddGameModalOpen(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Game
      </button>
    </div>
  );
};

export default GameOverviewCard;