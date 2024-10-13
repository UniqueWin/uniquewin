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

export default function HowToPlayPage() {
  return (
    <motion.div
      className="container mx-auto px-4 py-8 bg-red-800 my-8 rounded-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-4xl font-bold mb-8 text-white">How to Play UniqueWin</h1>
      
      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700">
              How to Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-4">
              <li>Sign up for an account or log in if you already have one.</li>
              <li>Choose an active game from our list of available games.</li>
              <li>Read the question carefully and think of your unique answer.</li>
              <li>Submit your answer for £1, or use Lucky Dip for £5.</li>
              <li>Wait for the game to end to see if your answer is unique.</li>
              <li>Check the live results show for winners announcement.</li>
              <li>If you win, follow the instructions to claim your prize!</li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700">
              Game Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li>Each player can submit one answer per game.</li>
              <li>A minimum deposit of £10 is required to play.</li>
              <li>Players can win unique prizes by providing a unique answer.</li>
              <li>Instant win prizes are available for certain answers.</li>
              <li>Games run daily from 8 PM to 8 PM, with a live draw at 9 PM.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700">
              Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li>Think creatively to come up with unique answers.</li>
              <li>Check past games to see what answers have been used before.</li>
              <li>Use Lucky Dip if you're unsure about your answer.</li>
              <li>Participate regularly to increase your chances of winning.</li>
              <li>Join our community to share strategies and tips with other players.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}