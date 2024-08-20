"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/dataHelpers";

const HistoryPage = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const currentUser = getCurrentUser(parseInt(userId));
      if (currentUser) {
        setUser(currentUser);
        setHistory(currentUser.gameHistory); // Set the user's game history
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
};

export default HistoryPage;
