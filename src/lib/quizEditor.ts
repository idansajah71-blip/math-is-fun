"use client";

import type { QuizQuestion } from "./types";
import { getAllQuizzes } from "./data";
import { getLocalDateStr } from "./gamification";

const STORAGE_KEY = "matika_user_quizzes";

export interface UserQuiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  shareCode: string;
  topicFilter: string[];
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
  isPublic: boolean;
  playCount: number;
}

function getAll(): UserQuiz[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(quizzes: UserQuiz[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    console.warn("Failed to save quizzes: storage quota exceeded");
  }
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function createQuiz(
  title: string,
  description: string,
  createdBy: string,
  createdByName: string,
  topicFilter: string[],
  difficulty: "easy" | "medium" | "hard",
  questionIds: string[],
  isPublic: boolean
): UserQuiz {
  const allQuizzes = getAllQuizzes();
  const questions = allQuizzes.filter((q) => questionIds.includes(q.id));

  const quiz: UserQuiz = {
    id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description,
    createdBy,
    createdByName,
    createdAt: getLocalDateStr(),
    shareCode: generateCode(),
    topicFilter,
    difficulty,
    questions,
    isPublic,
    playCount: 0,
  };

  const quizzes = getAll();
  quizzes.push(quiz);
  saveAll(quizzes);

  return quiz;
}

export function updateQuiz(
  quizId: string,
  updates: Partial<Pick<UserQuiz, "title" | "description" | "topicFilter" | "difficulty" | "questions" | "isPublic">>
): UserQuiz | null {
  const quizzes = getAll();
  const idx = quizzes.findIndex((q) => q.id === quizId);
  if (idx === -1) return null;

  quizzes[idx] = { ...quizzes[idx], ...updates };
  saveAll(quizzes);
  return quizzes[idx];
}

export function deleteQuiz(quizId: string): boolean {
  const quizzes = getAll();
  const filtered = quizzes.filter((q) => q.id !== quizId);
  if (filtered.length === quizzes.length) return false;
  saveAll(filtered);
  return true;
}

export function getQuizById(quizId: string): UserQuiz | undefined {
  return getAll().find((q) => q.id === quizId);
}

export function getQuizByCode(code: string): UserQuiz | undefined {
  return getAll().find((q) => q.shareCode === code.toUpperCase());
}

export function getUserQuizzes(userId: string): UserQuiz[] {
  return getAll().filter((q) => q.createdBy === userId);
}

export function getPublicQuizzes(): UserQuiz[] {
  return getAll().filter((q) => q.isPublic);
}

export function incrementPlayCount(quizId: string) {
  const quizzes = getAll();
  const quiz = quizzes.find((q) => q.id === quizId);
  if (quiz) {
    quiz.playCount++;
    saveAll(quizzes);
  }
}

export function getQuestionsByTopics(topics: string[], difficulty?: string): QuizQuestion[] {
  let pool = getAllQuizzes().filter((q) => q.type === "choice" && q.options && q.options.length >= 4);
  if (topics.length > 0) {
    pool = pool.filter((q) => topics.includes(q.topicSlug));
  }
  if (difficulty) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }
  return pool;
}
