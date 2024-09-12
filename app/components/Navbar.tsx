"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Trophy } from "lucide-react";

const Navbar = () => {
  return (
    <>
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
    </>
  );
};

export default Navbar;