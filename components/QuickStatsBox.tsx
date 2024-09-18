"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface QuickStatsProps {
  quickStats: {
    activeGames: number;
    totalPlayers: number;
    totalPrizeAwarded: number;
    totalUniqueWins: number;
    totalWinners: number;
    averagePrizePerAnswer: number;
    averagePrizePerWinner: number;
    gamesLast24Hours: number;
    instantWinsToday: number;
    totalLuckyDips: number;
    totalAnswers: number;
    averageAnswersPerGame: number;
  } | null;
  prizesByGame: { [gameId: string]: number } | null;
}

export function QuickStatsBox({
  quickStats,
  prizesByGame,
}: QuickStatsProps) {
  const formatCurrency = (value: number | undefined) =>
    value !== undefined ? `£${value.toFixed(2)}` : "N/A";
  const formatNumber = (value: number | undefined) =>
    value !== undefined ? value.toLocaleString() : "N/A";

  const statGroups = [
    {
      title: "Game Statistics",
      stats: [
        { key: "activeGames", label: "Active Games", format: formatNumber },
        {
          key: "gamesLast24Hours",
          label: "Games Last 24h",
          format: formatNumber,
        },
        { key: "totalAnswers", label: "Total Answers", format: formatNumber },
        {
          key: "averageAnswersPerGame",
          label: "Avg Answers/Game",
          format: (v: number | undefined) =>
            v !== undefined ? v.toFixed(2) : "N/A",
        },
      ],
    },
    {
      title: "Player Statistics",
      stats: [
        { key: "totalPlayers", label: "Total Players", format: formatNumber },
        { key: "totalWinners", label: "Total Winners", format: formatNumber },
        {
          key: "totalUniqueWins",
          label: "Total Unique Wins",
          format: formatNumber,
        },
        {
          key: "instantWinsToday",
          label: "Instant Wins Today",
          format: formatNumber,
        },
        {
          key: "totalLuckyDips",
          label: "Total Lucky Dips",
          format: formatNumber,
        },
      ],
    },
    {
      title: "Prize Statistics",
      stats: [
        {
          key: "totalPrizeAwarded",
          label: "Total Prize Awarded",
          format: formatCurrency,
        },
        {
          key: "averagePrizePerAnswer",
          label: "Avg Prize/Answer",
          format: formatCurrency,
        },
        {
          key: "averagePrizePerWinner",
          label: "Avg Prize/Winner",
          format: formatCurrency,
        },
      ],
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-700">
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quickStats ? (
          <>
            {statGroups.map((group, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold text-purple-700 mb-3">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {group.stats.map((stat) => (
                    <div
                      key={stat.key}
                      className="bg-purple-50 p-4 rounded-lg shadow-sm"
                    >
                      <p className="text-sm text-purple-600 font-medium mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-purple-800">
                        {stat.format(
                          quickStats[stat.key as keyof typeof quickStats]
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>Loading stats...</p>
        )}
      </CardContent>
    </Card>
  );
}
