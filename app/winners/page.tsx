"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

interface Winner {
  id: string;
  username: string;
  question: string;
  prize_amount: number;
  winning_answer: string;
}

interface WinnerByUser {
  id: string;
  username: string;
  totalPrize: number;
  winningAnswersByGame: Record<string, string[]>;
}

interface WinnerByGame {
  id: string;
  question: string;
  totalPrize: number;
  winners: {
    username: string;
    prize: number;
    answer: string;
  }[];
}

export default function Winners() {
  const [originalWinners, setOriginalWinners] = useState<Winner[]>([]);
  const [winnersByUser, setWinnersByUser] = useState<WinnerByUser[]>([]);
  const [winnersByGame, setWinnersByGame] = useState<WinnerByGame[]>([]);
  const [showAnswersAsList, setShowAnswersAsList] = useState(true);
  const [groupWinnersByAnswer, setGroupWinnersByAnswer] = useState(false);

  useEffect(() => {
    fetch('/api/winners')
      .then(response => response.json())
      .then(data => {
        if (data.originalWinners && data.groupedByUser && data.groupedByGame) {
          setOriginalWinners(data.originalWinners);
          setWinnersByUser(data.groupedByUser);
          setWinnersByGame(data.groupedByGame);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(error => console.error('Error fetching winners:', error));
  }, []);

  const renderWinningAnswers = (answers: Record<string, string[]>) => {
    if (showAnswersAsList) {
      return Object.entries(answers).map(([question, answerList]) => (
        <div key={question} className="mb-2">
          <p className="font-medium">{question}</p>
          <ul className="list-disc pl-5">
            {answerList.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
        </div>
      ));
    } else {
      return Object.entries(answers).map(([question, answerList]) => (
        <div key={question} className="mb-2">
          <p className="font-medium">{question}</p>
          <p>{answerList.join(", ")}</p>
        </div>
      ));
    }
  };

  const renderWinnersByGame = (game: WinnerByGame) => {
    if (groupWinnersByAnswer) {
      const groupedWinners = game.winners.reduce((acc, winner) => {
        if (!acc[winner.answer]) {
          acc[winner.answer] = [];
        }
        acc[winner.answer].push(winner);
        return acc;
      }, {} as Record<string, typeof game.winners>);

      return Object.entries(groupedWinners).map(([answer, winners]) => (
        <div key={answer} className="mb-4">
          <h4 className="font-semibold">Answer: {answer}</h4>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Prize</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-4 border-b">{winner.username}</td>
                  <td className="py-2 px-4 border-b text-green-600 font-bold">£{winner.prize.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ));
    } else {
      return (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Prize</th>
              <th className="py-2 px-4 border-b">Winning Answer</th>
            </tr>
          </thead>
          <tbody>
            {game.winners.map((winner, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4 border-b">{winner.username}</td>
                <td className="py-2 px-4 border-b text-green-600 font-bold">£{winner.prize.toFixed(2)}</td>
                <td className="py-2 px-4 border-b italic">{winner.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-4xl font-bold mb-8 text-white">Winners</h1>
      
      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700">
              Recent Winners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Prize</th>
                    <th className="py-2 px-4 border-b">Game</th>
                    <th className="py-2 px-4 border-b">Winning Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {originalWinners.map((winner, index) => (
                    <tr key={winner.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-2 px-4 border-b">{winner.username}</td>
                      <td className="py-2 px-4 border-b text-green-600 font-bold">£{winner.prize_amount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{winner.question}</td>
                      <td className="py-2 px-4 border-b italic">{winner.winning_answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700">
              Top Winners by User
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="answer-display-toggle"
                checked={showAnswersAsList}
                onCheckedChange={setShowAnswersAsList}
              />
              <Label htmlFor="answer-display-toggle">
                {showAnswersAsList ? "Show answers as list" : "Show answers comma-separated"}
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Total Prize</th>
                    <th className="py-2 px-4 border-b">Winning Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {winnersByUser.map((winner, index) => (
                    <tr key={winner.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-2 px-4 border-b">{winner.username}</td>
                      <td className="py-2 px-4 border-b text-green-600 font-bold">£{winner.totalPrize.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">
                        {renderWinningAnswers(winner.winningAnswersByGame)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700">
              Top Winners by Game
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="group-by-toggle"
                checked={groupWinnersByAnswer}
                onCheckedChange={setGroupWinnersByAnswer}
              />
              <Label htmlFor="group-by-toggle">
                {groupWinnersByAnswer ? "Group by answer" : "Group by user"}
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {winnersByGame.map((game) => (
                <div key={game.id} className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">{game.question}</h3>
                  <p className="text-green-600 font-bold mb-2">Total Prize: £{game.totalPrize.toFixed(2)}</p>
                  {renderWinnersByGame(game)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700">
              Winner Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <blockquote className="italic border-l-4 border-red-500 pl-4">
                "I never thought I'd win with such a simple answer! UniqueWin is amazing!" - John D.
              </blockquote>
              <blockquote className="italic border-l-4 border-red-500 pl-4">
                "The thrill of seeing my answer was unique is unbeatable. Thanks, UniqueWin!" - Sarah T.
              </blockquote>
              <blockquote className="italic border-l-4 border-red-500 pl-4">
                "I've won twice now. This game is addictive and so much fun!" - Mike R.
              </blockquote>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}