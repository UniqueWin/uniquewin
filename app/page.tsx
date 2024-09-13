"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client"; // Ensure you have the Supabase client
import { Game } from "@/utils/dataHelpers"; // Import Game type if needed
import Navbar from "@/components/Navbar";

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
    <div className="flex flex-col items-center justify-start h-[90vh]">
      <main className="flex flex-col items-center justify-bewteen self-stretch h-full">
        {/* Render current game and past games */}
        {currentGame && (
          <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-2xl font-bold">{currentGame.question}</h1>
            <p className="text-lg">Jackpot: £{currentGame.current_prize}</p>
            <p className="text-lg">Ends: {new Date(currentGame.end_time).toLocaleString()}</p>
          </div>
        )}
        <h2>Past Games</h2>
        <ul>
          {pastGames.map((game) => (
            <li key={game.id}>{game.question}</li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
