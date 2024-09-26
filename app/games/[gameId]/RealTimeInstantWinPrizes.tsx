"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAnswerInstantWinPrizes } from "@/utils/dataHelpers";

interface RealTimeInstantWinPrizesProps {
  gameId: string;
  setInstantWinPrizes: (prizes: any[]) => void; // Function to update instant win prizes
}

const RealTimeInstantWinPrizes: React.FC<RealTimeInstantWinPrizesProps> = ({
  gameId,
  setInstantWinPrizes,
}) => {
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialPrizes = await getAnswerInstantWinPrizes(gameId);
      setInstantWinPrizes(initialPrizes); // Set initial state with fetched data
    };

    fetchInitialData(); // Fetch initial data on mount

    const subscription = supabase
      .channel("custom-instant-win-channel") // Ensure this channel is set up in Supabase
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "answer_instant_wins" },
        async (payload) => {
          try {
            const { data, error } = await supabase
              .from("answer_instant_wins")
              .select("*")
              .eq("game_id", gameId);

            if (error) {
              console.error("Error fetching instant win prizes:", error);
              return;
            }

            setInstantWinPrizes(data || []); // Update state with fetched data
          } catch (err) {
            console.error("Error in fetching instant win prizes:", err);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "answer_instant_wins" },
        async (payload) => {
          try {
            const { data, error } = await supabase
              .from("answer_instant_wins")
              .select("*")
              .eq("game_id", gameId);

            if (error) {
              console.error("Error fetching instant win prizes:", error);
              return;
            }

            setInstantWinPrizes(data || []); // Update state with fetched data
          } catch (err) {
            console.error("Error in fetching instant win prizes:", err);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe(); // Clean up the subscription on unmount
    };
  }, [gameId, setInstantWinPrizes]);

  return null; // No UI rendering
};

export default RealTimeInstantWinPrizes;
