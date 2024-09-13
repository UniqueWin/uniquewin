import { GameCard } from "@/components/GameCard";
import { Play, Pause, Square, Edit } from "lucide-react";

interface GameOverviewCardProps {
  title: string;
  games: any[];
  onUpdate: () => void;
  onEdit: (game: any) => void;
  onStatusChange: (gameId: string, newStatus: string) => void;
  userId: string;
  icons: {
    play: React.ReactNode;
    pause: React.ReactNode;
    stop: React.ReactNode;
    edit: React.ReactNode;
  };
  setIsAddGameModalOpen: (isOpen: boolean) => void;
}

const GameOverviewCard: React.FC<GameOverviewCardProps> = ({ 
  title,
  games, 
  onUpdate, 
  onEdit, 
  onStatusChange, 
  userId, 
  icons, 
  setIsAddGameModalOpen 
}) => {
  return (
    <div className="col-span-1 bg-white p-4 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onUpdate={onUpdate}
            onEdit={() => onEdit(game)}
            onStatusChange={(newStatus) => onStatusChange(game.id, newStatus)}
            userId={userId}
            icons={icons}
          />
        ))}
      </div>
      {title === "Active Games" && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsAddGameModalOpen(true)}
        >
          Add New Game
        </button>
      )}
    </div>
  );
};

export default GameOverviewCard;