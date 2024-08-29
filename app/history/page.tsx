"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/utils/dataHelpers";
import { User } from "@/utils/userHelpers";

// Define an extended User type that includes gameHistory
interface ExtendedUser extends User {
  gameHistory: {
    gameId: number;
    answers: { answer: string; status: string; instantWin: string }[];
  }[];
}

export default function HistoryPage() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [history, setHistory] = useState<ExtendedUser['gameHistory']>([]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const currentUser = getCurrentUser(parseInt(userId));
      if (currentUser) {
        setUser(currentUser as ExtendedUser);
        setHistory(currentUser.gameHistory || []); // Set the user's game history
      }
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Game History for {user.username}
      </h1>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Game ID</th>
            <th className="text-left">Your Answers</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((game) => (
            <tr key={game.gameId}>
              <td>{game.gameId}</td>
              <td>
                {game.answers.map((ans) => (
                  <div key={ans.answer}>
                    {ans.answer} - {ans.status}
                  </div>
                ))}
              </td>
              <td>
                {game.answers.some((ans) => ans.status === "UNIQUE")
                  ? "Winning"
                  : "Not Winning"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
