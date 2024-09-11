"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { GameCard } from "@/components/GameCard";
import { AddInstantWinPrizeModal } from "@/components/AddInstantWinPrizeModal";
import { AddGameModal } from "@/components/AddGameModal";
import { EditGameModal } from "@/components/EditGameModal";
import { LoginModal } from "@/components/LoginModal";
import { QuickStatsBox } from "@/components/QuickStatsBox";
import { useRouter } from "next/navigation";
import { Play, Pause, Square, Edit } from "lucide-react";
import GameOverviewCard from "@/components/GameOverviewCard";

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
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<string[]>([]);
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
      fetchGames();
      fetchInstantWinPrizes();
      fetchQuickStats();
      fetchAllPlayers();
      fetchAllGames();
    }
  };

  const fetchGames = async () => {
    const { data, error } = await supabase.from("games").select(`
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
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    const { data: activeGames } = await supabase
      .from("games")
      .select("count", { count: "exact" })
      .eq("status", "active");

    const { data: totalPlayers } = await supabase
      .from("profiles")
      .select("count", { count: "exact" });

    const { data: winnersPrizes } = await supabase
      .from("winners")
      .select("prize_amount");

    const totalPrizeAwarded =
      winnersPrizes?.reduce(
        (sum, winner) => sum + (winner.prize_amount || 0),
        0
      ) || 0;

    const { data: gamesLast24Hours } = await supabase
      .from("answers")
      .select("count", { count: "exact" })
      .gte("submitted_at", yesterday);

    const { data: instantWinsToday } = await supabase
      .from("answers")
      .select("count", { count: "exact" })
      .eq("is_instant_win", true)
      .gte("submitted_at", today);

    const { data: totalLuckyDips } = await supabase
      .from("answers")
      .select("count", { count: "exact" })
      .eq("is_lucky_dip", true);

    // Fetch recent answers
    const { data: recentAnswers, error: answersError } = await supabase
      .from("answers")
      .select(
        `
        id,
        submitted_at,
        answer_text,
        user_id,
        game_id
      `
      )
      .order("submitted_at", { ascending: false })
      .limit(5);

    if (answersError) {
      console.error("Error fetching recent answers:", answersError);
      return;
    }

    // Fetch usernames for the recent answers
    const userIds = recentAnswers.map((answer) => answer.user_id);
    const { data: userProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      return;
    }

    // Fetch game questions for the recent answers
    const gameIds = recentAnswers.map((answer) => answer.game_id);
    const { data: games, error: gamesError } = await supabase
      .from("games")
      .select("id, question")
      .in("id", gameIds);

    if (gamesError) {
      console.error("Error fetching games:", gamesError);
      return;
    }

    // Combine the data
    const recentPlayerActivitiesData = recentAnswers.map((answer) => ({
      ...answer,
      username:
        userProfiles.find((profile) => profile.id === answer.user_id)
          ?.username || "Unknown User",
      gameQuestion:
        games.find((game) => game.id === answer.game_id)?.question ||
        "Unknown Game",
    }));

    setQuickStats({
      activeGames: activeGames?.[0]?.count || 0,
      totalPlayers: totalPlayers?.[0]?.count || 0,
      totalPrizeAwarded: totalPrizeAwarded,
      gamesLast24Hours: gamesLast24Hours?.[0]?.count || 0,
      instantWinsToday: instantWinsToday?.[0]?.count || 0,
      totalLuckyDips: totalLuckyDips?.[0]?.count || 0,
    });

    setRecentPlayerActivities(recentPlayerActivitiesData);
  };

  const fetchAllPlayers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) console.error("Error fetching players:", error);
    else setAllPlayers(data || []);
  };

  const fetchAllGames = async () => {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) console.error("Error fetching games:", error);
    else setAllGames(data || []);
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
    await fetchUserAndData();
    router.refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const handleAddGameModalOpen = () => setIsAddGameModalOpen(true);
  const handleEditGameModalOpen = (game: any) => {
    setSelectedGame(game);
    setIsEditGameModalOpen(true);
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
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Games Overview Card */}
        <GameOverviewCard
          games={games}
          onUpdate={fetchGames}
          onEdit={handleEditGameModalOpen}
          onStatusChange={handleGameStatusChange}
          userId={user.id}
          icons={{
            play: <Play size={18} />,
            pause: <Pause size={18} />,
            stop: <Square size={18} />,
            edit: <Edit size={18} />,
          }}
          setIsAddGameModalOpen={handleAddGameModalOpen}
        />

        {/* Quick Stats Card */}
        <QuickStatsBox
          quickStats={quickStats}
          recentPlayerActivities={recentPlayerActivities}
        />

        {/* Instant Win Prizes Table Card */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Instant Win Prizes
          </h2>
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

        {/* Players List Card */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recent Players
          </h2>
          <table className="w-full text-gray-700">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Account Balance</th>
                <th className="p-2 text-left">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {allPlayers.map((player) => (
                <tr key={player.id} className="border-b">
                  <td className="p-2">{player.username}</td>
                  <td className="p-2">{player.email}</td>
                  <td className="p-2">£{player.account_balance.toFixed(2)}</td>
                  <td className="p-2">
                    {new Date(player.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Games List Card */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow mt-6">
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
      </div>
    </div>
  );
}
