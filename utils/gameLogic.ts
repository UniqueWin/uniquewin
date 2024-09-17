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
  console.log('Starting processAnswer', { userId, gameId, answer, validAnswersCount: validAnswers.length });
  console.log('Valid answers:', validAnswers);

  try {
    // Check if the user has already submitted this answer (case-insensitive)
    const { data: existingUserAnswer, error: existingUserAnswerError } = await supabase
      .from("answers")
      .select("id")
      .eq("game_id", gameId)
      .eq("user_id", userId)
      .ilike("answer_text", answer)
      .limit(1);

      console.log("Existing user answer:", existingUserAnswer);

    if (existingUserAnswerError) throw existingUserAnswerError;

    if (existingUserAnswer && existingUserAnswer.length > 0) {
      console.log('User has already submitted this answer');
      return {
        success: false,
        message: "You've already submitted this answer.",
      };
    }

    // Make the check case-insensitive
    const isValidAnswer = validAnswers.some(validAnswer => 
      validAnswer.toLowerCase() === answer.toLowerCase()
    );
    console.log('Is valid answer:', isValidAnswer, 'Submitted answer:', answer);

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

    // Check if the answer already exists for ANY user in this game
    const { data: existingAnswers, error: existingAnswerError } = await supabase
      .from("answers")
      .select("id, status")
      .eq("game_id", gameId)
      .ilike("answer_text", answer);

    if (existingAnswerError) throw existingAnswerError;

    const isUniqueAnswer = existingAnswers.length === 0;
    console.log('Is unique answer:', isUniqueAnswer, 'Existing answers:', existingAnswers);

    // Update all existing answers with the same text to NOT UNIQUE if this is a new non-unique answer
    if (!isUniqueAnswer && isValidAnswer) {
      console.log('Updating existing answers to NOT UNIQUE');
      const { data: updatedAnswers, error: updateError } = await supabase
        .from("answers")
        .update({ status: "NOT UNIQUE" })
        .eq("game_id", gameId)
        .ilike("answer_text", answer)
        .select();

      if (updateError) throw updateError;
      console.log('Existing answers updated successfully:', updatedAnswers);
    }

    // Determine the status for the new answer
    let status;
    if (isValidAnswer) {
      status = isUniqueAnswer ? "UNIQUE" : "NOT UNIQUE";
    } else {
      status = "INVALID";
    }
    console.log('Determined status for new answer:', status);

    // Insert the new answer
    const { data: answerData, error: answerError } = await supabase
      .from("answers")
      .insert({
        user_id: userId,
        game_id: gameId,
        answer_text: answer,
        status: status,
      })
      .select()
      .single();

    if (answerError) {
      console.error('Error inserting answer:', answerError);
      throw answerError;
    }
    console.log('Inserted new answer:', answerData);

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

export const purchaseLuckyDip = async (
  userId: string,
  gameId: string,
  availableLuckyDips: string[],
  luckyDipPrice: number
): Promise<{ success: boolean; answer: string; isUniqueAnswer: boolean }> => {
  const supabase = createClient();
  console.log('Starting purchaseLuckyDip', { userId, gameId, luckyDipPrice, availableLuckyDipsCount: availableLuckyDips.length });

  try {
    // Fetch current credit balance
    const { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      throw fetchError;
    }

    console.log('Current credit balance:', userData.credit_balance);

    // Calculate new balance
    const newBalance = (userData.credit_balance || 0) - luckyDipPrice;

    if (newBalance < 0) {
      console.error('Insufficient credits', { currentBalance: userData.credit_balance, luckyDipPrice, newBalance });
      throw new Error("Insufficient credits");
    }

    // Update credit balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credit_balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating credit balance:', updateError);
      throw updateError;
    }

    console.log('Credit balance updated successfully', { newBalance });

    // Get all existing answers for this game
    const { data: existingAnswers, error: existingAnswersError } = await supabase
      .from('answers')
      .select('answer_text')
      .eq('game_id', gameId);

    if (existingAnswersError) {
      console.error('Error fetching existing answers:', existingAnswersError);
      throw existingAnswersError;
    }

    // Filter out already used answers (case-insensitive)
    const unusedAnswers = availableLuckyDips.filter(answer => 
      !existingAnswers.some(existingAnswer => 
        existingAnswer.answer_text.toLowerCase() === answer.toLowerCase()
      )
    );

    if (unusedAnswers.length === 0) {
      throw new Error("No unique Lucky Dip answers available");
    }

    // Select a random answer from unused Lucky Dips
    const randomIndex = Math.floor(Math.random() * unusedAnswers.length);
    const selectedAnswer = unusedAnswers[randomIndex];
    console.log('Selected answer:', selectedAnswer);

    // Insert the new answer (it's guaranteed to be unique)
    console.log('Inserting new answer');
    const { data: insertedAnswer, error: insertError } = await supabase
      .from('answers')
      .insert({
        user_id: userId,
        game_id: gameId,
        answer_text: selectedAnswer,
        status: 'UNIQUE',
        is_lucky_dip: true,
        submitted_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.error('Error inserting new answer:', insertError);
      throw insertError;
    }
    console.log('New answer inserted successfully:', insertedAnswer);

    return { success: true, answer: selectedAnswer, isUniqueAnswer: true };
  } catch (error) {
    console.error('Error in purchaseLuckyDip:', error);
    throw error;
  }
};
