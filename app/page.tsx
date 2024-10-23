"use client";

import { Game } from "@/utils/dataHelpers";
import { createClient } from "@/utils/supabase/client";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import About from "@/components/About";
import Banner from "@/components/Banner";
import { BentoGridComponent } from "@/components/BentoGrid";
import Hero from "@/components/Hero";
import HeroBG from "@/components/HeroBG";
import LiveIndicator from "@/components/LiveIndicator";
import WaysToWin2 from "@/components/WaysToWin2";
import Features from "@/components/Features";
import SignUpBanner from "@/components/SignUpBanner";
import { Button } from "@/components/ui/button";
import Reviews from "@/components/Reviews";

const supabase = createClient();

export default function Home() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [pastGames, setPastGames] = useState<Game[]>([]);
  const [flashingIndex, setFlashingIndex] = useState(0); // New state for flashing index
  const [reverseFlashingIndex, setReverseFlashingIndex] = useState(29); // New state for reverse flashing index
  const [rollResult, setRollResult] = useState<number | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data: currentGameData, error: currentGameError } =
          await supabase
            .from("games")
            .select("*")
            .eq("status", "active")
            .single();

        if (currentGameError) {
          console.error("Error fetching current game:", currentGameError);
          setCurrentGame(null);
        } else {
          setCurrentGame(currentGameData || null);
        }

        const { data: pastGamesData, error: pastGamesError } = await supabase
          .from("games")
          .select("*")
          .neq("status", "active")
          .limit(5);

        if (pastGamesError) {
          console.error("Error fetching past games:", pastGamesError);
          setPastGames([]);
        } else {
          setPastGames(pastGamesData || []);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashingIndex((prevIndex) => (prevIndex + 1) % 30); // Update index in a loop
      setReverseFlashingIndex((prevIndex) => (prevIndex - 1 + 30) % 30); // Update reverse index in a loop
    }, 500); // Adjust the timing as needed

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isChecking = false;

    const checkAndCleanup = async () => {
      if (isChecking) return;
      isChecking = true;

      try {
        const { data: lastCleanup, error: cleanupError } = await supabase
          .from("last_cleanup")
          .select("last_run")
          .eq("id", 1)
          .single();

        console.log({ lastCleanup, cleanupError });

        if (cleanupError) throw cleanupError;

        const lastRunString = lastCleanup?.last_run;

        // Parse the date string directly, as it's already in ISO 8601 format
        const lastRun = lastRunString ? new Date(lastRunString) : new Date(0);
        const now = new Date();

        // Format both dates to UK time strings for comparison and logging
        const ukTimeFormatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        const lastRunUK = ukTimeFormatter.format(lastRun);
        const nowUK = ukTimeFormatter.format(now);

        const minutesSinceLastRun =
          (now.getTime() - lastRun.getTime()) / (1000 * 60);

        console.log(`Last cleanup run (UK): ${lastRunUK}`);
        console.log(`Current time (UK): ${nowUK}`);
        console.log(
          `Minutes since last run: ${minutesSinceLastRun.toFixed(2)}`
        );

        if (minutesSinceLastRun >= 1) {
          console.log("Triggering cleanup...");
          const response = await fetch("/api/process-ended-games", {
            method: "POST",
          });
          if (!response.ok) {
            throw new Error("Failed to trigger cleanup");
          }
          const result = await response.json();
          console.log("Cleanup result:", result);
        } else {
          console.log("Cleanup not needed yet");
        }
      } catch (error) {
        console.error("Error checking or triggering cleanup:", error);
      } finally {
        isChecking = false;
      }
    };

    // Run immediately on component mount
    checkAndCleanup();

    // Set up interval to run every 5 minutes
    const intervalId = setInterval(checkAndCleanup, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#4B0082] flex flex-col">
      <HeroBG />
      <LiveIndicator currentGame={currentGame} />
      <Hero />

      {/* The rest of your content */}
      <div className="flex-grow bg-white">
        <WaysToWin2 />

        <About />

        <BentoGridComponent />

        <Features />

        <Banner />

        <Reviews />
      </div>
    </div>
  );
}
