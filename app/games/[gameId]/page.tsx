"use client";

import { useState, useEffect } from "react";
import {
  getGameById,
  getUserAnswers,
  getAnswerInstantWinPrizes,
  getWinnerName,
} from "@/utils/dataHelpers";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Game } from "@/utils/dataHelpers";
import { ExtendedUser } from "@/utils/userHelpers";
import Footer from "@/components/Footer";
import Banner from "./Banner";
import TrustPilot from "./Trustpilot";
import History from "./History";
import Question from "./Question";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScratchCardComponent from "./ScratchCardComponent";
import { cn } from "@/lib/utils";
import GameRewards from "./GameRewards";

interface UserAnswer {
  answer: string;
  status: string;
  isInstantWin: boolean;
  instantWin: string;
  submittedAt: string;
}

export default function GamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [availableLuckyDips, setAvailableLuckyDips] = useState<string[]>([]);
  const [showGameHistory, setShowGameHistory] = useState(true);
  const [instantWinPrizes, setInstantWinPrizes] = useState<any[]>([]);
  const [countdown, setCountdown] = useState("");
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [userAnswersLoading, setUserAnswersLoading] = useState(true);
  const supabase = createClient();

  const [winnerNames, setWinnerNames] = useState<{ [key: string]: string }>({});

  const fetchWinnerNames = async (prizes: any[]) => {
    const names: { [key: string]: string } = {};

    for (const prize of prizes) {
      if (prize.status === "SCRATCHED") {
        names[prize.id] = await getWinnerName(prize.winner_id);
      }
    }
    setWinnerNames(names);
  };

  const fetchUserAndGame = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return;
      }

      const extendedUser: ExtendedUser = {
        ...user,
        id: user.id,
        username: profileData.username || "",
        is_admin: profileData.is_admin || false,
        email: user.email || "",
        credit_balance: profileData.credit_balance || 0,
        account_balance: profileData.account_balance || 0,
      };
      setUser(extendedUser);

      const currentGame = await getGameById(params.gameId);
      if (currentGame) {
        // Fetch all answers for the game
        const { data: allAnswers, error: answersError } = await supabase
          .from("answers")
          .select("*")
          .eq("game_id", params.gameId);

        if (answersError) {
          console.error("Error fetching game answers:", answersError);
        } else {
          currentGame.answers = allAnswers;
        }

        setGame(currentGame);
        setAvailableLuckyDips(currentGame.valid_answers || []);

        setUserAnswersLoading(true);
        const answers = await getUserAnswers(user.id, params.gameId);
        setUserAnswers(
          answers.map((answer) => ({
            answer: answer.answer,
            status: answer.status,
            isInstantWin: answer.isInstantWin,
            instantWin: answer.instantWin,
            submittedAt: answer.submittedAt,
          })) || []
        );

        setUserAnswersLoading(false);

        const gameInstantWinPrizes = await getAnswerInstantWinPrizes(
          params.gameId
        );
        setInstantWinPrizes(gameInstantWinPrizes);

        await fetchWinnerNames(gameInstantWinPrizes);
      } else {
        router.push("/games");
      }
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchUserAndGame();
  }, [router, params.gameId, supabase]);

  useEffect(() => {
    if (game) {
      const timer = setInterval(() => {
        const now = new Date();
        const endTime = new Date(game.end_time);
        const distance = endTime.getTime() - now.getTime();

        if (distance < 0) {
          clearInterval(timer);
          setCountdown("GAME OVER");
          setShowGameHistory(false);
        } else {
          const minutes = Math.floor(distance / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          setShowGameHistory(minutes > 30);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [game]);

  const getPartiallyHiddenWord = (word: string) => {
    return word
      .split("")
      .map((char, index) => {
        if (index === 0 || index === word.length - 1 || Math.random() < 0.3) {
          return char;
        }
        return "_";
      })
      .join(" ");
  };

  const updateNavbarCredits = () => {
    // This function should be passed down from a parent component
    // that has access to the Navbar's fetchUserAndCredits function
    // For now, we'll just call fetchUserAndGame to update the local state
    fetchUserAndGame();
  };

  const refreshUserAnswers = async () => {
    if (user) {
      setUserAnswersLoading(true);
      const answers = await getUserAnswers(user.id, params.gameId);
      setUserAnswers(
        answers.map((answer) => ({
          answer: answer.answer,
          status: answer.status,
          isInstantWin: answer.isInstantWin,
          instantWin: answer.instantWin,
          submittedAt: answer.submittedAt,
        })) || []
      );
      setUserAnswersLoading(false);
    }
  };

  const refreshPage = async () => {
    await fetchUserAndGame();
  };

  const [userWonPrizes, setUserWonPrizes] = useState<any[]>([]);
  const [otherPrizes, setOtherPrizes] = useState<any[]>([]);

  useEffect(() => {
    if (instantWinPrizes.length > 0 && user) {
      const userWon = instantWinPrizes.filter(
        (prize) => prize.winner_id === user.id
      );
      const others = instantWinPrizes.filter(
        (prize) => prize.winner_id !== user.id
      );
      setUserWonPrizes(userWon);
      setOtherPrizes(others);
    }
  }, [instantWinPrizes, user]);

  if (!user || !game) return <div>Loading...</div>;

  return (
    <div className="bg-red-800 min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Add a new Card component to display the current prize */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">
                Prize
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                £{game.current_prize}
              </p>
            </CardContent>
          </Card>

          <Question
            game={game}
            setGame={setGame}
            availableLuckyDips={game?.valid_answers || []}
            setAvailableLuckyDips={setAvailableLuckyDips}
            instantWinPrizes={instantWinPrizes}
            setInstantWinPrizes={setInstantWinPrizes}
            getPartiallyHiddenWord={getPartiallyHiddenWord}
            updateNavbarCredits={updateNavbarCredits}
            onAnswerSubmitted={refreshUserAnswers}
            refreshPage={refreshPage}
          />

          {userAnswersLoading ? (
            <div>Loading your answers...</div>
          ) : userAnswers.length > 0 ? (
            <Card className="my-8">
              <CardHeader>
                <CardTitle className="text-xl text-black font-bold mb-4">
                  Your Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Answer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Instant Win Prize</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAnswers.map((answer, index) => {
                      const uniqueAnswersCount =
                        game.answers?.filter((a) => a.status === "UNIQUE")
                          .length || 0;
                      const statusColor =
                        answer.status === "UNIQUE" && uniqueAnswersCount === 1
                          ? "text-green-500"
                          : answer.status === "UNIQUE"
                          ? "text-orange-500"
                          : answer.status === "NOT UNIQUE"
                          ? "text-red-500"
                          : "text-black";

                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {answer.answer}
                          </TableCell>
                          <TableCell className={cn("font-medium", statusColor)}>
                            {answer.status}
                          </TableCell>
                          <TableCell>
                            {answer.instantWin !== "NO"
                              ? answer.instantWin
                              : "No instant win"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="my-8 text-black">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-red-700">
                  No answers submitted yet
                </CardTitle>
              </CardHeader>
              <CardContent className="text-black p-4">
                You haven't submitted any answers for this game yet.
              </CardContent>
            </Card>
          )}

          {/* Updated Instant Win Prizes card */}
          <Card className="my-8">
            <CardHeader>
              <CardTitle className="text-3xl text-black font-bold">
                Instant Win Prizes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GameRewards
                prizes={instantWinPrizes}
                userId={user.id}
                gameId={params.gameId}
                refreshPage={refreshPage}
              />
              <hr className="my-4 border-gray-300" />

              {/* <h3 className="text-lg font-semibold mb-2">Other Prizes</h3>
              <Table className="overflow-y-scroll h-[300px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Winner</TableHead>
                    <TableHead>Prize</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-y-scroll h-[300px]">
                  {otherPrizes.map((prize, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {prize.status === "LOCKED"
                          ? "Not won yet"
                          : prize.status === "UNLOCKED"
                          ? "Waiting for winner to scratch"
                          : winnerNames[prize.id] || "Loading..."}
                      </TableCell>
                      <TableCell>
                        <ScratchCardComponent
                          prize={
                            prize.prize_type === "CASH"
                              ? `£${prize.prize_amount}`
                              : prize.prize_type === "CREDITS"
                              ? `${prize.prize_amount} credits`
                              : prize.prize_type
                          }
                          onReveal={refreshPage}
                          gameId={params.gameId}
                          prizeId={prize.id}
                          userId={user.id}
                          status={prize.status}
                          winnerId={prize.winner_id}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </CardContent>
          </Card>

          {/* {showGameHistory && (
            <History game={game} instantWinPrizes={instantWinPrizes} />
          )} */}

          <Banner />

          <TrustPilot />
        </motion.div>
      </div>
    </div>
  );
}
