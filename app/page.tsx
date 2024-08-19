"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScratchCard } from 'next-scratchcard';

interface Answer {
  answer: string;
  frequency: number | "PENDING";
  status: "UNIQUE" | "NOT UNIQUE" | "PENDING";
  instantWin: string | "REVEAL" | "PENDING";
}

interface Game {
  question: string;
  jackpot: number;
  endTime: Date;
  answers: Answer[];
}

const luckyDipNames = [
  "THOMAS",
  "TIMOTHY",
  "TYLER",
  "THEODORE",
  "TOBY",
  "TREVOR",
  "TRISTAN",
  "TANNER",
  "TATE",
  "THADDEUS",
];

const ScratchCardComponent = ({ prize, onReveal }: { prize: string, onReveal: () => void }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleComplete = () => {
    setIsRevealed(true);
    onReveal();
  };

  return (
    <div className="relative w-[300px] h-[300px]">
      <ScratchCard
        width={300}
        height={300}
        finishPercent={70}
        onComplete={handleComplete}
        customBrush={{
          width: 40,
          height: 40,
          shape: "circle",
        }}
      >
        <div className="flex items-center justify-center w-full h-full bg-purple-500">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <p className="text-white text-2xl font-bold">YOU WIN {prize}</p>
          </div>
        </div>
      </ScratchCard>
      {!isRevealed && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-purple-500 pointer-events-none">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-white text-lg font-bold">YOU WIN</p>
            <p className="text-yellow-400 text-2xl font-bold">{prize}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);
  const [userBalance, setUserBalance] = useState(10);
  const [countdown, setCountdown] = useState("");
  const [availableLuckyDips, setAvailableLuckyDips] = useState([
    ...luckyDipNames,
  ]);
  const [revealedPrizes, setRevealedPrizes] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    // Initialize game data
    const newGame: Game = {
      question: "NAME A BOYS NAME BEGINNING WITH 'T'",
      jackpot: 1500,
      endTime: new Date(Date.now() + 5 * 60000), // 5 minutes from now
      answers: [
        {
          answer: "THOMAS",
          frequency: 27,
          status: "NOT UNIQUE",
          instantWin: "£25",
        },
        {
          answer: "TIMOTHY",
          frequency: 1,
          status: "UNIQUE",
          instantWin: "REVEAL",
        },
        {
          answer: "TYLER",
          frequency: "PENDING",
          status: "PENDING",
          instantWin: "PENDING",
        },
        {
          answer: "THEODORE",
          frequency: 1,
          status: "UNIQUE",
          instantWin: "NO",
        },
      ],
    };
    setGame(newGame);

    // Set up countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const distance = newGame.endTime.getTime() - now.getTime();
      if (distance < 0) {
        clearInterval(timer);
        setCountdown("GAME OVER");
        // Handle game over logic here
      } else {
        const minutes = Math.floor(distance / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submitAnswer = () => {
    if (!game || (!answer.trim() && !isLuckyDip)) return;

    let submittedAnswer = answer.toUpperCase();
    if (isLuckyDip) {
      if (availableLuckyDips.length === 0) {
        alert("No more Lucky Dips available!");
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableLuckyDips.length);
      submittedAnswer = availableLuckyDips[randomIndex];
      setAvailableLuckyDips((prev) =>
        prev.filter((_, index) => index !== randomIndex)
      );
    }

    const newAnswer: Answer = {
      answer: submittedAnswer,
      frequency: isLuckyDip ? 1 : "PENDING",
      status: isLuckyDip ? "UNIQUE" : "PENDING",
      instantWin: isLuckyDip ? "REVEAL" : "PENDING",
    };

    setGame((prevGame) => ({
      ...prevGame!,
      answers: [newAnswer, ...prevGame!.answers],
    }));

    setAnswer("");
    setIsLuckyDip(false);
    setUserBalance((prev) => prev - (isLuckyDip ? 5 : 1));
  };

  const calculateWinnings = () => {
    const uniqueAnswers =
      game?.answers.filter((a) => a.status === "UNIQUE") || [];
    return uniqueAnswers.length
      ? (750 / uniqueAnswers.length).toFixed(2)
      : "0.00";
  };

  const handleReveal = (index: number) => {
    if (revealedPrizes[index]) return; // Prevent re-revealing
    const prize =
      Math.random() < 0.5 ? "NO WIN" : `£${Math.floor(Math.random() * 50) + 1}`;
    setRevealedPrizes((prev) => ({ ...prev, [index]: prize }));
    setGame((prevGame) => ({
      ...prevGame!,
      answers: prevGame!.answers.map((answer, i) =>
        i === index ? { ...answer, instantWin: prize } : answer
      ),
    }));
  };

  if (!game) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-purple-300 min-h-screen"
    >
      <header className="bg-purple-700 text-white p-4">
        <nav className="flex flex-wrap justify-between">
          <div className="space-x-4 mb-2 sm:mb-0">
            <a href="#">HOME</a>
            <a href="#">HOW TO PLAY?</a>
            <a href="#">WINNERS</a>
            <a href="#">FAQ</a>
            <a href="#">CONTACT US</a>
          </div>
          <div className="space-x-4">
            <a href="#">SIGN IN/LOGOUT</a>
            <a href="#">MY ACCOUNT</a>
            <span>BALANCE: £{userBalance}</span>
            <a href="#" className="bg-orange-500 px-2 py-1 rounded">
              BUY CREDITS
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-between items-center mb-4"
        >
          <h1 className="text-3xl font-bold">UNIQUEWIN.CO.UK</h1>
          <div>
            <p>LIVE: JACKPOT: £{game.jackpot}</p>
            <p>GAME ENDS IN {countdown}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">
            FIND A UNIQUE ANSWER & WIN!
          </h2>
          <p className="text-xl mb-4">{game.question}</p>

          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="ENTER YOUR ANSWER"
            className="mb-4"
            disabled={isLuckyDip}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isLuckyDip}
              onChange={() => setIsLuckyDip(!isLuckyDip)}
              className="mr-2"
              disabled={availableLuckyDips.length === 0}
            />
            <label>LUCKY DIP ({availableLuckyDips.length} left)</label>
          </div>
          <Button onClick={submitAnswer} className="bg-orange-500 w-full mb-8">
            PLAY NOW/SUBMIT
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4">GAME HISTORY</h3>
          <p className="mb-4">
            YOU ARE CURRENTLY WINNING: £{calculateWinnings()}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full mb-8">
              <thead>
                <tr>
                  <th className="text-left">YOUR ANSWER</th>
                  <th className="text-left">ANSWER FREQUENCY</th>
                  <th className="text-left">ANSWER STATUS</th>
                  <th className="text-left">INSTANT WIN</th>
                </tr>
              </thead>
              <tbody>
                {game.answers.map((answer, index) => (
                  <tr key={index}>
                    <td>{answer.answer}</td>
                    <td>{answer.frequency}</td>
                    <td
                      className={
                        answer.status === "UNIQUE"
                          ? "text-green-500"
                          : answer.status === "NOT UNIQUE"
                          ? "text-red-500"
                          : "text-orange-500"
                      }
                    >
                      {answer.status}
                    </td>
                    <td>
                      {answer.instantWin === "REVEAL" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              REVEAL
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Scratch to Reveal Your Prize!
                              </DialogTitle>
                            </DialogHeader>
                            <ScratchCardComponent
                              prize={revealedPrizes[index] || "£50.00!"}
                              onReveal={() => handleReveal(index)}
                            />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        answer.instantWin
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-purple-500 text-white p-4 text-center mb-8"
        >
          <h3 className="text-xl font-bold">DON'T MISS THE 8PM RESULTS SHOW</h3>
          <p>EVERY MONDAY NIGHT LIVE ON FACEBOOK</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-wrap justify-between items-center mb-8"
        >
          <div className="w-full md:w-1/2 bg-purple-400 h-32 mb-4 md:mb-0">
            {/* Placeholder for winner testimonial or recent win highlight */}
            <p className="text-white p-4">
              "I won £500 last week with UniqueWin! It's so exciting!" - Sarah
              T.
            </p>
          </div>
          <div className="w-full md:w-1/2 md:pl-4">
            <h3 className="text-xl font-bold">NEW WINNERS EVERYDAY</h3>
            <p>WILL YOU BE NEXT?</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-purple-400 p-4 text-center"
        >
          {/* Placeholder for Trustpilot widget */}
          <p className="text-white">
            Trustpilot Rating: 4.8/5 from 1000+ reviews
          </p>
        </motion.div>
      </main>

      <footer className="bg-purple-700 text-white p-4 text-center mt-8">
        <a href="#" className="mx-2">
          Terms & Conditions
        </a>
        <a href="#" className="mx-2">
          Privacy Policy
        </a>
        <a href="#" className="mx-2">
          Responsible Gaming
        </a>
        <a href="#" className="mx-2">
          Contact Us
        </a>
      </footer>
    </motion.div>
  );
};

export default Home;
