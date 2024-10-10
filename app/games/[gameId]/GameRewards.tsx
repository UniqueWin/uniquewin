"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWinnerName } from "@/utils/dataHelpers"; // Import the function to fetch winner names
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Gift, HelpCircle, Lock, Sparkles, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import ScratchCardComponent from "./ScratchCardComponent";
import PrizeCard from "./PrizeCard"; // Import PrizeCard
import { Prize, WinnerNames, NewGameRewardsProps, PrizeType, BonusGameType } from "./types"; // Ensure this imports the correct Prize type

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

const getPrizeValue = (selectedPrize: any): Prize => {
  return {
    id: selectedPrize.id, // Add the id property
    prize_type: selectedPrize.prize_type, // Add the prize_type property
    prize_amount: selectedPrize.prize_amount, // Add the prize_amount property
    status: selectedPrize.status, // Add the status property
    winner_id: selectedPrize.winner_id, // Add the winner_id property
    bonus_game_type: selectedPrize.bonus_game_type ?? null, // Ensure this matches the Prize type
  };
};

export default function NewGameRewards({
  prizes,
  userId,
  gameId,
}: NewGameRewardsProps) {
  if (!Array.isArray(prizes)) {
    return <div>No prizes available.</div>;
  }

  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [claimedCount, setClaimedCount] = useState(0);
  const [winnerNames, setWinnerNames] = useState<WinnerNames>({}); // Declare winnerNames state
  const [userWonPrizes, setUserWonPrizes] = useState<Prize[]>([]);
  const [otherPrizes, setOtherPrizes] = useState<Prize[]>([]);
  const [groupedPrizes, setGroupedPrizes] = useState<
    Record<PrizeType, Prize[]>
  >({} as Record<PrizeType, Prize[]>);

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

  useEffect(() => {
    setUserWonPrizes(prizes.filter((prize) => prize.winner_id === userId));
    setOtherPrizes(prizes.filter((prize) => prize.winner_id !== userId));
    setClaimedCount(
      prizes.filter((prize) => prize.winner_id === userId).length
    );

    const grouped = prizes.reduce((acc, prize) => {
      if (!acc[prize.prize_type]) {
        acc[prize.prize_type] = [];
      }
      acc[prize.prize_type].push(prize);
      return acc;
    }, {} as Record<PrizeType, Prize[]>);

    grouped["ALL"] = prizes;

    setGroupedPrizes(grouped);
  }, [prizes, userId]);

  const revealPrize = (prize: Prize) => {
    setSelectedPrize(prize);
    setIsRevealing(true);
    if (prize.status !== "LOCKED") {
      // Show confetti only if the prize is unlocked
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setTimeout(() => {
      setClaimedCount((count) => count + 1);
      setIsRevealing(false);
    }, 2000);
  };

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
          {["ALL", ...Object.keys(groupedPrizes)]
            .filter((type, index, self) =>
              type === "ALL" ? self.indexOf(type) === index : true
            )
            .map((type) => (
              <TabsTrigger
                key={`prizes-${type}`}
                value={type}
                className="capitalize bg-"
              >
                {type}
              </TabsTrigger>
            ))}
        </TabsList>
        {Object.entries(groupedPrizes).map(([type, prizes]) => {
          const wonPrizesOfType = userWonPrizes.filter(
            (prize) => prize.prize_type === type
          );
          const otherPrizesOfType = otherPrizes.filter(
            (prize) => prize.prize_type === type
          );

          return (
            <TabsContent key={type} value={type}>
              {/* For "ALL" type, display all prizes */}
              {type === "ALL" ? (
                <>
                  {/* Render Won Prizes */}
                  {userWonPrizes.length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold mb-4">Won</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {userWonPrizes.map((prize) => (
                          <PrizeCard
                            key={prize.id}
                            prize={prize}
                            onReveal={revealPrize}
                            winnerName={winnerNames[prize.id]} // Pass winner name to PrizeCard
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Render Other Prizes */}
                  {otherPrizes.length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold mb-4">Other Prizes</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {otherPrizes.map((prize) => (
                          <PrizeCard
                            key={prize.id}
                            prize={prize}
                            onReveal={revealPrize}
                            winnerName={winnerNames[prize.id]} // Pass winner name to PrizeCard
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Render Won Prizes */}
                  {wonPrizesOfType.length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold mb-4">Won</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {wonPrizesOfType.map((prize) => (
                          <PrizeCard
                            key={prize.id}
                            prize={prize}
                            onReveal={revealPrize}
                            winnerName={winnerNames[prize.id]} // Pass winner name to PrizeCard
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Render Other Prizes */}
                  {otherPrizesOfType.length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold mb-4">Other Prizes</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {otherPrizesOfType.map((prize) => (
                          <PrizeCard
                            key={prize.id}
                            prize={prize}
                            onReveal={revealPrize}
                            winnerName={winnerNames[prize.id]} // Pass winner name to PrizeCard
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </TabsContent>
          );
        })}
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
                    {selectedPrize.status === "LOCKED" ||
                    selectedPrize.winner_id !== userId
                      ? "Prize Details"
                      : "Revealing Prize..."}
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
                      prize={getPrizeValue(selectedPrize)} // Ensure this returns a Prize type
                      onReveal={() => console.log("null")} // Handle reveal action
                      gameId={gameId} // Pass gameId
                      prizeId={selectedPrize.id.toString()} // Pass prizeId
                      userId={userId} // Pass userId
                      status={selectedPrize.status} // Pass prize status
                      winnerId={selectedPrize.winner_id} // Pass winnerId
                      bonusGameType={selectedPrize.bonus_game_type ?? null} // Ensure this is using the correct type
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
                        Close!
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
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                        onClick={() => setSelectedPrize(null)}
                      >
                        {selectedPrize.status === "LOCKED" ||
                        selectedPrize.winner_id !== userId
                          ? "Okay"
                          : "Close!"}
                      </button>
                    </>
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