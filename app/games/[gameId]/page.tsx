"use client";

import { useState, useEffect } from "react";
import { getGameById } from "@/utils/dataHelpers";
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
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndGame = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const currentGame = await getGameById(params.gameId);
        if (currentGame) {
          setGame(currentGame);
          if (!currentGame.answers) {
            currentGame.answers = [];
          }
          setAvailableLuckyDips([...(currentGame.validAnswers || [])]);
        } else {
          router.push("/games");
        }
      } else {
        router.push("/login");
      }
    };

    fetchUserAndGame();
  }, [router, params.gameId, supabase]);

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
            user={user}
            setUser={setUser}
            setGame={setGame}
            availableLuckyDips={availableLuckyDips}
            setAvailableLuckyDips={setAvailableLuckyDips}
            setInstantWinPrizes={setInstantWinPrizes}
            getPartiallyHiddenWord={getPartiallyHiddenWord}
            updateNavbarCredits={updateNavbarCredits}
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
