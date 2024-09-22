"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserAnswers, getGameById } from "@/utils/dataHelpers";

interface RealTimeAnswersProps {
  gameId: string;
  userId: string;
  setUserAnswers: (answers: any[]) => void;
  setGameAnswers: (answers: any[]) => void; // New prop to set game answers
}

const RealTimeAnswers: React.FC<RealTimeAnswersProps> = ({
  gameId,
  userId,
  setUserAnswers,
  setGameAnswers, // New prop
}) => {
  const supabase = createClient();

  useEffect(() => {
    const answersChannel = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "answers" },
        async (payload) => {
          try {
            const answers = await getUserAnswers(userId, gameId);
            setUserAnswers(answers);

            // Fetch the latest game answers
            const { data: allAnswers, error } = await supabase
              .from("answers")
              .select("*")
              .eq("game_id", gameId);

            if (error) {
              console.error("Error fetching game answers:", error);
            } else {
              setGameAnswers(allAnswers); // Update game answers
            }
          } catch (error) {
            console.error("Error fetching answers:", error); // Log if fetching fails
          }
        }
      )
      .subscribe();

    return () => {
      answersChannel.unsubscribe(); // Clean up the subscription on unmount
    };
  }, [gameId, userId, setUserAnswers, setGameAnswers]); // Add setGameAnswers to dependencies

  return null; // No UI rendering
};

export default RealTimeAnswers;
