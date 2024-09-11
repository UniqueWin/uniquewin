import users from "../data/users.json"; // Keep this if you still need user data
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

const supabase = createClient();

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
  hangmanWords?: string[];
}

export async function getCurrentGame(): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "active")
    .single();

  if (error) {
    console.error("Error fetching current game:", error);
    return null;
  }
  return data;
}

export async function getAllGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .neq("status", "active"); // Fetch past games

  if (error) {
    console.error("Error fetching all games:", error);
    return [];
  }
  return data;
}

export async function getGameById(gameId: number): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (error) {
    console.error("Error fetching game by ID:", error);
    return null;
  }
  return data;
}

export function getCurrentUser(userId: number) {
  return users.find((user) => user.id === userId);
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