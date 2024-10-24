"use client";
import "./flipboard.css";

import React, { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { Game } from "@/utils/dataHelpers";
import Image from "next/image";

const FlipDigit = ({ digit }: { digit: string }) => {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    setFlip(true);
    const timer = setTimeout(() => setFlip(false), 500);
    return () => clearTimeout(timer);
  }, [digit]);

  return (
    <div className="flip-digit">
      <div className={`top ${flip ? "flip-top" : ""}`}>{digit}</div>
      <div className={`bottom ${flip ? "flip-bottom" : ""}`}>{digit}</div>
    </div>
  );
};

export default function FlipboardTimer({
  game,
  showTitle,
  mobile = false,
}: {
  game: Game;
  showTitle: boolean;
  mobile: boolean;
}) {
  // const [time, setTime] = useState("23:55:13");
  //get time until game end
  const endTime = new Date(game.end_time);
  const currentTime = new Date();
  const timeUntilEnd = endTime.getTime() - currentTime.getTime();
  const hours = Math.floor(timeUntilEnd / (1000 * 60 * 60)) - 1; // Subtract 1 hour
  const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000);

  const [time, setTime] = useState(
    `${String(Math.max(0, hours)).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const [hours, minutes, seconds] = prevTime.split(":").map(Number);
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          clearInterval(timer);
          return "00:00:00";
        }

        return `${String(newHours).padStart(2, "0")}:${String(
          newMinutes
        ).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (mobile) {
    return (
      <div className="text-white flex justify-start items-center w-full max-w-[170px]">
        <span className="text-sm w-full">Next Game in:</span>
        <div className="flex justify-center items-start font-bold tracking-widest w-full">
          {time.split("").map((digit, index) =>
            digit === ":" ? (
              <span key={index} className="mx-">
                :
              </span>
            ) : (
              <div className="flex flex-col items-center" key={index}>
                {digit}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-white bg-black/40 p-[0.5] rounded relative">
      <div className="absolute -top-2 left-5 w-full h-full">
        <Image src="/watch.png" alt="watch" width={21} height={23} />
      </div>
      <div className="flex items-center justify-center mbf-4">
        {/* <Timer className="w-6 h-6 mr-2" /> */}
        {showTitle && <h2 className="text-xs font-bold">GAME ENDS IN</h2>}
      </div>
      <div className="flex justify-center items-center font-bold">
        {time.split("").map((digit, index) =>
          digit === ":" ? (
            <span key={index} className="mx-">
              :
            </span>
          ) : (
            <div className="flex flex-col items-center text-[20px]" key={index}>
              <FlipDigit key={index} digit={digit} />
            </div>
          )
        )}
      </div>
      <div className="grid grid-cols-3 w-full">
        <span className="text-[10px] text-center">HOURS</span>
        <span className="text-[10px] text-center">MINUTES</span>
        <span className="text-[10px] text-center">SECONDS</span>
      </div>
    </div>
  );
}
