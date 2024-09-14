import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = createClient();

  try {
    const now = new Date().toISOString();

    // Update all active games that have passed their end time
    const { data, error } = await supabase
      .from("games")
      .update({ status: "ended" })
      .eq("status", "active")
      .lt("end_time", now)
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: `Closed ${data?.length || 0} expired games`,
    });
  } catch (error) {
    console.error("Error closing expired games:", error);
    return NextResponse.json(
      { error: "Failed to close expired games" },
      { status: 500 }
    );
  }
}
