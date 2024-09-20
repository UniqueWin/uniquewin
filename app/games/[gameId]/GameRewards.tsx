"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Coins, HelpCircle, Lock, Unlock } from "lucide-react";
import ScratchCardComponent from "./ScratchCardComponent";
import { getWinnerName } from "@/utils/dataHelpers";

type PrizeType = "CREDITS" | "CASH" | "LUCKY_DIP" | "HANGMAN";

interface Prize {
  id: number;
  prize_type: PrizeType;
  prize_amount: number;
  status: "LOCKED" | "UNLOCKED" | "SCRATCHED";
  winner_id: string | null;
}

interface WinnerNames {
  [key: number]: string;
}

const prizeIcons = {
  CREDITS: Coins,
  CASH: Coins,
  LUCKY_DIP: Gift,
  HANGMAN: HelpCircle,
};

interface GameRewardsProps {
  prizes: Prize[];
  userId: string;
  gameId: string;
  refreshPage: () => void;
}

export default function GameRewards({
  prizes,
  userId,
  gameId,
  refreshPage,
}: GameRewardsProps) {
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [userWonPrizes, setUserWonPrizes] = useState<Prize[]>([]);
  const [otherPrizes, setOtherPrizes] = useState<Prize[]>([]);
  const [winnerNames, setWinnerNames] = useState<WinnerNames>({});

  useEffect(() => {
    setUserWonPrizes(prizes.filter((prize) => prize.winner_id === userId));
    setOtherPrizes(prizes.filter((prize) => prize.winner_id !== userId));
  }, [prizes, userId]);

  useEffect(() => {
    const fetchWinnerNames = async () => {
      const names: WinnerNames = {};
      for (const prize of prizes) {
        if (prize.winner_id && prize.status === "SCRATCHED") {
          names[prize.id] = await getWinnerName(prize.winner_id);
        }
      }
      setWinnerNames(names);
    };

    fetchWinnerNames();
  }, [prizes]);

  const getPrizeValue = (prize: Prize) => {
    switch (prize.prize_type) {
      case "CASH":
        return `£${prize.prize_amount}`;
      case "CREDITS":
        return `${prize.prize_amount} credits`;
      case "LUCKY_DIP":
        return "Mystery Prize";
      case "HANGMAN":
        return "h _ n g m _ n";
      default:
        return "Unknown";
    }
  };

  const renderPrizeIcon = (prize: Prize) => {
    if (prize.status === "LOCKED") {
      return <Lock className="w-12 h-12 text-gray-400 mb-2" />;
    } else if (prize.status === "UNLOCKED") {
      return <Unlock className="w-12 h-12 text-yellow-400 mb-2" />;
    } else {
      const Icon = prizeIcons[prize.prize_type];
      return <Icon className={`w-12 h-12 mb-2 ${prize.prize_type === "CREDITS" ? "text-yellow-300" : "text-blue-300"}`} />;
    }
  };

  const renderPrizeList = (prizeList: Prize[], title: string) => (
    <>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {prizeList.map((prize) => (
          <motion.div
            key={prize.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="bg-opacity-20 backdrop-blur-lg bg-white cursor-pointer overflow-hidden"
              onClick={() => setSelectedPrize(prize)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {renderPrizeIcon(prize)}
                </motion.div>
                <Badge variant="secondary" className="mb-2">
                  {prize.prize_type.toLowerCase()}
                </Badge>

                <p className="text-center font-semibold">
                  {/* {getPrizeValue(prize)} */}
                </p>

                {prize.status === "SCRATCHED" && (
                  <div className="mt-2 text-center">
                    <p className="text-xs text-green-300">Claimed!</p>
                    {winnerNames[prize.id] && (
                      <p className="text-xs text-green-200">by: {prize.winner_id === userId ? "You" : winnerNames[prize.id]}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex flex-col bg-gradient-to-br from-red-700 to-purple-900 text-white p-4 rounded-xl">
      {renderPrizeList(userWonPrizes, "Won")}
      {renderPrizeList(otherPrizes, "Other Prizes")}

      <AnimatePresence>
        {selectedPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPrize(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-600 to-red-700 p-8 rounded-lg shadow-2xl max-w-sm w-full text-center flex flex-col items-center justify-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">
                {selectedPrize.winner_id === userId
                  ? "You Won!"
                  : "Prize Details"}
              </h2>
              <div className="">
                {prizeIcons[selectedPrize.prize_type] && (
                  <motion.div
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {renderPrizeIcon(selectedPrize)}
                  </motion.div>
                )}
              </div>
              {selectedPrize.status && (
                <ScratchCardComponent
                  prize={getPrizeValue(selectedPrize)}
                  onReveal={refreshPage}
                  gameId={gameId}
                  prizeId={selectedPrize.id.toString()}
                  userId={userId}
                  status={selectedPrize.status}
                  winnerId={selectedPrize.winner_id}
                />
              )}
              <Badge variant="secondary" className="mb-4">
                {selectedPrize.prize_type.toLowerCase()}
              </Badge>
              {selectedPrize.winner_id === userId ? (
                <>
                  <p className="text-lg mb-4 text-green-300">Claimed by: You</p>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    onClick={() => setSelectedPrize(null)}
                  >
                    Awesome!
                  </button>
                </>
              ) : (
                <>
                  {selectedPrize.status === "SCRATCHED" && winnerNames[selectedPrize.id] && (
                    <p className="text-lg mb-4 text-green-300">
                      Claimed by: {winnerNames[selectedPrize.id]}
                    </p>
                  )}
                  {selectedPrize.status === "LOCKED" && (
                    <p className="text-lg mb-4 text-yellow-300">
                      This prize is still locked. Keep playing to unlock it!
                    </p>
                  )}
                  {selectedPrize.status === "UNLOCKED" && (
                    <p className="text-lg mb-4 text-blue-300">
                      This prize is unlocked! Scratch to reveal your prize.
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
