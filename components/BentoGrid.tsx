"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconTrophy, IconGift, IconUsers, IconHelp } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";
import NumberTicker from "@/components/ui/number-ticker";

export function BentoGridComponent() {
  return (
    <BentoGrid className="max-w-7xl mx-auto my-10 grid-cols-3 grid-rows-2 gap-4 h-[400px]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const PrizeItem = () => (
  <div className="flex flex-col items-center justify-center h-full text-white p-4 rounded-lg bg-pink-500 bg-gradient-to-b from-pink-500 to-pink-600">
    <IconTrophy className="h-24 w-24 mb-2 text-yellow-400" />
    <h2 className="text-3xl font-bold">
      £<NumberTicker value={10000} className="text-white" delay={0} />
    </h2>
    <p className="text-sm">given in prizes</p>
  </div>
);

const WinnerItem = () => (
  <div
    id="winneritem"
    className="flex items-center justify-between text-white rounded-lg relative bg-teal-300 bg-gradient-to-b from-teal-300 to-teal-500 h-full"
  >
    <Image
      src="/path/to/avatar.png"
      alt="Winner"
      width={50}
      height={50}
      className="rounded-full"
    />
    <div className="absolute bottom-0 left-0 -auto w-full bg-white bg-opacity-20 backdrop-blur-[2px] p-2 rounded text-purple-800">
      <div className="flex justify-between">
        <div className="flex flex-col text-left px-4 font-semibold">
          <p className="text- ">Wanna be a</p>
          <p className="text-">next winner?</p>
        </div>
        <Button className="bg-orange-400 bg-gradient-to-b from-orange-400 to-orange-500 text-white hover:bg-orange-500 hover:from-orange-500 hover:to-orange-700">
          Play Now
        </Button>
      </div>
    </div>
  </div>
);

const WinnersCountItem = () => (
  <div className="flex flex-col items-center justify-center h-full text-white p-4 rounded-lg bg-orange-400 bg-gradient-to-b from-orange-400 to-orange-600 h-2/3 w-full">
    <h2 className="text-4xl font-bold">
      <NumberTicker value={875} className="text-white" delay={0} />
    </h2>
    <p className="text-sm">Winners</p>
  </div>
);

const PlayersCountItem = () => (
  <div className="flex flex-col items-center justify-center h-full text-white p-4 rounded-lg bg-purple-500 bg-gradient-to-b from-purple-500 to-purple-700">
    <h2 className="text-4xl font-bold">
      <NumberTicker value={1200} className="text-white" delay={0} />
    </h2>
    <p className="text-sm">players</p>
  </div>
);

const HowToPlayItem = () => (
  <div className="flex items-center justify-between p-4 rounded-lg relative h-full w-full bg-gradient-to-b from-[#f5c299] to-[#f59999]">
    <div className="flex items-center">
      <Image
        src="/path/to/avatar1.png"
        alt="Player 1"
        width={40}
        height={40}
        className="rounded-full mr-2"
      />
      <Image
        src="/path/to/avatar2.png"
        alt="Player 2"
        width={40}
        height={40}
        className="rounded-full"
      />
    </div>
    <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-20 backdrop-blur-[2px] p-2 rounded text-purple-800 flex justify-between items-center px-4">
      <p className="font-bold">How to play?</p>
      <Button
        size="sm"
        className="bg-orange-400 bg-gradient-to-b from-orange-400 to-orange-500 text-white hover:bg-orange-500 hover:from-orange-500 hover:to-orange-700"
      >
        Read FAQ
      </Button>
    </div>
  </div>
);

const WinnersAndHowToPlayItem = () => (
  <div className="flex flex-col items-center justify-center h-full w-full gap-4">
    <WinnersCountItem />
    <HowToPlayItem />
  </div>
);

const items = [
  {
    title: "Prize Pool",
    description: null,
    header: <PrizeItem />,
    className: "col-span-1 row-span-2",
    icon: null,
  },
  {
    title: "Next Winner",
    description: null,
    header: <WinnerItem />,
    className: "col-span-1 row-span-1",
    icon: null,
  },
  {
    title: "Winners Count",
    description: null,
    header: <WinnersAndHowToPlayItem />,
    className: "col-span-1 row-span-2 gap-2",
    icon: null,
  },
  {
    title: "Players Count",
    description: null,
    header: <PlayersCountItem />,
    className: "col-span-1 row-span-1",
    icon: null,
  },
];
