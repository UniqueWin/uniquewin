"use client";

import { useState, useEffect } from "react";
import { ExtendedUser, GameHistoryItem, Answer } from "@/utils/userHelpers";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function HistoryPage() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);

  useEffect(() => {
    const fetchUserAndHistory = async () => {
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
          account_balance: profileData.account_balance || 0,
        };

        setUser(extendedUser);
        // Fetch game history from the database
        const { data: gameHistory, error: historyError } = await supabase
          .from("game_history")
          .select(`
            id,
            game_id,
            user_id,
            played_at,
            result,
            answers (
              answer,
              status
            )
          `)
          .eq("user_id", user.id)
          .order("played_at", { ascending: false });

        if (historyError) {
          console.error("Error fetching game history:", historyError);
          return;
        }

        const formattedHistory: GameHistoryItem[] = gameHistory.map((item: any) => ({
          gameId: item.game_id,
          gameName: `Game ${item.game_id}`, // You might want to fetch the actual game name if available
          playedAt: item.played_at,
          result: item.result,
          answers: item.answers,
        }));

        setHistory(formattedHistory);
      }
    };

    fetchUserAndHistory();
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
                {game.answers.map((ans: Answer) => (
                  <div key={ans.answer}>
                    {ans.answer} - {ans.status}
                  </div>
                ))}
              </td>
              <td>{game.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
