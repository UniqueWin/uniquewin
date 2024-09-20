"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, ExtendedUser } from "@/utils/userHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

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

export default function ProfilePage() {
  const { user, addCredits, updateUser, refreshUser, getUserWinnings } =
    useUser();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<ExtendedUser | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserDataAndHistory = async () => {
      if (user) {
        setEditedUser(user);
        const winnings = await getUserWinnings(user.id);
        setTotalWinnings(winnings);
        await fetchGameHistory(user.id);
      }
    };

    fetchUserDataAndHistory();
  }, [user, getUserWinnings]);

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
      setGameHistory(data || []);
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
        <h1 className="text-4xl font-bold mb-8 text-purple-800">My Profile</h1>

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

        <h2 className="text-2xl font-bold mb-4 text-purple-800">
          Game History
        </h2>
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
