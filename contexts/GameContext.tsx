"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { Game, getCurrentGame } from "@/utils/gameHelpers";

interface GameContextType {
  currentGame: Game | null;
  setCurrentGame: React.Dispatch<React.SetStateAction<Game | null>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const game = await getCurrentGame();
        setCurrentGame(game);
      } catch (error) {
        console.error('Error fetching current game:', error);
      }
    };

    fetchGame();

    const interval = setInterval(fetchGame, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{ currentGame, setCurrentGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
