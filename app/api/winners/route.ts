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
        prize_amount,
        user_id,
        game_id,
        answer_id
      `)
      .order('announced_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    // Fetch related data separately
    const userIds = winners.map(w => w.user_id);
    const gameIds = winners.map(w => w.game_id);
    const answerIds = winners.map(w => w.answer_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);

    const { data: games } = await supabase
      .from("games")
      .select("id, question")
      .in("id", gameIds);

    const { data: answers } = await supabase
      .from("answers")
      .select("id, answer_text")
      .in("id", answerIds);

    // Combine the data
    const formattedWinners = winners.map(winner => {
      const profile = profiles?.find(p => p.id === winner.user_id);
      const game = games?.find(g => g.id === winner.game_id);
      const answer = answers?.find(a => a.id === winner.answer_id);

      return {
        id: winner.id,
        games: { question: game?.question },
        profiles: { username: profile?.username },
        prize_amount: winner.prize_amount,
        winning_answer: answer?.answer_text
      };
    });

    return NextResponse.json(formattedWinners);
  } catch (error: any) {
    console.error("Error fetching winners:", error);
    return NextResponse.json(
      { error: "Failed to fetch winners", details: error.message },
      { status: 500 }
    );
  }
}