"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client"; // Ensure you have the Supabase client
import { Game } from "@/utils/dataHelpers"; // Import Game type if needed
import AddGameModal from "@/components/AddGameModal"; // Import your modal component
import AddInstantWinPrizeModal from "@/components/AddInstantWinPrizeModal"; // Import your modal component

export default function Component() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [pastGames, setPastGames] = useState<Game[]>([]);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchGames = async () => {
      const { data: currentGameData, error: currentGameError } = await supabase
        .from("games")
        .select("*")
        .eq("status", "active")
        .single(); // Assuming you want the current active game

      if (currentGameError) {
        console.error("Error fetching current game:", currentGameError);
      } else {
        setCurrentGame(currentGameData);
      }

      const { data: pastGamesData, error: pastGamesError } = await supabase
        .from("games")
        .select("*")
        .neq("status", "active"); // Fetch past games

      if (pastGamesError) {
        console.error("Error fetching past games:", pastGamesError);
      } else {
        setPastGames(pastGamesData);
      }
    };

    fetchGames();
  }, [supabase]);

  return (
    <div>
      <Header />
      <main>
        {/* Render current game and past games */}
        {currentGame && (
          <div>
            <h1>{currentGame.question}</h1>
            <p>Jackpot: £{currentGame.jackpot}</p>
            <p>Ends: {new Date(currentGame.endTime).toLocaleString()}</p>
          </div>
        )}
        <h2>Past Games</h2>
        <ul>
          {pastGames.map((game) => (
            <li key={game.id}>{game.question}</li>
          ))}
        </ul>

        {/* Buttons to open modals */}
        <button onClick={() => setIsAddGameModalOpen(true)}>Add New Game</button>
        <button onClick={() => setIsAddPrizeModalOpen(true)}>Add Instant Win Prize</button>

        {/* Modals */}
        <AddGameModal
          isOpen={isAddGameModalOpen}
          onClose={() => setIsAddGameModalOpen(false)}
        />
        <AddInstantWinPrizeModal
          isOpen={isAddPrizeModalOpen}
          onClose={() => setIsAddPrizeModalOpen(false)}
        />
      </main>
      <Footer />
    </div>
  );
}
