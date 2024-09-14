"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Game,
  Answer,
  submitAnswer,
  checkForInstantWin,
  getGameInstantWinPrizes,
  GameInstantWinPrize,
} from "@/utils/dataHelpers";
import { User } from "@/utils/userHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ExtendedUser } from "@/utils/userHelpers"; // Add this import
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type QuestionProps = {
  game: Game;
  user: ExtendedUser;
  setUser: React.Dispatch<React.SetStateAction<ExtendedUser | null>>;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
  availableLuckyDips: string[];
  setAvailableLuckyDips: React.Dispatch<React.SetStateAction<string[]>>;
  instantWinPrizes: GameInstantWinPrize[];
  setInstantWinPrizes: React.Dispatch<
    React.SetStateAction<GameInstantWinPrize[]>
  >;
  getPartiallyHiddenWord: (word: string) => string;
  updateNavbarCredits: () => void;
};

export default function Question({
  game,
  user,
  setUser,
  setGame,
  availableLuckyDips,
  setAvailableLuckyDips,
  instantWinPrizes,
  setInstantWinPrizes,
  getPartiallyHiddenWord,
  updateNavbarCredits,
}: QuestionProps) {
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const isLuckyDipAnswer =
        isLuckyDip && availableLuckyDips.includes(answer);
      const instantWin = checkForInstantWin(instantWinPrizes);

      const { data, error } = await supabase
        .from("answers")
        .insert({
          game_id: game.id,
          user_id: user.id,
          answer_text: answer,
          is_lucky_dip: isLuckyDipAnswer,
          is_instant_win: !!instantWin,
          instant_win_amount: instantWin?.prize.prize_amount || 0,
        })
        .select();

      if (error) throw error;

      if (isLuckyDipAnswer) {
        setAvailableLuckyDips((prev) => prev.filter((a) => a !== answer));
      }

      if (instantWin) {
        setInstantWinPrizes((prev) =>
          prev.map((p) =>
            p.id === instantWin.id ? { ...p, quantity: p.quantity - 1 } : p
          )
        );
        toast.success(
          `Congratulations! You won £${instantWin.prize.prize_amount?.toFixed(
            2
          )}!`
        );
        updateNavbarCredits();
      }

      setAnswer("");
      setIsLuckyDip(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-3xl font-bold mb-4 text-primary">{game.question}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-grow bg-white text-black"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Answer!"}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="lucky-dip"
            checked={isLuckyDip}
            onCheckedChange={setIsLuckyDip}
            disabled={availableLuckyDips.length === 0 || isSubmitting}
          />
          <Label htmlFor="lucky-dip">
            Lucky Dip ({availableLuckyDips.length} left)
          </Label>
        </div>

        <p className="text-sm text-muted-foreground">
          Cost: {isLuckyDip ? "£5" : "£1"} per play
        </p>
      </form>
    </motion.div>
  );
}

// Helper function to check for instant win
// function checkForInstantWin(
//   prizes: GameInstantWinPrize[]
// ): GameInstantWinPrize | null {
//   const availablePrizes = prizes.filter((p) => p.quantity > 0);
//   if (availablePrizes.length === 0) return null;

//   // Simple random selection for demonstration
//   // In a real scenario, you might want to use weighted probabilities
//   return Math.random() < 0.1
//     ? availablePrizes[Math.floor(Math.random() * availablePrizes.length)]
//     : null;
// }
