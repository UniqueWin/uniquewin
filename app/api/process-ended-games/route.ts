import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

export const dynamic = "force-dynamic";

function getCurrentUKTime(): Date {
  return toZonedTime(new Date(), "Europe/London");
}

function formatDateTimeLocal(date: Date): string {
  return formatInTimeZone(date, "Europe/London", "yyyy-MM-dd HH:mm:ss");
}

export async function POST() {
  console.log("Starting process-ended-games route handler");
  const supabase = createClient();

  try {
    const nowUK = getCurrentUKTime();
    console.log("Current UK time:", formatDateTimeLocal(nowUK));

    // Fetch active games that have ended
    const { data: endedGames, error: fetchError } = await supabase
      .from("games")
      .select("id, current_prize")
      .eq("status", "active")
      .lte("end_time", formatDateTimeLocal(nowUK));

    if (fetchError) throw fetchError;

    let processedGames = 0;

    for (const game of endedGames) {
      // Process winners for each ended game
      const { data: uniqueAnswers, error: answersError } = await supabase
        .from("answers")
        .select("id, user_id, answer_text")
        .eq("game_id", game.id)
        .eq("status", "UNIQUE");

      if (answersError) {
        console.error(`Error fetching answers for game ${game.id}:`, answersError);
        continue;
      }

      const totalUniqueAnswers = uniqueAnswers.length;
      const prizePerAnswer = totalUniqueAnswers > 0 ? game.current_prize / totalUniqueAnswers : 0;

      for (const answer of uniqueAnswers) {
        // Update user balance
        const { data: userData, error: fetchError } = await supabase
          .from('profiles')
          .select('account_balance')
          .eq('id', answer.user_id)
          .single();

        if (fetchError) {
          console.error(`Error fetching balance for user ${answer.user_id}:`, fetchError);
          continue;
        }

        const newBalance = (userData.account_balance || 0) + prizePerAnswer;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ account_balance: newBalance })
          .eq('id', answer.user_id);

        if (updateError) {
          console.error(`Error updating balance for user ${answer.user_id}:`, updateError);
          continue;
        }

        // Create winner entry
        const { error: winnerError } = await supabase
          .from("winners")
          .insert({
            game_id: game.id,
            user_id: answer.user_id,
            answer_id: answer.id,
            prize_amount: prizePerAnswer
          });

        if (winnerError) {
          console.error(`Error inserting winner for game ${game.id}:`, winnerError);
        }
      }

      // Update game status to completed
      const { error: updateGameError } = await supabase
        .from("games")
        .update({ status: "completed" })
        .eq("id", game.id);

      if (updateGameError) {
        console.error(`Error updating game ${game.id} status:`, updateGameError);
      } else {
        processedGames++;
      }
    }

    // Update last_cleanup timestamp
    const { error: updateError } = await supabase
      .from("last_cleanup")
      .update({ last_run: formatDateTimeLocal(nowUK) })
      .eq("id", 1);

    if (updateError) throw updateError;

    return NextResponse.json({
      message: `Processed ${processedGames} ended games`,
      processedGames: processedGames,
    });
  } catch (error) {
    console.error("Error in process-ended-games route handler:", error);
    return NextResponse.json({ error: "Failed to process ended games" }, { status: 500 });
  }
}