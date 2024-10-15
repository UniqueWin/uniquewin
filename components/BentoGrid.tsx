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
    <BentoGrid className="max-w-7xl mx-auto my-10 grid-cols-3 grid-rows-2 gap-8 h-[500px]">
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
  <div className="flex flex-col items-center justify-center h-full text-white p-4 rounded-3xl bg-gradient-radial from-[#e13bb1] to-[#c4016b]">
    <IconTrophy className="h-24 w-24 mb-2 text-yellow-400" />
    <h2 className="text-7xl font-bold">
      £<NumberTicker value={10000} className="text-white" delay={0} />
    </h2>
    <p className="text-2xl">given in prizes</p>
  </div>
);

const WinnerItem = () => (
  <div className="relative w-full h-full rounded-3xl overflow-hidden">
    <Image
      src="/guy.png"
      alt="Winner"
      layout="fill"
      objectFit="cover"
      quality={100}
      priority
      className="scale-[1.35] object-cover"
    />

    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-20 backdrop-blur-[2px] p-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-left px-4 font-semibold text-purple-800">
          <p>Wanna be a</p>
          <p>next winner?</p>
        </div>
        <Button className="text-white bg-gradient-to-t from-[#f69808] to-[#fdc202] from-30% to-100% hover:from-[#f69708d9] hover:to-[#fec509] rounded-lg px-4 text-xl font-semibold">
          Register
        </Button>
      </div>
    </div>
  </div>
);

const HowToItem = () => (
  <div className="relative w-full h-full rounded-3xl overflow-hidden">
    <Image
      src="/players.png"
      alt="Winner"
      layout="fill"
      objectFit="cover"
      quality={100}
      priority
      className="scale-[1.35] object-cover"
    />

    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-20 backdrop-blur-[2px] p-2">
      <div className="flex justify-between items-center text-left px-4">
        <div className="flex justify-center items-center font-bold text-purple-800">
          How to play?
        </div>
        <Button
          size="sm"
          className="text-white bg-gradient-to-t from-[#f69808] to-[#fdc202] from-30% to-100% hover:from-[#f69708d9] hover:to-[#fec509] rounded-lg px-4 text-xl font-semibold"
        >
          Read FAQ
        </Button>
      </div>
    </div>
  </div>
);

const WinnersCountItem = () => (
  <div className="flex flex-col items-center justify-center text-white p-4 rounded-3xl h-full w-full bg-gradient-radial from-[#fbb304] via-[#fbb304] to-[#fb8c00]">
    <h2 className="text-7xl font-bold">
      <NumberTicker value={875} className="text-white" delay={0} />
    </h2>
    <p className="text-2xl">Winners</p>
  </div>
);

const PlayersCountItem = () => (
  <div className="flex flex-col items-center justify-center text-white p-4 rounded-3xl h-full w-full bg-gradient-radial from-purple-600 to-purple-800">
    <h2 className="text-7xl font-bold">
      <NumberTicker value={1200} className="text-white" delay={0} />
    </h2>
    <p className="text-2xl">players</p>
  </div>
);

const HowToPlayItem = () => (
  //radial gradient
  //#d0c8c1 center
  //#cfc9be outer
  <div className="flex items-center justify-between p-4 rounded-2xl relative h-full w-full bg-gradient-radial from-[#d0c8c1] to-[#bbb6ac]">
    <div className="flex items-center"></div>
    <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-20 backdrop-blur-[1px p-2 rounded-b-xl text-purple-800 flex justify-between items-center px-4">
      <p className="font-bold">How to play?</p>
      <Button
        size="sm"
        className="bg-orange-400 bg-gradient-to-b from-orange-400 to-orange-500 text-white hover:bg-orange-500 hover:from-orange-400 hover:to-orange-700"
      >
        Read FAQ
      </Button>
    </div>
  </div>
);

const WinnersAndHowToPlayItem = () => (
  <div className="flex flex-col h-full w-full">
    <div className="h-1/3 mb-4">
      <WinnersCountItem />
    </div>
    <div className="flex-grow">
      <HowToItem />
    </div>
  </div>
);

const WinnerAndPlayersCountItem = () => (
  <div className="flex flex-col h-full w-full">
    <div className="flex-grow">
      <WinnerItem />
    </div>
    <div className="h-1/3 mt-4">
      <PlayersCountItem />
    </div>
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
    title: "Winners & Players Count",
    description: null,
    header: <WinnerAndPlayersCountItem />,
    className: "col-span-1 row-span-2 gap-2",
    icon: null,
  },
  {
    title: "Winners Count",
    description: null,
    header: <WinnersAndHowToPlayItem />,
    className: "col-span-1 row-span-2 gap-2",
    icon: null,
  },
];
