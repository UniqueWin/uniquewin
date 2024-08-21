import Link from "next/link";
import { getAllGames } from "@/utils/dataHelpers";

export default function LandingPage() {
  const games = getAllGames();
  const featuredGame = games[0];

  return (
    <div className="bg-purple-300 min-h-screen">
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-purple-800">
          Welcome to UniqueWin
        </h1>

        <div className="bg-purple-100 p-6 rounded-lg mb-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Featured Game
          </h2>
          <p className="text-xl mb-2">{featuredGame.question}</p>
          <p className="mb-4">Jackpot: £{featuredGame.jackpot}</p>
          <Link
            href={`/games/${featuredGame.id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Play Now
          </Link>
        </div>

        <div className="mb-8 bg-purple-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            How It Works
          </h2>
          <p className="mb-4">Find a unique answer and win the jackpot!</p>
          <Link
            href="/how-it-works"
            className="text-purple-600 hover:text-purple-800 transition"
          >
            Learn More
          </Link>
        </div>

        <div className="mb-8 bg-purple-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Testimonials
          </h2>
          <p>
            "I won £500 last week with UniqueWin! It's so exciting!" - Sarah T.
          </p>
        </div>

        <Link
          href="/games"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          View All Games
        </Link>
      </main>
    </div>
  );
}
