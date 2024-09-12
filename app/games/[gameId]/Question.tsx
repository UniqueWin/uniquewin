"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Game, Answer } from "@/utils/dataHelpers";
import { User } from "@/utils/userHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type QuestionProps = {
  game: Game;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
  availableLuckyDips: string[];
  setAvailableLuckyDips: React.Dispatch<React.SetStateAction<string[]>>;
  setInstantWinPrizes: React.Dispatch<React.SetStateAction<{
    [key: number]: { type: "money" | "word"; value: string };
  }>>;
  getPartiallyHiddenWord: (word: string) => string;
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
}: QuestionProps) {
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);

  const handleSubmitAnswer = () => {
    if (!game || (!answer.trim() && !isLuckyDip)) return;

    let submittedAnswer = answer.toUpperCase();
    if (isLuckyDip) {
      if (availableLuckyDips.length === 0) {
        alert("No more Lucky Dips available!");
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableLuckyDips.length);
      submittedAnswer = availableLuckyDips[randomIndex];
      setAvailableLuckyDips((prev) =>
        prev.filter((word) => word !== submittedAnswer)
      );
    }

    // Check if the answer is in the validAnswers list
    const isValidAnswer = game.validAnswers.includes(submittedAnswer);

    const newAnswer: Answer = {
      answer: submittedAnswer,
      frequency: 1,
      status: isLuckyDip ? "UNIQUE" : isValidAnswer ? "PENDING" : "NOT UNIQUE",
      instantWin: isLuckyDip ? "REVEAL" : "PENDING",
    };

    setGame((prevGame) => ({
      ...prevGame!,
      answers: [newAnswer, ...(prevGame!.answers || [])],
    }));

    if (isLuckyDip) {
      const isWordPrize = Math.random() < 0.4;
      if (isWordPrize && game.validAnswers.length > 0) {
        const randomWordIndex = Math.floor(
          Math.random() * game.validAnswers.length
        );
        const word = game.validAnswers[randomWordIndex];
        setInstantWinPrizes((prev) => ({
          ...prev,
          [game.answers.length]: {
            type: "word",
            value: getPartiallyHiddenWord(word),
          },
        }));
      } else {
        const prizeAmount = Math.floor(Math.random() * 50) + 1;
        setInstantWinPrizes((prev) => ({
          ...prev,
          [game.answers.length]: { type: "money", value: `£${prizeAmount}` },
        }));
      }
    }

    setAnswer("");
    setIsLuckyDip(false);
    setUser((prev) => ({
      ...prev!,
      balance: prev!.balance - (isLuckyDip ? 5 : 1),
    }));

    if (!isValidAnswer) {
      alert(
        "Your answer is not in the list of valid answers. It will be reviewed manually."
      );
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
      <p className="mb-4 text-lg">Your Balance: £{user.balance.toFixed(2)}</p>

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
          onClick={handleSubmitAnswer}
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
