"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentGame, submitAnswer } from "@/utils/dataHelpers";
import { User, useUser } from "@/utils/userHelpers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Keep this type definition
type GameHistoryEntry = {
  gameId: number;
  answer: string;
  status: string;
  instantWin: string;
};

// Extend the User type from userHelpers
interface ExtendedUser extends User {
  gameHistory?: GameHistoryEntry[];
}

export default function LandingPage() {
  const { user, updateUser } = useUser<ExtendedUser>();
  const [currentGame, setCurrentGame] = useState(getCurrentGame());
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [clue, setClue] = useState("");

  useEffect(() => {
    if (user) {
      setGameHistory(user.gameHistory || []);
    }
  }, [user]);

  const generatePartialAnswer = (word: string) => {
    const revealedCount = Math.floor(word.length / 2);
    const revealedIndices = new Set();
    while (revealedIndices.size < revealedCount) {
      revealedIndices.add(Math.floor(Math.random() * word.length));
    }
    return word
      .split("")
      .map((char, index) => (revealedIndices.has(index) ? char : "_"))
      .join(" ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && currentGame) {
      const cost = isLuckyDip ? 5 : 1;
      if (user.credit_balance >= cost) {
        let luckyDipAnswer = "";
        if (isLuckyDip) {
          if (Math.random() < 0.5) {
            const uniqueAnswer = currentGame.validAnswers.find(
              (a) =>
                !currentGame.answers.some(
                  (submittedAnswer) => submittedAnswer.answer === a
                )
            );
            if (uniqueAnswer) {
              const partialAnswer = generatePartialAnswer(uniqueAnswer);
              setClue(`Clue: ${partialAnswer}`);
              luckyDipAnswer = uniqueAnswer;
            } else {
              luckyDipAnswer =
                currentGame.luckyDipAnswers[
                  Math.floor(Math.random() * currentGame.luckyDipAnswers.length)
                ];
              setClue(`Lucky Dip Answer: ${luckyDipAnswer}`);
            }
          } else {
            luckyDipAnswer =
              currentGame.luckyDipAnswers[
                Math.floor(Math.random() * currentGame.luckyDipAnswers.length)
              ];
            setClue(`Lucky Dip Answer: ${luckyDipAnswer}`);
          }
        }

        const result = submitAnswer(
          user.id, // Remove .toString()
          currentGame.id,
          isLuckyDip ? luckyDipAnswer : answer,
          isLuckyDip
        );
        if (result) {
          const updatedUser: ExtendedUser = {
            ...user,
            credit_balance: user.credit_balance - cost,
          };
          updateUser(updatedUser);

          const updatedHistory: GameHistoryEntry[] = [
            ...gameHistory,
            {
              gameId: currentGame.id,
              answer: isLuckyDip ? luckyDipAnswer : answer,
              status: "PENDING",
              instantWin: isLuckyDip ? "YES" : "NO",
            },
          ];
          setGameHistory(updatedHistory);

          setAnswer("");
          setIsLuckyDip(false);

          setCurrentGame(getCurrentGame());
        }
      } else {
        alert("Insufficient balance");
      }
    } else {
      alert("Please log in to play");
    }
  };

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.main
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-8 text-purple-800 text-center underline"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          FIND A UNIQUE ANSWER & WIN!
        </motion.h1>

        <motion.div
          className="bg-purple-400 p-6 rounded-lg shadow-md mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            {currentGame.question}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="ENTER YOUR ANSWER"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full py-2 px-4 rounded-md bg-white text-black placeholder-gray-500"
            />
            <div className="flex items-center justify-center space-x-2">
              <input
                type="checkbox"
                id="luckyDip"
                checked={isLuckyDip}
                onChange={(e) => setIsLuckyDip(e.target.checked)}
                className="form-checkbox h-5 w-5 text-orange-500"
              />
              <label htmlFor="luckyDip" className="text-white">
                LUCKY DIP
              </label>
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            >
              PLAY NOW/SUBMIT
            </Button>
          </form>
          {clue && (
            <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
              {clue}
            </div>
          )}
        </motion.div>

        {user && (
          <motion.div
            className="bg-purple-400 p-6 rounded-lg shadow-md mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Game History</h2>
            <table className="w-full text-white">
              <thead>
                <tr>
                  <th className="text-left">Your Answer</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Instant Win</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.answer}</td>
                    <td>{entry.status}</td>
                    <td>{entry.instantWin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* ... (rest of the component remains the same) */}
      </motion.main>
    </div>
  );
}
