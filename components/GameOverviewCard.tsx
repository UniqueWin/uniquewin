import React, { ReactElement } from 'react';
import { Game } from '@/utils/dataHelpers';
// import GameStatusToggle from './GameStatusToggle';
import { Play, Pause, Square, Edit, Trash } from 'lucide-react';

interface GameOverviewCardProps {
  games: any[];
  userId: any;
  icons: { [key: string]: ReactElement };
  onEdit: (game: any) => void;
  onDelete: (gameId: string) => Promise<void>;
  onStatusChange: (gameId: string, newStatus: string) => Promise<void>;
}

const GameOverviewCard: React.FC<GameOverviewCardProps> = ({ games, userId, icons, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <div key={game.id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{game.question}</h3>
          <p className="text-sm text-gray-600 mb-2">Status: {game.gameStatus}</p>
          <p className="text-sm text-gray-600 mb-4">Jackpot: £{game.jackpot}</p>
          {/* <GameStatusToggle
            gameId={game.id}
            currentStatus={game.gameStatus}
            onStatusChange={(newStatus) => onStatusChange(game.id, newStatus)}
            userId={userId}
            icons={icons}
          /> */}
        </div>
      ))}
    </div>
  );
};

export default GameOverviewCard;