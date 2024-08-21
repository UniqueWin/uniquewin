import Link from "next/link";
import { getAllGames } from "@/utils/dataHelpers";

export default function LandingPage() {
  const games = getAllGames();
  const featuredGame = games[0]; // Assume the first game is featured

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to UniqueWin</h1>

      <div className="bg-purple-100 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Game</h2>
        <p className="text-xl mb-2">{featuredGame.question}</p>
        <p className="mb-4">Jackpot: £{featuredGame.jackpot}</p>
        <Link
          href={`/games/${featuredGame.id}`}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Play Now
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <p>Find a unique answer and win the jackpot!</p>
        <Link href="/how-it-works" className="text-purple-500">
          Learn More
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
        <p>
          "I won £500 last week with UniqueWin! It's so exciting!" - Sarah T.
        </p>
      </div>

      <Link
        href="/games"
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        View All Games
      </Link>
    </div>
  );
}
