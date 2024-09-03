"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Trophy } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#7D0F23]">
      {/* Top Banner */}
      <div className="bg-pink-950 p-2 flex justify-between items-center text-white text-sm">
        <div className="flex items-center space-x-4">
          <Trophy className="text-yellow-400" />
          <div>Live jackpot £1,500</div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FFC700] text-black"
          >
            Play Now
          </Button>
        </div>
        <div className="flex items-center space-x-4 border-l border-white pl-4">
          <div className="flex items-center gap-2">
            <Bell className="mr-" />
            <div className="flex flex-col">
              <span className="font-semibold">
                You have <span className="text-yellow-400">10 credits</span>{" "}
                left.
              </span>
              <small className="text-xxs">Buy more credits</small>
            </div>
            <a href="#" className="text-xs ml-1 underline">
              Buy more credits
            </a>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FFC700] text-black"
          >
            Buy Credits
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="flex justify-start items-center gap-4 text-black">
          <div className="text-lg font-bold">Logo</div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How to Play
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Winners
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex space-x-4 items-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-pink-900 text-pink-900"
          >
            Login
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FF6B00] text-white"
          >
            Register
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mt-20 px-4">
        <h1 className="text-[#FFC700] text-5xl font-extrabold mb-6">
          Find a Unique Answer and WIN!
        </h1>
        <div className="bg-[#C0163D] inline-block py-4 px-10 rounded-full text-lg font-bold mb-8 text-white -rotate-3">
          Name a boss beginning with 'T':
        </div>

        <div className="flex justify-center mb-4">
          <Input placeholder="Type your answer here..." className="mr-2 w-64 bg-white py-5" />
          <Button
            variant="secondary"
            size="lg"
            className="bg-yellow-400 text-black font-semibold text-lg"
          >
            Answer!
          </Button>
        </div>
        <Button variant="outline" size="lg" className="text-white border-white">
          Lucky Dip
        </Button>
      </div>

      {/* 3 Ways to Win Section */}
      <div className="mt-20 text-center px-4 text-white">
        <h2 className="text-3xl font-bold mb-4">3 Ways to Win Big Prizes</h2>
        <p className="mb-10 max-w-2xl mx-auto">
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
