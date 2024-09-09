import { Switch } from "@/components/ui/switch";

interface Game {
  id: string;
  question: string;
  current_prize: number;
  status: string;
  instantWinPrizes: Array<{
    id: string;
    prize_type: string;
    prize_amount: number;
  }>;
}

interface GameCardProps {
  game: Game;
  onUpdate: () => void;
}

export function GameCard({ game, onUpdate }: GameCardProps) {
  const handleStatusChange = async (newStatus: boolean) => {
    // Update game status in the database
    // Then call onUpdate to refresh the games list
    onUpdate();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow text-gray-800">
      <h3 className="text-xl font-semibold text-gray-900">{game.question}</h3>
      <p className="text-gray-700">Prize: £{game.current_prize}</p>
      <div className="flex items-center mt-2">
        <span className="text-gray-700 mr-2">Status:</span>
        <Switch
          checked={game.status === 'active'}
          onCheckedChange={(checked) => handleStatusChange(checked)}
        />
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-900">Instant Win Prizes:</h4>
        <ul className="text-sm text-gray-700">
          {game.instantWinPrizes?.slice(0, 3).map(prize => (
            <li key={prize.id}>{prize.prize_type}: {prize.prize_amount}</li>
          ))}
          {game.instantWinPrizes?.length > 3 && <li>+ {game.instantWinPrizes?.length - 3} more...</li>}
        </ul>
      </div>
    </div>
  );
}