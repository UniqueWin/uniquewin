"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { GameCard } from "@/components/GameCard";
import { AddInstantWinPrizeModal } from "@/components/AddInstantWinPrizeModal";
import { AddGameModal } from "@/components/AddGameModal";

export default function AdminPage() {
  const [games, setGames] = useState<any[]>([]);
  const [instantWinPrizes, setInstantWinPrizes] = useState<any[]>([]);
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchGames();
    fetchInstantWinPrizes();
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase.from("games").select("*");
    if (error) console.error("Error fetching games:", error);
    else setGames(data || []);
  };

  const fetchInstantWinPrizes = async () => {
    const { data, error } = await supabase
      .from("instant_win_prizes")
      .select("*");
    if (error) console.error("Error fetching instant win prizes:", error);
    else setInstantWinPrizes(data || []);
  };

  const handleGameStatusChange = async (gameId: string, newStatus: boolean) => {
    const { error } = await supabase
      .from("games")
      .update({ status: newStatus ? "active" : "pending" })
      .eq("id", gameId);

    if (error) console.error("Error updating game status:", error);
    else fetchGames();
  };

  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Games Overview Card */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Games Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.slice(0, 4).map((game) => (
              <GameCard key={game.id} game={game} onUpdate={fetchGames} />
            ))}
          </div>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsAddGameModalOpen(true)}
          >
            Add New Game
          </button>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
          {/* Add quick stats here */}
        </div>

        {/* Instant Win Prizes Table Card */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Instant Win Prizes</h2>
          <table className="w-full text-gray-700">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Prize Type</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Probability</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instantWinPrizes.map((prize) => (
                <tr key={prize.id} className="border-b">
                  <td className="p-2">{prize.prize_type}</td>
                  <td className="p-2">{prize.prize_amount}</td>
                  <td className="p-2">{prize.probability}</td>
                  <td className="p-2">{/* Add edit and delete buttons */}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => setIsAddPrizeModalOpen(true)}
          >
            Add New Prize
          </button>
        </div>
      </div>

      <AddInstantWinPrizeModal
        isOpen={isAddPrizeModalOpen}
        onClose={() => setIsAddPrizeModalOpen(false)}
        onAddPrize={fetchInstantWinPrizes}
      />

      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        onAddGame={fetchGames}
      />
    </div>
  );
}
