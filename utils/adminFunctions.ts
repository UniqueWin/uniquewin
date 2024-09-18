import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchGames = async () => {
  const { data, error } = await supabase.from("games").select(`
    *,
    game_instant_win_prizes (
      instant_win_prize_id,
      quantity,
      instant_win_prizes (
        prize_type,
        prize_amount
      )
    )
  `);
  if (error) console.error("Error fetching games:", error);
  return data || [];
};

export const fetchInstantWinPrizes = async () => {
  const { data, error } = await supabase
    .from("instant_win_prizes")
    .select("*");
  if (error) console.error("Error fetching instant win prizes:", error);
  return data || [];
};

export async function fetchQuickStats() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const { data: activeGames } = await supabase
    .from("games")
    .select("count", { count: "exact" })
    .eq("status", "active");

  const { data: totalPlayers } = await supabase
    .from("profiles")
    .select("count", { count: "exact" });

  // Fetch all winners and their prize amounts, along with the original jackpot
  const { data: winnersPrizes, error: winnersError } = await supabase
    .from("winners")
    .select(`
      prize_amount,
      game_id,
      games (
        current_prize
      )
    `);

  if (winnersError) {
    console.error("Error fetching winners:", winnersError);
    return null;
  }

  // Group prizes by game and calculate total payout
  const prizesByGame: { [key: string]: any } = winnersPrizes.reduce((acc: { [key: string]: any }, winner) => {
    if (!acc[winner.game_id]) {
      acc[winner.game_id] = {
        totalPayout: 0,
        winnerCount: 0,
        jackpot: winner.games?.[0]?.current_prize || 0
      };
    }
    acc[winner.game_id].totalPayout += parseFloat(winner.prize_amount) || 0;
    acc[winner.game_id].winnerCount += 1;
    return acc;
  }, {});

  // Adjust payouts to avoid overspill
  let totalPrizeAwarded = 0;
  let totalWinnerCount = 0;

  Object.values(prizesByGame).forEach((game: any) => {
    if (game.totalPayout > game.jackpot) {
      const adjustmentFactor = game.jackpot / game.totalPayout;
      game.totalPayout = game.jackpot;
      game.adjustedPrizePerWinner = game.jackpot / game.winnerCount;
    } else {
      game.adjustedPrizePerWinner = game.totalPayout / game.winnerCount;
    }
    totalPrizeAwarded += game.totalPayout;
    totalWinnerCount += game.winnerCount;
  });

  console.log("Prizes by game (adjusted):", prizesByGame);
  console.log("Total prize awarded (adjusted):", totalPrizeAwarded);
  console.log("Total Unique Wins count:", totalWinnerCount);

  // Fetch all winners and their prize amounts
  const { data: winnersPrizesOriginal, error: winnersErrorOriginal } = await supabase
    .from("winners")
    .select("prize_amount, game_id");

  if (winnersErrorOriginal) {
    console.error("Error fetching winners:", winnersErrorOriginal);
    return null;
  }

  // Calculate the total prize awarded and count winners
  const totalPrizeAwardedOriginal = winnersPrizesOriginal.reduce((sum, winner) => sum + (parseFloat(winner.prize_amount) || 0), 0);
  const winnerCountOriginal = winnersPrizesOriginal.length;

  console.log("Winners prizes:", winnersPrizesOriginal.map(w => w.prize_amount));
  console.log("Calculated totalPrizeAwarded:", totalPrizeAwardedOriginal);
  console.log("Number of winners:", winnerCountOriginal);

  // Group prizes by game
  const prizesByGameOriginal: { [key: string]: number } = winnersPrizesOriginal.reduce((acc: { [key: string]: number }, winner) => {
    if (!acc[winner.game_id]) {
      acc[winner.game_id] = 0;
    }
    acc[winner.game_id] += parseFloat(winner.prize_amount) || 0;
    return acc;
  }, {});

  console.log("Prizes by game:", prizesByGameOriginal);

  const { data: gamesLast24Hours } = await supabase
    .from("answers")
    .select("count", { count: "exact" })
    .gte("submitted_at", yesterday);

  const { data: instantWinsToday } = await supabase
    .from("answers")
    .select("count", { count: "exact" })
    .eq("is_instant_win", true)
    .gte("submitted_at", today);

  const { data: totalLuckyDips } = await supabase
    .from("answers")
    .select("count", { count: "exact" })
    .eq("is_lucky_dip", true);

  const { data: recentAnswers, error: answersError } = await supabase
    .from("answers")
    .select(`
      id,
      submitted_at,
      answer_text,
      user_id,
      game_id
    `)
    .order("submitted_at", { ascending: false })
    .limit(5);

  if (answersError) {
    console.error("Error fetching recent answers:", answersError);
    return null;
  }

  const userIds = recentAnswers.map((answer) => answer.user_id);
  const { data: userProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  if (profilesError) {
    console.error("Error fetching user profiles:", profilesError);
    return null;
  }

  const gameIds = recentAnswers.map((answer) => answer.game_id);
  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("id, question")
    .in("id", gameIds);

  if (gamesError) {
    console.error("Error fetching games:", gamesError);
    return null;
  }

  const recentPlayerActivities = recentAnswers.map((answer) => ({
    ...answer,
    username: userProfiles.find((profile) => profile.id === answer.user_id)?.username || "Unknown User",
    gameQuestion: games.find((game) => game.id === answer.game_id)?.question || "Unknown Game",
  }));

  const { data: totalAnswers } = await supabase
    .from("answers")
    .select("count", { count: "exact" });

  const { data: totalGames } = await supabase
    .from("games")
    .select("count", { count: "exact" });

  const averageAnswersPerGame = totalAnswers?.[0]?.count / totalGames?.[0]?.count || 0;

  // Fetch unique winners
  const { data: uniqueWinners, error: uniqueWinnersError } = await supabase
    .from("winners")
    .select("user_id")
    .order('user_id');

  if (uniqueWinnersError) {
    console.error("Error fetching unique winners:", uniqueWinnersError);
    return null;
  }

  // Count unique winners
  const uniqueWinnerSet = new Set(uniqueWinners.map(winner => winner.user_id));
  const totalWinners = uniqueWinnerSet.size;

  const totalUniqueWins = winnersPrizes.length;

  return {
    quickStats: {
      activeGames: activeGames?.[0]?.count || 0,
      totalPlayers: totalPlayers?.[0]?.count || 0,
      totalPrizeAwarded,
      totalUniqueWins,
      totalWinners,
      averagePrizePerAnswer: totalPrizeAwarded / (totalAnswers?.[0]?.count || 1),
      averagePrizePerWinner: totalPrizeAwarded / (totalWinners || 1),
      gamesLast24Hours: gamesLast24Hours?.[0]?.count || 0,
      instantWinsToday: instantWinsToday?.[0]?.count || 0,
      totalLuckyDips: totalLuckyDips?.[0]?.count || 0,
      totalAnswers: totalAnswers?.[0]?.count || 0,
      averageAnswersPerGame,
    },
    recentPlayerActivities,
    prizesByGame, // Make sure this is included
  };
};

export const fetchAllPlayers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) console.error("Error fetching players:", error);
  return data || [];
};

export const fetchAllGames = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) console.error("Error fetching games:", error);
  return data || [];
};

export const handleGameStatusChange = async (gameId: string, newStatus: string) => {
  const { error } = await supabase
    .from("games")
    .update({ status: newStatus })
    .eq("id", gameId);

  if (error) console.error("Error updating game status:", error);
};

export const handleLogout = async () => {
  await supabase.auth.signOut();
};