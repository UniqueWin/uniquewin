"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { ScratchCard } from "next-scratchcard";
import { scratchCard } from "@/utils/gameLogic";

// Define our own interface for ScratchCard props
interface ScratchCardProps {
  prize: string | number;
  onReveal: () => void;
  gameId: string;
  prizeId: string;
  userId: string;
  status: "LOCKED" | "UNLOCKED" | "SCRATCHED";
  winnerId: string | null;
}

// Extend the ScratchCardProps interface to include the brushColor and onScratch props
interface ExtendedScratchCardProps extends ScratchCardProps {
  width: number;
  height: number;
  finishPercent: number;
  onComplete: () => void;
  image: string;
  brushSize: number;
  brushColor: string;
  onScratch: (percentage: number) => void;
  children?: React.ReactNode;
}

const ScratchCardWithBrushColor =
  ScratchCard as React.ComponentType<ExtendedScratchCardProps>;

const ScratchCardComponent: React.FC<ScratchCardProps> = ({
  prize,
  onReveal,
  gameId,
  prizeId,
  userId,
  status,
  winnerId,
}) => {
  const [isRevealed, setIsRevealed] = useState(status === "SCRATCHED");
  const [scratchedPercentage, setScratchedPercentage] = useState(
    isRevealed ? 100 : 0
  );
  const [localStatus, setLocalStatus] = useState(status);

  const handleComplete = async () => {
    if (localStatus === "UNLOCKED" && userId === winnerId) {
      try {
        await scratchCard(gameId, prizeId);
        setIsRevealed(true);
        setLocalStatus("SCRATCHED");
        onReveal();
      } catch (error) {
        console.error("Error scratching card:", error);
      }
    }
  };

  const isWinner = userId === winnerId;
  const isScratchable = localStatus === "UNLOCKED" && isWinner;

  const getMessage = () => {
    if (localStatus === "LOCKED") return "Locked";
    if (localStatus === "UNLOCKED" && !isWinner)
      return "Waiting for winner to scratch";
    if (localStatus === "SCRATCHED" || (localStatus === "UNLOCKED" && isWinner))
      return `Prize: ${prize}`;
    return "Scratch to reveal!";
  };

  useEffect(() => {
    setLocalStatus(status);
    setIsRevealed(
      status === "SCRATCHED" || (status === "UNLOCKED" && isWinner)
    );
  }, [status, isWinner]);

  return (
    <div className="bg-pink-200 p-1 rounded-lg w-fit">
      <div className="relative w-[250px] h-[75px] rounded bg-pink-500">
        {isRevealed && localStatus === "UNLOCKED" && isWinner && (
          <Confetti width={250} height={75} />
        )}
        <ScratchCardWithBrushColor
          width={250}
          height={75}
          finishPercent={50}
          onComplete={handleComplete}
          image={
            isScratchable
              ? "https://st3.depositphotos.com/1022597/35608/i/450/depositphotos_356083076-stock-photo-grey-stone-texture-useful-background.jpg"
              : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
          }
          brushSize={15}
          brushColor={isScratchable ? "#808080" : "transparent"}
          onScratch={(percentage) => setScratchedPercentage(percentage)}
          prize={prize}
          onReveal={onReveal}
          gameId={gameId}
          prizeId={prizeId}
          userId={userId}
          status={localStatus}
          winnerId={winnerId}
        >
          <div className="flex items-center justify-center w-full h-full bg-purple-500 rounded-lg p-4">
            <div className="text-center">
              <p className="text-white text-xl font-bold">{getMessage()}</p>
            </div>
          </div>
        </ScratchCardWithBrushColor>
      </div>
    </div>
  );
};

export default ScratchCardComponent;
