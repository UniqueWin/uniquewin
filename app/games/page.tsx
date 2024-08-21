"use client";

import Link from "next/link";
import { getCurrentGame, getAllGames } from "@/utils/dataHelpers";
import { motion } from "framer-motion";

export default function GamesListPage() {
  const currentGame = getCurrentGame();
  const pastGames = getAllGames().slice(1, 6); // Get 5 past games

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-purple-800">
          Today's Game
        </h1>
        <motion.div
          className="bg-purple-100 p-6 rounded-lg shadow-md mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-2 text-purple-700">
            {currentGame.question}
          </h2>
          <p className="mb-2">Jackpot: £{currentGame.jackpot}</p>
          <p className="mb-4">
            Ends: {new Date(currentGame.endTime).toLocaleString()}
          </p>
          <Link
            href={`/games/${currentGame.id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Play Now
          </Link>
        </motion.div>

        <h2 className="text-3xl font-bold mb-4 text-purple-800">Past Games</h2>
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
              <p className="mb-2">Jackpot: £{game.jackpot}</p>
              <p className="mb-2">
                Winner:{" "}
                {game.answers.find((a) => a.status === "UNIQUE")?.answer ||
                  "No winner"}
              </p>
              <p>Ended: {new Date(game.endTime).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
