"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getAllGames } from "@/utils/dataHelpers";

export default function WinnersPage() {
  const [activeTab, setActiveTab] = useState("LAST MONTH");
  const games = getAllGames();

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-purple-800">Winners</h1>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md">
          <div className="flex mb-4">
            <button
              className={`mr-2 px-4 py-2 rounded ${
                activeTab === "LAST MONTH" ? "bg-purple-500 text-white" : "bg-purple-200"
              }`}
              onClick={() => setActiveTab("LAST MONTH")}
            >
              LAST MONTH
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "STATUS" ? "bg-purple-500 text-white" : "bg-purple-200"
              }`}
              onClick={() => setActiveTab("STATUS")}
            >
              STATUS
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Game ID</th>
                <th className="text-left">Question</th>
                <th className="text-left">Entries</th>
                <th className="text-left">Win/Lose</th>
                <th className="text-left">Instant Win</th>
                <th className="text-left">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                const winningAnswer = game.answers.find(a => a.status === "UNIQUE");
                const instantWin = game.answers.find(a => a.instantWin !== "NO");
                let profit = 0;
                if (winningAnswer) profit += game.jackpot;
                if (instantWin) profit += parseInt(instantWin.instantWin.replace('£', ''));
                profit -= game.answers.length; // Assuming each entry costs £1

                return (
                  <tr key={game.id}>
                    <td>{game.id}</td>
                    <td>{game.question}</td>
                    <td>{game.answers.length}</td>
                    <td>{winningAnswer ? "WIN" : "LOSE"}</td>
                    <td>{instantWin ? instantWin.instantWin : "NO"}</td>
                    <td className={profit >= 0 ? "text-green-500" : "text-red-500"}>
                      {profit >= 0 ? `+£${profit}` : `-£${Math.abs(profit)}`}
                    </td>
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