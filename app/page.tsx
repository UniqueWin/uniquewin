"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const Home = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLuckyDip, setIsLuckyDip] = useState(false);
  const [userBalance, setUserBalance] = useState(10);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    // Initialize game data
    const newGame: Game = {
      question: "NAME A BOYS NAME BEGINNING WITH 'T'",
      jackpot: 1500,
      endTime: new Date(Date.now() + 8 * 3600000 + 23 * 60000 + 13 * 1000), // 8:23:13 from now
      answers: [
        { answer: "APPLE", frequency: 27, status: "NOT UNIQUE", instantWin: "£25" },
        { answer: "ORANGE", frequency: 1, status: "UNIQUE", instantWin: "REVEAL" },
        { answer: "TOMATO", frequency: "PENDING", status: "PENDING", instantWin: "PENDING" },
        { answer: "BEETROOT", frequency: 1, status: "UNIQUE", instantWin: "NO" },
      ],
    };
    setGame(newGame);

    // Set up countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const distance = newGame.endTime.getTime() - now.getTime();
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submitAnswer = () => {
    if (!game || !answer.trim()) return;

    const newAnswer: Answer = {
      answer: answer.toUpperCase(),
      frequency: isLuckyDip ? 1 : "PENDING",
      status: isLuckyDip ? "UNIQUE" : "PENDING",
      instantWin: isLuckyDip ? "REVEAL" : "PENDING",
    };

    setGame(prevGame => ({
      ...prevGame!,
      answers: [newAnswer, ...prevGame!.answers],
    }));

    setAnswer("");
    setIsLuckyDip(false);
  };

  const calculateWinnings = () => {
    const uniqueAnswers = game?.answers.filter(a => a.status === "UNIQUE") || [];
    return uniqueAnswers.length ? (750 / uniqueAnswers.length).toFixed(2) : "0.00";
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div className="bg-purple-300 min-h-screen">
      <header className="bg-purple-700 text-white p-4">
        <nav className="flex justify-between">
          <div>
            <a href="#" className="mr-4">HOME</a>
            <a href="#" className="mr-4">HOW TO PLAY?</a>
            <a href="#" className="mr-4">WINNERS</a>
            <a href="#" className="mr-4">FAQ</a>
            <a href="#" className="mr-4">CONTACT US</a>
          </div>
          <div>
            <a href="#" className="mr-4">SIGN IN/LOGOUT</a>
            <a href="#" className="mr-4">MY ACCOUNT</a>
            <span className="mr-4">BALANCE: £{userBalance}</span>
            <a href="#" className="bg-orange-500 px-2 py-1 rounded">BUY CREDITS</a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">UNIQUEWIN.CO.UK</h1>
          <div>
            <p>LIVE: JACKPOT: £{game.jackpot}</p>
            <p>GAME ENDS IN {countdown}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">FIND A UNIQUE ANSWER & WIN!</h2>
        <p className="text-xl mb-4">{game.question}</p>

        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ENTER YOUR ANSWER"
          className="mb-4"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isLuckyDip}
            onChange={() => setIsLuckyDip(!isLuckyDip)}
            className="mr-2"
          />
          <label>LUCKY DIP</label>
        </div>
        <Button onClick={submitAnswer} className="bg-orange-500 w-full mb-8">PLAY NOW/SUBMIT</Button>

        <h3 className="text-xl font-bold mb-4">GAME HISTORY</h3>
        <p className="mb-4">YOU ARE CURRENTLY WINNING: £{calculateWinnings()}</p>
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
                <td className={
                  answer.status === "UNIQUE" ? "text-green-500" :
                  answer.status === "NOT UNIQUE" ? "text-red-500" :
                  "text-orange-500"
                }>{answer.status}</td>
                <td>{answer.instantWin}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-purple-500 text-white p-4 text-center mb-8">
          <h3 className="text-xl font-bold">DON'T MISS THE 8PM RESULTS SHOW</h3>
          <p>EVERY MONDAY NIGHT LIVE ON FACEBOOK</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="w-1/2 bg-purple-400 h-32"></div>
          <div>
            <h3 className="text-xl font-bold">NEW WINNERS EVERYDAY</h3>
            <p>WILL YOU BE NEXT?</p>
          </div>
        </div>

        <div className="bg-purple-400 p-4 text-center">
          TRUSTPILOT WIDGET
        </div>
      </main>

      <footer className="bg-purple-700 text-white p-4 text-center">
        FOOTER LINKS HERE
      </footer>
    </div>
  );
};

export default Home;