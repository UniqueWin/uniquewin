import React from "react";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

type Props = {};

function About({}: Props) {
  return (
    <section className="container py-4 lg:py-20 xl:px-0 flex flex-col lg:flex-row lg:h-[400px] items-start justify-center max-w-7xl gap-10">
      <div className="w-full">
        <h4 className="text-sm lg:text-lg font-bold text-[#6b14cd]">
          About Our Games
        </h4>
        <h3 className="w-full h-full text-5xl lg:text-5xl font-bold text-black">
          About Our Games, <br /> Learn
          <span className="p-[0.5px] m-1 relative leading-normal whitespace-nowrap">
            <div className="rotate-[-2deg] absolute inset-0 w-full h-full bg-[#f79e07]"></div>
            <span className="relative z-10 text-white">How To Play</span>
          </span>
        </h3>
      </div>

      <div className="flex flex-col justify-center w-full">
        <p className="text-black text-lg leading-relaxed">
          Unleash your creativity and stand a chance to win exclusive prizes by
          providing a one-of-a-kind answer. Unleash your creativity and stand a
          chance to win exclusive prizes by providing a one-of-a-kind answer.
          Unleash your creativity and stand a chance to win exclusive prizes by
          providing a one-of-a-kind answer. Unleash your creativity and stand a
          chance to win exclusive prizes.
        </p>
        <div className="flex flex-col lg:flex-row gap-2 my-2 w-full">
          <a href="/games">
            <Button
              size="sm"
              className="text-white lg:text-2xl font-bold bg-gradient-to-t from-[#347158] to-[#58e364] from-30% to-100% hover:from-[#214838] hover:to-[#41a84a] rounded-xl px-4 w-full lg:w-[175px] lg:h-[55px]"
            >
              Get started
            </Button>
          </a>
          <Button
            variant="ghost"
            className="text-purple-800 lg:text-2xl font-bold hover:bg-transparent hover:underline hover:text-purple-900 w-full lg:w-[175px] lg:h-[55px]"
          >
            <a href="/faq" className="flex items-center">
              FAQs <ChevronRight className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default About;
