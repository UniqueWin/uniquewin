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
      .limit(50);

    if (error) throw error;

    // Fetch related data separately
    const userIds = Array.from(new Set(winners.map(w => w.user_id)));
    const gameIds = Array.from(new Set(winners.map(w => w.game_id)));
    const answerIds = Array.from(new Set(winners.map(w => w.answer_id)));

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

    console.log("Unique answer IDs:", answerIds.length);
    console.log("Fetched answers:", answers?.length);

    // Original winners data
    const originalWinners = winners.map(winner => {
      const profile = profiles?.find(p => p.id === winner.user_id);
      const game = games?.find(g => g.id === winner.game_id);
      const answer = answers?.find(a => a.id === winner.answer_id);
      return {
        id: winner.id,
        username: profile?.username,
        question: game?.question,
        prize_amount: winner.prize_amount,
        winning_answer: answer?.answer_text
      };
    }).slice(0, 5);

    // Group by user
    const groupedByUser = userIds.reduce((acc, userId) => {
      const userWins = winners.filter(w => w.user_id === userId);
      const profile = profiles?.find(p => p.id === userId);
      
      const winningAnswersByGame = userWins.reduce((gameAcc, win) => {
        const game = games?.find(g => g.id === win.game_id);
        const answer = answers?.find(a => a.id === win.answer_id);
        if (game?.question && answer?.answer_text) {
          if (!gameAcc[game.question]) {
            gameAcc[game.question] = new Set();
          }
          gameAcc[game.question].add(answer.answer_text);
        }
        return gameAcc;
      }, {} as Record<string, Set<string>>);

      // Convert Sets to Arrays
      const winningAnswersByGameArray = Object.fromEntries(
        Object.entries(winningAnswersByGame).map(([key, value]) => [key, Array.from(value)])
      );

      acc.push({
        id: userId,
        username: profile?.username,
        totalPrize: userWins.reduce((sum, w) => sum + Number(w.prize_amount), 0),
        winningAnswersByGame: winningAnswersByGameArray
      });

      return acc;
    }, [] as Array<{
      id: string;
      username: string | undefined;
      totalPrize: number;
      winningAnswersByGame: Record<string, string[]>;
    }>);

    // Sort users by total prize and slice to get top 5
    const topWinnersByUser = groupedByUser
      .sort((a, b) => b.totalPrize - a.totalPrize)
      .slice(0, 5);

    // Group by game
    const groupedByGame = gameIds.map(gameId => {
      const gameWins = winners.filter(w => w.game_id === gameId);
      const game = games?.find(g => g.id === gameId);
      
      // Use a Map to group winners by user_id
      const uniqueWinners = new Map();
      
      gameWins.forEach(w => {
        const profile = profiles?.find(p => p.id === w.user_id);
        const answer = answers?.find(a => a.id === w.answer_id);
        
        if (profile && answer) {
          if (!uniqueWinners.has(w.user_id)) {
            uniqueWinners.set(w.user_id, {
              username: profile.username,
              prize: Number(w.prize_amount),
              answers: new Set([answer.answer_text])
            });
          } else {
            const existingWinner = uniqueWinners.get(w.user_id);
            existingWinner.prize += Number(w.prize_amount);
            existingWinner.answers.add(answer.answer_text);
          }
        }
      });

      return {
        id: gameId,
        question: game?.question,
        totalPrize: gameWins.reduce((sum, w) => sum + Number(w.prize_amount), 0),
        winners: Array.from(uniqueWinners.values()).map(w => ({
          username: w.username,
          prize: w.prize,
          answer: Array.from(w.answers).join(", ")
        }))
      };
    }).sort((a, b) => b.totalPrize - a.totalPrize).slice(0, 5);

    console.log("Grouped by game:", JSON.stringify(groupedByGame, null, 2));

    return NextResponse.json({ originalWinners, groupedByUser: topWinnersByUser, groupedByGame });
  } catch (error: any) {
    console.error("Error fetching winners:", error);
    return NextResponse.json(
      { error: "Failed to fetch winners", details: error.message },
      { status: 500 }
    );
  }
}