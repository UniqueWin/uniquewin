"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function FAQPage() {
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-4xl font-bold mb-8 text-white">Frequently Asked Questions</h1>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700">
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is a unique answer?</AccordionTrigger>
                <AccordionContent>
                  A unique answer is one that no other player has submitted for
                  that game. If your answer is the only one of its kind, you win!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I know if I've won?</AccordionTrigger>
                <AccordionContent>
                  Check your game history or tune into our live results show
                  every day at 8PM on Facebook. We'll announce all winners during the show.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What is Lucky Dip?</AccordionTrigger>
                <AccordionContent>
                  Lucky Dip automatically selects an answer for you from our
                  list of valid answers. It costs £5 but guarantees a valid
                  entry and saves you time thinking of an answer.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How much does it cost to play?</AccordionTrigger>
                <AccordionContent>
                  It costs £1 to submit your own answer, or £5 for a Lucky Dip. You need a minimum balance of £10 to start playing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I claim my prize?</AccordionTrigger>
                <AccordionContent>
                  If you win, you'll receive instructions on how to claim your prize via email. Make sure your account details are up to date!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Can I play multiple times in one game?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can play multiple times in one game.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>What happens if no one has a unique answer?</AccordionTrigger>
                <AccordionContent>
                  If no one submits a unique answer, the prize rolls over to the next game, making the jackpot even bigger!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}