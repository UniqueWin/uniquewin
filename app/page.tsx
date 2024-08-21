"use client";

import Link from "next/link";
import { getCurrentGame, getAllGames } from "@/utils/dataHelpers";
import { motion } from "framer-motion";

export default function LandingPage() {
  const currentGame = getCurrentGame();
  const pastGames = getAllGames().slice(1, 4); // Get 3 past games

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.main 
        className="container mx-auto px-4 py-8 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-purple-800"
          variants={itemVariants}
        >
          Welcome to UniqueWin
        </motion.h1>

        <motion.div 
          className="bg-purple-100 p-6 rounded-lg mb-8 shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Today's Game
          </h2>
          <p className="text-xl mb-2">{currentGame.question}</p>
          <p className="mb-4">Jackpot: £{currentGame.jackpot}</p>
          <Link
            href={`/games/${currentGame.id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Play Now
          </Link>
        </motion.div>

        <motion.div 
          className="bg-purple-100 p-6 rounded-lg shadow-md mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            How It Works
          </h2>
          <p className="mb-4">UniqueWin offers one exciting game every day. Be the first to submit a unique answer and win the jackpot!</p>
          <Link
            href="/how-it-works"
            className="text-purple-600 hover:text-purple-800 transition"
          >
            Learn More
          </Link>
        </motion.div>

        <motion.div 
          className="bg-purple-100 p-6 rounded-lg shadow-md mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Recent Winners
          </h2>
          {pastGames.map((game, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">{game.question}</h3>
              <p>Winner: {game.answers.find(a => a.status === "UNIQUE")?.answer || "No winner"}</p>
              <p>Jackpot: £{game.jackpot}</p>
            </div>
          ))}
          <Link
            href="/winners"
            className="text-purple-600 hover:text-purple-800 transition"
          >
            View All Winners
          </Link>
        </motion.div>

        <motion.div 
          className="bg-purple-500 text-white p-4 text-center rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-2">
            Don't Miss the 8PM Results Show
          </h2>
          <p>Every Night Live on Facebook</p>
        </motion.div>
      </motion.main>
    </div>
  );
}