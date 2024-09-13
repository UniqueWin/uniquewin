"use client";

import React from "react";
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

export default function Winners() {
  // This would typically come from your database
  const recentWinners = [
    { name: "John Doe", prize: "£1000", game: "Boys names starting with 'T'", answer: "Thaddeus" },
    { name: "Jane Smith", prize: "£500", game: "Fruits starting with 'P'", answer: "Pomelo" },
    { name: "Bob Johnson", prize: "£250", game: "Countries starting with 'S'", answer: "San Marino" },
    { name: "Alice Brown", prize: "£100", game: "Animals starting with 'Z'", answer: "Zebu" },
    { name: "Charlie Davis", prize: "£50", game: "Colors starting with 'M'", answer: "Mauve" },
  ];

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-4xl font-bold mb-8 text-purple-800">Winners</h1>
      
      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700">
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
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-2 px-4 border-b">{winner.name}</td>
                      <td className="py-2 px-4 border-b text-green-600 font-bold">{winner.prize}</td>
                      <td className="py-2 px-4 border-b">{winner.game}</td>
                      <td className="py-2 px-4 border-b italic">{winner.answer}</td>
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
            <CardTitle className="text-2xl font-bold text-purple-700">
              Winner Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <blockquote className="italic border-l-4 border-purple-500 pl-4">
                "I never thought I'd win with such a simple answer! UniqueWin is amazing!" - John D.
              </blockquote>
              <blockquote className="italic border-l-4 border-purple-500 pl-4">
                "The thrill of seeing my answer was unique is unbeatable. Thanks, UniqueWin!" - Sarah T.
              </blockquote>
              <blockquote className="italic border-l-4 border-purple-500 pl-4">
                "I've won twice now. This game is addictive and so much fun!" - Mike R.
              </blockquote>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}