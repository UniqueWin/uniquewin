"use client";

import { useState, useEffect } from "react";
import { getGameById, getUserAnswers } from "@/utils/dataHelpers";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Game } from "@/utils/dataHelpers";
import { User } from "@supabase/supabase-js";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScratchCardComponent from "./ScratchCardComponent";
import { ExtendedUser } from "@/utils/userHelpers"; // Add this import

interface UserAnswer {
  answer: string;
  status: string;
  isInstantWin: boolean;
  instantWin: string;
  submittedAt: string;
}

export default function GamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter();
  // const [user, setUser] = useState<User | null>(null);
  //extended user with credit balance and id
  const [user, setUser] = useState<ExtendedUser | null>(null); // Update the user state type
  const [game, setGame] = useState<Game | null>(null);
  const [availableLuckyDips, setAvailableLuckyDips] = useState<string[]>([]);
  const [showGameHistory, setShowGameHistory] = useState(true);
  const [instantWinPrizes, setInstantWinPrizes] = useState<{
    [key: number]: { type: "money" | "word"; value: string };
  }>({});
  const [countdown, setCountdown] = useState("");
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [userAnswersLoading, setUserAnswersLoading] = useState(true);
  const supabase = createClient();

  const fetchUserAndGame = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const extendedUser: ExtendedUser = {
        ...user,
        id: parseInt(user.id, 10), // Convert string id to number
        username: "", // Provide a default value if username is missing
        is_admin: false, // Set a default value or fetch from somewhere
        email: user.email || "", // Provide a default value for email
        credit_balance: 0, // Set a default value or fetch from somewhere
      };
      setUser(extendedUser);
      const currentGame = await getGameById(params.gameId);
      if (currentGame) {
        setGame(currentGame);
        if (!currentGame.answers) {
          currentGame.answers = [];
        }
        setAvailableLuckyDips([...(currentGame.valid_answers || [])]);

        // Fetch user answers for this game
        setUserAnswersLoading(true);
        const answers = await getUserAnswers(user.id, params.gameId);
        // Map the answers to match the UserAnswer interface
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
  };

  if (!user || !game) return <div>Loading...</div>;

  return (
    <div className="bg-red-50 min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Question
            game={game}
            user={user as ExtendedUser} // Cast user to ExtendedUser
            setUser={
              setUser as React.Dispatch<
                React.SetStateAction<ExtendedUser | null>
              >
            }
            setGame={setGame}
            availableLuckyDips={availableLuckyDips}
            setAvailableLuckyDips={setAvailableLuckyDips}
            setInstantWinPrizes={setInstantWinPrizes}
            getPartiallyHiddenWord={getPartiallyHiddenWord}
            updateNavbarCredits={updateNavbarCredits}
          />

          {/* User Answers Table */}
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
                  <TableCaption>Answers</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Answer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Instant Win</TableHead>
                      <TableHead>Instant Win Prize</TableHead>
                      <TableHead className="text-right">Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAnswers.map((answer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {answer.answer}
                        </TableCell>
                        <TableCell>{answer.status}</TableCell>
                        <TableCell>
                          {answer.isInstantWin ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {answer.instantWin !== "NO" ? (
                            <ScratchCardComponent
                              prize={answer.instantWin}
                              onReveal={() => {}}
                            />
                          ) : (
                            "No"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(answer.submittedAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
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

          {showGameHistory && (
            <History game={game} instantWinPrizes={instantWinPrizes} />
          )}

          <Banner />

          <TrustPilot />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
