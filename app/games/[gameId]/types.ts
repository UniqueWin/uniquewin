export type PrizeType = "ALL" | "CREDITS" | "CASH" | "LUCKY_DIP" | "HANGMAN";

export interface Prize {
  id: number;
  prize_type: PrizeType;
  prize_amount: number;
  status: "LOCKED" | "UNLOCKED" | "SCRATCHED";
  winner_id: string | null;
}

export interface WinnerNames {
  [key: number]: string; // Define the type for winner names
}

export interface NewGameRewardsProps {
  prizes: Prize[]; // Accept prizes as a prop
  userId: string; // Add userId prop
  gameId: string; // Add gameId prop
}