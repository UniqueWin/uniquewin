import { NextResponse } from "next/server";
import { processEndedGames } from "@/utils/gameLogic";
import { createClient } from "@/utils/supabase/client";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { format, parseISO } from "date-fns";

export async function GET() {
  console.log("Starting process-ended-games route handler");
  const supabase = createClient();

  try {
    const nowUK = toZonedTime(new Date(), "Europe/London");
    console.log("Current UK time:", nowUK);

    // Fetch active games
    const { data: activeGames, error: fetchError } = await supabase
      .from("games")
      .select("id, end_time, status")
      .eq("status", "active");

    if (fetchError) throw fetchError;

    // Close expired games
    const gamesToClose = activeGames.filter((game) => {
      const gameEndTime = toZonedTime(parseISO(game.end_time), "Europe/London");
      return gameEndTime <= nowUK;
    });

    if (gamesToClose.length > 0) {
      const { data: closedGames, error: closeError } = await supabase
        .from("games")
        .update({ status: "ended" })
        .in("id", gamesToClose.map((game) => game.id))
        .select();

      if (closeError) throw closeError;

      // Process winners for closed games
      for (const game of closedGames) {
        // ... existing winner processing logic ...
      }

      return NextResponse.json({
        message: `Closed ${closedGames.length} expired games and processed winners`,
        closedGames: closedGames,
      });
    } else {
      return NextResponse.json({
        message: "No games to close",
        closedGames: [],
      });
    }
  } catch (error) {
    console.error("Error in process-ended-games route handler:", error);
    return NextResponse.json({ error: "Failed to process ended games" }, { status: 500 });
  }
}