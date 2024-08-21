"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { Game, getCurrentGame } from "@/utils/dataHelpers";

interface GameContextType {
  currentGame: Game | null;
  updateGame: (game: Game) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  const updateGame = (game: Game) => {
    setCurrentGame(game);
  };

  useEffect(() => {
    // Fetch initial game data
    const game = getCurrentGame();
    setCurrentGame(game);

    // Set up an interval to update the game every minute
    const interval = setInterval(() => {
      const updatedGame = getCurrentGame();
      setCurrentGame(updatedGame);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{ currentGame, updateGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
