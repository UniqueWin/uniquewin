"use client";

import React, { useState, useEffect } from "react";
import { Disc } from "lucide-react";

const prizes = [
  { name: "$100 Cash", color: "#FF6B6B", icon: "💰" },
  { name: "$50 Credit", color: "#4ECDC4", icon: "🛍️" },
  { name: "$25 Gift", color: "#45B7D1", icon: "🎁" },
  { name: "$200 Cash", color: "#FFA07A", icon: "💰" },
  { name: "Mystery", color: "#9B59B6", icon: "❓" },
  { name: "$75 Credit", color: "#58D68D", icon: "🛍️" },
  { name: "$150 Cash", color: "#F1C40F", icon: "💰" },
  { name: "$40 Gift", color: "#E74C3C", icon: "🎁" },
];

const WheelOfFortune = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<null | { name: string; color: string; icon: string }>(null);
  const [lights, setLights] = useState(Array(20).fill(false));

  useEffect(() => {
    const interval = setInterval(() => {
      setLights((prev) => prev.map(() => Math.random() > 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setWinner(null);
      const spinDuration = 5000 + Math.random() * 2000; // 5-7 seconds
      const totalRotation = 1440 + Math.random() * 1440; // 4-8 full rotations
      const finalRotation = totalRotation + (360 / prizes.length) * Math.floor(Math.random() * prizes.length);

      const startTime = Date.now();
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < spinDuration) {
          const progress = elapsedTime / spinDuration;
          const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
          setRotation(easeOut * finalRotation);
          requestAnimationFrame(animate);
        } else {
          setRotation(finalRotation);
          setIsSpinning(false);
          const winningIndex = prizes.length - 1 - Math.floor((finalRotation % 360) / (360 / prizes.length));
          setWinner(prizes[winningIndex]);
        }
      };
      requestAnimationFrame(animate);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white p-8">
      <div className="relative w-96 h-96 mb-8 z-10">
        {/* Wheel */}
        <div
          className="absolute w-full h-full rounded-full border-8 border-yellow-400 transition-transform duration-5000 ease-out shadow-lg"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${index * (360 / prizes.length)}deg)`,
                transformOrigin: "50% 50%",
              }}
            >
              <div
                className="absolute top-0 left-1/2 w-1 h-1/2"
                style={{
                  background: prize.color,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              ></div>
              <div
                className="absolute top-12 left-1/2 transform -translate-x-1/2 text-sm font-bold w-24 text-center"
                style={{
                  transform: `rotate(${90 + 360 / prizes.length / 2}deg)`,
                }}
              >
                {prize.icon}
                <br />
                {prize.name}
              </div>
            </div>
          ))}
          
          {/* Colored lights */}
          {lights.map((on, index) => (
            <div
              key={index}
              className={`absolute w-4 h-4 rounded-full transition-all duration-300 z-10 ${
                on ? "scale-110 opacity-100" : "scale-90 opacity-50"
              }`}
              style={{
                background: `rgb(${Math.random() * 255},${Math.random() * 255},${
                  Math.random() * 255
                })`,
                top: `${50 - 49 * Math.cos((index * Math.PI) / 10)}%`,
                left: `${50 + 49 * Math.sin((index * Math.PI) / 10)}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: on ? "0 0 10px 2px currentColor" : "none",
              }}
            ></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Disc className="text-yellow-400 w-16 h-16 drop-shadow-lg" />
        </div>
      </div>

      {/* Stand */}
      <div className="w-64 h-64 -mt-32 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-t-full relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-400"></div>
        <div className="absolute bottom-0 w-full h-12 bg-yellow-900"></div>
      </div>

      <button
        className="mt-8 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-full font-bold text-xl hover:from-yellow-300 hover:to-yellow-500 transition-all transform hover:scale-105 shadow-lg"
        onClick={spinWheel}
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "SPIN!"}
      </button>

      {winner && (
        <div className="mt-6 text-center animate-bounce">
          <h2 className="text-3xl font-bold text-yellow-400">You won:</h2>
          <p className="text-4xl font-bold text-white mt-2">
            {winner.icon} {winner.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default WheelOfFortune;
