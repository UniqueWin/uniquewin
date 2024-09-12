"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  getCurrentGame,
  getGameById,
  submitAnswer,
} from "@/utils/dataHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScratchCard } from "next-scratchcard";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { Game, Answer } from "@/utils/dataHelpers";
import { User } from "@/utils/userHelpers";
import Header from "@/components/Header"; // Import Header
import Footer from "@/components/Footer"; // Import Footer
import Banner from "./Banner";
import TrustPilot from "./Trustpilot";
import ScratchCardComponent from "./ScratchcardComponent";
import History from "./History";
import Question from "./Question";
import { Bell, Trophy } from "lucide-react";

const luckyDipNames = ["THEODRE", "TEDDY", "THOMAS", "TREVOR", "TAYTE"];

export default function GamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [availableLuckyDips, setAvailableLuckyDips] = useState<string[]>([]);
  const [showGameHistory, setShowGameHistory] = useState(true);
  const [instantWinPrizes, setInstantWinPrizes] = useState<{
    [key: number]: { type: "money" | "word"; value: string };
  }>({});
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const currentUser = getCurrentUser(parseInt(userId));
      if (currentUser) {
        setUser(currentUser as User);
        getGameById(params.gameId).then((currentGame) => {
          console.log("Game ID:", params.gameId);
          console.log("Current Game:", currentGame);
          if (currentGame) {
            setGame(currentGame);
            // Initialize answers if it doesn't exist
            if (!currentGame.answers) {
              currentGame.answers = [];
            }
            // Set available Lucky Dips from validAnswers
            setAvailableLuckyDips([...(currentGame.validAnswers || [])]);
          } else {
            router.push("/games");
          }
        });
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router, params.gameId]);

  useEffect(() => {
    if (game) {
      const timer = setInterval(() => {
        const now = new Date();
        const endTime = new Date(game.endTime);
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
            user={user}
            setUser={setUser}
            setGame={setGame}
            availableLuckyDips={availableLuckyDips}
            setAvailableLuckyDips={setAvailableLuckyDips}
            setInstantWinPrizes={setInstantWinPrizes}
            getPartiallyHiddenWord={getPartiallyHiddenWord}
          />
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
