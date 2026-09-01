"use client";

import type { Topic, QuizQuestion, Level } from "@/lib/types";

const TOPICS_KEY = "matika_admin_topics";
const QUESTIONS_KEY = "matika_admin_questions";

export interface ManagedTopic extends Topic {
  isPublished: boolean;
  createdBy: string;
  updatedAt: string;
}

export interface ManagedQuestion extends QuizQuestion {
  isPublished: boolean;
  createdBy: string;
  updatedAt: string;
}

function getStoredTopics(): ManagedTopic[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(TOPICS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveStoredTopics(topics: ManagedTopic[]) {
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
}

function getStoredQuestions(): ManagedQuestion[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveStoredQuestions(questions: ManagedQuestion[]) {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
}

function hasDuplicatePattern(text: string, windowSize = 20, maxRepeats = 5): boolean {
  if (text.length < windowSize * maxRepeats) return false;
  for (let i = 0; i <= text.length - windowSize * maxRepeats; i++) {
    const chunk = text.substring(i, i + windowSize);
    let repeats = 0;
    for (let j = i; j <= text.length - windowSize; j += windowSize) {
      if (text.substring(j, j + windowSize) === chunk) repeats++;
      else break;
    }
    if (repeats >= maxRepeats) return true;
  }
  return false;
}

export function getAllTopics(): ManagedTopic[] {
  return getStoredTopics();
}

export function getTopicBySlug(slug: string): ManagedTopic | undefined {
  return getStoredTopics().find((t) => t.slug === slug);
}

export function createTopic(topic: Omit<ManagedTopic, "updatedAt">): ManagedTopic {
  const topics = getStoredTopics();
  const newTopic: ManagedTopic = { ...topic, updatedAt: new Date().toISOString() };
  topics.push(newTopic);
  saveStoredTopics(topics);
  return newTopic;
}

export function updateTopic(slug: string, updates: Partial<ManagedTopic>): ManagedTopic | null {
  const topics = getStoredTopics();
  const idx = topics.findIndex((t) => t.slug === slug);
  if (idx === -1) return null;
  const existing = topics[idx];
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  if (merged.content && hasDuplicatePattern(merged.content)) {
    console.warn(`[content] Rejected duplicate content for topic "${slug}"`);
    merged.content = existing.content;
  }
  topics[idx] = merged;
  saveStoredTopics(topics);
  return topics[idx];
}

export function deleteTopic(slug: string): boolean {
  const topics = getStoredTopics();
  const filtered = topics.filter((t) => t.slug !== slug);
  if (filtered.length === topics.length) return false;
  saveStoredTopics(filtered);
  return true;
}

export function getAllQuestions(): ManagedQuestion[] {
  return getStoredQuestions();
}

export function getQuestionsByTopic(topicSlug: string): ManagedQuestion[] {
  return getStoredQuestions().filter((q) => q.topicSlug === topicSlug);
}

export function getQuestionById(id: string): ManagedQuestion | undefined {
  return getStoredQuestions().find((q) => q.id === id);
}

export function createQuestion(question: Omit<ManagedQuestion, "updatedAt">): ManagedQuestion {
  const questions = getStoredQuestions();
  const newQ: ManagedQuestion = { ...question, updatedAt: new Date().toISOString() };
  questions.push(newQ);
  saveStoredQuestions(questions);
  return newQ;
}

export function updateQuestion(id: string, updates: Partial<ManagedQuestion>): ManagedQuestion | null {
  const questions = getStoredQuestions();
  const idx = questions.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  questions[idx] = { ...questions[idx], ...updates, updatedAt: new Date().toISOString() };
  saveStoredQuestions(questions);
  return questions[idx];
}

export function deleteQuestion(id: string): boolean {
  const questions = getStoredQuestions();
  const filtered = questions.filter((q) => q.id !== id);
  if (filtered.length === questions.length) return false;
  saveStoredQuestions(filtered);
  return true;
}

export function getContentStats() {
  const topics = getStoredTopics();
  const questions = getStoredQuestions();
  return {
    totalTopics: topics.length,
    publishedTopics: topics.filter((t) => t.isPublished).length,
    draftTopics: topics.filter((t) => !t.isPublished).length,
    totalQuestions: questions.length,
    publishedQuestions: questions.filter((q) => q.isPublished).length,
    questionsByLevel: {
      smp: questions.filter((q) => topics.find((t) => t.slug === q.topicSlug)?.level === "smp").length,
      sma: questions.filter((q) => topics.find((t) => t.slug === q.topicSlug)?.level === "sma").length,
      kuliah: questions.filter((q) => topics.find((t) => t.slug === q.topicSlug)?.level === "kuliah").length,
    },
  };
}
