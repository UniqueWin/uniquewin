"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllGames, Game } from "@/utils/dataHelpers";

export default function WinnersPage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const allGames = await getAllGames();
      setGames(allGames);
    };

    fetchGames();
  }, []);

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-purple-800">Winners</h1>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Game ID</th>
                <th className="text-left">Question</th>
                <th className="text-left">Winner</th>
                <th className="text-left">Winning Answer</th>
                <th className="text-left">Prize</th>
                <th className="text-left">Instant Win</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                const winningAnswer = game.answers.find(a => a.status === "UNIQUE");
                const instantWin = game.answers.find(a => a.instantWin !== "NO");
                let profit = 0;
                if (winningAnswer) profit += game.jackpot;
                if (instantWin) profit += parseInt(instantWin.instantWin.replace('£', ''));
                return (
                  <tr key={game.id}>
                    <td>{game.id}</td>
                    <td>{game.question}</td>
                    <td>{winningAnswer ? winningAnswer.answer : "No winner"}</td>
                    <td>{winningAnswer ? winningAnswer.answer : "N/A"}</td>
                    <td>£{profit}</td>
                    <td>{instantWin ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}