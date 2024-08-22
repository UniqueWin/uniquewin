import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface HangmanGameProps {
  word: string;
  onWin: () => void;
  onLose: () => void;
}

export function HangmanGame({ word, onWin, onLose }: HangmanGameProps) {
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [remainingGuesses, setRemainingGuesses] = useState(6);

  const maskedWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter.toLowerCase()) ? letter : '_'))
    .join(' ');

  const availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    if (maskedWord.replace(/ /g, '') === word) {
      onWin();
    } else if (remainingGuesses === 0) {
      onLose();
    }
  }, [maskedWord, remainingGuesses, word, onWin, onLose]);

  const handleGuess = (letter: string) => {
    const lowerLetter = letter.toLowerCase();
    if (!guessedLetters.has(lowerLetter)) {
      const newGuessedLetters = new Set(guessedLetters).add(lowerLetter);
      setGuessedLetters(newGuessedLetters);
      if (!word.toLowerCase().includes(lowerLetter)) {
        setRemainingGuesses(prev => prev - 1);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold">{maskedWord}</div>
      <div>Remaining guesses: {remainingGuesses}</div>
      <div className="flex flex-wrap gap-2">
        {availableLetters.map(letter => (
          <Button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.has(letter.toLowerCase())}
            className="w-8 h-8 p-0"
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}