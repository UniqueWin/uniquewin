"use client";

import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { Game } from "@/utils/dataHelpers";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const supabase = createClient();

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
      const { data: currentGameData, error: currentGameError } = await supabase
        .from("games")
        .select("*")
        .eq("status", "active")
        .single();

      if (currentGameError) {
        console.error("Error fetching current game:", currentGameError);
      } else {
        setCurrentGame(currentGameData);
      }

      const { data: pastGamesData, error: pastGamesError } = await supabase
        .from("games")
        .select("*")
        .neq("status", "active")
        .limit(5);

      if (pastGamesError) {
        console.error("Error fetching past games:", pastGamesError);
      } else {
        setPastGames(pastGamesData);
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
    const checkAndCleanup = async () => {
      try {
        const { data: lastCleanup, error: cleanupError } = await supabase
          .from("last_cleanup")
          .select("last_run")
          .single();

        if (cleanupError) throw cleanupError;

        const lastRun = new Date(lastCleanup?.last_run || 0);
        const now = new Date();
        const minutesSinceLastRun =
          (now.getTime() - lastRun.getTime()) / (1000 * 60);

        if (minutesSinceLastRun >= 5) {
          const response = await fetch("/api/close-expired-games", {
            method: "GET",
          });
          if (!response.ok) {
            throw new Error("Failed to trigger cleanup");
          }
          console.log("Cleanup triggered successfully");
        }
      } catch (error) {
        console.error("Error checking or triggering cleanup:", error);
      }
    };

    // Run immediately on component mount
    checkAndCleanup();

    // Set up interval to run every 5 minutes
    const intervalId = setInterval(checkAndCleanup, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#7f102c] max-w-7xl mx-auto">
      <div className="text-center mt-20 px-4">
        <h1 className="text-[#FFC700] text-5xl font-extrabold mb-6">
          Find a Unique Answer and WIN!
        </h1>
        {currentGame && (
          <div className="flex justify-center mb-4">
            <TextRevealCard
              text={currentGame.question}
              revealText={`Jackpot: £${currentGame.current_prize}`}
              className="-rotate-3"
            />
          </div>
        )}

        <div className="flex justify-center mb-4">
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
            <div className="flex items-center justify-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-white">Lucky Dip</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Ways to Win Section */}
      <div className="mt-20 text-center px-4 text-black bg-white py-20">
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
              Unleash your creativity and stand a chance to win exclusive prizes
              by providing a one-of-a-kind answer.
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
              Get rewarded instantly with exciting prizes just by participating
              in our engaging contests.
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
      <div className="mt-20 text-center px-4 text-white">
        <h2 className="text-3xl font-bold mb-4">Past Games</h2>
        <ul className="space-y-2">
          {pastGames.map((game) => (
            <li key={game.id} className="bg-[#C0163D] p-4 rounded-lg">
              <h3 className="font-bold">{game.question}</h3>
              <p>Jackpot: £{game.current_prize}</p>
              <p>Ended: {new Date(game.end_time).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
