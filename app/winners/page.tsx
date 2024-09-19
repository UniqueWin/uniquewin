"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  games: { question: string };
  profiles: { username: string };
  prize_amount: number;
  winning_answer: string;
}

export default function Winners() {
  const [recentWinners, setRecentWinners] = useState<Winner[]>([]);

  useEffect(() => {
    fetch('/api/winners')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentWinners(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(error => console.error('Error fetching winners:', error));
  }, []);

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
                  {recentWinners.map((winner, index) => (
                    <tr key={winner.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-2 px-4 border-b">{winner.profiles.username}</td>
                      <td className="py-2 px-4 border-b text-green-600 font-bold">£{winner.prize_amount}</td>
                      <td className="py-2 px-4 border-b">{winner.games.question}</td>
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