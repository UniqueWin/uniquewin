import users from "../data/users.json";
import games from "../data/games.json";

export function getCurrentUser(userId: number) {
  return users.find((user) => user.id === userId);
}

export function getCurrentGame() {
  const game = games[0]; // Assuming you want the first game
  return {
    ...game,
    endTime: new Date(game.endTime), // Convert endTime to Date object
  };
}

export function submitAnswer(userId: number, gameId: number, answer: string) {
  const user = getCurrentUser(userId);
  const game = getCurrentGame();

  if (user && game) {
    // Update user's game history
    const newAnswer = {
      answer,
      frequency: 1,
      status: "PENDING", // This should be updated based on game logic
      instantWin: "NO", // This should be updated based on game logic
    };

    // Add the new answer to the user's game history
    user.gameHistory.push({
      gameId,
      answers: [newAnswer],
    });

    // Update the game's answers
    game.answers.push(newAnswer);
  }
}

// Add more helper functions as needed