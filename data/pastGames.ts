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
    start_time: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    end_time: new Date().toISOString(),
    current_prize: 1000,
  },
  {
    id: "2",
    question: "NAME A FRUIT THAT STARTS WITH 'A'",
    gameStatus: "completed",
    jackpot: 1200,
    validAnswers: ["APPLE", "APRICOT", "AVOCADO", "ACAI", "ACKEE"],
    answers: [
      { answer: "ACKEE", frequency: 1, status: "UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "APPLE", frequency: 5, status: "NOT UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
    ],
    lucky_dip_answers: [],
    hangmanWords: ["APPLE", "APRICOT", "AVOCADO", "ACAI", "ACKEE"],
    start_time: new Date(Date.now() - 172800000).toISOString(), // 48 hours ago
    end_time: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    current_prize: 1200,
  },
  {
    id: "3",
    question: "NAME A COUNTRY IN EUROPE",
    gameStatus: "completed",
    jackpot: 2000,
    validAnswers: ["FRANCE", "GERMANY", "ITALY", "SPAIN", "POLAND"],
    answers: [
      { answer: "POLAND", frequency: 1, status: "UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
      { answer: "FRANCE", frequency: 4, status: "NOT UNIQUE", instantWin: "NO", isInstantWin: false, submittedAt: new Date().toISOString() },
    ],
    lucky_dip_answers: [],
    hangmanWords: ["FRANCE", "GERMANY", "ITALY", "SPAIN", "POLAND"],
    start_time: new Date(Date.now() - 259200000).toISOString(), // 72 hours ago
    end_time: new Date(Date.now() - 172800000).toISOString(), // 48 hours ago
    current_prize: 2000,
  },
];