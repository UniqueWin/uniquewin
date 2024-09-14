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
import { ExtendedUser } from "@/utils/userHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
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
  onAnswerSubmitted: () => void;
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
  onAnswerSubmitted,
}: QuestionProps) {
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!answer && !isLuckyDip) || isSubmitting) return;

    setIsSubmitting(true);

    try {
      let submittedAnswer = answer;
      if (isLuckyDip) {
        if (availableLuckyDips.length === 0) {
          // If no lucky dips are available, use a random answer from the game's valid answers
          const validAnswers = game.validAnswers || [];
          if (validAnswers.length === 0) {
            toast.error("No valid answers available for lucky dip!");
            setIsSubmitting(false);
            return;
          }
          const randomIndex = Math.floor(Math.random() * validAnswers.length);
          submittedAnswer = validAnswers[randomIndex];
        } else {
          const randomIndex = Math.floor(Math.random() * availableLuckyDips.length);
          submittedAnswer = availableLuckyDips[randomIndex];
          setAvailableLuckyDips((prev) => prev.filter((a) => a !== submittedAnswer));
        }
      }

      const instantWin = checkForInstantWin(instantWinPrizes);

      const { data, error } = await supabase
        .from("answers")
        .insert({
          game_id: game.id,
          user_id: user.id,
          answer_text: submittedAnswer,
          is_lucky_dip: isLuckyDip,
          is_instant_win: !!instantWin,
          instant_win_amount: instantWin?.prize.prize_amount || 0,
        })
        .select();

      if (error) throw error;

      if (isLuckyDip) {
        setAvailableLuckyDips((prev) => prev.filter((a) => a !== submittedAnswer));
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
      onAnswerSubmitted();
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
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">
          Your Credits: £{user.credit_balance?.toFixed(2)}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">
                Instant Wins
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <ul className="list-disc pl-5">
                {instantWinPrizes.map((prize) => (
                  <li key={prize.id} className="text-xs">
                    £{prize.prize.prize_amount?.toFixed(2)} (x{prize.quantity})
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
            disabled={isSubmitting}
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
