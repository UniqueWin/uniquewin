import { createClient } from "@/utils/supabase/client";
import { ExtendedUser } from "./userHelpers";

const supabase = createClient();

export interface Answer {
  answer: string;
  frequency: number;
  status: "UNIQUE" | "NOT UNIQUE" | "PENDING";
  isInstantWin: boolean;
  instantWin: string;
  submittedAt: string;
}

export interface Game {
  id: number;
  question: string;
  jackpot: number;
  start_time: string;
  end_time: string;
  valid_answers: string[];
  answers: Answer[];
  lucky_dip_answers: string[];
  hangmanWords?: string[];
  instant_win_probability: number;
  instant_win_prizes?: GameInstantWinPrize[];
  current_prize: number; // Add this line
}

export interface InstantWinPrize {
  id: string;
  prize_amount: number;
  probability: number;
  prize_type: 'cash' | 'item';
  prize_details: any;
}

export interface GameInstantWinPrize {
  id: string;
  game_id: string;
  instant_win_prize_id: string;
  quantity: number;
  prize: InstantWinPrize;
}

export async function getCurrentGame(): Promise<Game | null> {
  const now = new Date();

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .gte("end_time", now.toISOString())
    .eq("status", "active")
    .order("end_time", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching current game:", error);
    return null;
  }
  return data;
}

export async function getAllGames(): Promise<Game[]> {
  const now = new Date();
  const today8PM = new Date(now);
  today8PM.setHours(20, 0, 0, 0);

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .lt("end_time", today8PM.toISOString())
    .order("end_time", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching all games:", error);
    return [];
  }
  return data;
}

export async function getGameById(gameId: string): Promise<Game | null> {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (error) {
      console.error("Error fetching game:", error);
      return null;
    }

    return data as Game;
  } catch (error) {
    console.error("Error in getGameById:", error);
    return null;
  }
}

export async function getGameInstantWinPrizes(gameId: string): Promise<GameInstantWinPrize[]> {
  const { data, error } = await supabase
    .from('game_instant_win_prizes')
    .select(`
      id,
      game_id,
      instant_win_prize_id,
      quantity,
      prize:instant_win_prizes (*)
    `)
    .eq('game_id', gameId);

  if (error) {
    console.error('Error fetching game instant win prizes:', error);
    return [];
  }

  return data as GameInstantWinPrize[];
}

export const submitAnswer = async (
  gameId: string,
  userId: string,
  answer: string,
  isLuckyDip: boolean,
  instantWinPrize?: GameInstantWinPrize | null
) => {
  try {
    console.log("Submitting answer:", gameId, userId, answer, isLuckyDip);
    // Fetch user's current credits
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("id", userId)
      .single();

    console.log("User data:", userData);

    if (userError) throw userError;

    if (!userData || userData.credit_balance < 1) {
      throw new Error("Insufficient credits");
    }

    // Deduct credits from the user
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credit_balance: userData.credit_balance - 1 })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Submit the answer
    const { data, error } = await supabase
      .from("answers")
      .insert({
        game_id: gameId,
        user_id: userId,
        answer_text: answer,
        is_lucky_dip: isLuckyDip,
        is_instant_win: !!instantWinPrize,
        instant_win_amount: instantWinPrize ? instantWinPrize.prize.prize_amount : 0,
      })
      .select()
      .single();

    if (error) throw error;

    if (instantWinPrize) {
      await updateInstantWinPrizeQuantity(instantWinPrize.id);
    }

    return data;
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};

export function checkForInstantWin(prizes: GameInstantWinPrize[]): GameInstantWinPrize | null {
  const totalProbability = prizes.reduce((sum, prize) => sum + (prize.prize.probability * prize.quantity), 0);
  if (totalProbability === 0) return null;

  const randomNumber = Math.random() * totalProbability;
  let cumulativeProbability = 0;

  for (const prize of prizes) {
    cumulativeProbability += prize.prize.probability * prize.quantity;
    if (randomNumber < cumulativeProbability && prize.quantity > 0) {
      return prize;
    }
  }

  return null;
}

async function updateInstantWinPrizeQuantity(prizeId: string) {
  const { data, error } = await supabase
    .from('game_instant_win_prizes')
    .select('quantity')
    .eq('id', prizeId)
    .single();

  if (error) {
    console.error('Error fetching prize quantity:', error);
    return;
  }

  if (data && data.quantity > 0) {
    const { error: updateError } = await supabase
      .from('game_instant_win_prizes')
      .update({ quantity: data.quantity - 1 })
      .eq('id', prizeId);

    if (updateError) {
      console.error('Error updating instant win prize quantity:', updateError);
    }
  }
}

export function generateValidAnswers(question: string): string[] {
  // This is a simplified version. In a real application, you'd have a more comprehensive list.
  const answers = {
    "NAME A BOYS NAME BEGINNING WITH 'T'": [
      "THOMAS",
      "TIMOTHY",
      "TYLER",
      "THEODORE",
      "TREVOR",
    ],
    "NAME A FRUIT THAT STARTS WITH 'A'": [
      "APPLE",
      "APRICOT",
      "AVOCADO",
      "ACAI",
      "ACKEE",
    ],
    "NAME A COUNTRY IN EUROPE": [
      "FRANCE",
      "GERMANY",
      "ITALY",
      "SPAIN",
      "POLAND",
    ],
    "NAME A COLOR OF THE RAINBOW": [
      "RED",
      "ORANGE",
      "YELLOW",
      "GREEN",
      "BLUE",
      "INDIGO",
      "VIOLET",
    ],
    "NAME A PLANET IN OUR SOLAR SYSTEM": [
      "MERCURY",
      "VENUS",
      "EARTH",
      "MARS",
      "JUPITER",
      "SATURN",
      "URANUS",
      "NEPTUNE",
    ],
  };

  return answers[question as keyof typeof answers] || [];
}

export async function getUserAnswers(userId: string, gameId: string): Promise<Answer[]> {
  try {
    const { data, error } = await supabase
      .from('answers')
      .select(`
        id,
        answer_text,
        status,
        is_instant_win,
        instant_win_amount,
        submitted_at
      `)
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error("Error fetching user answers:", error);
      throw error;
    }

    return data.map(answer => ({
      answer: answer.answer_text,
      status: answer.status || 'PENDING',
      isInstantWin: answer.is_instant_win,
      instantWin: answer.is_instant_win ? `£${answer.instant_win_amount}` : 'NO',
      submittedAt: answer.submitted_at
    }));
  } catch (error) {
    console.error("Error in getUserAnswers:", error);
    return [];
  }
}

export async function getCurrentUser(userId: string): Promise<ExtendedUser | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Transform the data into ExtendedUser format
  const extendedUser: ExtendedUser = {
    ...data,
    is_admin: data.is_admin || false,
    username: data.username || data.email?.split('@')[0] || '',
    credit_balance: data.credit_balance || 0,
  };

  return extendedUser;
}
