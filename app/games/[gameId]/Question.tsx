"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Game,
  Answer,
  submitAnswer,
  checkForInstantWin,
  getGameInstantWinPrizes,
} from "@/utils/dataHelpers";
import { User } from "@/utils/userHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ExtendedUser } from "@/utils/userHelpers"; // Add this import

type QuestionProps = {
  game: Game;
  user: ExtendedUser;
  setUser: React.Dispatch<React.SetStateAction<ExtendedUser | null>>;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
  availableLuckyDips: string[];
  setAvailableLuckyDips: React.Dispatch<React.SetStateAction<string[]>>;
  setInstantWinPrizes: React.Dispatch<
    React.SetStateAction<{
      [key: number]: { type: "money" | "word"; value: string };
    }>
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
  setInstantWinPrizes,
  getPartiallyHiddenWord,
  updateNavbarCredits,
}: QuestionProps) {
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim() && !isLuckyDip) {
      toast("Please enter an answer or select Lucky Dip.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Check for instant win
      const instantWinPrizes = await getGameInstantWinPrizes(
        game.id.toString()
      );
      const instantWinPrize = checkForInstantWin(instantWinPrizes);

      const result = await submitAnswer(
        game.id.toString(),
        user.id.toString(), // Convert user.id to string
        isLuckyDip
          ? getPartiallyHiddenWord(
              availableLuckyDips[
                Math.floor(Math.random() * availableLuckyDips.length)
              ]
            )
          : answer,
        isLuckyDip,
        instantWinPrize
      );

      // Update local user state
      const { data: updatedUser, error } = await supabase
        .from("profiles")
        .select("credit_balance")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            credit_balance: updatedUser.credit_balance,
          };
        }
        return prevUser;
      });

      // Update game answers
      setGame((prevGame) => {
        if (prevGame) {
          return {
            ...prevGame,
            answers: [...(prevGame.answers || []), result],
          };
        }
        return prevGame;
      });

      // Update available lucky dips
      if (isLuckyDip) {
        setAvailableLuckyDips((prev) => prev.filter((_, index) => index !== 0));
      }

      updateNavbarCredits();

      setAnswer("");
      toast("Answer submitted successfully!");

      if (instantWinPrize) {
        toast(
          `Congratulations! You won an instant prize: £${instantWinPrize.prize.prize_amount}`
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Insufficient credits") {
        toast(
          "You don't have enough credits to play. Please buy more credits."
        );
      } else {
        toast("Failed to submit answer. Please try again.");
      }
      console.error("Error submitting answer:", error);
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
      <p className="mb-4 text-lg">
        Your Credits: £{user.credit_balance?.toFixed(2)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-grow bg-white text-black"
            disabled={isLuckyDip || isSubmitting}
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
