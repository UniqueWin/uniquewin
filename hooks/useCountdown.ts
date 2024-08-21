"use client";

import { useState, useEffect } from "react";

export function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("ENDED");
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
}
