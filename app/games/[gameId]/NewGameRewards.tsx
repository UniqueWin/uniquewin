import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Coins, HelpCircle, LucideIcon } from "lucide-react";
import Confetti from "react-confetti";
import { PrizeType } from "@/types/prize";

// Remove the enum definition here since we're now importing it

interface Prize {
  id: number;
  type: PrizeType;
  value: string;
  winner: string | null;
  rarity: "common" | "rare" | "epic" | "legendary";
}

// Define the type for prizeIcons using LucideIcon
const prizeIcons: { [key in PrizeType]: LucideIcon } = {
  [PrizeType.CASH]: Coins,
  [PrizeType.CREDIT]: Coins,
  [PrizeType.ITEM]: Gift,
};

const rarityColors = {
  common: "border-gray-300",
  rare: "border-blue-400",
  epic: "border-purple-500",
  legendary: "border-yellow-400",
};

const tooltipContent: Record<PrizeType, string> = {
  [PrizeType.CASH]: "Real money rewards",
  [PrizeType.CREDIT]: "In-game currency to spend on various items",
  [PrizeType.ITEM]: "A random prize from our selection",
};

export default function NewGameRewards() {
  const [prizes, setPrizes] = useState<Prize[]>([
    ...Array(10)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        type: PrizeType.CASH,
        value: "£10",
        winner: null,
        rarity: "common" as const,
      })),
    {
      id: 11,
      type: PrizeType.CASH,
      value: "£100",
      winner: null,
      rarity: "rare" as const,
    },
    {
      id: 12,
      type: PrizeType.CREDIT,
      value: "100",
      winner: null,
      rarity: "rare" as const,
    },
    {
      id: 13,
      type: PrizeType.ITEM,
      value: "Mystery Box",
      winner: null,
      rarity: "epic" as const,
    },
    {
      id: 14,
      type: PrizeType.CASH,
      value: "£1000",
      winner: null,
      rarity: "legendary" as const,
    },
  ]);

  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [claimedCount, setClaimedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const revealPrize = (prize: Prize) => {
    setSelectedPrize(prize);
    setIsRevealing(true);
    setTimeout(() => {
      setPrizes(
        prizes.map((p) => (p.id === prize.id ? { ...p, winner: "You" } : p))
      );
      setIsRevealing(false);
      setClaimedCount((count) => count + 1);
      if (prize.rarity === "legendary" || prize.rarity === "epic") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPrize(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-4 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMTAiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIwMjAyMDIwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] animate-[spin_60s_linear_infinite]" />
      </div>
      <div className="relative z-10">
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
        <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {prizes.map((prize) => (
            <motion.div
              key={prize.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`bg-opacity-20 backdrop-blur-lg bg-white cursor-pointer overflow-hidden border-2 ${
                  rarityColors[prize.rarity]
                }`}
                onClick={() => !prize.winner && revealPrize(prize)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  {prize.winner ? (
                    <Sparkles className="w-12 h-12 text-yellow-400 mb-2" />
                  ) : (
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {prizeIcons[prize.type] && (
                              <prizeIcons[prize.type] className="w-12 h-12 text-blue-300 mb-2" />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipContent[prize.type]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  )}
                  <Badge variant="secondary" className="mb-2">
                    {prize.type}
                  </Badge>
                  <p className="text-center font-semibold">{prize.value}</p>
                  {prize.winner && (
                    <div className="mt-2 text-center">
                      <p className="text-xs text-green-300">Claimed!</p>
                      <p className="text-xs text-green-300">
                        Winner: {prize.winner}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => !isRevealing && setSelectedPrize(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 180 }}
              animate={{ scale: 1, rotateY: isRevealing ? [180, 0] : 0 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-lg shadow-2xl max-w-sm w-full text-center border-4 ${
                rarityColors[selectedPrize.rarity]
              }`}
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
                  <h2 className="text-2xl font-bold mb-4">You Won!</h2>
                  <div className="text-6xl mb-4">
                    {prizeIcons[selectedPrize.type] && (
                      <prizeIcons[selectedPrize.type] className="inline" />
                    )}
                  </div>
                  <p className="text-xl mb-2">{selectedPrize.value}</p>
                  <Badge variant="secondary" className="mb-4">
                    {selectedPrize.type}
                  </Badge>
                  <p className="text-lg mb-4 text-green-300">Claimed by: You</p>
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
