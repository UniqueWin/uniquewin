import Link from "next/link";
import { getAllGames } from "@/utils/dataHelpers";

export default function GamesListPage() {
  const games = getAllGames();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Current Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games?.map((game) => (
          <div key={game.id} className="bg-purple-100 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">{game.question}</h2>
            <p className="mb-2">Jackpot: £{game.jackpot}</p>
            <p className="mb-4">Ends: {game.endTime.toLocaleString()}</p>
            <Link
              href={`/games/${game.id}`}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Play Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
