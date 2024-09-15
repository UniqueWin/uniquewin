"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { ScratchCard } from "next-scratchcard";

// Define our own interface for ScratchCard props
interface ScratchCardProps {
  prize: string | number;
  onReveal: () => void;
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
  children?: React.ReactNode; // Add this line
}

const ScratchCardWithBrushColor =
  ScratchCard as React.ComponentType<ExtendedScratchCardProps>;

const ScratchCardComponent: React.FC<ScratchCardProps> = ({ prize, onReveal }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const handleComplete = () => {
    setIsRevealed(true);
    onReveal();

    setTimeout(() => {
      setIsRevealed(false);
    }, 5000);
  };

  return (
    <div className="bg-pink-200 p-1 rounded-lg w-fit">
      <div
        className={`relative w-[250px] h-[75px] rounded bg-pink-500
      ${isClicked ? "cursor-pointer" : "cursor-default"}`}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
      >
        {isRevealed && <Confetti width={250} height={75} />}
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
          prize={prize}
          onReveal={onReveal}
        >
          <div className="flex items-center justify-center w-full h-full bg-purple-500 rounded-lg p-4 ">
            <div className="text-center">
              <p className="text-white text-2xl font-bold">YOU WIN</p>
              <p
                className={`text-white font-bold ${
                  typeof prize === 'string' && prize.includes("£") ? "text-green-500" : "text-xl"
                }`}
              >
                {prize}
              </p>
            </div>
          </div>
        </ScratchCardWithBrushColor>
      </div>
    </div>
  );
};

export default ScratchCardComponent;
