"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Game, Answer, submitAnswer } from "@/utils/dataHelpers";
import { User } from "@/utils/userHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

type QuestionProps = {
  game: Game;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

function Question({
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
  const supabase = createClient();

  const handleSubmitAnswer = async (answer: string, isLuckyDip: boolean) => {
    try {
      const result = await submitAnswer(
        game.id.toString(),
        user.id,
        answer,
        isLuckyDip
      );

      // Update local user state
      // Note: You'll need to fetch the updated user data from Supabase
      // after submitting the answer, as the User type from Supabase
      // doesn't include the credits field.
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
            user_metadata: {
              ...prevUser.user_metadata,
              credit_balance: updatedUser.credit_balance,
            },
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

      updateNavbarCredits();

      toast("Answer submitted successfully!");
    } catch (error) {
      if (error instanceof Error && error.message === "Insufficient credits") {
        toast("You don't have enough credits to play. Please buy more credits.");
      } else {
        toast("Failed to submit answer. Please try again.");
      }
      console.error("Error submitting answer:", error);
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

      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-grow bg-white text-black"
          disabled={isLuckyDip}
        />
        <Button
          onClick={() => handleSubmitAnswer(answer, isLuckyDip)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Answer!
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="lucky-dip"
          checked={isLuckyDip}
          onCheckedChange={setIsLuckyDip}
          disabled={availableLuckyDips.length === 0}
        />
        <Label htmlFor="lucky-dip">
          Lucky Dip ({availableLuckyDips.length} left)
        </Label>
      </div>

      <p className="text-sm text-muted-foreground">
        Cost: {isLuckyDip ? "£5" : "£1"} per play
      </p>
    </motion.div>
  );
}

export default Question;
