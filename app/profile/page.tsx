"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, ExtendedUser } from "@/utils/userHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { Trophy, Award, Zap, Target, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  achievements,
  getAchievementProgress,
  Achievement,
  AchievementLevel,
} from "@/utils/achievements";

interface GameHistoryItem {
  id: string;
  game: {
    question: string;
  };
  answer_text: string;
  status: string;
  is_instant_win: boolean;
  instant_win_amount: number;
}

interface UserStats {
  totalGames: number;
  winRate: number;
  biggestWin: number;
  totalInstantWins: number;
}

export default function ProfilePage() {
  const { user, addCredits, updateUser, refreshUser, getUserWinnings } =
    useUser();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<ExtendedUser | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [stats, setStats] = useState<UserStats>({
    totalGames: 0,
    winRate: 0,
    biggestWin: 0,
    totalInstantWins: 0,
  });
  const [userAchievements, setUserAchievements] = useState<{
    [key: string]: number;
  }>({});
  const [referralCode, setReferralCode] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchUserDataAndHistory = async () => {
      if (user) {
        setEditedUser(user);
        const winnings = await getUserWinnings(user.id);
        setTotalWinnings(winnings);
        await fetchGameHistory(user.id);
        await fetchUserStats(user.id);
        await fetchAchievements(user.id);
        await fetchReferralCode(user.id);
      }
    };

    fetchUserDataAndHistory();
  }, [user]);

  const fetchGameHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from("answers")
      .select(
        `
        id,
        answer_text,
        status,
        is_instant_win,
        instant_win_amount,
        game:games (question)
      `
      )
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching game history:", error);
    } else {
      const safeGameHistory: GameHistoryItem[] = (data || []).map(
        (item: any) => ({
          id: item.id || "",
          game: {
            question: item.game?.question || "Unknown question",
          },
          answer_text: item.answer_text || "",
          status: item.status || "",
          is_instant_win: item.is_instant_win || false,
          instant_win_amount: item.instant_win_amount || 0,
        })
      );
      setGameHistory(safeGameHistory);
    }
  };

  const fetchUserStats = async (userId: string) => {
    const { data, error } = await supabase
      .from("answers")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user stats:", error);
    } else {
      const totalGames = data.length;
      const wins = data.filter((answer) => answer.status === "UNIQUE").length;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      const biggestWin = Math.max(
        ...data.map((answer) => answer.instant_win_amount || 0)
      );
      const totalInstantWins = data.filter(
        (answer) => answer.is_instant_win
      ).length;

      setStats({
        totalGames,
        winRate: Number(winRate.toFixed(2)),
        biggestWin,
        totalInstantWins,
      });
    }
  };

  const fetchAchievements = async (userId: string) => {
    // This is still a placeholder. In a real implementation, you'd fetch the user's
    // achievement progress from your database.
    const mockUserAchievements = {
      games_played: 15,
      unique_answers: 7,
      credits_spent: 25, // Set to 0 to make it unachieved
      winning_streak: 3,
      jackpot_winner: 0, // Set to 0 to make it unachieved
    };

    setUserAchievements(mockUserAchievements);
  };

  const fetchReferralCode = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching referral code:", error);
    } else {
      setReferralCode(data.referral_code || "No referral code available");
    }
  };

  if (!user) return <div>Loading...</div>;

  const handleSave = async () => {
    if (editedUser) {
      await updateUser(editedUser);
      setEditMode(false);
      refreshUser();
    }
  };

  const handleAddCredits = async () => {
    await addCredits(10);
    refreshUser();
  };

  return (
    <div className="bg-black bg-opacity-10 rounded-xl my-2 min-h-screen flex flex-col w-2/3 text-black">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-white">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode && editedUser ? (
                <>
                  <Input
                    className="mb-4"
                    value={editedUser.username}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, username: e.target.value })
                    }
                    placeholder="Username"
                  />
                  <Input
                    className="mb-4"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                  <Input
                    className="mb-4"
                    value={editedUser.full_name || ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        full_name: e.target.value,
                      })
                    }
                    placeholder="Full Name"
                  />
                  <Input
                    className="mb-4"
                    type="date"
                    value={editedUser.date_of_birth || ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        date_of_birth: e.target.value,
                      })
                    }
                    placeholder="Date of Birth"
                  />
                  <Input
                    className="mb-4"
                    value={editedUser.address || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, address: e.target.value })
                    }
                    placeholder="Address"
                  />
                  <Button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 mr-2"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditMode(false)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-2">
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="mb-2">
                    <strong>Full Name:</strong> {user.full_name || "Not set"}
                  </p>
                  <p className="mb-2">
                    <strong>Date of Birth:</strong>{" "}
                    {user.date_of_birth || "Not set"}
                  </p>
                  <p className="mb-2">
                    <strong>Address:</strong> {user.address || "Not set"}
                  </p>
                  <Button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 hover:bg-blue-600 mt-4"
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <strong>Credits:</strong> £{user.credit_balance}
              </p>
              <p className="mb-2">
                <strong>Account Balance:</strong> £{user.account_balance}
              </p>
              <p className="mb-4">
                <strong>Total Winnings:</strong> £{totalWinnings.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Trophy />}
            title="Total Games"
            value={stats.totalGames}
          />
          <StatCard
            icon={<Trophy />}
            title="Win Rate"
            value={`${stats.winRate}%`}
          />
          <StatCard
            icon={<Trophy />}
            title="Biggest Win"
            value={`£${stats.biggestWin}`}
          />
          <StatCard
            icon={<Trophy />}
            title="Instant Wins"
            value={stats.totalInstantWins}
          />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {achievements.map((achievement) => {
            const progress = getAchievementProgress(
              achievement.id,
              userAchievements[achievement.id] || 0
            );
            return (
              <TooltipProvider key={achievement.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={`cursor-pointer ${
                        progress && progress.level > 0
                          ? "bg-white"
                          : "bg-white opacity-50"
                      }`}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        {achievement.icon}
                        <p className="text-sm font-semibold mt-2">
                          {achievement.name}
                        </p>
                        {progress && (
                          <>
                            <p className="text-xs text-gray-500">
                              Level {progress.level}
                            </p>
                            <span className="text-center text-xs font-semibold text-yellow-400">
                              {achievement.levels[progress.level - 1].name}
                            </span>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      <strong>{achievement.name}</strong>
                    </p>
                    <p>{achievement.description}</p>
                    {progress ? (
                      <>
                        <p>Current Level: {progress.level}</p>
                        <p>{progress.description}</p>
                        {progress.level < achievement.levels.length && (
                          <p>
                            Next Level:{" "}
                            {achievement.levels[progress.level].description}
                          </p>
                        )}
                      </>
                    ) : (
                      <p>Not yet started</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Referral Program</h2>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{referralCode}</p>
            <Button
              className="mt-4"
              onClick={() => navigator.clipboard.writeText(referralCode)}
            >
              Copy Code
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4 text-white">Game History</h2>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Question</th>
                <th className="text-left">Your Answer</th>
                <th className="text-left">Status</th>
                <th className="text-left">Instant Win</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map((game) => (
                <tr key={game.id}>
                  <td>{game.game.question}</td>
                  <td>{game.answer_text}</td>
                  <td>{game.status}</td>
                  <td>
                    {game.is_instant_win ? `£${game.instant_win_amount}` : "NO"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center p-4">
        {icon}
        <div className="ml-4">
          <p className="text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
