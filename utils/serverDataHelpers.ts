// utils/serverUtils.ts - Ensure this file is only imported in server-side components

import fs from "fs";
import path from "path";
import users from "../data/users.json";
import games from "../data/games.json";

export function getCurrentUser(userId: number) {
  return users.find((user) => user.id === userId);
}

export function getCurrentGame() {
  const game = games[0];
  return {
    ...game,
    endTime: new Date(game.endTime),
  };
}

export function submitAnswer(userId: number, gameId: number, answer: string) {
  const user = getCurrentUser(userId);
  const game = getCurrentGame();

  if (user && game) {
    const validAnswers = game.validAnswers;
    const isValidAnswer = validAnswers.includes(answer.toUpperCase());

    const newAnswer = {
      answer,
      frequency: 1,
      status: isValidAnswer ? "UNIQUE" : "NOT UNIQUE",
      instantWin: "NO",
    };

    user.gameHistory.push({
      gameId,
      answers: [newAnswer],
    });

    game.answers.push(newAnswer);

    writeDataToFile("data/users.json", users);
    writeDataToFile("data/games.json", games);
  }
}

function writeDataToFile(filePath: string, data: any) {
  fs.writeFileSync(
    path.join(process.cwd(), filePath),
    JSON.stringify(data, null, 2)
  );
}
