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
    <BentoGrid className="px-4 md:mx-auto my-10 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-12 lg:h-[500px]">
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
  <div className="flex flex-col items-center justify-center h-full text-white p-4 rounded-3xl bg-gradient-radial from-[#e13bb1] to-[#c4016b] md:min-h-full h-[330px] lg:min-h-[500px] ">
    {/* <IconTrophy className="h-24 w-24 mb-2 text-yellow-400" /> */}
    <Image
      src="/trophy-icon.png"
      alt="Prize"
      width={158}
      height={163}
      className="mb-2"
    />
    <h2 className="text-4xl lg:text-8xl text-white font-bold">
      £<NumberTicker value={10000} className="text-white" delay={0} />
    </h2>
    <p className="text-4xl">given in prizes</p>
  </div>
);

const WinnerItem = () => (
  // 405x275
  <div className="relative w-full h-[260px] rounded-3xl overflow-hidden md:min-h-full max-h-[275px] lg:h-[275px]">
    {/* <Image src="/guy.png" alt="Winner" width={405} height={275} className="object-cover"/> */}
    <Image
      src="/guy.png"
      alt="Winner"
      layout="fill"
      objectFit="cover"
      quality={100}
      priority
      className="scale-[1.35]f object-cover"
    />

    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-50 backdrop-blur-[2px rounded-b-3xl lg:h-[85px]">
      <div className="flex justify-between items-center p-4">
        <div className="flex flex-col text-left px-4 font-bold text-[#420982] text-2xl leading-none">
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

const WinnersCountItem = () => (
  <div className="flex flex-col items-center justify-center text-white p-4 rounded-3xl h-full w-full bg-gradient-radial from-[#fbb304] via-[#fbb304] to-[#fb8c00]">
    <h2 className="text-8xl font-bold leading-none">
      <NumberTicker value={875} className="text-white leading-none" delay={0} />
    </h2>
    <p className="text-xl lg:text-4xl leading-none">Winners</p>
  </div>
);

const PlayersCountItem = () => (
  <div className="flex flex-col items-center justify-center text-white p-4 rounded-3xl w-full bg-gradient-radial from-purple-600 to-purple-800 leading-none h-[145px] md:h-full">
    <h2 className="text-4xl lg:text-[80px] font-bold leading-none">
      <NumberTicker value={1200} className="text-white" delay={0} />
    </h2>
    <p className="text-xl lg:text-4xl leading-none">players</p>
  </div>
);

const HowToItem = () => (
  // 405x275
  <div className="relative w-full h-[260px] rounded-3xl overflow-hidden md:min-h-full max-h-[275px] lg:h-[275px] ">
    {/* <Image src="/people.png" alt="Winner" width={405} height={263} /> */}
    <Image
      src="/people.png"
      alt="Winner"
      layout="fill"
      objectFit="cover"
      quality={100}
      priority
      className="scale-[1.35]f object-cover"
    />

    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-50 backdrop-blur-[2px] rounded-b-3xl lg:h-[85px]">
      <div className="flex justify-between items-center p-4">
        <div className="flex text-left px-4 font-bold text-[#420982] text-2xl leading-none">
          How to play?
        </div>
        <Button className="text-white bg-gradient-to-t from-[#f69808] to-[#fdc202] from-30% to-100% hover:from-[#f69708d9] hover:to-[#fec509] rounded-lg px-4 text-xl font-semibold">
          Read FAQ
        </Button>
      </div>
    </div>
  </div>
);

const WinnersAndHowToPlayItem = () => (
  <div className="flex flex-col h-full w-full gap-4 md:gap-7">
    <div className="h-full lg:h-[200px] md:h-1/3">
      <WinnersCountItem />
    </div>
    <div className="flex-gro h-ful w-full">
      <HowToItem />
    </div>
  </div>
);

const WinnerAndPlayersCountItem = () => (
  <div className="flex flex-col h-full w-full gap-4 md:gap-7">
    <div className="flex-gro h-ful w-full order-1 md:order-none">
      <WinnerItem />
    </div>
    <div className="h-full lg:h-[200px] md:h-1/3">
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
