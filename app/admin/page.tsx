"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { GameCard } from "@/components/GameCard";
import { AddInstantWinPrizeModal } from "@/components/AddInstantWinPrizeModal";
import { AddGameModal } from "@/components/AddGameModal";
import { EditGameModal } from "@/components/EditGameModal";
import { LoginModal } from "@/components/LoginModal";
import { QuickStatsBox, QuickStatsProps } from "@/components/QuickStatsBox";
import { useRouter } from "next/navigation";
import { Play, Pause, Square, Edit } from "lucide-react";
import GameOverviewCard from "@/components/GameOverviewCard";
import {
  fetchGames,
  fetchInstantWinPrizes,
  fetchQuickStats,
  fetchAllPlayers,
  fetchAllGames,
  handleGameStatusChange,
  handleLogout
} from "@/utils/adminFunctions";

export default function AdminPage() {
  const [games, setGames] = useState<any[]>([]);
  const [instantWinPrizes, setInstantWinPrizes] = useState<any[]>([]);
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isEditGameModalOpen, setIsEditGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [quickStats, setQuickStats] = useState<QuickStatsProps['quickStats']>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [recentPlayerActivities, setRecentPlayerActivities] = useState<any[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchUserAndData();
  }, []);

  const fetchUserAndData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const gamesData = await fetchGames();
      setGames(gamesData);
      const prizesData = await fetchInstantWinPrizes();
      setInstantWinPrizes(prizesData);
      const statsData = await fetchQuickStats();
      if (statsData) {
        setQuickStats(statsData.quickStats);
        setRecentPlayerActivities(statsData.recentPlayerActivities);
      }
      const playersData = await fetchAllPlayers();
      setAllPlayers(playersData);
      const allGamesData = await fetchAllGames();
      setAllGames(allGamesData);
    }
  };

  const handleEditGame = (game: any) => {
    setSelectedGame(game);
    setIsEditGameModalOpen(true);
  };

  const handleLogin = async () => {
    await fetchUserAndData();
    router.refresh();
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    setUser(null);
    router.refresh();
  };

  if (!user) {
    return (
      <div className="p-6 bg-gray-100 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="text-center">
          <p className="mb-4">Please log in to access the admin dashboard.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Log In
          </button>
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
          isSignUp={false}
        />
      </div>
    );
  }

  const activeGames = games.filter(game => game.status === 'active');
  const historicGames = games.filter(game => game.status !== 'active');

  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogoutClick}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Games Overview Column */}
        <div className="space-y-6">
          {/* Active Games Overview Card */}
          <GameOverviewCard
            title="Active Games"
            games={activeGames}
            onUpdate={fetchGames}
            onEdit={handleEditGame}
            onStatusChange={handleGameStatusChange}
            userId={user.id}
            icons={{
              play: <Play size={18} />,
              pause: <Pause size={18} />,
              stop: <Square size={18} />,
              edit: <Edit size={18} />,
            }}
            setIsAddGameModalOpen={setIsAddGameModalOpen}
          />

          {/* Historic Games Overview Card */}
          <GameOverviewCard
            title="Historic Games"
            games={historicGames}
            onUpdate={fetchGames}
            onEdit={handleEditGame}
            onStatusChange={handleGameStatusChange}
            userId={user.id}
            icons={{
              play: <Play size={18} />,
              pause: <Pause size={18} />,
              stop: <Square size={18} />,
              edit: <Edit size={18} />,
            }}
            setIsAddGameModalOpen={setIsAddGameModalOpen}
          />
        </div>

        {/* Quick Stats Column */}
        <div>
          <QuickStatsBox
            quickStats={quickStats}
            recentPlayerActivities={recentPlayerActivities}
          />
        </div>
      </div>

      {/* Instant Win Prizes Table Card */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Instant Win Prizes
        </h2>
        <table className="w-full text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Prize Type</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instantWinPrizes.map((prize) => (
              <tr key={prize.id} className="border-b">
                <td className="p-2">{prize.prize_type}</td>
                <td className="p-2">{prize.prize_amount}</td>
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

      {/* Players List Card */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Recent Players
        </h2>
        <table className="w-full text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Account Cash</th>
              <th className="p-2 text-left">Account Credits</th>
              <th className="p-2 text-left">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {allPlayers.map((player) => (
              <tr key={player.id} className="border-b">
                <td className="p-2">{player.username}</td>
                <td className="p-2">{player.email}</td>
                <td className="p-2">£{player.account_balance.toFixed(2)}</td>
                <td className="p-2">£{player.credit_balance.toFixed(2)}</td>
                <td className="p-2">
                  {new Date(player.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Games List Card */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Recent Games
        </h2>
        <table className="w-full text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Question</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Current Prize</th>
              <th className="p-2 text-left">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {allGames.map((game) => (
              <tr key={game.id} className="border-b">
                <td className="p-2">{game.question}</td>
                <td className="p-2">{game.status}</td>
                <td className="p-2">£{game.current_prize.toFixed(2)}</td>
                <td className="p-2">
                  {new Date(game.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        allInstantWinPrizes={instantWinPrizes}
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
