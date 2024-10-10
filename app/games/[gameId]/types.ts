export type PrizeType = "ALL" | "CREDITS" | "CASH" | "LUCKY_DIP" | "HANGMAN";

export interface Prize {
  id: number;
  prize_type: PrizeType;
  prize_amount: number;
  status: "LOCKED" | "UNLOCKED" | "SCRATCHED";
  winner_id: string | null;
  bonus_game_type?: BonusGameType;
}

export interface WinnerNames {
  [key: number]: string; // Define the type for winner names
}

export interface NewGameRewardsProps {
  prizes: Prize[]; // Accept prizes as a prop
  userId: string; // Add userId prop
  gameId: string; // Add gameId prop
}
// Ensure BonusGameType includes all necessary types
export type BonusGameType =
  | "DICE_ROLL"
  | "COIN_FLIP"
  | "WHEEL_SPIN"
  | "MYSTERY_BOX"; // Updated to include all types
