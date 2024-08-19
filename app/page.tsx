"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Answer {
  text: string;
  frequency: number;
  status: "UNIQUE" | "NOT UNIQUE" | "PENDING";
  instantWin: number | "REVEAL" | "NO";
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

  useEffect(() => {
    // Load game data from local storage or initialize if not present
    const storedGame = localStorage.getItem("currentGame");
    if (storedGame) {
      setGame(JSON.parse(storedGame));
    } else {
      const newGame: Game = {
        question: "NAME A BOYS NAME BEGINNING WITH 'T'",
        jackpot: 1500,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        answers: [],
      };
      setGame(newGame);
      localStorage.setItem("currentGame", JSON.stringify(newGame));
    }

    // Load user balance
    const storedBalance = localStorage.getItem("userBalance");
    if (storedBalance) {
      setUserBalance(parseInt(storedBalance));
    }
  }, []);

  const submitAnswer = () => {
    if (!game || !answer.trim()) return;

    const cost = isLuckyDip ? 5 : 1;
    if (userBalance < cost) {
      alert("Insufficient balance!");
      return;
    }

    let newAnswer: Answer;
    if (isLuckyDip) {
      // Implement lucky dip logic here
      newAnswer = {
        text: answer,
        frequency: 1,
        status: "UNIQUE",
        instantWin: "REVEAL",
      };
    } else {
      newAnswer = {
        text: answer,
        frequency: 1,
        status: "PENDING",
        instantWin: "NO",
      };
    }

    const updatedAnswers = [...game.answers, newAnswer];
    const updatedGame = { ...game, answers: updatedAnswers };
    setGame(updatedGame);
    localStorage.setItem("currentGame", JSON.stringify(updatedGame));

    // Update user balance
    const newBalance = userBalance - cost;
    setUserBalance(newBalance);
    localStorage.setItem("userBalance", newBalance.toString());

    setAnswer("");
    setIsLuckyDip(false);
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">UniqueWin.co.uk</h1>
      <div className="mb-4">
        <p>LIVE: JACKPOT: £{game.jackpot}</p>
        <p>GAME ENDS IN: {/* Add countdown logic */}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          FIND A UNIQUE ANSWER & WIN!
        </h2>
        <p className="mb-2">{game.question}</p>
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ENTER YOUR ANSWER"
          className="mb-2"
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isLuckyDip}
            onChange={() => setIsLuckyDip(!isLuckyDip)}
            className="mr-2"
          />
          <label>LUCKY DIP</label>
        </div>
        <Button onClick={submitAnswer}>PLAY NOW/SUBMIT</Button>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">GAME HISTORY</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>YOUR ANSWER</TableHead>
              <TableHead>ANSWER FREQUENCY</TableHead>
              <TableHead>ANSWER STATUS</TableHead>
              <TableHead>INSTANT WIN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {game.answers.map((answer, index) => (
              <TableRow key={index}>
                <TableCell>{answer.text}</TableCell>
                <TableCell>{answer.frequency}</TableCell>
                <TableCell>{answer.status}</TableCell>
                <TableCell>{answer.instantWin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <p>YOU ARE CURRENTLY WINNING: £{/* Add winning calculation logic */}</p>
      </div>
    </div>
  );
};

export default Home;
