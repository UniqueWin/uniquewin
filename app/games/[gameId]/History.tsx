"use client";

import React from "react";
import { motion } from "framer-motion";
import ScratchCardComponent from "./ScratchCardComponent";
import { Game, GameInstantWinPrize } from "@/utils/dataHelpers";

type HistoryProps = {
  game: Game;
  instantWinPrizes: GameInstantWinPrize[];
};

function History({ game, instantWinPrizes }: HistoryProps) {
  const calculateWinnings = () => {
    const uniqueAnswers =
      game?.answers?.filter((a) => a.status === "UNIQUE") || [];
    return uniqueAnswers.length
      ? (750 / uniqueAnswers.length).toFixed(2)
      : "0.00";
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
                        instantWinPrizes[game.answers.length - 1 - index]
                          ? instantWinPrizes[game.answers.length - 1 - index]
                              .prize.prize_type === "CASH"
                            ? instantWinPrizes[game.answers.length - 1 - index]
                                .prize.prize_amount
                            : `${
                                instantWinPrizes[
                                  game.answers.length - 1 - index
                                ].prize.prize_details
                              }`
                          : "£0"
                      }
                      onReveal={() => {}}
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

export default History;
