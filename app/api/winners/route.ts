import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();

  try {
    const { data: winners, error } = await supabase
      .from("winners")
      .select(`
        id,
        games (question),
        users (
          profiles (username)
        ),
        prize_amount,
        winning_answer
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    // Reshape the data to match the expected format
    const formattedWinners = winners.map(winner => ({
      id: winner.id,
      games: winner.games,
      profiles: { username: winner.users.profiles.username },
      prize_amount: winner.prize_amount,
      winning_answer: winner.winning_answer
    }));

    return NextResponse.json(formattedWinners);
  } catch (error: any) {
    console.error("Error fetching winners:", error);
    return NextResponse.json(
      { error: "Failed to fetch winners", details: error.message },
      { status: 500 }
    );
  }
}