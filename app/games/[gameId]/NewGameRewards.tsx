"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Coins, HelpCircle, Lock, Unlock } from "lucide-react";
import confetti from "canvas-confetti";
import { getWinnerName } from "@/utils/dataHelpers"; // Import the function to fetch winner names
import ScratchCardComponent from "./ScratchCardComponent";

type PrizeType = "ALL" | "CREDITS" | "CASH" | "LUCKY_DIP" | "HANGMAN";

interface Prize {
  id: number;
  prize_type: PrizeType;
  prize_amount: number;
  status: "LOCKED" | "UNLOCKED" | "SCRATCHED";
  winner_id: string | null;
}

const prizeIcons = {
  CREDITS: Coins,
  CASH: Coins,
  LUCKY_DIP: Gift,
  HANGMAN: HelpCircle,
};

const tooltipContent = {
  CREDITS: "In-game currency to spend on various items",
  CASH: "Real money rewards",
  LUCKY_DIP: "A random prize from our selection",
  HANGMAN: "Play a game of Hangman to win more prizes",
};

interface WinnerNames {
  [key: number]: string; // Define the type for winner names
}

interface NewGameRewardsProps {
  prizes: Prize[]; // Accept prizes as a prop
  userId: string; // Add userId prop
  gameId: string; // Add gameId prop
}

export default function NewGameRewards({
  prizes,
  userId,
  gameId,
}: NewGameRewardsProps) {
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [claimedCount, setClaimedCount] = useState(0);
  const [winnerNames, setWinnerNames] = useState<WinnerNames>({}); // Declare winnerNames state

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
  }, [prizes]); // Fetch winner names whenever prizes change

  const revealPrize = (prize: Prize) => {
    setSelectedPrize(prize);
    setIsRevealing(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setClaimedCount((count) => count + 1);
      setIsRevealing(false);
    }, 2000);
  };

  const groupedPrizes = prizes.reduce((acc, prize) => {
    if (!acc[prize.prize_type]) {
      acc[prize.prize_type] = [];
    }
    acc[prize.prize_type].push(prize);
    return acc;
  }, {} as Record<PrizeType, Prize[]>);

  // Add this line to create an "ALL" category
  groupedPrizes["ALL"] = prizes; // Include all prizes

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-700 to-fuchsia-900 text-white p-4 relative overflow-hidden rounded-xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Rewards Vault</h1>
      <div className="mb-4 text-center">
        <p>
          Claimed: {claimedCount} / {prizes.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(claimedCount / prizes.length) * 100}%` }}
          ></div>
        </div>
      </div>
      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4 bg-black bg-opacity-20">
          {[
            "ALL",
            ...Object.keys(groupedPrizes).filter((type) => type !== "ALL"),
          ].map((type) => (
            <TabsTrigger key={type} value={type} className="capitalize bg-">
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(groupedPrizes).map(([type, prizes]) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {prizes.map((prize) => (
                <PrizeCard
                  key={prize.id}
                  prize={prize}
                  onReveal={revealPrize}
                  winnerName={winnerNames[prize.id]} // Pass winner name to PrizeCard
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <AnimatePresence>
        {selectedPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => !isRevealing && setSelectedPrize(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 180 }}
              animate={{ scale: 1, rotateY: isRevealing ? [180, 0] : 0 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br from-red-600 to-purple-700 p-8 rounded-lg shadow-2xl max-w-sm w-full text-center`}
              onClick={(e) => e.stopPropagation()}
            >
              {isRevealing ? (
                <div className="flex flex-col items-center">
                  <Sparkles className="w-16 h-16 text-yellow-400 mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold mb-4">
                    Revealing Prize...
                  </h2>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">
                    {selectedPrize.winner_id === userId
                      ? "You Won!"
                      : "Prize Details"}
                  </h2>{" "}
                  <div className="my-4 flex justify-center w-full">
                    <ScratchCardComponent
                      className="mx-auto"
                      prize={selectedPrize} // Pass the selected prize to the ScratchCardComponent
                      onReveal={() => setSelectedPrize(null)} // Handle reveal action
                      gameId={gameId} // Pass gameId
                      prizeId={selectedPrize.id.toString()} // Pass prizeId
                      userId={userId} // Pass userId
                      status={selectedPrize.status} // Pass prize status
                      winnerId={selectedPrize.winner_id} // Pass winnerId
                    />
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    {selectedPrize.prize_type}
                  </Badge>
                  {selectedPrize.winner_id === userId ? (
                    <>
                      <p className="text-lg mb-4 text-green-300">
                        Claimed by: You
                      </p>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                        onClick={() => setSelectedPrize(null)}
                      >
                        Awesome!
                      </button>
                    </>
                  ) : (
                    <>
                      {selectedPrize.status === "SCRATCHED" &&
                        winnerNames[selectedPrize.id] && (
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
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    onClick={() => setSelectedPrize(null)}
                  >
                    Awesome!
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PrizeCard({
  prize,
  onReveal,
  winnerName, // Accept winner name as a prop
}: {
  prize: Prize;
  onReveal: (prize: Prize) => void;
  winnerName: string; // Define type for winner name
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card
        className={`bg-opacity-20 backdrop-blur-lg bg-white cursor-pointer overflow-hidden border-2`}
        onClick={() => !prize.winner_id && onReveal(prize)}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <motion.div
            animate={{ rotateY: prize.status === "LOCKED" ? [0, 360] : 0 }} // Animate padlock rotation
            transition={{
              duration: 2,
              repeat: prize.status === "LOCKED" ? Infinity : 0,
              ease: "linear",
            }}
          >
            {prize.winner_id ? (
              <Unlock className="w-12 h-12 text-yellow-400 mb-2" /> // Use unlocked padlock for claimed prizes
            ) : (
              <Lock className="w-12 h-12 text-gray-400 mb-2" /> // Use padlock for unclaimed prizes
            )}
          </motion.div>
          <Badge variant="secondary" className="mb-2">
            {prize.prize_type}
          </Badge>
          {prize.winner_id && (
            <div className="mt-2 text-center">
              <p className="text-xs text-green-300">Claimed!</p>
              <p className="text-xs text-green-300">
                Winner: {winnerName} {/* Display winner's name */}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
