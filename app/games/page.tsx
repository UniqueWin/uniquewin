"use client";

import Link from "next/link";
import { getCurrentGame } from "@/utils/dataHelpers";
import { motion } from "framer-motion";

export default function GamesListPage() {
  const game = getCurrentGame();

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
          className="bg-purple-100 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-2 text-purple-700">
            {game.question}
          </h2>
          <p className="mb-2">Jackpot: £{game.jackpot}</p>
          <p className="mb-4">Ends: {new Date(game.endTime).toLocaleString()}</p>
          <Link
            href={`/games/${game.id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Play Now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}