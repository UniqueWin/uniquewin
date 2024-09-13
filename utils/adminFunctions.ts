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

export const fetchQuickStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const { data: activeGames } = await supabase
    .from("games")
    .select("count", { count: "exact" })
    .eq("status", "active");

  const { data: totalPlayers } = await supabase
    .from("profiles")
    .select("count", { count: "exact" });

  const { data: winnersPrizes } = await supabase
    .from("winners")
    .select("prize_amount");

  const totalPrizeAwarded = winnersPrizes?.reduce((sum, winner) => sum + (winner.prize_amount || 0), 0) || 0;

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

  return {
    quickStats: {
      activeGames: activeGames?.[0]?.count || 0,
      totalPlayers: totalPlayers?.[0]?.count || 0,
      totalPrizeAwarded: totalPrizeAwarded,
      gamesLast24Hours: gamesLast24Hours?.[0]?.count || 0,
      instantWinsToday: instantWinsToday?.[0]?.count || 0,
      totalLuckyDips: totalLuckyDips?.[0]?.count || 0,
    },
    recentPlayerActivities,
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