"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  getCurrentGame,
  getGameById,
  submitAnswer,
} from "@/utils/dataHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScratchCard } from 'next-scratchcard';
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { Game, Answer } from "@/utils/dataHelpers";
import { User } from "@/utils/userHelpers";
import Header from "@/components/Header"; // Import Header
import Footer from "@/components/Footer"; // Import Footer

const luckyDipNames = ["THEODRE", "TEDDY", "THOMAS", "TREVOR", "TAYTE"];

// Define our own interface for ScratchCard props
interface ScratchCardProps {
  width: number;
  height: number;
  image: string;
  finishPercent: number;
  onComplete: () => void;
  brushSize: number;
  children: React.ReactNode;
}

// Extend the ScratchCardProps interface to include the brushColor and onScratch props
interface ExtendedScratchCardProps extends ScratchCardProps {
  brushColor?: string;
  onScratch: (percentage: number) => void;
}

const ScratchCardWithBrushColor = ScratchCard as React.ComponentType<ExtendedScratchCardProps>;

const ScratchCardComponent = ({
  prize,
  onReveal,
}: {
  prize: string;
  onReveal: () => void;
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);

  const handleComplete = () => {
    setIsRevealed(true);
    onReveal();

    setTimeout(() => {
      setIsRevealed(false);
    }, 5000);
  };

  return (
    <div className="relative w-[250px] h-[75px] rounded">
      {isRevealed && (
        <Confetti
          width={250}
          height={75}
          // drawShape={(ctx) => {
          //   ctx.beginPath();
          //   for (let i = 0; i < 22; i++) {
          //     const angle = 0.35 * i;
          //     const x = (0.2 + 1.5 * angle) * Math.cos(angle);
          //     const y = (0.2 + 1.5 * angle) * Math.sin(angle);
          //     ctx.lineTo(x, y);
          //   }
          //   ctx.stroke();
          //   ctx.closePath();
          // }}
        />
      )}
      <ScratchCardWithBrushColor
        width={250}
        height={75}
        finishPercent={50}
        onComplete={handleComplete}
        image={
          "https://st3.depositphotos.com/1022597/35608/i/450/depositphotos_356083076-stock-photo-grey-stone-texture-useful-background.jpg"
        }
        brushSize={10}
        brushColor="#808080"
        onScratch={(percentage) => setScratchedPercentage(percentage)}
      >
        <div className="flex items-center justify-center w-full h-full bg-purple-500 rounded-lg p-4">
          <div className="text-center">
            <p className="text-white text-2xl font-bold">YOU WIN</p>
            <p
              className={`text-white font-bold ${
                prize.includes("£") ? "text-green-500" : "text-xl"
              }`}
            >
              {prize}
            </p>
          </div>
        </div>
      </ScratchCardWithBrushColor>
    </div>
  );
};

