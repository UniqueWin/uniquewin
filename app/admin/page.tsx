"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { GameCard } from "@/components/GameCard";
import { AddInstantWinPrizeModal } from "@/components/AddInstantWinPrizeModal";
import { AddGameModal } from "@/components/AddGameModal";
import { EditGameModal } from "@/components/EditGameModal";
import { LoginModal } from "@/components/LoginModal";

export default function AdminPage() {
  const [games, setGames] = useState<any[]>([]);
  const [instantWinPrizes, setInstantWinPrizes] = useState<any[]>([]);
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isEditGameModalOpen, setIsEditGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [quickStats, setQuickStats] = useState({
    activeGames: 0,
    totalPlayers: 0,
    totalPrizeAwarded: 0,
    gamesLast24Hours: 0,
    instantWinsToday: 0,
    totalLuckyDips: 0,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchGames();
    fetchInstantWinPrizes();
    fetchQuickStats();
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    } else {
      setUserId(null);
    }
  };

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from("games")
      .select(`
        *,
        game_instant_win_prizes (
          instant_win_prize_id,
          quantity,
          custom_probability,
          instant_win_prizes (
            prize_type,
            prize_amount
          )
        )
      `);
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

  const fetchQuickStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const { data: activeGames } = await supabase
      .from('games')
      .select('count', { count: 'exact' })
      .eq('status', 'active');

    const { data: totalPlayers } = await supabase
      .from('profiles')
      .select('count', { count: 'exact' });

    const { data: totalPrizeAwarded } = await supabase
      .from('game_history')
      .select('sum(prize_amount)')
      .single();

    const { data: gamesLast24Hours } = await supabase
      .from('game_history')
      .select('count', { count: 'exact' })
      .gte('created_at', yesterday);

    const { data: instantWinsToday } = await supabase
      .from('answers')
      .select('count', { count: 'exact' })
      .eq('is_instant_win', true)
      .gte('submitted_at', today);

    const { data: totalLuckyDips } = await supabase
      .from('answers')
      .select('count', { count: 'exact' })
      .eq('is_lucky_dip', true);

    setQuickStats({
      activeGames: activeGames?.[0]?.count || 0,
      totalPlayers: totalPlayers?.[0]?.count || 0,
      totalPrizeAwarded: totalPrizeAwarded?.sum || 0,
      gamesLast24Hours: gamesLast24Hours?.[0]?.count || 0,
      instantWinsToday: instantWinsToday?.[0]?.count || 0,
      totalLuckyDips: totalLuckyDips?.[0]?.count || 0,
    });
  };

  const handleEditGame = (game: any) => {
    setSelectedGame(game);
    setIsEditGameModalOpen(true);
  };

  const handleGameStatusChange = async (gameId: string, newStatus: string) => {
    const { error } = await supabase
      .from("games")
      .update({ status: newStatus })
      .eq("id", gameId);

    if (error) console.error("Error updating game status:", error);
    else fetchGames();
  };

  const handleLogin = async () => {
    await fetchUserId();
    fetchGames();
    fetchInstantWinPrizes();
    fetchQuickStats();
  };

  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {userId ? (
        // ... existing JSX for logged-in state ...
      ) : (
        <div className="text-center">
          <p className="mb-4">Please log in to access the admin dashboard.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Log In
          </button>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

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

      <EditGameModal
        isOpen={isEditGameModalOpen}
        onClose={() => setIsEditGameModalOpen(false)}
        onEditGame={fetchGames}
        game={selectedGame}
        allInstantWinPrizes={instantWinPrizes}
      />
    </div>
  );
}
