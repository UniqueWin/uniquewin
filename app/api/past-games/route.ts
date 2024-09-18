import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  const { data: pastGames, error } = await supabase
    .from("games")
    .select(`
      id,
      question,
      start_time,
      end_time,
      current_prize,
      winners (
        user_id,
        prize_amount,
        profiles (username)
      )
    `)
    .eq("status", "completed")
    .order("end_time", { ascending: false });

  if (error) {
    console.error("Error fetching past games:", error);
    return NextResponse.json({ error: "Failed to fetch past games" }, { status: 500 });
  }

  return NextResponse.json(pastGames);
}