export default function GamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [availableLuckyDips, setAvailableLuckyDips] = useState([
    ...luckyDipNames,
  ]);
  const [showGameHistory, setShowGameHistory] = useState(true);
  const [instantWinPrizes, setInstantWinPrizes] = useState<{
    [key: number]: { type: "money" | "word"; value: string };
  }>({});

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const currentUser = getCurrentUser(parseInt(userId));
      if (currentUser) {
        setUser(currentUser as User);
        const currentGame = getGameById(parseInt(params.gameId));
        if (currentGame) {
          setGame(currentGame);
        } else {
          router.push("/games");
        }
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router, params.gameId]);

  useEffect(() => {
    if (game) {
      const timer = setInterval(() => {
        const now = new Date();
        const endTime = new Date(game.endTime);
        const distance = endTime.getTime() - now.getTime();

        if (distance < 0) {
          clearInterval(timer);
          setCountdown("GAME OVER");
          setShowGameHistory(false);
        } else {
          const minutes = Math.floor(distance / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          setShowGameHistory(minutes > 30);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [game]);

  const getPartiallyHiddenWord = (word: string) => {
    return word
      .split("")
      .map((char, index) => {
        if (index === 0 || index === word.length - 1 || Math.random() < 0.3) {
          return char;
        }
        return "_";
      })
      .join(" ");
  };

  const handleSubmitAnswer = () => {
    if (!game || (!answer.trim() && !isLuckyDip)) return;

    let submittedAnswer = answer.toUpperCase();
    if (isLuckyDip) {
      if (game.luckyDipAnswers.length === 0) {
        alert("No more Lucky Dips available!");
        return;
      }
      const randomIndex = Math.floor(
        Math.random() * game.luckyDipAnswers.length
      );
      submittedAnswer = game.luckyDipAnswers[randomIndex];
      setGame((prevGame) => ({
        ...prevGame!,
        luckyDipAnswers: prevGame!.luckyDipAnswers.filter(
          (word) => word !== submittedAnswer
        ),
      }));
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
      answers: [newAnswer, ...prevGame!.answers],
    }));

    if (isLuckyDip) {
      const isWordPrize = Math.random() < 0.4; // 20% chance of word prize (increased money prize probability)
      if (isWordPrize && game.validAnswers.length > 0) {
        const randomWordIndex = Math.floor(
          Math.random() * game.validAnswers.length
        );
        const word = game.validAnswers[randomWordIndex];
        setInstantWinPrizes((prev) => ({
          ...prev,
          [game!.answers.length]: {
            type: "word",
            value: getPartiallyHiddenWord(word),
          },
        }));
      } else {
        const prizeAmount = Math.floor(Math.random() * 50) + 1;
        setInstantWinPrizes((prev) => ({
          ...prev,
          [game!.answers.length]: { type: "money", value: `£${prizeAmount}` },
        }));
      }
    }

    setAnswer("");
    setIsLuckyDip(false);
    setUser((prev) => ({
      ...prev!,
      balance: prev!.balance - (isLuckyDip ? 5 : 1),
    }));

    // Provide feedback to the user
    if (!isValidAnswer) {
      alert(
        "Your answer is not in the list of valid answers. It will be reviewed manually."
      );
    }
  };

  const calculateWinnings = () => {
    const uniqueAnswers =
      game?.answers.filter((a) => a.status === "UNIQUE") || [];
    return uniqueAnswers.length
      ? (750 / uniqueAnswers.length).toFixed(2)
      : "0.00";
  };

  if (!user || !game) return <div>Loading...</div>;

  return (
    <div className="bg-purple-300 min-h-screen flex flex-col">
      <Header /> {/* Add Header */}
      <div className="container mx-auto p-4 flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-between items-center mb-4"
          >
            <h1 className="text-3xl font-bold">UNIQUEWIN.CO.UK</h1>
            <div>
              <p>LIVE: JACKPOT: £{game.jackpot}</p>
              <p>GAME ENDS IN {countdown}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              FIND A UNIQUE ANSWER & WIN!
            </h2>
            <p className="text-xl mb-4">{game.question}</p>

            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="ENTER YOUR ANSWER"
              className="mb-4"
              disabled={isLuckyDip}
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isLuckyDip}
                onChange={() => setIsLuckyDip(!isLuckyDip)}
                className="mr-2"
                disabled={availableLuckyDips.length === 0}
              />
              <label>LUCKY DIP ({availableLuckyDips.length} left)</label>
            </div>
            <Button
              onClick={handleSubmitAnswer}
              className="bg-orange-500 w-full mb-8"
            >
              PLAY NOW/SUBMIT
            </Button>
          </motion.div>

          {showGameHistory && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4">GAME HISTORY</h3>
              <p className="mb-4">
                YOU ARE CURRENTLY WINNING: £{calculateWinnings()}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full mb-8">
                  <thead>
                    <tr>
                      <th className="text-left">YOUR ANSWER</th>
                      <th className="text-left">ANSWER FREQUENCY</th>
                      <th className="text-left">ANSWER STATUS</th>
                      <th className="text-left">INSTANT WIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...game.answers].reverse().map((answer, index) => (
                      <tr key={index}>
                        <td>{answer.answer}</td>
                        <td>{answer.frequency}</td>
                        <td
                          className={
                            answer.status === "UNIQUE"
                              ? "text-green-500"
                              : answer.status === "NOT UNIQUE"
                              ? "text-red-500"
                              : "text-orange-500"
                          }
                        >
                          {answer.status}
                        </td>
                        <td className="text-center text-xs">
                          {answer.instantWin === "REVEAL" ? (
                            <ScratchCardComponent
                              prize={
                                instantWinPrizes[game.answers.length - 1 - index]
                                  ? instantWinPrizes[
                                      game.answers.length - 1 - index
                                    ].type === "money"
                                    ? instantWinPrizes[
                                        game.answers.length - 1 - index
                                      ].value
                                    : `${
                                        instantWinPrizes[
                                          game.answers.length - 1 - index
                                        ].value
                                      }`
                                  : "£0"
                              }
                              onReveal={() => {}}
                            />
                          ) : (
                            answer.instantWin
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-purple-500 text-white p-4 text-center mb-8"
          >
            <h3 className="text-xl font-bold">DON'T MISS THE 8PM RESULTS SHOW</h3>
            <p>EVERY MONDAY NIGHT LIVE ON FACEBOOK</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-wrap justify-between items-center mb-8"
          >
            <div className="w-full md:w-1/2 bg-purple-400 h-32 mb-4 md:mb-0">
              <p className="text-white p-4">
                "I won £500 last week with UniqueWin! It's so exciting!" - Sarah
                T.
              </p>
            </div>
            <div className="w-full md:w-1/2 md:pl-4">
              <h3 className="text-xl font-bold">NEW WINNERS EVERYDAY</h3>
              <p>WILL YOU BE NEXT?</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-purple-400 p-4 text-center"
          >
            <p className="text-white">
              Trustpilot Rating: 4.8/5 from 1000+ reviews
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
}
