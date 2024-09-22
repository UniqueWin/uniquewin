"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserAnswers } from "@/utils/dataHelpers";

interface RealTimeAnswersProps {
  gameId: string;
  userId: string;
  setUserAnswers: (answers: any[]) => void;
}

const RealTimeAnswers: React.FC<RealTimeAnswersProps> = ({
  gameId,
  userId,
  setUserAnswers,
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
          } catch (error) {
            console.error("Error fetching answers:", error); // Log if fetching fails
          }
        }
      )
      .subscribe();

    return () => {
      answersChannel.unsubscribe(); // Clean up the subscription on unmount
    };
  }, [gameId, userId, setUserAnswers]); // Dependencies to re-run effect if any changes

  return null; // No UI rendering
};

export default RealTimeAnswers;
