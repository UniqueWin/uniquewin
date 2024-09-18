import { NextResponse } from "next/server";
import { processEndedGames } from "@/utils/gameLogic";
import { createClient } from "@/utils/supabaseClient";

export async function GET() {
  const supabase = createClient();

  try {
    // Fetch ended games that haven't been processed
    const { data: endedGames, error: gamesError } = await supabase
      .from("games")
      .select("*")
      .eq("status", "ended")
      .eq("prizes_distributed", false);

    if (gamesError) throw gamesError;

    for (const game of endedGames) {
      // Fetch winners for this game
      const { data: winners, error: winnersError } = await supabase
        .from("winners")
        .select("*")
        .eq("game_id", game.id);

      if (winnersError) throw winnersError;

      const winnerCount = winners.length;
      const prizePerWinner = game.current_prize / winnerCount;

      // Update each winner with their adjusted prize amount
      for (const winner of winners) {
        await supabase
          .from("winners")
          .update({ prize_amount: prizePerWinner })
          .eq("id", winner.id);

        // Update user's account balance
        await supabase.rpc("add_to_account_balance", {
          user_id: winner.user_id,
          amount: prizePerWinner
        });
      }

      // Mark the game as processed
      await supabase
        .from("games")
        .update({ prizes_distributed: true })
        .eq("id", game.id);
    }

    return NextResponse.json({ message: "Processed ended games and distributed prizes" });
  } catch (error) {
    console.error("Error processing ended games:", error);
    return NextResponse.json({ error: "Failed to process ended games" }, { status: 500 });
  }
}