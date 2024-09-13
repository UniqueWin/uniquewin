"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import HowToPlay from "@/components/HowToPlay";

export default function HowToPlayPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-purple-800">How to Play UniqueWin</h1>
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
    </div>
  );
}