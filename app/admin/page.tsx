"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getAllGames, Game } from "@/utils/dataHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [games, setGames] = useState(getAllGames());
  const [newGame, setNewGame] = useState<Partial<Game>>({});

  const handleAddGame = () => {
    // Add logic to create a new game
  };

  const handleUpdateGame = (gameId: number, updatedGame: Partial<Game>) => {
    // Add logic to update a game
  };

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-purple-800">Admin Dashboard</h1>
        
        <div className="mb-8 bg-purple-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Add New Game</h2>
          <form className="space-y-4">
            <Input
              placeholder="Question"
              value={newGame.question || ''}
              onChange={(e) => setNewGame({...newGame, question: e.target.value})}
            />
            <Input
              placeholder="Jackpot"
              type="number"
              value={newGame.jackpot || ''}
              onChange={(e) => setNewGame({...newGame, jackpot: Number(e.target.value)})}
            />
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleAddGame}>
              Add Game
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {games.map((game) => (
            <div key={game.id} className="bg-purple-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2 text-purple-700">{game.question}</h2>
              <p>Jackpot: £{game.jackpot}</p>
              <p>Ends: {new Date(game.endTime).toLocaleString()}</p>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600">
                Edit Game
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}