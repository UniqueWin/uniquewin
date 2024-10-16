"use client";
import "./flipboard.css";

import React, { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { Game } from "@/utils/dataHelpers";

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
              <div className="flex flex-col items-center">{digit}</div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <div className="flex items-center justify-center mbf-4">
        {/* <Timer className="w-6 h-6 mr-2" /> */}
        {showTitle && <h2 className="text-xl font-bold">GAME ENDS IN</h2>}
      </div>
      <div className="flex justify-center items-center text-3xl font-bold">
        {time.split("").map((digit, index) =>
          digit === ":" ? (
            <span key={index} className="mx-">
              :
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <FlipDigit key={index} digit={digit} />
            </div>
          )
        )}
      </div>
      <div className="flex gap-2 w-full">
        <small className="text-xs">HOURS</small>
        <small className="text-xs">MINUTES</small>
        <small className="text-xs">SECONDS</small>
      </div>
    </div>
  );
}
