import Link from "next/link";
import { generateDummyGames } from "@/utils/dataHelpers";

export default function GamesListPage() {
  const games = generateDummyGames(10); // Or however many games you want to show

  return (
    <div>
      <h1>Current Games</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.id}`}>
              {game.question} - Jackpot: £{game.jackpot}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
