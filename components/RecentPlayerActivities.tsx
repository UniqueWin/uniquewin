import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentPlayerActivitiesProps {
  recentPlayerActivities: {
    id: string;
    submitted_at: string;
    answer_text: string;
    username: string;
    gameQuestion: string;
  }[];
}

export function RecentPlayerActivities({ recentPlayerActivities }: RecentPlayerActivitiesProps) {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-700">Recent Player Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPlayerActivities.length > 0 ? (
          <ul className="space-y-3">
            {recentPlayerActivities.map((activity) => (
              <li
                key={activity.id}
                className="bg-white p-3 rounded-lg shadow-sm border border-purple-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-purple-800">
                      {activity.username}
                    </p>
                    <p className="text-sm text-gray-600">
                      "{activity.answer_text}"
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {new Date(activity.submitted_at).toLocaleTimeString()}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Game: {activity.gameQuestion}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activities.</p>
        )}
      </CardContent>
    </Card>
  );
}