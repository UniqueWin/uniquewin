import users from "../data/users.json";

export interface Answer {
  answer: string;
  frequency: number | "PENDING";
  status: "UNIQUE" | "NOT UNIQUE" | "PENDING";
  instantWin: string | "REVEAL" | "PENDING";
}

export interface Game {
  id: number;
  question: string;
  jackpot: number;
  startTime: string;
  endTime: string;
  validAnswers: string[];
  answers: Answer[];
  luckyDipAnswers: string[];
}

export function generateDummyGames(count: number): Game[] {
  const questions = [
    "NAME A BOYS NAME BEGINNING WITH 'T'",
    "NAME A FRUIT THAT STARTS WITH 'A'",
    "NAME A COUNTRY IN EUROPE",
    "NAME A COLOR OF THE RAINBOW",
    "NAME A PLANET IN OUR SOLAR SYSTEM",
  ];

  const generateValidAnswers = (question: string): string[] => {
    switch (question) {
      case "NAME A BOYS NAME BEGINNING WITH 'T'":
        return [
          "THOMAS",
          "TYLER",
          "THEODORE",
          "TREVOR",
          "TRISTAN",
          "TANNER",
          "TATE",
          "THADDEUS",
        ];
      case "NAME A FRUIT THAT STARTS WITH 'A'":
        return ["APPLE", "APRICOT", "AVOCADO", "ACKEE", "ASIAN PEAR"];
      case "NAME A COUNTRY IN EUROPE":
        return [
          "FRANCE",
          "GERMANY",
          "SPAIN",
          "ITALY",
          "POLAND",
          "UKRAINE",
          "SWEDEN",
        ];
      case "NAME A COLOR OF THE RAINBOW":
        return ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "INDIGO", "VIOLET"];
      case "NAME A PLANET IN OUR SOLAR SYSTEM":
        return [
          "MERCURY",
          "VENUS",
          "EARTH",
          "MARS",
          "JUPITER",
          "SATURN",
          "URANUS",
          "NEPTUNE",
        ];
      default:
        return [];
    }
  };

  return Array.from({ length: count }, (_, i) => {
    const question = questions[i % questions.length];
    const validAnswers = generateValidAnswers(question);
    const startTime = new Date(Date.now() + Math.random() * 30 * 60 * 1000); // Start within next 30 minutes
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // End 30 minutes after start

    return {
      id: i + 1,
      question,
      jackpot: 1000 + Math.floor(Math.random() * 1000),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      validAnswers,
      answers: [],
      luckyDipAnswers: validAnswers.slice(0, 5),
    };
  });
}

const dummyGames = generateDummyGames(10);

export function getCurrentUser(userId: number) {
  return users.find((user) => user.id === userId);
}

export function getAllGames(): Game[] {
  return dummyGames.map((game) => ({
    ...game,
    startTime: new Date(game.startTime),
    endTime: new Date(game.endTime),
  }));
}

export function getGameById(gameId: number): Game | undefined {
  const game = dummyGames.find((g) => g.id === gameId);
  if (game) {
    return {
      ...game,
      startTime: new Date(game.startTime),
      endTime: new Date(game.endTime),
    };
  }
  return undefined;
}

export function getCurrentGame(): Game {
  const game = dummyGames[Math.floor(Math.random() * dummyGames.length)];
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
    const newAnswer: Answer = {
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
