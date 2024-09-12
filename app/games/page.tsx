"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getCurrentGame, getAllGames } from "@/utils/dataHelpers";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="bg-red-50 min-h-screen flex flex-col">
      {/* Top Banner */}
      <div className="bg-pink-950 p-2 flex justify-between items-center text-white text-sm">
        <div className="flex items-center space-x-4">
          <Trophy className="text-yellow-400" />
          <div>Live jackpot £1,500</div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FFC700] text-black"
          >
            Play Now
          </Button>
        </div>
        <div className="flex items-center space-x-4 border-l border-white pl-4">
          <div className="flex items-center gap-2">
            <Bell className="mr-" />
            <div className="flex flex-col">
              <span className="font-semibold">
                You have <span className="text-yellow-400">10 credits</span>{" "}
                left.
              </span>
              <small className="text-xxs">Buy more credits</small>
            </div>
            <a href="#" className="text-xs ml-1 underline">
              Buy more credits
            </a>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FFC700] text-black"
          >
            Buy Credits
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="flex justify-start items-center gap-4 text-black">
          <div className="text-lg font-bold">Logo</div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How to Play
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Winners
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex space-x-4 items-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-pink-900 text-pink-900"
          >
            Login
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FF6B00] text-white"
          >
            Register
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Current Game Banner */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-purple-700">Today's Game</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Rules Section */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Game Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Each player can submit one answer per game.</li>
                  <li>A minimum deposit of £10 is required to play.</li>
                  <li>Players can win unique prizes by providing a unique answer.</li>
                  <li>Instant win prizes are available for certain answers.</li>
                  <li>Games run daily from 8 PM to 8 PM, with a live draw at 9 PM.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* How to Play Section */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside">
                  <li>Choose an active game from the list.</li>
                  <li>Read the question carefully.</li>
                  <li>Submit your answer for £1, or use Lucky Dip for £5.</li>
                  <li>Wait for the game to end to see if your answer is unique.</li>
                  <li>Check the live results show for the winners announcement.</li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Frequently Asked Questions (FAQ)</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold">Q: How do I deposit credits?</h3>
                <p>A: You can deposit credits through the "Buy Credits" section in your account.</p>
                <h3 className="font-bold">Q: What happens if my answer is not unique?</h3>
                <p>A: If your answer is not unique, it will be marked as a duplicate, and you will not win the jackpot.</p>
                <h3 className="font-bold">Q: Can I play more than one game a day?</h3>
                <p>A: No, each player can only participate in one game per day.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Past Games Section */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Past Games</CardTitle>
              </CardHeader>
              <CardContent>
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
                      <p className="mb-2">Jackpot: £{game.current_prize}</p>
                      <p className="mb-2">
                        Winner: {game.winner || "No winner yet"}
                      </p>
                      <p>Ended: {formatUKTime(game.end_time)}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
