"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface QuickStatsProps {
  quickStats: {
    activeGames: number;
    totalPlayers: number;
    totalPrizeAwarded: number;
    gamesLast24Hours: number;
    instantWinsToday: number;
    totalLuckyDips: number;
  } | null;
  recentPlayerActivities: {
    id: string;
    submitted_at: string;
    answer_text: string;
    username: string;
    gameQuestion: string;
  }[];
}

export function QuickStatsBox({ quickStats, recentPlayerActivities }: QuickStatsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-700">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {quickStats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(quickStats).map(([key, value]) => (
              <div key={key} className="bg-purple-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-purple-600 font-medium mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-2xl font-bold text-purple-800">
                  {key === 'totalPrizeAwarded' ? `£${value.toFixed(2)}` : value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading stats...</p>
        )}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Recent Player Activities</h3>
          {recentPlayerActivities.length > 0 ? (
            <ul className="space-y-3">
              {recentPlayerActivities.map((activity) => (
                <li key={activity.id} className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-purple-800">{activity.username}</p>
                      <p className="text-sm text-gray-600">"{activity.answer_text}"</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(activity.submitted_at).toLocaleTimeString()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Game: {activity.gameQuestion}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent activities.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}