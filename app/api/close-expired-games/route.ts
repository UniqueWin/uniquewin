import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();

  try {
    // Use UTC time to avoid timezone issues
    const now = new Date().toISOString();

    // Close expired games
    const { data: closedGames, error: closeError } = await supabase
      .from("games")
      .update({ status: "ended" })
      .eq("status", "active")
      .lt("end_time", now)
      .select();

    if (closeError) throw closeError;

    // Update last_cleanup timestamp
    const { error: updateError } = await supabase
      .from('last_cleanup')
      .update({ last_run: now })
      .eq('id', 1);

    if (updateError) throw updateError;

    return NextResponse.json({
      message: `Closed ${closedGames?.length || 0} expired games`,
    });
  } catch (error) {
    console.error("Error closing expired games:", error);
    return NextResponse.json(
      { error: "Failed to close expired games" },
      { status: 500 }
    );
  }
}
