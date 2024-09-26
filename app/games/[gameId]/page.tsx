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
import RealTimeAnswers from "./RealTimeAnswers";
import YourAnswers from "./YourAnswers"; // Import the new component
import NewGameRewards from "./NewGameRewards";

interface UserAnswer {
  answer: string;
  status: string;
  isInstantWin: boolean;
  instantWin: string;
  submittedAt: string;
}

function adjustToLocal(utcDateString: string): Date {
  const date = new Date(utcDateString);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
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
          setGameAnswers(allAnswers); // Set initial game answers
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
        const endTime = adjustToLocal(game.end_time);
        const distance = endTime.getTime() - now.getTime();

        if (distance < 0) {
          clearInterval(timer);
          setCountdown("GAME OVER");
          setShowGameHistory(false);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
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

  const [gameAnswers, setGameAnswers] = useState<any[]>([]); // New state for game answers

  if (!user || !game) return <div>Loading...</div>;

  return (
    <div className="bg-black bg-opacity-10 rounded-xl my-2 min-h-screen flex flex-col">
      <RealTimeAnswers
        gameId={params.gameId}
        userId={user?.id}
        setUserAnswers={setUserAnswers}
        setGameAnswers={setGameAnswers} // Pass the new setter
      />
      <div className="container mx-auto p-4 flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-transparent">
            <CardContent className="flex justify-center items-center p-6">
              <h2 className="text-4xl font-bold text-white">
                Game ends in:{" "}
                <span className="text-yellow-300">{countdown}</span>
              </h2>
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
          />

          <YourAnswers
            userAnswers={userAnswers}
            gameAnswers={gameAnswers} // Use the new state
            loading={userAnswersLoading}
          />

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
              <NewGameRewards prizes={instantWinPrizes} />
              <hr className="my-4 border-gray-300" />
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
