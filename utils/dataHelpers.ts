import users from "../data/users.json";
import { pastGames } from "@/data/pastGames";

export interface Answer {
  answer: string;
  frequency: number;
  status: "UNIQUE" | "NOT UNIQUE" | "PENDING";
  instantWin: string;
}

export interface Game {
  id: number;
  question: string;
  jackpot: number;
  startTime: string;
  endTime: string;
  validAnswers: string[];
  answers: Answer[];
  luckyDipAnswers: string[];
  hangmanWords: string[];
}

let currentGame: Game | null = null;

export function generateDailyGame(): Game {
  const questions = [
    "NAME A BOYS NAME BEGINNING WITH 'T'",
    "NAME A FRUIT THAT STARTS WITH 'A'",
    "NAME A COUNTRY IN EUROPE",
    "NAME A COLOR OF THE RAINBOW",
    "NAME A PLANET IN OUR SOLAR SYSTEM",
  ];

  const question = questions[Math.floor(Math.random() * questions.length)];
  const validAnswers = generateValidAnswers(question);
  const now = new Date();
  const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // End in 24 hours

  return {
    id: 1,
    question,
    jackpot: 1000 + Math.floor(Math.random() * 1000),
    startTime: now.toISOString(),
    endTime: endTime.toISOString(),
    validAnswers,
    answers: [],
    luckyDipAnswers: validAnswers.slice(0, 5),
    hangmanWords: [], // Initialize hangmanWords as an empty array
  };
}

export function getCurrentGame(): Game {
  if (!currentGame || new Date(currentGame.endTime) < new Date()) {
    currentGame = generateDailyGame();
  }
  return currentGame;
}

export function getCurrentUser(userId: number) {
  return users.find((user) => user.id === userId);
}

export function getAllGames(): Game[] {
  return [getCurrentGame(), ...pastGames];
}

export function getGameById(gameId: number): Game | undefined {
  if (gameId === 1) {
    return getCurrentGame();
  }
  return undefined;
}

export function submitAnswer(userId: number, gameId: number, answer: string, isLuckyDip: boolean = false) {
  const user = getCurrentUser(userId);
  const game = getCurrentGame();

  if (user && game) {
    const cost = isLuckyDip ? 5 : 1;
    if (user.balance >= cost) {
      // Update user's balance
      user.balance -= cost;

      // Update user's game history
      const newAnswer: Answer = {
        answer,
        frequency: 1,
        status: "PENDING", // This should be updated based on game logic
        instantWin: "NO", // This should be updated based on game logic
      };

      // Add the new answer to the user's game history
      user.gameHistory.push({
        gameId,
        answers: [newAnswer],
      });

      // Update the game's answers
      game.answers.push(newAnswer);

      return true; // Submission successful
    }
  }
  return false; // Submission failed
}

export function generateValidAnswers(question: string): string[] {
  // This is a simplified version. In a real application, you'd have a more comprehensive list.
  const answers = {
    "NAME A BOYS NAME BEGINNING WITH 'T'": ["THOMAS", "TIMOTHY", "TYLER", "THEODORE", "TREVOR"],
    "NAME A FRUIT THAT STARTS WITH 'A'": ["APPLE", "APRICOT", "AVOCADO", "ACAI", "ACKEE"],
    "NAME A COUNTRY IN EUROPE": ["FRANCE", "GERMANY", "ITALY", "SPAIN", "POLAND"],
    "NAME A COLOR OF THE RAINBOW": ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "INDIGO", "VIOLET"],
    "NAME A PLANET IN OUR SOLAR SYSTEM": ["MERCURY", "VENUS", "EARTH", "MARS", "JUPITER", "SATURN", "URANUS", "NEPTUNE"],
  };

  return answers[question as keyof typeof answers] || [];
}