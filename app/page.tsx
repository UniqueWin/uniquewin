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
import { ChevronRight, Clover, Star, Circle } from "lucide-react";
import CustomSwitch from "@/components/CustomSwitch"; // Import the custom switch
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// import DiceRollAnimation from "./components/DiceRollAnimation"; // Import the animation component
import DiceRoll from "./components/DiceRoll";
import { BentoGridComponent } from "@/components/BentoGrid";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import Link from "next/link";

const supabase = createClient();

export default function Home() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [pastGames, setPastGames] = useState<Game[]>([]);
  const [flashingIndex, setFlashingIndex] = useState(0); // New state for flashing index
  const [reverseFlashingIndex, setReverseFlashingIndex] = useState(29); // New state for reverse flashing index
  const [rollResult, setRollResult] = useState<number | null>(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashingIndex((prevIndex) => (prevIndex + 1) % 30); // Update index in a loop
      setReverseFlashingIndex((prevIndex) => (prevIndex - 1 + 30) % 30); // Update reverse index in a loop
    }, 500); // Adjust the timing as needed

    return () => clearInterval(interval);
  }, []);

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

  const handleRollComplete = (result: number) => {
    setRollResult(result); // Store the result of the roll
  };

  return (
    <div className="relative min-h-screen w-full bg-[#4B0082] flex flex-col">
      {/* hero bg */}
      <div className="absolute top-0 left-0 w-full h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[87vh] bg-black bg-opacity-10 z-1 overflow-hidden select-none">
        <div className="relative w-full h-full">
          <Image
            src="/title gfx.png"
            alt="hero-bg"
            layout="fill"
            objectFit="contain"
            objectPosition="center top"
            className="z-10 p-4 md:p-10 select-none"
          />
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20 select-none">
        <div className="z-10 flex items-center justify-center">
          <Link href="/games">
            <AnimatedGradientText>
              <Circle
                className="mr-1 h-4 w-4"
                fill={currentGame?.status === "active" ? "#00ff00" : "#ff0000"}
              />
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
                {currentGame?.status === "active" ? "LIVE" : " "}
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </Link>
        </div>
        {/* <div
          className={cn(
            "inline-flex items-center rounded-full bg-zinc-900 bg-opacity-50 px-2 py-1 text-xs font-medium text-white"
          )}
        >
          <span
            className={cn(
              "mr-1 h-3 w-3 rounded-full border-white border ",
              currentGame?.status === "active" ? "bg-emerald-400" : "bg-red-400"
            )}
          />
          {currentGame?.status === "active" ? "LIVE" : " "}
        </div> */}
      </div>

      <div className="h-[60vh] sm:h-[60vh] md:h-[65vh] lg:h-[87vh] relative overflow-hidden">
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
        <div className="h-100 absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(75,0,130,0.3)_50%,rgba(75,0,130,0.7)_100%)]"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-start md:justify-start mt-44 sm:mt-64 md:mt-80 lg:mt-[500px] xl:mt-[500px] 2xl:mt-[500px] px-4 overflow-y-auto">
          <div className="text-white mb-4 bg-black bg-opacity-20 p-4 px-4 md:px-10 rounded-[30px] border2 border-white border-opacity-40 w-full sm:max-w-md md:max-w-2xl z-20">
            <div className="flex gap-1 md:gap-2 mx-auto w-full justify-center items-center">
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full blur-[1.5px] duration-1000 ${
                    index === flashingIndex
                      ? "bg-yellow-300 animate-pulse"
                      : "bg-yellow-200 bg-opacity-50"
                  }`}
                ></div>
              ))}
            </div>
            <div className="py-4 flex flex-col gap-2 items-center">
              <h2 className="text-xl md:text-3xl font-bold text-center">
                Name the boss name beginning with 'T':
              </h2>
              <CustomSwitch
                label="Lucky Dip"
                onChange={(checked) => console.log("Switch is now:", checked)}
              />
              <div className="flex flex-col sm:flex-row gap-2 w-full justify-center items-center">
                <PlaceholdersAndVanishInput
                  placeholders={placeholders.map(
                    (placeholder) => placeholder.question
                  )}
                  onChange={handleChange}
                  onSubmit={onSubmit}
                  className="w-full sm:w-96 rounded-lg px-0"
                />
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-white font-semibold text-xl h-12 bg-gradient-to-t from-[#347158] to-[#58e364] from-30% to-100% w-full sm:w-28 mt-2 sm:mt-0"
                >
                  Answer!
                </Button>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 mx-auto w-full justify-center items-center">
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full blur-[1.5px] duration-1000 ${
                    index === reverseFlashingIndex
                      ? "bg-yellow-300 animate-pulse"
                      : "bg-yellow-200 bg-opacity-50"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <p className="text-white text-sm md:text-base mt-2">
            Cost £1 to play £5 lucky dip
          </p>
        </div>
      </div>

      {/* The rest of your content */}
      <div className="flex-grow bg-white">
        {/* 3 Ways to Win Section */}
        <div className="text-center px-4 text-black py-20">
          <small className="text-xs text-purple-800 font-semibold">
            Discover
          </small>
          <h2 className="text-3xl font-bold mb-4 text-purple-800 py-5">
            3 Ways to Win{" "}
            <span className="p-[0.5px]0.5px] relative">
              <div className="rotate-[-2deg] absolute inset-0 w-full h-full bg-[#f79e07]"></div>
              <span className="relative z-10 text-white">Big Prizes</span>
            </span>
          </h2>
          <p className="mb-10 max-w-lg mx-auto">
            Explore our exciting opportunities to win unique prizes, instant
            rewards, and participate in live raffles.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center text-center gap-8 max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="w-full rounded-xl bg-white text-black shadow-lg">
              <Image
                src="/gifts3.png"
                alt="Unique Answer"
                width={500}
                height={500}
                className="mb-4 rounded-t-xl h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2 py-6">
                <h3 className="font-bold text-2xl mb-2 text-purple-800">
                  Find a Unique Answer
                </h3>
                <p className="text-sm">
                  Unleash your creativity and stand a chance to win exclusive
                  prizes by providing a one-of-a-kind answer.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-full rounded-xl bg-white text-black shadow-lg">
              <Image
                src="/chest.png"
                alt="Instant Prizes"
                width={500}
                height={500}
                className="mb-4 rounded-t-xl h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2 py-6">
                <h3 className="font-bold text-2xl mb-2 text-purple-800">
                  Instant Prizes
                </h3>
                <div className="text-sm">
                  Get rewarded instantly with exciting prizes just by
                  participating in our engaging contests.
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-full rounded-xl bg-white text-black shadow-lg">
              <Image
                src="/pound.png"
                alt="Live Raffle"
                width={500}
                height={500}
                className="mb-4 rounded-t-xl h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2 py-6">
                <h3 className="font-bold text-2xl mb-2 text-purple-800">
                  Live Raffle
                </h3>
                <p className="text-sm">
                  Experience the thrill of our live raffles and stand a chance
                  to win big prizes in real-time and live on Facebook.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className=" container py-20 flex h-[400px] items-start justify-center max-w-7xl">
          <div className="w-full">
            <h4 className="text-lg font-bold text-purple-800">
              About Our Games
            </h4>
            <h3 className="w-full h-full text-3xl font-bold text-black leading-10">
              About Our Games, <br /> Learn
              <span className="p-[0.5px] m-1 relative">
                <div className="rotate-[-2deg] absolute inset-0 w-full h-full bg-[#f79e07]"></div>
                <span className="relative z-10 text-white">How To Play</span>
              </span>
            </h3>
          </div>

          <div className="flex flex-col justify-center  w-full">
            <p className="max-w-lg text-black text-sm leading-relaxed">
              Unleash your creativity and stand a chance to win exclusive prizes
              by providing a one-of-a-kind answer. Unleash your creativity and
              stand a chance to win exclusive prizes by providing a
              one-of-a-kind answer. Unleash your creativity and stand a chance
              to win exclusive prizes by providing a one-of-a-kind answer.
              Unleash your creativity and stand a chance to win exclusive
              prizes.
            </p>
            <div className="flex gap-2 my-2 w-full">
              <a href="/games">
                <Button
                  size="sm"
                  className="text-white bg-gradient-to-t from-[#347158] to-[#58e364] from-30% to-100% hover:from-[#214838] hover:to-[#41a84a] rounded-xl px-4"
                >
                  Get started
                </Button>
              </a>
              <Button
                variant="ghost"
                className="text-purple-800 hover:bg-transparent hover:underline hover:text-purple-900"
              >
                <a href="/faq" className="flex items-center">
                  FAQs <ChevronRight className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <BentoGridComponent />

        <section className="flex gap-10 p-4 text-black container w-full justify-between items-center my-20">
          <div className="w-full h-full flex flex-col gap-4 max-w-xl justify-center items-center">
            <div className="relative">
              <Image
                src="/luck.png"
                alt="Unique Answer"
                width={500}
                height={500}
                className="rounded-xl"
              />
              <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-center font-bold text-white text-4xl px-10 mb-8">
                <span className="w-[93%] leading-tight p-[0.5px] relative">
                  <div></div>
                  Discover Your Luck with Our Exciting{" "}
                  <span className="bg-white px-1 rotate-[-2deg] text-blue-800">
                    Lucky Dip
                  </span>
                </span>
              </div>
            </div>
            <p className="text-left px-10">
              Find a Unique Answer and WIN! Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Ea consequatur aut in assumenda
              quidem. Harum, sequi! Minus sit necessitatibus, alias possimus
              nihil fuga sapiente eaque saepe, repellat molestiae ex
              reprehenderit.
            </p>
          </div>
          <div className="w-full h-full flex flex-col gap-4 max-w-xl justify-center items-center">
            <div>
              <h3 className="text-3xl font-bold">Instant Prizes</h3>
            </div>
            <div className="relative">
              <Image
                src="/wheel.png"
                alt="Unique Answer"
                width={500}
                height={500}
                className="rounded-xl"
              />
              <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-center font-bold text-white text-4xl px-10 mb-8">
                <span className="w-[93%] leading-tight">
                  Don't Miss the 8pm Result Show on{" "}
                  <span className="bg-white px-1 rotate-[-3deg] text-blue-800">
                    Facebook
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/*   <div className="relative w-full h-full rounded-3xl overflow-hidden">
    <Image
      src="/players.png"
      alt="Winner"
      layout="fill"
      objectFit="cover"
      quality={100}
      priority
      className="scale-[1.35] object-cover"
    /> */}

        {/* //banner */}
        <section className="bg-[#fbead1] my-10 relative h-[200px]">
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <Image
              src="/bannerbg.png"
              alt="banner"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="container flex justify-center items-center gap-12 h-[200px] z-10 relative">
            <h3 className="text-4xl font-bold w-1/2 text-black">
              If there is no unique answer found the prize is rolled over to the{" "}
              <span className="bg-[#f15f53] px-[0.5] text-white">
                next game.
              </span>
            </h3>
            <div className="flex gap-4">
              <div className="w-16 h-16 relative">
                <Image
                  src="/two-red-dice-clipart-lg.png"
                  alt="Dice"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="w-24 h-24 relative -ml-4">
                <Image
                  src="/two-red-dice-clipart-lg.png"
                  alt="Dice"
                  layout="fill"
                  objectFit="contain"
                  className="-mr-6 rotate-45"
                />
              </div>
            </div>
          </div>
        </section>

        {/* reviews horizontal scroll section trustpilot with title and subtitle */}
        <section className="bg-white p-10 my-10 text-black">
          <div className="container flex flex-col gap-4 mb-6">
            <h3 className="text-3xl font-bold">Reviews</h3>
            <p className="text-lg">
              Read what our players have to say about us.
            </p>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scrollbar scrollbar-hide">
              <div className="w-64 flex-shrink-0 snap-start shadow-[0_0_5px_rgba(0,_0,_0,_0.1)] rounded-lg">
                <div className="bg-[#00b67a bg-white text-black p-4 rounded-lg h-full flex flex-col">
                  <div className="flex flex-col justify-center items-center mb-2">
                    <div className=" font-bold">Excellent</div>
                    <div className="flex items-center gap-1 p-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-8 h-8 fill-white bg-green-500 p-1 outline-none stroke-white"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm flex-grow">
                    Ranked on <span className="font-bold">438 reviews</span>
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {/* <Image
                      src="/trustpilot-logo.png"
                      alt="Trustpilot"
                      width={80}
                      height={20}
                      className="mr-2"
                    /> */}
                    <Star className="w-6 h-6 fill-green-500 outline-none stroke-green-500" />
                    <span className="text-xs ">Trustpilot</span>
                  </div>
                </div>
              </div>

              {/* Other review items */}
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="w-64 flex-shrink-0 snap-start shadow-[0_0_5px_rgba(0,_0,_0,_0.1)] rounded-lg"
                >
                  <div className="bg-[#00b67a bg-white text-black p-4 rounded-lg h-full flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-white bg-green-500 p-1 outline-none stroke-white"
                          />
                        ))}
                      </div>
                      <div className="text-xs">7 days ago</div>
                    </div>
                    <div className=" font-bold">Best on the market</div>
                    <p className="text-sm  flex-grow">
                      "I love this product because it is the best on the
                      market."
                    </p>
                    <hr className="w-20 my-1" />
                    <span className="font-bold text-sm">Trustpilot</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* small center banner "Join 1,200 players and Win a BIG prize, smaller text underneath "Registration is free, no credit card required and a button to the right saying JOIN NOW! */}
        <section className="p-10 mt-10 flex justify-center items-center h-[400px] relative">
          <div className="absolute top-0 left-0 w-full h-px] z-0 text-gray-50">
            <svg
              width="100%"
              height="100%"
              id="svg"
              viewBox="0 0 1440 390"
              xmlns="http://www.w3.org/2000/svg"
              className="transition duration-300 ease-in-out delay-150 z-0"
            >
              <path
                d="M 0,400 L 0,0 C 227,99 454,198 694,198 C 934,198 1187,99 1440,0 L 1440,400 L 0,400 Z"
                stroke="none"
                strokeWidth="0"
                fill="currentColor"
                fillOpacity="1"
                className="transition-all duration-300 ease-in-out delay-150 path-0 z-0"
              ></path>
            </svg>
          </div>
          <div className="bg-purple-800 text-white my-10 w-2/3 rounded-3xl flex items-center justify-start overflow-hidden bg-gradient-to-b from-purple-700 to-purple-900 h-[150px] z-10">
            <div className="w-1/5 h-full">
              <Image
                src="/InstantPrizes.webp"
                alt="Instant Prizes"
                width={150}
                height={150}
                className="rounded-3xl"
              />
            </div>
            <div className="container flex flex-col gap-2 items-start justify-center w-3/5">
              <h3 className="text-2xl font-bold">
                Join 1,200 players and Win a BIG prize
              </h3>
              <p className="text-sm">
                Registration is free, no credit card required
              </p>
            </div>
            <div className="flex justify-en w-1/5">
              <Button className="bg-yellow-400 text-black font-semibold text-lg">
                JOIN NOW!
              </Button>
            </div>
          </div>
        </section>

        {/* Past Games Section */}
        {/* <div className="text-center px-4 text-white bg-[#4B0082] py-20 mx-10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Past Games</h2>
          <ul className="space-y-2">
            {pastGames.map((game) => (
              <li
                key={game.id}
                className="bg-[#C0163D] p-4 rounded-lg max-w-xl mx-auto"
              >
                <h3 className="font-bold">{game.question}</h3>
                <p>Jackpot: £{game.current_prize ?? game.jackpot}</p>
                <p>Ended: {new Date(game.end_time).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Dice Roll Animation */}
        {/* <div className="text-center bg-[#4B0082] py-20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Bonus Game Preview: Dice Roll
          </h2>
          <DiceRoll />
          {rollResult !== null && (
            <p className="text-white">You rolled a {rollResult}!</p>
          )}
        </div> */}
      </div>
    </div>
  );
}
