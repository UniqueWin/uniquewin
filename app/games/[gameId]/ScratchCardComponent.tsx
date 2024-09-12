"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { ScratchCard } from "next-scratchcard";

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

const ScratchCardWithBrushColor =
  ScratchCard as React.ComponentType<ExtendedScratchCardProps>;

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

export default ScratchCardComponent;
