import { Trophy, Award, Zap, Target, Star } from "lucide-react";

export interface AchievementLevel {
  level: number;
  name: string;
  description: string;
  requirement: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  levels: AchievementLevel[];
}

export const achievements: Achievement[] = [
  {
    id: "games_played",
    name: "Game Enthusiast",
    description: "Play multiple games",
    icon: <Trophy className="h-6 w-6 text-yellow-400" />,
    levels: [
      {
        level: 1,
        name: "Novice Player",
        description: "Play your first game",
        requirement: 1,
      },
      {
        level: 2,
        name: "Regular Player",
        description: "Play 10 games",
        requirement: 10,
      },
      {
        level: 3,
        name: "Dedicated Player",
        description: "Play 50 games",
        requirement: 50,
      },
      {
        level: 4,
        name: "Game Master",
        description: "Play 100 games",
        requirement: 100,
      },
    ],
  },
  {
    id: "unique_answers",
    name: "Unique Thinker",
    description: "Provide unique answers",
    icon: <Award className="h-6 w-6 text-blue-400" />,
    levels: [
      {
        level: 1,
        name: "Original Thinker",
        description: "Get your first unique answer",
        requirement: 1,
      },
      {
        level: 2,
        name: "Creative Mind",
        description: "Get 5 unique answers",
        requirement: 5,
      },
      {
        level: 3,
        name: "Innovator",
        description: "Get 20 unique answers",
        requirement: 20,
      },
      {
        level: 4,
        name: "Genius",
        description: "Get 50 unique answers",
        requirement: 50,
      },
    ],
  },
  {
    id: "credits_spent",
    name: "Big Spender",
    description: "Spend credits in the game",
    icon: <Zap className="h-6 w-6 text-green-400" />,
    levels: [
      {
        level: 1,
        name: "First Purchase",
        description: "Spend your first credit",
        requirement: 1,
      },
      {
        level: 2,
        name: "Regular Customer",
        description: "Spend 10 credits",
        requirement: 10,
      },
      {
        level: 3,
        name: "VIP Player",
        description: "Spend 50 credits",
        requirement: 50,
      },
      {
        level: 4,
        name: "High Roller",
        description: "Spend 100 credits",
        requirement: 100,
      },
    ],
  },
  {
    id: "winning_streak",
    name: "Lucky Streak",
    description: "Win games in a row",
    icon: <Star className="h-6 w-6 text-purple-400" />,
    levels: [
      {
        level: 1,
        name: "Lucky Win",
        description: "Win 2 games in a row",
        requirement: 2,
      },
      {
        level: 2,
        name: "Hot Streak",
        description: "Win 3 games in a row",
        requirement: 3,
      },
      {
        level: 3,
        name: "Unstoppable",
        description: "Win 5 games in a row",
        requirement: 5,
      },
      {
        level: 4,
        name: "Legendary Streak",
        description: "Win 10 games in a row",
        requirement: 10,
      },
    ],
  },
  {
    id: "jackpot_winner",
    name: "Jackpot Winner",
    description: "Win games with high jackpots",
    icon: <Target className="h-6 w-6 text-red-400" />,
    levels: [
      {
        level: 1,
        name: "Small Fortune",
        description: "Win a game with a jackpot of 100 or more",
        requirement: 100,
      },
      {
        level: 2,
        name: "Big Winner",
        description: "Win a game with a jackpot of 500 or more",
        requirement: 500,
      },
      {
        level: 3,
        name: "Jackpot King",
        description: "Win a game with a jackpot of 1000 or more",
        requirement: 1000,
      },
      {
        level: 4,
        name: "Millionaire",
        description: "Win a game with a jackpot of 5000 or more",
        requirement: 5000,
      },
    ],
  },
];

export function getAchievementProgress(
  achievementId: string,
  userProgress: number
): AchievementLevel | null {
  const achievement = achievements.find((a) => a.id === achievementId);
  if (!achievement) return null;

  for (let i = achievement.levels.length - 1; i >= 0; i--) {
    if (userProgress >= achievement.levels[i].requirement) {
      return achievement.levels[i];
    }
  }

  return null;
}
