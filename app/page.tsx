"use client";

import Link from "next/link";
import { getAllGames } from "@/utils/dataHelpers";
import { motion } from "framer-motion";

export default function LandingPage() {
  const games = getAllGames();
  const featuredGame = games[0];

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
        className="container mx-auto px-4 py-8"
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
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-purple-100 p-6 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Choose a game from our list of active games</li>
              <li>Submit your answer for £1, or use Lucky Dip for £5</li>
              <li>Wait for the game to end to see if your answer is unique!</li>
            </ol>
            <Link
              href="/how-it-works"
              className="text-purple-600 hover:text-purple-800 transition mt-4 inline-block"
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div 
            className="bg-purple-100 p-6 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              Latest Winners
            </h2>
            <ul className="space-y-2">
              <li>"I won £500 last week!" - Sarah T.</li>
              <li>"UniqueWin is so exciting!" - John D.</li>
              <li>"Best game ever!" - Emma S.</li>
            </ul>
            <Link
              href="/winners"
              className="text-purple-600 hover:text-purple-800 transition mt-4 inline-block"
            >
              See All Winners
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-purple-100 p-6 rounded-lg shadow-md mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Current Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.slice(0, 6).map((game, index) => (
              <motion.div 
                key={game.id} 
                className="bg-white p-4 rounded shadow"
                variants={itemVariants}
                custom={index}
              >
                <h3 className="font-bold mb-2">{game.question}</h3>
                <p className="mb-2">Jackpot: £{game.jackpot}</p>
                <Link
                  href={`/games/${game.id}`}
                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition"
                >
                  Play
                </Link>
              </motion.div>
            ))}
          </div>
          <Link
            href="/games"
            className="text-purple-600 hover:text-purple-800 transition mt-4 inline-block"
          >
            View All Games
          </Link>
        </motion.div>

        <motion.div 
          className="bg-purple-500 text-white p-4 text-center rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-2">
            Don't Miss the 8PM Results Show
          </h2>
          <p>Every Monday Night Live on Facebook</p>
        </motion.div>
      </motion.main>
    </div>
  );
}