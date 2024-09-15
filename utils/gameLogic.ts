import { createClient } from "@/utils/supabase/client";
import { GameInstantWinPrize } from "@/utils/dataHelpers";

export async function processAnswer(
  userId: string,
  gameId: string,
  answer: string,
  instantWinPrizes: GameInstantWinPrize[],
  validAnswers: string[]
) {
  const supabase = createClient();

  try {
    const isValidAnswer = validAnswers.includes(answer.toUpperCase());

    // Fetch user's current credit balance
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Deduct credits from the user
    const { data: updatedUserData, error: updateError } = await supabase
      .from("profiles")
      .update({ credit_balance: (userData.credit_balance || 0) - 1 })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Check if the answer is unique
    const { data: existingAnswers, error: existingAnswerError } = await supabase
      .from("answers")
      .select("id")
      .eq("game_id", gameId)
      .eq("answer_text", answer)
      .limit(1);

    if (existingAnswerError) throw existingAnswerError;

    const isUniqueAnswer = existingAnswers.length === 0;

    // Insert the answer
    const { data: answerData, error: answerError } = await supabase
      .from("answers")
      .insert({
        user_id: userId,
        game_id: gameId,
        answer_text: answer,
        status: isValidAnswer && isUniqueAnswer ? "correct" : "pending",
      })
      .select()
      .single();

    if (answerError) throw answerError;

    let instantWin = null;
    if (!isValidAnswer) {
      instantWin = checkForInstantWin(instantWinPrizes);
      if (instantWin) {
        // Update game_instant_win_prizes quantity
        await supabase
          .from("game_instant_win_prizes")
          .update({ quantity: instantWin.quantity - 1 })
          .eq("id", instantWin.id);

        // Update the answer with instant win information
        await supabase
          .from("answers")
          .update({
            is_instant_win: true,
            instant_win_amount: instantWin.prize.prize_amount,
          })
          .eq("id", answerData.id);

        // Update user's balance
        const balanceColumn = instantWin.prize.prize_type.toLowerCase() === "cash" ? "account_balance" : "credit_balance";
        await supabase
          .from("profiles")
          .update({
            [balanceColumn]: updatedUserData[balanceColumn] + instantWin.prize.prize_amount
          })
          .eq("id", userId);
      }
    }

    return { success: true, isValidAnswer, isUniqueAnswer, instantWin };
  } catch (error) {
    console.error("Error processing answer:", error);
    throw error;
  }
}

function checkForInstantWin(prizes: GameInstantWinPrize[]): GameInstantWinPrize | null {
  for (const prize of prizes) {
    if (prize.quantity > 0 && Math.random() < prize.prize.probability) {
      return prize;
    }
  }
  return null;
}

export async function purchaseLuckyDip(
  userId: string,
  gameId: string,
  availableAnswers: string[],
  luckyDipPrice: number
) {
  const supabase = createClient();

  try {
    // Fetch user's current credit balance
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Deduct lucky dip price from user's credit balance
    const { data: updatedUserData, error: updateError } = await supabase
      .from("profiles")
      .update({ credit_balance: (userData.credit_balance || 0) - luckyDipPrice })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    if (updatedUserData.credit_balance < 0) {
      throw new Error("Insufficient credits");
    }

    // Select a random answer from available answers
    const randomAnswer = availableAnswers[Math.floor(Math.random() * availableAnswers.length)];

    // Insert the answer
    const { data: answerData, error: answerError } = await supabase
      .from("answers")
      .insert({
        user_id: userId,
        game_id: gameId,
        answer_text: randomAnswer,
        status: "pending",
        is_lucky_dip: true,
      })
      .select()
      .single();

    if (answerError) throw answerError;

    return { success: true, answer: randomAnswer };
  } catch (error) {
    console.error("Error purchasing lucky dip:", error);
    throw error;
  }
}
