import { Game, Answer } from "@/utils/dataHelpers";

export const pastGames: Game[] = [
  {
    id: "1",
    question: "Name a boy's name beginning with T",
    gameStatus: "completed",
    jackpot: 1000,
    validAnswers: ["THOMAS", "TIMOTHY", "TYLER", "THEODORE", "TREVOR"],
    answers: [
      { answer: "THOMAS", frequency: 50, status: "NOT UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "TIMOTHY", frequency: 30, status: "NOT UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "TYLER", frequency: 20, status: "NOT UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "THEODORE", frequency: 1, status: "UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "TREVOR", frequency: 1, status: "UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
    ],
    lucky_dip_answers: [],
    hangmanWords: ["THOMAS", "TIMOTHY", "TYLER", "THEODORE", "TREVOR"],
    endTime: new Date().toISOString(), // Add this line
    current_prize: 1000, // Add this line
  },
  {
    id: "2", // Change to string
    question: "NAME A FRUIT THAT STARTS WITH 'A'",
    gameStatus: "completed", // Add this line
    jackpot: 1200,
    validAnswers: ["APPLE", "APRICOT", "AVOCADO", "ACAI", "ACKEE"],
    answers: [
      { answer: "ACKEE", frequency: 1, status: "UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "APPLE", frequency: 5, status: "NOT UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
    ],
    lucky_dip_answers: [],
    hangmanWords: ["APPLE", "APRICOT", "AVOCADO", "ACAI", "ACKEE"],
    endTime: new Date().toISOString(), // Add this line
    current_prize: 1200, // Add this line
  },
  {
    id: "3", // Change to string
    question: "NAME A COUNTRY IN EUROPE",
    gameStatus: "completed", // Add this line
    jackpot: 2000,
    validAnswers: ["FRANCE", "GERMANY", "ITALY", "SPAIN", "POLAND"],
    answers: [
      { answer: "POLAND", frequency: 1, status: "UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "FRANCE", frequency: 4, status: "NOT UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
    ],
    lucky_dip_answers: [],
    hangmanWords: ["FRANCE", "GERMANY", "ITALY", "SPAIN", "POLAND"],
    endTime: new Date().toISOString(), // Add this line
    current_prize: 2000, // Add this line
  },
];