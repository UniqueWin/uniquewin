"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, User } from "@/utils/userHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllGames } from "@/utils/dataHelpers";
import { Game } from "@/utils/dataHelpers";

export default function ProfilePage() {
  const { user, addCredits, updateUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [gameHistory, setGameHistory] = useState<Game[]>([]);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
      const allGames = getAllGames();
      setGameHistory(allGames.slice(0, 5));
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  const handleSave = () => {
    if (editedUser) {
      updateUser(editedUser);
      setEditMode(false);
    }
  };

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-purple-800">My Profile</h1>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md mb-8">
          {editMode && editedUser ? (
            <>
              <Input
                className="mb-4"
                value={editedUser.username}
                onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                placeholder="Username"
              />
              <Input
                className="mb-4"
                value={editedUser.email}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                placeholder="Email"
              />
              <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 mr-2">
                Save
              </Button>
              <Button onClick={() => setEditMode(false)} className="bg-red-500 hover:bg-red-600">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">{user.username}</h2>
              <p className="mb-2">Email: {user.email}</p>
              <p className="mb-4">Credits: £{user.credit_balance}</p>
              <Button 
                onClick={() => setEditMode(true)}
                className="bg-blue-500 hover:bg-blue-600 mr-2"
              >
                Edit Profile
              </Button>
              <Button 
                onClick={() => addCredits(10)} 
                className="bg-orange-500 hover:bg-orange-600"
              >
                Add £10 Credits
              </Button>
            </>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4 text-purple-800">Game History</h2>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Game ID</th>
                <th className="text-left">Question</th>
                <th className="text-left">Entries</th>
                <th className="text-left">Win/Lose</th>
                <th className="text-left">Instant Win</th>
                <th className="text-left">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map((game) => (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>{game.question}</td>
                  <td>{game.answers.length}</td>
                  <td>{game.answers.some(a => a.status === "UNIQUE") ? "WIN" : "LOSE"}</td>
                  <td>{game.answers.some(a => a.instantWin !== "NO") ? "YES" : "NO"}</td>
                  <td>£{calculateProfitLoss(game)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function calculateProfitLoss(game: Game) {
  // This is a placeholder function. You'd need to implement the actual logic based on your game rules.
  const winningAnswer = game.answers.find(a => a.status === "UNIQUE");
  const instantWin = game.answers.find(a => a.instantWin !== "NO");
  let profit = 0;
  if (winningAnswer) profit += game.jackpot;
  if (instantWin) profit += parseInt(instantWin.instantWin.replace('£', ''));
  profit -= game.answers.length; // Assuming each entry costs £1
  return profit;
}