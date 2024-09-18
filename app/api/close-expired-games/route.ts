import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { format, parseISO, subMinutes } from "date-fns";

export const dynamic = "force-dynamic";

function getCurrentUKTime(): Date {
  return toZonedTime(new Date(), "Europe/London");
}

function formatDateTimeLocal(date: Date): string {
  return formatInTimeZone(date, "Europe/London", "yyyy-MM-dd HH:mm:ss");
}

export async function POST() {
  const supabase = createClient();

  try {
    // Get current time
    const nowUK = getCurrentUKTime();

    console.log("Current UK time (raw):", nowUK);
    console.log("Current UK time (formatted):", formatDateTimeLocal(nowUK));

    // Fetch active games
    const { data: activeGames, error: fetchError } = await supabase
      .from("games")
      .select("id, end_time, status")
      .eq("status", "active");

    if (fetchError) throw fetchError;

    // Close expired games
    const gamesToClose = activeGames.filter((game) => {
      const gameEndTime = toZonedTime(parseISO(game.end_time), "Europe/London");

      const isExpired = gameEndTime <= nowUK;

      return isExpired;
    });

    if (gamesToClose.length > 0) {
      const { data: closedGames, error: closeError } = await supabase
        .from("games")
        .update({ status: "ended" })
        .in(
          "id",
          gamesToClose.map((game) => game.id)
        )
        .select();

      if (closeError) throw closeError;

      // Update last_cleanup timestamp
      const { error: updateError } = await supabase
        .from("last_cleanup")
        .update({ last_run: formatDateTimeLocal(nowUK) })
        .eq("id", 1);

      if (updateError) throw updateError;

      return NextResponse.json({
        message: `Closed ${closedGames?.length || 0} expired games`,
        closedGames: closedGames,
      });
    } else {
      return NextResponse.json({
        message: "No games to close",
        closedGames: [],
      });
    }
  } catch (error: any) {
    console.error("Error closing expired games:", error);
    return NextResponse.json(
      { error: "Failed to close expired games", details: error.message },
      { status: 500 }
    );
  }
}
