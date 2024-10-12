import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CoinFlipAnimation from './CoinFlipAnimation';
// import DiceRollAnimation from '../DiceRollAnimation';
import { BonusGameType as GameBonusGameType } from "@/app/games/[gameId]/types"; // Import from types.ts

enum BonusGameType {
  COIN_FLIP = 'COIN_FLIP',
  DICE_ROLL = 'DICE_ROLL',
  MYSTERY_BOX = 'MYSTERY_BOX',
  WHEEL_SPIN = 'WHEEL_SPIN'
}

interface BonusGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: GameBonusGameType; // Use the type from types.ts
  onGameComplete: (result: number) => void;
}

export function BonusGameModal({ isOpen, onClose, gameType, onGameComplete }: BonusGameModalProps) {
  const [result, setResult] = useState<number | null>(null);

  const handleCoinFlipComplete = (flipResult: 'heads' | 'tails') => {
    const gameResult = flipResult === 'heads' ? 0 : 1;
    setResult(gameResult);
    onGameComplete(gameResult);
  };

  const handleDiceRollComplete = (rollResult: number) => {
    setResult(rollResult);
    onGameComplete(rollResult);
  };

  const playGame = () => {
    let gameResult: number;
    switch (gameType) {
      case BonusGameType.COIN_FLIP:
        // Coin flip is handled by CoinFlipAnimation component
        return;
      case BonusGameType.DICE_ROLL:
        gameResult = Math.floor(Math.random() * 6) + 1;
        break;
      case BonusGameType.MYSTERY_BOX:
        gameResult = Math.floor(Math.random() * 3);
        break;
      default:
        return;
    }
    setResult(gameResult);
    onGameComplete(gameResult);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bonus Game: {gameType}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          {gameType === BonusGameType.COIN_FLIP ? (
            <CoinFlipAnimation onFlipComplete={handleCoinFlipComplete} />
          // ) : gameType === BonusGameType.DICE_ROLL ? (
          //   <DiceRollAnimation onRollComplete={handleDiceRollComplete} />
          ) : result === null ? (
            <Button onClick={playGame}>Play {gameType}</Button>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <p className="text-2xl font-bold">
                Result: {result}
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}