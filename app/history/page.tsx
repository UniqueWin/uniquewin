"use client";

import { useState, useEffect } from "react";
import { ExtendedUser, GameHistoryItem, Answer } from "@/utils/userHelpers";
import { createClient } from "@/utils/supabase/client";

export default function HistoryPage() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        const extendedUser: ExtendedUser = {
          ...user,
          id: user.id,
          username: profileData.username || "",
          is_admin: profileData.is_admin || false,
          email: user.email || "",
          credit_balance: profileData.credit_balance || 0,
          gameHistory: profileData.game_history || [],
        };
        setUser(extendedUser);
        setHistory(extendedUser.gameHistory || []);
      }
    };

    fetchUser();
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
          {history?.map((game) => (
            <tr key={game.gameId}>
              <td>{game.gameId}</td>
              <td>
                {game.answers.map((ans: Answer) => (
                  <div key={ans.answer}>
                    {ans.answer} - {ans.status}
                  </div>
                ))}
              </td>
              <td>
                {game.answers.some((ans: Answer) => ans.status === "UNIQUE")
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
