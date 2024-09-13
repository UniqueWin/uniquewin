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
    hangmanWords: ["THOMAS", "TIMOTHY", "TYLER", "THEODORE", "TREVOR"], // Add this line
  },
  {
    id: 2,
    question: "NAME A FRUIT THAT STARTS WITH 'A'",
    jackpot: 1200,
    startTime: "2023-06-02T00:00:00Z",
    endTime: "2023-06-02T23:59:59Z",
    validAnswers: ["APPLE", "APRICOT", "AVOCADO", "ACAI", "ACKEE"],
    answers: [
      { answer: "ACKEE", frequency: 1, status: "UNIQUE", instantWin: "NO" },
      { answer: "APPLE", frequency: 5, status: "NOT UNIQUE", instantWin: "NO" },
    ],
    lucky_dip_answers: [],
    hangmanWords: ["APPLE", "APRICOT", "AVOCADO", "ACAI", "ACKEE"], // Add this line
  },
  {
    id: 3,
    question: "NAME A COUNTRY IN EUROPE",
    jackpot: 2000,
    startTime: "2023-06-03T00:00:00Z",
    endTime: "2023-06-03T23:59:59Z",
    validAnswers: ["FRANCE", "GERMANY", "ITALY", "SPAIN", "POLAND"],
    answers: [
      { answer: "POLAND", frequency: 1, status: "UNIQUE", instantWin: "NO" },
      { answer: "FRANCE", frequency: 4, status: "NOT UNIQUE", instantWin: "NO" },
    ],
    lucky_dip_answers: [],
    hangmanWords: ["FRANCE", "GERMANY", "ITALY", "SPAIN", "POLAND"], // Add this line
  },
];