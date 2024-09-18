import { createClient } from "@/utils/supabase/client";
import { checkForInstantWin } from './dataHelpers';

export async function processAnswer(
  userId: string,
  gameId: string,
  answer: string,
  validAnswers: string[]
) {
  const supabase = createClient();
  console.log('Starting processAnswer', { userId, gameId, answer, validAnswersCount: validAnswers.length });

  try {
    // Check if the user has already submitted this answer (case-insensitive)
    const { data: existingUserAnswer, error: existingUserAnswerError } = await supabase
      .from("answers")
      .select("id")
      .eq("game_id", gameId)
      .eq("user_id", userId)
      .ilike("answer_text", answer)
      .limit(1);

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

    // Check if the answer already exists for ANY user in this game (case-insensitive)
    const { data: existingAnswers, error: existingAnswerError } = await supabase
      .from("answers")
      .select("id, status")
      .eq("game_id", gameId)
      .ilike("answer_text", answer);

    if (existingAnswerError) throw existingAnswerError;

    const isUniqueAnswer = existingAnswers.length === 0;

    // Update all existing answers with the same text to NOT UNIQUE if this is a new non-unique answer
    if (!isUniqueAnswer && isValidAnswer) {
      const { data: updatedAnswers, error: updateError } = await supabase
        .from("answers")
        .update({ status: "NOT UNIQUE" })
        .eq("game_id", gameId)
        .ilike("answer_text", answer)
        .select();

      if (updateError) throw updateError;
    }

    // Determine the status for the new answer
    let status;
    if (isValidAnswer) {
      status = isUniqueAnswer ? "UNIQUE" : "NOT UNIQUE";
    } else {
      status = "PENDING";
    }

    // Check for instant win
    const instantWin = await checkForInstantWin(gameId, answer);

    // Update the answer in the database
    const { data: newAnswer, error: answerError } = await supabase
      .from("answers")
      .insert({
        game_id: gameId,
        user_id: userId,
        answer_text: answer,
        status: status,
        is_instant_win: !!instantWin,
        instant_win_amount: instantWin ? instantWin.prize_amount : null,
      })
      .select()
      .single();

    if (answerError) throw answerError;

    // If it's an instant win, update the status
    if (instantWin) {
      await supabase
        .from("answer_instant_wins")
        .update({ status: 'UNLOCKED', winner_id: userId })
        .eq("id", instantWin.id);
    }

    return {
      success: true,
      isValidAnswer,
      isUniqueAnswer,
      isInstantWin: !!instantWin,
      instantWinAmount: instantWin ? instantWin.prize_amount : null,
    };
  } catch (error) {
    console.error("Error processing answer:", error);
    throw error;
  }
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

export const scratchCard = async (gameId: string, prizeId: string) => {
  const supabase = createClient();

  try {
    const { data: updatedPrize, error: updateError } = await supabase
      .from('answer_instant_wins')
      .update({ status: 'SCRATCHED' })
      .eq('id', prizeId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      status: updatedPrize.status,
      prizeAmount: updatedPrize.prize_amount,
    };
  } catch (error) {
    console.error('Error in scratchCard:', error);
    throw error;
  }
};

export async function processEndedGames() {
  const supabase = createClient();

  const { data: endedGames, error: gamesError } = await supabase
    .from("games")
    .select("id, current_prize")
    .eq("status", "ended");

  if (gamesError) {
    console.error("Error fetching ended games:", gamesError);
    return;
  }

  for (const game of endedGames) {
    const { data: uniqueAnswers, error: answersError } = await supabase
      .from("answers")
      .select("id, user_id, answer_text")
      .eq("game_id", game.id)
      .eq("status", "UNIQUE");

    if (answersError) {
      console.error(`Error fetching answers for game ${game.id}:`, answersError);
      continue;
    }

    // Group unique answers by user
    const userAnswers = uniqueAnswers.reduce((acc: { [key: string]: any[] }, answer) => {
      if (!acc[answer.user_id]) {
        acc[answer.user_id] = [];
      }
      acc[answer.user_id].push(answer);
      return acc;
    }, {});

    const totalUniqueAnswers = uniqueAnswers.length;
    const prizePerAnswer = totalUniqueAnswers > 0 ? game.current_prize / totalUniqueAnswers : 0;

    for (const [userId, answers] of Object.entries(userAnswers)) {
      const userPrize = prizePerAnswer * answers.length;

      // Update user balance
      const { data: userData, error: fetchError } = await supabase
        .from('profiles')
        .select('account_balance')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error(`Error fetching balance for user ${userId}:`, fetchError);
        continue;
      }

      const newBalance = (userData.account_balance || 0) + userPrize;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ account_balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        console.error(`Error updating balance for user ${userId}:`, updateError);
        continue;
      }

      // Create winner entries
      for (const answer of answers) {
        const { error: winnerError } = await supabase
          .from("winners")
          .insert({
            game_id: game.id,
            user_id: userId,
            answer_id: answer.id,
            prize_amount: prizePerAnswer
          });

        if (winnerError) {
          console.error(`Error inserting winner for game ${game.id}:`, winnerError);
        }
      }
    }

    // Update game status
    const { error: updateGameError } = await supabase
      .from("games")
      .update({ status: "completed" })
      .eq("id", game.id);

    if (updateGameError) {
      console.error(`Error updating game ${game.id} status:`, updateGameError);
    }
  }
}
