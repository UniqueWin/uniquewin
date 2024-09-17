"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/utils/UserContext";
import { Game, GameInstantWinPrize, Answer } from "@/utils/dataHelpers";
import { processAnswer, purchaseLuckyDip } from "@/utils/gameLogic";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";

type QuestionProps = {
  game: Game;
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
  refreshPage: () => void;
};

export default function Question({
  game,
  setGame,
  availableLuckyDips,
  setAvailableLuckyDips,
  instantWinPrizes,
  setInstantWinPrizes,
  getPartiallyHiddenWord,
  updateNavbarCredits,
  onAnswerSubmitted,
  refreshPage,
}: QuestionProps) {
  const { user, refreshUser } = useUser();
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === "" || !user) return;

    // Check if user has enough credits
    if ((user.credit_balance ?? 0) < (game.price ?? 0)) {
      toast.error("Insufficient credits to play.");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting answer:", answer);
      console.log("Valid answers:", game.valid_answers);
      const result = await processAnswer(
        user.id,
        game.id,
        answer,
        instantWinPrizes,
        game.valid_answers || []
      );
      console.log("Process answer result:", result);

      if (result.success) {
        if (result.isValidAnswer) {
          if (result.isUniqueAnswer) {
            toast.success("Correct and unique answer!");
          } else {
            toast.info("Valid answer, but already submitted by someone else.");
          }
          if (result.instantWin) {
            toast.success(`Congratulations! You've won an instant prize: ${result.instantWin.prize.prize_amount} ${result.instantWin.prize.prize_type}`);
          }
        } else {
          toast.info("Invalid answer submitted.");
        }

        // Update the game state with the new answer immediately
        setGame((prevGame: Game | null): Game | null => {
          if (!prevGame) return null;
          const updatedAnswers: Answer[] = [
            ...(prevGame.answers || []).map((a: Answer): Answer => {
              if (a.answer && a.answer.toLowerCase() === answer.toLowerCase()) {
                return { ...a, status: "NOT UNIQUE" };
              }
              return a;
            }),
            {
              answer: answer,
              status: result.isValidAnswer
                ? (result.isUniqueAnswer ? "UNIQUE" : "NOT UNIQUE")
                : "PENDING",
              isLuckyDip: false,
              submittedAt: new Date().toISOString(),
              instantWin: result.instantWin ? JSON.stringify(result.instantWin) : "",
              isInstantWin: !!result.instantWin,
              user_id: user.id,
            } as Answer
          ];

          return {
            ...prevGame,
            answers: updatedAnswers,
          } as Game;
        });

        setAnswer("");
        await refreshUser();
        onAnswerSubmitted(); // This should refresh the user answers
        refreshPage();
      } else {
        toast.error(
          result.message || "Failed to submit answer. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLuckyDip = async () => {
    if (!user || !game) return;
    setIsSubmitting(true);
    console.log("Starting handleLuckyDip", {
      userId: user.id,
      gameId: game.id,
      luckyDipPrice: game.lucky_dip_price,
    });

    try {
      const result = await purchaseLuckyDip(
        user.id,
        game.id,
        availableLuckyDips,
        game.lucky_dip_price ?? 0
      );
      console.log("purchaseLuckyDip result:", result);

      if (result.success) {
        toast.success(
          `Lucky Dip purchased! Your answer: ${result.answer} (${
            result.isUniqueAnswer ? "UNIQUE" : "NOT UNIQUE"
          })`
        );
        setAvailableLuckyDips((prevDips) =>
          prevDips.filter((dip) => dip !== result.answer)
        );

        // Update the game state with the new answer
        setGame((prevGame: Game | null): Game | null => {
          if (!prevGame) return null;
          const updatedAnswers: Answer[] = [
            ...(prevGame.answers || []).map((a: Answer): Answer => {
              if (a.answer === result.answer) {
                console.log(
                  `Updating existing answer: ${a.answer} from ${a.status} to NOT UNIQUE`
                );
                return { ...a, status: "NOT UNIQUE" };
              }
              return a;
            }),
            {
              answer: result.answer,
              status: result.isUniqueAnswer ? "UNIQUE" : "NOT UNIQUE",
              isLuckyDip: true,
              submittedAt: new Date().toISOString(),
              instantWin: "", // Add this line
              isInstantWin: false, // Add this line
              user_id: user.id, // Add this line
            } as Answer
          ];
          console.log("Updated game answers:", updatedAnswers);
          return {
            ...prevGame,
            answers: updatedAnswers,
          };
        });

        await refreshUser();
        onAnswerSubmitted(); // This should refresh the user answers
        refreshPage();
      }
    } catch (error) {
      console.error("Error purchasing Lucky Dip:", error);
      toast.error("Failed to purchase Lucky Dip. Please try again.");
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
                    {prize.prize.prize_type === "CASH" && "£"}
                    {prize.prize.prize_amount?.toFixed(2)}
                    {prize.prize.prize_type === "CREDITS" && "Q"} (x
                    {prize.quantity})
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
            disabled={
              isSubmitting ||
              !answer ||
              answer.length === 0 ||
              (user?.credit_balance ?? 0) < (game.price ?? 0)
            }
          >
            {isSubmitting ? "Submitting..." : "Answer!"}
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleLuckyDip}
          disabled={
            isSubmitting ||
            availableLuckyDips.length === 0 ||
            (user?.credit_balance ?? 0) < (game.lucky_dip_price ?? 0)
          }
        >
          Lucky Dip (£{game.lucky_dip_price ?? 0})
        </Button>

        <p className="text-sm text-muted-foreground">
          Cost: £{game.price ?? 0} per play, £{game.lucky_dip_price ?? 0} for
          Lucky Dip
        </p>
      </form>
    </motion.div>
  );
}
