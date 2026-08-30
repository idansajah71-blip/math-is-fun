"use client";

import { getAllQuizzes } from "./data";
import { getLocalDateStr } from "./gamification";

const STORAGE_KEY = "matika_daily_challenge";

export interface DailyChallengeSubmission {
  userId: string;
  userName: string;
  date: string;
  answer: number;
  timeMs: number;
  isCorrect: boolean;
  xpEarned: number;
}

export interface DailyChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicSlug: string;
}

function seedRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) | 0;
    return (h >>> 0) / 4294967296;
  };
}

export function getDailyChallengeQuestion(): DailyChallengeQuestion | null {
  const today = getLocalDateStr();
  const quizzes = getAllQuizzes().filter((q) => q.type === "choice" && q.options && q.options.length >= 4);
  if (quizzes.length === 0) return null;

  const rng = seedRandom(today);
  const idx = Math.floor(rng() * quizzes.length);
  const q = quizzes[idx];

  return {
    id: q.id,
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    topicSlug: q.topicSlug,
  };
}

function getSubmissions(): DailyChallengeSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSubmissions(subs: DailyChallengeSubmission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

export function hasSubmittedToday(userId: string): boolean {
  const today = getLocalDateStr();
  const subs = getSubmissions();
  return subs.some((s) => s.userId === userId && s.date === today);
}

export function submitAnswer(
  userId: string,
  userName: string,
  answer: number,
  timeMs: number
): { xpEarned: number; isCorrect: boolean } {
  const today = getLocalDateStr();

  // Prevent duplicate submissions
  if (hasSubmittedToday(userId)) return { xpEarned: 0, isCorrect: false };

  const q = getDailyChallengeQuestion();
  if (!q) return { xpEarned: 0, isCorrect: false };

  const isCorrect = answer === q.correctIndex;
  let xpEarned = 0;
  if (isCorrect) {
    xpEarned = 10;
    if (timeMs < 10000) xpEarned += 5; // Speed bonus
  }

  const submission: DailyChallengeSubmission = {
    userId,
    userName,
    date: today,
    answer,
    timeMs,
    isCorrect,
    xpEarned,
  };

  const subs = getSubmissions();
  subs.push(submission);
  saveSubmissions(subs);

  return { xpEarned, isCorrect };
}

export function getDailyLeaderboard(): (DailyChallengeSubmission & { rank: number })[] {
  const today = getLocalDateStr();
  const subs = getSubmissions().filter((s) => s.date === today);

  // Sort: correct first (desc), then by time (asc)
  subs.sort((a, b) => {
    if (a.isCorrect !== b.isCorrect) return a.isCorrect ? -1 : 1;
    return a.timeMs - b.timeMs;
  });

  // Deduplicate: keep only latest per user
  const seen = new Map<string, DailyChallengeSubmission>();
  for (const s of subs) {
    seen.set(s.userId, s);
  }

  return Array.from(seen.values()).map((s, i) => ({ ...s, rank: i + 1 }));
}

export function getTodayStats(): { total: number; correct: number; avgTimeMs: number } {
  const today = getLocalDateStr();
  const subs = getSubmissions().filter((s) => s.date === today && s.timeMs < 60000);
  if (subs.length === 0) return { total: 0, correct: 0, avgTimeMs: 0 };

  const correct = subs.filter((s) => s.isCorrect).length;
  const avgTimeMs = subs.reduce((a, s) => a + s.timeMs, 0) / subs.length;

  return { total: subs.length, correct, avgTimeMs };
}
