"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Trophy } from "lucide-react";
import Image from "next/image";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";

export default function Home() {
  const placeholders = [
    {
      question: "Name a boys name beginning with 'T':",
      answers: ["Thomas", "Timothy", "Toby", "Tyler"],
    },
    {
      question: "Name a fruit beginning with 'P':",
      answers: ["Pear", "Pineapple", "Peach", "Plum"],
    },
    {
      question: "What's a common household pet?",
      answers: ["Dog", "Cat", "Fish", "Hamster"],
    },
    {
      question: "Name a country in South America:",
      answers: ["Brazil", "Argentina", "Peru", "Colombia"],
    },
    {
      question: "What's a popular board game?",
      answers: ["Monopoly", "Scrabble", "Chess", "Cluedo"],
    },
    {
      question: "Name a famous scientist:",
      answers: ["Einstein", "Newton", "Darwin", "Curie"],
    },
    {
      question: "What's a common breakfast food?",
      answers: ["Cereal", "Toast", "Eggs", "Pancakes"],
    },
    {
      question: "Name a primary color:",
      answers: ["Red", "Blue", "Yellow"],
    },
  ];
  const randomPlaceholder =
    placeholders[Math.floor(Math.random() * placeholders.length)];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="min-h-screen bg-[#7f102c] max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="text-center mt-20 px-4">
        <h1 className="text-[#FFC700] text-5xl font-extrabold mb-6">
          Find a Unique Answer and WIN!
        </h1>
        <div className="flex justify-center mb-4">
          <TextRevealCard
            text={randomPlaceholder.question}
            revealText={randomPlaceholder.answers[0]}
            className="-rotate-3"
          />
        </div>
        {/* <div className="bg-[#C0163D] inline-block py-4 px-10 rounded-full text-lg font-bold mb-8 text-white -rotate-3">
          Name a boys name beginning with 'T':
        </div> */}

        <div className="flex justify-center mb-4">
          {/* <Input
            placeholder="Type your answer here..."
            className="mr-2 w-64 bg-white py-5"
          /> */}
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
    </div>
  );
}
