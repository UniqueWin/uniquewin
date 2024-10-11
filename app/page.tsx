"use client";

import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { Game } from "@/utils/dataHelpers";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Clover } from "lucide-react";
import CustomSwitch from "@/components/CustomSwitch"; // Import the custom switch
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Dynamically import the DiceRollAnimation component
const DiceRollAnimation = dynamic(
  () => import("@/components/DiceRollAnimation"),
  {
    ssr: false,
  }
);

const supabase = createClient();

export default function Home() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [pastGames, setPastGames] = useState<Game[]>([]);
  const placeholders = [
    {
      question: "Name a boys name beginning with 'T':",
      answers: ["Thomas", "Timothy", "Toby", "Tyler"],
    },
    {
      question: "Name a girls name beginning with 'A':",
      answers: ["Ava", "Amelia", "Aria", "Aurora"],
    },
    {
      question: "Name a country beginning with 'S':",
      answers: ["Spain", "Sweden", "Switzerland", "Sri Lanka"],
    },
    {
      question: "Name a city beginning with 'L':",
      answers: ["London", "Los Angeles", "Lisbon", "Lima"],
    },
    {
      question: "Name a fruit beginning with 'B':",
      answers: ["Banana", "Blueberry", "Blackberry", "Berry"],
    },
    {
      question: "Name a vegetable beginning with 'C':",
      answers: ["Carrot", "Cucumber", "Cabbage", "Celery"],
    },
    {
      question: "Name a color beginning with 'R':",
      answers: ["Red", "Rose", "Ruby", "Rust"],
    },
    {
      question: "Name a flower beginning with 'D':",
      answers: ["Daisy", "Daffodil", "Dahlia", "Dandelion"],
    },
    {
      question: "Name a bird beginning with 'E':",
      answers: ["Eagle", "Emu", "Eagle", "Eagle"],
    },
    {
      question: "Name a mammal beginning with 'F':",
      answers: ["Fox", "Frog", "Falcon", "Falcon"],
    },
    {
      question: "Name a reptile beginning with 'G':",
      answers: ["Gecko", "Gecko", "Gecko", "Gecko"],
    },
    {
      question: "Name a fish beginning with 'H':",
      answers: ["Herring", "Herring", "Herring", "Herring"],
    },
    {
      question: "Name a insect beginning with 'I':",
      answers: ["Iguana", "Iguana", "Iguana", "Iguana"],
    },
    {
      question: "Name a amphibian beginning with 'J':",
      answers: ["Jaguar", "Jaguar", "Jaguar", "Jaguar"],
    },
    {
      question: "Name a animal beginning with 'K':",
      answers: ["Kangaroo", "Kangaroo", "Kangaroo", "Kangaroo"],
    },
    {
      question: "Name a animal beginning with 'L':",
      answers: ["Lion", "Lion", "Lion", "Lion"],
    },
    {
      question: "Name a animal beginning with 'M':",
      answers: ["Monkey", "Monkey", "Monkey", "Monkey"],
    },
    {
      question: "Name a animal beginning with 'N':",
      answers: ["Narwhal", "Narwhal", "Narwhal", "Narwhal"],
    },
    {
      question: "Name a animal beginning with 'O':",
      answers: ["Owl", "Owl", "Owl", "Owl"],
    },
    {
      question: "Name a animal beginning with 'P':",
      answers: ["Penguin", "Penguin", "Penguin", "Penguin"],
    },
    {
      question: "Name a animal beginning with 'Q':",
      answers: ["Quokka", "Quokka", "Quokka", "Quokka"],
    },
    {
      question: "Name a animal beginning with 'R':",
      answers: ["Raccoon", "Raccoon", "Raccoon", "Raccoon"],
    },
    {
      question: "Name a animal beginning with 'S':",
      answers: ["Snake", "Snake", "Snake", "Snake"],
    },
    {
      question: "Name a animal beginning with 'T':",
      answers: ["Turtle", "Turtle", "Turtle", "Turtle"],
    },
    {
      question: "Name a animal beginning with 'U':",
      answers: ["Uakari", "Uakari", "Uakari", "Uakari"],
    },
    {
      question: "Name a animal beginning with 'V':",
      answers: ["Vulture", "Vulture", "Vulture", "Vulture"],
    },
    {
      question: "Name a animal beginning with 'W':",
      answers: ["Walrus", "Walrus", "Walrus", "Walrus"],
    },
    {
      question: "Name a animal beginning with 'X':",
      answers: ["Xenops", "Xenops", "Xenops", "Xenops"],
    },
    {
      question: "Name a animal beginning with 'Y':",
      answers: ["Yak", "Yak", "Yak", "Yak"],
    },
    {
      question: "Name a animal beginning with 'Z':",
      answers: ["Zebra", "Zebra", "Zebra", "Zebra"],
    },
  ];
  const randomPlaceholder =
    placeholders[Math.floor(Math.random() * placeholders.length)];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

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
      <div className="absolute top-10 right-20 z-50 select-none">
        <div
          className={cn(
            "inline-flex items-center rounded-full bg-zinc-900 bg-opacity-50 px-2 py-1 text-xs font-medium text-white"
          )}
        >
          <span className="mr-1 h-3 w-3 rounded-full bg-emerald-400 border-white border " />
          LIVE
        </div>
      </div>
      <div className="h-[87vh] relative overflow-hidden">
        <div className="absolute inset-[-100%]">
          <div
            className="
              [--aurora:repeating-conic-gradient(from_0deg_at_50%_50%,#4B0082_0deg_10deg,rgba(255,255,255,0.1)_10deg_20deg)]
              [background-image:var(--aurora)]
              absolute inset-0
              animate-spin-slow
              filter blur
            "
          ></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(75,0,130,0.3)_50%,rgba(75,0,130,0.7)_100%)]"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center pt-20 px-4 overflow-y-auto">
          <h1 className="text-9xl text-center font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-[#c8b58c] to-[#f5d983] w-2/3 leading-[0.75] stroke-black stroke-1">
            Find a Unique <span className="text-[160px]">Answer</span> and{" "}
            <span className="text-[160px]">WIN!</span>
          </h1>
          {currentGame ? (
            <div className="flex justify-center mb-4">
              <TextRevealCard
                text={currentGame.question}
                revealText={`Jackpot: £${
                  currentGame.current_prize ?? currentGame.jackpot
                }`}
                className="-rotate-3"
              />
            </div>
          ) : (
            <div className="text-white mb-4 bg-black bg-opacity-20 p-4 px-10 rounded-[30px] border2 border-white border-opacity-40">
              {/* <div className="flex gap-2">
                {Array.from({ length: 30 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 bg-yellow-300 rounded-full blur-[1.5px] animate-pulse duration-1000"
                  ></div>
                ))}
              </div> */}
              <div className="py-4 flex flex-col gap-2 items-center">
                <h2 className="text-3xl font-bold">
                  Name the boss name beginning with 'T':
                </h2>
                <CustomSwitch
                  label="Lucky Dip"
                  onChange={(checked) => console.log("Switch is now:", checked)}
                />
                <div className="flex gap-2 w-full justify-center items-center">
                  {/* <Input
                    type="text"
                    placeholder="Type your answer here..."
                    className="bg-white border-2 border-white border-opacity-40 rounded-lg p-6 text-xl font-bold text-white w-full"
                  /> */}
                  <PlaceholdersAndVanishInput
                    placeholders={placeholders.map(
                      (placeholder) => placeholder.question
                    )}
                    onChange={handleChange}
                    onSubmit={onSubmit}
                    // className="w-full bg-whfite border-2 border-white border-opacity-40 rounded-lg p-6 text-xl font-bold text-black"
                    className="w-96 rounded-lg px-0"
                  />
                  <Button
                    variant="secondary"
                    size="lg"
                    className="text-white font-semibold text-xl h-12 bg-gradient-to-t from-[#347158] to-[#58e364] from-30% to-100% w-28"
                  >
                    Answer!
                  </Button>
                </div>
              </div>
              {/* <div className="flex gap-2">
                {Array.from({ length: 30 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 bg-yellow-300 rounded-full blur-[1.5px] animate-pulse duration-1000"
                  ></div>
                ))}
              </div> */}
            </div>
          )}
          <p className="text-white">Cost £1 to play £5 lucky dip</p>
          {/* <p className="text-white mb-4">
              No active games at the moment. Check back soon!
            </p> */}

          {/* <div className="flex justify-center mb-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholders.map(
                (placeholder) => placeholder.question
              )}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="lg"
                className="bg-yellow-400 text-black font-semibold text-lg"
              >
                Answer!
              </Button>
              <CustomSwitch
                label="Lucky Dip"
                onChange={(checked) => console.log("Switch is now:", checked)}
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* The rest of your content */}
      <div className="flex-grow bg-white">
        {/* 3 Ways to Win Section */}
        <div className="text-center px-4 text-black py-20">
          <small className="text-xs">Discover</small>
          <h2 className="text-3xl font-bold mb-4 text-pink-800 py-5">
            3 Ways to Win Big Prizes
          </h2>
          <p className="mb-10 max-w-lgo mx-auto">
            Explore our exciting opportunities to win unique prizes, instant
            rewards, and participate in live raffles.
          </p>

          <div className="flex justify-center space-x-8">
            {/* Card 1 */}
            <div className="w-72 p-6 rounded-lg bg-white text-black">
              <Image
                src="/unique-answer-icon.png"
                alt="Unique Answer"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="font-bold text-xl mb-2">Find a Unique Answer</h3>
              <p>
                Unleash your creativity and stand a chance to win exclusive
                prizes by providing a one-of-a-kind answer.
              </p>
            </div>

            {/* Card 2 */}
            <div className="w-72 p-6 rounded-lg bg-white text-black">
              <Image
                src="/instant-prizes-icon.png"
                alt="Instant Prizes"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="font-bold text-xl mb-2">Instant Prizes</h3>
              <p>
                Get rewarded instantly with exciting prizes just by
                participating in our engaging contests.
              </p>
            </div>

            {/* Card 3 */}
            <div className="w-72 p-6 rounded-lg bg-white text-black">
              <Image
                src="/live-raffle-icon.png"
                alt="Live Raffle"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="font-bold text-xl mb-2">Live Raffle</h3>
              <p>
                Experience the thrill of our live raffles and stand a chance to
                win big prizes in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Past Games Section */}
        <div className="text-center px-4 text-white bg-[#4B0082] py-20">
          <h2 className="text-3xl font-bold mb-4">Past Games</h2>
          <ul className="space-y-2">
            {pastGames.map((game) => (
              <li key={game.id} className="bg-[#C0163D] p-4 rounded-lg">
                <h3 className="font-bold">{game.question}</h3>
                <p>Jackpot: £{game.current_prize ?? game.jackpot}</p>
                <p>Ended: {new Date(game.end_time).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Dice Roll Animation */}
        <div className="text-center bg-[#4B0082] py-20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Bonus Game Preview: Dice Roll
          </h2>
          <div className="flex justify-center">
            <DiceRollAnimation
              onRollComplete={(result) =>
                console.log(`Dice roll result: ${result}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
