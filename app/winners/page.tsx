"use client";

import { motion } from "framer-motion";
import { getAllGames } from "@/utils/dataHelpers";

const winnerData = [
  { name: "John Doe", prize: "£500" },
  { name: "Jane Smith", prize: "£750" },
  { name: "Mike Johnson", prize: "£1000" },
  { name: "Emily Brown", prize: "£250" },
  { name: "Alex Wilson", prize: "£1500" },
];

export default function WinnersPage() {
  const games = getAllGames();

  const getRandomWinner = () => winnerData[Math.floor(Math.random() * winnerData.length)];

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-purple-800">Winners</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => {
            const winner = game.answers.find(a => a.status === "UNIQUE") ? getRandomWinner() : null;
            return (
              <motion.div
                key={game.id}
                className="bg-purple-100 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-xl font-bold mb-2 text-purple-700">{game.question}</h2>
                <p className="mb-2">Jackpot: £{game.jackpot}</p>
                <p className="mb-2">Game ended: {new Date(game.endTime).toLocaleString()}</p>
                {winner ? (
                  <>
                    <p className="font-bold">Winner: {winner.name}</p>
                    <p>Prize: {winner.prize}</p>
                  </>
                ) : (
                  <p className="font-bold">No winner for this game</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}