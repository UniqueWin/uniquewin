"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-purple-800">Frequently Asked Questions</h1>
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
    </div>
  );
}