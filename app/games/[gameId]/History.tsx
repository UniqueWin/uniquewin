"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScratchCardComponent from "./ScratchCardComponent";
import { Game, GameInstantWinPrize } from "@/utils/dataHelpers";
import { useParams } from 'next/navigation';

type HistoryProps = {
  game: Game;
  instantWinPrizes: GameInstantWinPrize[];
};

export default function History({ game, instantWinPrizes }: HistoryProps) {
  const { gameId } = useParams();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // ... existing code to set userId ...
  }, []);

  const calculateWinnings = () => {
    const uniqueAnswers =
      game?.answers?.filter((a) => a.status === "UNIQUE") || [];
    return uniqueAnswers.length
      ? (750 / uniqueAnswers.length).toFixed(2)
      : "0.00";
  };

  const getPrizeValue = (prize: GameInstantWinPrize | undefined): string | number => {
    if (!prize) return '';
    if (typeof prize.prize === 'string' || typeof prize.prize === 'number') return prize.prize;
    return JSON.stringify(prize.prize);
  };

  const getWinners = (game: Game): string[] => {
    const uniqueAnswers = game.answers?.filter(a => a.status === "UNIQUE") || [];
    return uniqueAnswers.map(answer => answer.user_id);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-white text-black p-6 rounded-lg shadow-md mb-6"
    >
      <h3 className="text-xl font-bold mb-4">GAME HISTORY</h3>
      <p className="mb-4">YOU ARE CURRENTLY WINNING: £{calculateWinnings()}</p>
      <div className="overflow-x-auto">
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="text-left">YOUR ANSWER</th>
              <th className="text-left">ANSWER FREQUENCY</th>
              <th className="text-left">ANSWER STATUS</th>
              <th className="text-left">INSTANT WIN</th>
            </tr>
          </thead>
          <tbody>
            {[...(game.answers || [])].reverse().map((answer, index) => (
              <tr key={index}>
                <td>{answer.answer}</td>
                <td>{/* {answer.frequency} */}</td>
                <td
                  className={
                    answer.status === "UNIQUE"
                      ? "text-green-500"
                      : answer.status === "NOT UNIQUE"
                      ? "text-red-500"
                      : "text-orange-500"
                  }
                >
                  {answer.status}
                </td>
                <td className="text-center text-xs">
                  {answer.instantWin === "REVEAL" ? (
                    <ScratchCardComponent
                      prize={
                        game.answers &&
                        getPrizeValue(instantWinPrizes[game.answers.length - 1 - index])
                      }
                      onReveal={() => {}}
                      gameId={gameId as string}
                      prizeId={answer.answer || `prize-${index}`} // Using answer as prizeId, or a fallback
                      userId={userId || ''}
                      status="SCRATCHED"
                      winnerId={getWinners(game).includes(answer.user_id) ? answer.user_id : ''}
                    />
                  ) : (
                    answer.instantWin
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
