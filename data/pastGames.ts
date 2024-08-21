import { Game, Answer } from "@/utils/dataHelpers";

export const pastGames: Game[] = [
  {
    id: 1,
    question: "NAME A BOYS NAME BEGINNING WITH 'T'",
    jackpot: 1500,
    startTime: "2023-06-01T00:00:00Z",
    endTime: "2023-06-01T23:59:59Z",
    validAnswers: ["THOMAS", "TIMOTHY", "TYLER", "THEODORE", "TREVOR"],
    answers: [
      { answer: "THEODORE", frequency: 1, status: "UNIQUE", instantWin: "NO" },
      { answer: "THOMAS", frequency: 3, status: "NOT UNIQUE", instantWin: "NO" },
    ],
    luckyDipAnswers: [],
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
    luckyDipAnswers: [],
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
    luckyDipAnswers: [],
  },
];