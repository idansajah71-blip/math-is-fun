"use client";

import type { Topic, QuizQuestion, Level } from "./types";
import topicsData from "./topics.json";
import { quizzes as staticQuizzes } from "./quizzes";

const TOPICS_KEY = "belajarmtk_admin_topics";
const QUESTIONS_KEY = "belajarmtk_admin_questions";
const SEEDED_KEY = "belajarmtk_content_seeded";

function getAdminTopics(): { slug: string; title: string; level: Level; section: string; icon: string; content: string; description: string; isPublished: boolean }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(TOPICS_KEY) || "[]");
  } catch { return []; }
}

function getAdminQuestions(): (QuizQuestion & { isPublished: boolean; createdBy?: string; updatedAt?: string })[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  } catch { return []; }
}

function autoSeedAdminContent(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;

  const topics = (topicsData as Topic[]).map((t) => ({
    ...t,
    isPublished: true,
    createdBy: "system",
    updatedAt: new Date().toISOString(),
  }));

  const questions = staticQuizzes.map((q) => ({
    ...q,
    isPublished: true,
    createdBy: "system",
    updatedAt: new Date().toISOString(),
  }));

  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  localStorage.setItem(SEEDED_KEY, "true");
}

// Auto-seed on module load
autoSeedAdminContent();

export function getAllTopics(): Topic[] {
  const adminTopics = getAdminTopics();
  const staticTopics = topicsData as Topic[];

  if (adminTopics.length === 0) return staticTopics;

  const adminMap = new Map(adminTopics.filter((t) => t.isPublished).map((t) => [t.slug, t]));
  const adminSlugs = new Set(adminTopics.map((t) => t.slug));

  const merged: Topic[] = [];

  for (const t of staticTopics) {
    const adminOverride = adminMap.get(t.slug);
    if (adminOverride) {
      merged.push({
        id: t.id,
        slug: t.slug,
        title: adminOverride.title || t.title,
        level: adminOverride.level || t.level,
        section: adminOverride.section || t.section,
        icon: adminOverride.icon || t.icon,
        content: adminOverride.content || t.content,
        description: adminOverride.description || t.description,
      });
    } else {
      merged.push(t);
    }
  }

  for (const t of adminTopics) {
    if (t.isPublished && !adminSlugs.has(t.slug)) {
      merged.push({
        id: `admin-${t.slug}`,
        slug: t.slug,
        title: t.title,
        level: t.level,
        section: t.section,
        icon: t.icon,
        content: t.content,
        description: t.description,
      });
    }
  }

  return merged;
}

export function getTopicsByLevel(level: Level): Topic[] {
  return getAllTopics().filter((t) => t.level === level);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return getAllTopics().find((t) => t.slug === slug);
}

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase();
  return getAllTopics().filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
  );
}

export function getAllQuizzes(): QuizQuestion[] {
  const adminQuestions = getAdminQuestions();
  const publishedAdmin = adminQuestions.filter((q) => q.isPublished);

  if (publishedAdmin.length === 0) return staticQuizzes;

  const adminIds = new Set(publishedAdmin.map((q) => q.id));
  const result: QuizQuestion[] = [];

  for (const q of publishedAdmin) {
    const merged: QuizQuestion = {
      id: q.id,
      topicSlug: q.topicSlug,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      type: q.type as QuizQuestion["type"],
      difficulty: q.difficulty as QuizQuestion["difficulty"],
      hints: q.hints,
      alternatives: q.alternatives,
      equation: q.equation,
      numberLine: q.numberLine,
      sorting: q.sorting,
      graph: q.graph,
      geometry: q.geometry,
      venn: q.venn,
    };
    result.push(merged);
  }

  for (const q of staticQuizzes) {
    if (!adminIds.has(q.id)) {
      result.push(q);
    }
  }

  return result;
}
