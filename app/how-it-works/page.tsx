"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WaysToWin from "@/components/WaysToWin";
import HowToPlay from "@/components/HowToPlay";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.main 
        className="container mx-auto px-4 py-8 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-purple-800"
          variants={itemVariants}
        >
          How UniqueWin Works
        </motion.h1>

        <motion.div variants={itemVariants}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-700">
                3 Ways to Win!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WaysToWin />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-700">
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HowToPlay />
            </CardContent>
          </Card>
        </motion.div>

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
                    that game.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I know if I've won?</AccordionTrigger>
                  <AccordionContent>
                    Check your game history or tune into our live results show
                    every Monday at 8PM on Facebook.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What is Lucky Dip?</AccordionTrigger>
                  <AccordionContent>
                    Lucky Dip automatically selects an answer for you from our
                    list of valid answers. It costs £5 but guarantees a valid
                    entry.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  );
}