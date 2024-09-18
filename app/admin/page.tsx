"use client";

import { AddGameModal } from "@/components/AddGameModal";
import { AddInstantWinPrizeModal } from "@/components/AddInstantWinPrizeModal";
import { EditGameModal } from "@/components/EditGameModal";
import GameOverviewCard from "@/components/GameOverviewCard";
import { LoginModal } from "@/components/LoginModal";
import { QuickStatsBox, QuickStatsProps } from "@/components/QuickStatsBox";
import { RecentPlayerActivities } from "@/components/RecentPlayerActivities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchAllGames,
  fetchAllPlayers,
  fetchGames,
  fetchInstantWinPrizes,
  fetchQuickStats,
  handleLogout,
  handleGameStatusChange as updateGameStatusInDB,
} from "@/utils/adminFunctions";
import { createClient } from "@/utils/supabase/client";
import { Edit, Pause, Play, Square, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const [games, setGames] = useState<any[]>([]);
  const [instantWinPrizes, setInstantWinPrizes] = useState<any[]>([]);
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isEditGameModalOpen, setIsEditGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [quickStats, setQuickStats] =
    useState<QuickStatsProps["quickStats"]>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [recentPlayerActivities, setRecentPlayerActivities] = useState<any[]>(
    []
  );
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

  const handleDeleteGame = async (gameId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this game? This action cannot be undone."
    );
    if (confirmDelete) {
      const { error } = await supabase.from("games").delete().eq("id", gameId);

      if (error) {
        console.error("Error deleting game:", error);
      } else {
        // Update the games state directly after successful deletion
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
        // Optionally, you can still call fetchGames to ensure consistency with the database
        fetchGames().then((updatedGames) => setGames(updatedGames));
      }
    }
  };

  const handleAddGame = async () => {
    // Fetch the updated games list after a new game is added
    const updatedGames = await fetchGames();
    setGames(updatedGames);
    setIsAddGameModalOpen(false);
  };

  const handleGameStatusChange = async (gameId: string, newStatus: string) => {
    try {
      // Call the function from adminFunctions to update the game status in the database
      await updateGameStatusInDB(gameId, newStatus);

      // Update the local state without fetching all games again
      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId ? { ...game, status: newStatus } : game
        )
      );
    } catch (error) {
      console.error("Error changing game status:", error);
    }
  };

  const handleCloseExpiredGames = async () => {
    try {
      const closeResponse = await fetch("/api/close-expired-games", {
        method: "POST",
      });
      const closeData = await closeResponse.json();

      const processResponse = await fetch("/api/process-ended-games", {
        method: "GET",
      });
      const processData = await processResponse.json();

      console.log(`${closeData.message}\n${processData.message}`);

      const updatedGames = await fetchGames();
      setGames(updatedGames);
    } catch (error) {
      console.error("Error closing and processing expired games:", error);
      alert("Failed to close and process expired games. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-gray-100 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-[32rem] w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const activeGames = games.filter((game) => game.status === "active");
  const historicGames = games.filter((game) => game.status !== "active");

  return (
    <div className="p-6 bg-gray-100 text-gray-900 min-w-[90vw]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link href="/admin/users">
            <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/answer-validation">
            <Button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Validate Answers
            </Button>
          </Link>
          <Button
            onClick={handleCloseExpiredGames}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Close Expired Games
          </Button>
          <button
            onClick={handleLogoutClick}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Games Overview Column */}
        <div>
          {/* Active Games Overview Card */}
          <GameOverviewCard
            games={activeGames}
            onEdit={handleEditGame}
            onDelete={handleDeleteGame}
            onStatusChange={handleGameStatusChange}
            userId={user.id}
            title="Active Games"
            onUpdate={fetchGames}
            setIsAddGameModalOpen={setIsAddGameModalOpen}
            icons={{
              play: <Play size={18} />,
              pause: <Pause size={18} />,
              stop: <Square size={18} />,
              edit: <Edit size={18} />,
              delete: <Trash2 size={18} />,
            }}
          />

          {/* Historic Games Overview Card */}
          <GameOverviewCard
            games={historicGames}
            onEdit={handleEditGame}
            onDelete={handleDeleteGame}
            onStatusChange={handleGameStatusChange}
            userId={user.id}
            title="Historic Games"
            onUpdate={fetchGames}
            setIsAddGameModalOpen={setIsAddGameModalOpen}
            icons={{
              play: <Play size={18} />,
              pause: <Pause size={18} />,
              stop: <Square size={18} />,
              edit: <Edit size={18} />,
              delete: <Trash2 size={18} />,
            }}
          />
        </div>

        {/* Quick Stats and Recent Activities Column */}
        <div>
          <QuickStatsBox
            quickStats={quickStats}
            prizesByGame={quickStats?.prizesByGame || null}
          />
          <RecentPlayerActivities
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
              <th className="p-2 text-left">Start Time</th>
              <th className="p-2 text-left">End Time</th>
              <th className="p-2 text-left">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {allGames.map((game) => (
              <tr key={game.id} className="border-b">
                <td className="p-2">{game.question}</td>
                <td className="p-2">{game.status}</td>
                <td className="p-2">£{game.current_prize.toFixed(2)}</td>
                <td className="p-2">{game.start_time}</td>
                <td className="p-2">{game.end_time}</td>
                <td className="p-2">{game.created_at}</td>
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
        onAddGame={handleAddGame}
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
