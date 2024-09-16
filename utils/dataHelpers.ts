import { createClient } from "@/utils/supabase/client";
import { ExtendedUser } from "./userHelpers";

const supabase = createClient();

export interface Answer {
  answer: string;
  status: string;
  instantWin: string;
  isInstantWin: boolean;
  submittedAt: string;
  frequency?: number; // Make frequency optional
}

export interface Game {
  id: string;
  question: string;
  valid_answers: string[]; // Admin-defined valid answers
  answers?: Answer[]; // User submitted answers, optional as it might not always be loaded
  jackpot: number;
  end_time: string;
  lucky_dip_price?: number;
  price?: number;
  current_prize?: number;
  status: string;
  start_time: string;
  lucky_dip_answers?: string[];
  hangmanWords?: string[];
}

export interface InstantWinPrize {
  id: string;
  prize_amount: number;
  probability: number;
  prize_type: string;
  prize_details: any;
}

export interface GameInstantWinPrize {
  id: string;
  game_id: string;
  instant_win_prize_id: string;
  quantity: number;
  custom_probability: number;
  prize: InstantWinPrize;
}

export async function getCurrentGame(): Promise<Game | null> {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  console.log("Current local time:", localNow.toISOString());

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .lte("start_time", localNow.toISOString())
    .gt("end_time", localNow.toISOString())
    .eq("status", "active")
    .order("start_time", { ascending: false })
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
      .select(`
        *,
        answers:answers(
          id,
          answer_text,
          status,
          is_instant_win,
          instant_win_amount,
          submitted_at
        )
      `)
      .eq("id", gameId)
      .single();

    if (error) {
      console.error("Error fetching game:", error);
      return null;
    }

    // Transform the answers to match the Answer interface
    const transformedAnswers: Answer[] = data.answers.map((answer: any) => ({
      answer: answer.answer_text,
      status: answer.status || "PENDING",
      isInstantWin: answer.is_instant_win,
      instantWin: answer.is_instant_win ? `£${answer.instant_win_amount}` : "NO",
      submittedAt: answer.submitted_at,
    }));

    // Create the Game object with the transformed answers
    const game: Game = {
      ...data,
      answers: transformedAnswers,
    };

    return game;
  } catch (error) {
    console.error("Error in getGameById:", error);
    return null;
  }
}

export async function getGameInstantWinPrizes(
  gameId: string
): Promise<GameInstantWinPrize[]> {
  const { data, error } = await supabase
    .from("game_instant_win_prizes")
    .select(
      `
      id,
      game_id,
      instant_win_prize_id,
      quantity,
      prize:instant_win_prizes (
        id,
        prize_amount,
        probability,
        prize_type,
        prize_details
      )
    `
    )
    .eq("game_id", gameId);

  if (error) {
    console.error("Error fetching game instant win prizes:", error);
    return [];
  }

  // Transform the data to match the GameInstantWinPrize interface
  const transformedData: GameInstantWinPrize[] = data.map((item: any) => ({
    id: item.id,
    game_id: item.game_id,
    instant_win_prize_id: item.instant_win_prize_id,
    quantity: item.quantity,
    custom_probability: item.custom_probability,
    prize: {
      id: item.prize.id,
      prize_amount: item.prize.prize_amount,
      probability: item.prize.probability,
      prize_type: item.prize.prize_type,
      prize_details: item.prize.prize_details,
    },
  }));

  return transformedData;
}

export const submitAnswer = async (
  gameId: string,
  userId: string,
  answer: string,
  instantWinPrizes: GameInstantWinPrize[],
  validAnswers: string[]
) => {
  try {
    console.log("Submitting answer:", gameId, userId, answer, instantWinPrizes);
    console.log("Valid answers:", validAnswers); // Add this line for debugging

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

    const isValidAnswer = validAnswers.some(validAnswer => 
      validAnswer.toLowerCase() === answer.toLowerCase()
    );
    console.log("Is valid answer:", isValidAnswer); // Add this line for debugging

    const instantWin = checkForInstantWin(instantWinPrizes);

    // Check if the answer already exists for this game
    const { data: existingAnswers, error: existingAnswerError } = await supabase
      .from("answers")
      .select("id")
      .eq("game_id", gameId)
      .ilike("answer_text", answer)
      .limit(1);

    if (existingAnswerError) throw existingAnswerError;

    const isUniqueAnswer = isValidAnswer && existingAnswers.length === 0;

    // Submit the answer
    const { data: submittedAnswer, error } = await supabase
      .from("answers")
      .insert({
        game_id: gameId,
        user_id: userId,
        answer_text: answer,
        is_instant_win: !!instantWin,
        instant_win_amount: instantWin ? instantWin.prize.prize_amount : 0,
        status: isValidAnswer 
          ? (isUniqueAnswer ? "UNIQUE" : "NOT UNIQUE") 
          : "INVALID",
      })
      .select()
      .single();

    if (error) throw error;

    if (instantWin) {
      await updateInstantWinPrizeQuantity(instantWin.id);
    }

    // Fetch updated user profile
    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    return {
      success: true,
      isValidAnswer,
      isUniqueAnswer,
      instantWin,
      updatedCredits: updatedProfile.credit_balance,
    };
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};

export function checkForInstantWin(
  prizes: GameInstantWinPrize[]
): GameInstantWinPrize | null {
  const availablePrizes = prizes.filter((p) => p.quantity > 0);
  if (availablePrizes.length === 0) return null;

  for (const prize of availablePrizes) {
    if (Math.random() < prize.prize.probability) {
      return prize;
    }
  }
  return null;
}

async function updateInstantWinPrizeQuantity(prizeId: string) {
  const { data, error } = await supabase
    .from("game_instant_win_prizes")
    .select("quantity")
    .eq("id", prizeId)
    .single();

  if (error) {
    console.error("Error fetching prize quantity:", error);
    return;
  }

  if (data && data.quantity > 0) {
    const { error: updateError } = await supabase
      .from("game_instant_win_prizes")
      .update({ quantity: data.quantity - 1 })
      .eq("id", prizeId);

    if (updateError) {
      console.error("Error updating instant win prize quantity:", updateError);
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

export async function getUserAnswers(
  userId: string,
  gameId: string
): Promise<Answer[]> {
  try {
    const { data, error } = await supabase
      .from("answers")
      .select(
        `
        id,
        answer_text,
        status,
        is_instant_win,
        instant_win_amount,
        submitted_at
      `
      )
      .eq("user_id", userId)
      .eq("game_id", gameId)
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching user answers:", error);
      throw error;
    }

    return data.map((answer) => ({
      answer: answer.answer_text,
      status: answer.status || "PENDING",
      isInstantWin: answer.is_instant_win,
      instantWin: answer.is_instant_win
        ? `£${answer.instant_win_amount}`
        : "NO",
      submittedAt: answer.submitted_at,
      // frequency is not included in the database query, so we omit it here
    }));
  } catch (error) {
    console.error("Error in getUserAnswers:", error);
    return [];
  }
}

export async function getCurrentUser(
  userId: string
): Promise<ExtendedUser | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Transform the data into ExtendedUser format
  const extendedUser: ExtendedUser = {
    ...data,
    is_admin: data.is_admin || false,
    username: data.username || data.email?.split("@")[0] || "",
    credit_balance: data.credit_balance || 0,
  };

  return extendedUser;
}
