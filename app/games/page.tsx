"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getCurrentGame, getAllGames } from "@/utils/dataHelpers";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GamesListPage() {
  const [currentGame, setCurrentGame] = useState<any | null>(null);
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const currentGameData = await getCurrentGame();
        console.log("Current game data:", currentGameData);
        setCurrentGame(currentGameData);

        const pastGamesData = await getAllGames();
        console.log("Past games data:", pastGamesData);
        setPastGames(pastGamesData);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatUKTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { 
      timeZone: 'Europe/London',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#7f102c] min-h-screen">
      <Header />
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Current Game Banner */}
        <div className="bg-white text-black p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-4xl font-bold mb-2 text-purple-700">Today's Game</h1>
          {currentGame ? (
            <>
              <h2 className="text-xl font-bold mb-2">{currentGame.question}</h2>
              <p className="mb-2">Jackpot: £{currentGame.current_prize}</p>
              <p className="mb-4">Ends: {formatUKTime(currentGame.end_time)}</p>
              <Link
                href={`/games/${currentGame.id}`}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Play Now
              </Link>
            </>
          ) : (
            <p>No active game at the moment. Check back later!</p>
          )}
        </div>

        {/* Game Rules Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Game Rules</h2>
          <ul className="list-disc list-inside text-white">
            <li>Each player can submit one answer per game.</li>
            <li>A minimum deposit of £10 is required to play.</li>
            <li>Players can win unique prizes by providing a unique answer.</li>
            <li>Instant win prizes are available for certain answers.</li>
            <li>Games run daily from 8 PM to 8 PM, with a live draw at 9 PM.</li>
          </ul>
        </section>

        {/* How to Play Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">How to Play</h2>
          <ol className="list-decimal list-inside text-white">
            <li>Choose an active game from the list.</li>
            <li>Read the question carefully.</li>
            <li>Submit your answer for £1, or use Lucky Dip for £5.</li>
            <li>Wait for the game to end to see if your answer is unique.</li>
            <li>Check the live results show for the winners announcement.</li>
          </ol>
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Frequently Asked Questions (FAQ)</h2>
          <div className="text-white">
            <h3 className="font-bold">Q: How do I deposit credits?</h3>
            <p>A: You can deposit credits through the "Buy Credits" section in your account.</p>
            <h3 className="font-bold">Q: What happens if my answer is not unique?</h3>
            <p>A: If your answer is not unique, it will be marked as a duplicate, and you will not win the jackpot.</p>
            <h3 className="font-bold">Q: Can I play more than one game a day?</h3>
            <p>A: No, each player can only participate in one game per day.</p>
          </div>
        </section>

        {/* Past Games Section */}
        <h2 className="text-3xl font-bold mb-4 text-white">Past Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="bg-purple-100 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-bold mb-2 text-purple-700">
                {game.question}
              </h3>
              <p className="mb-2 text-black">Jackpot: £{game.current_prize}</p>
              <p className="mb-2 text-black">
                Winner: {game.winner || "No winner yet"}
              </p>
              <p className="text-black">Ended: {formatUKTime(game.end_time)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
