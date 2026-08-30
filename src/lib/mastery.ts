"use client";

import { getProfile, saveProfile } from "./gamification";

export type MasteryLevel = "Baru" | "Dasar" | "Menengah" | "Ahli" | "Master";

export interface MasteryInfo {
  pct: number;
  level: MasteryLevel;
  color: string;
  gradient: string;
}

const MASTERY_LEVELS: { min: number; level: MasteryLevel; color: string; gradient: string }[] = [
  { min: 90, level: "Master", color: "#FFC629", gradient: "from-yellow-400 to-amber-500" },
  { min: 70, level: "Ahli", color: "#25B2F6", gradient: "from-blue-400 to-cyan-500" },
  { min: 40, level: "Menengah", color: "#3DD34C", gradient: "from-green-400 to-emerald-500" },
  { min: 10, level: "Dasar", color: "#BA75FF", gradient: "from-purple-400 to-violet-500" },
  { min: 0, level: "Baru", color: "#9CA3AF", gradient: "from-gray-400 to-gray-500" },
];

export function getMasteryLevel(pct: number): MasteryInfo {
  for (const entry of MASTERY_LEVELS) {
    if (pct >= entry.min) {
      return { pct, level: entry.level, color: entry.color, gradient: entry.gradient };
    }
  }
  return { pct: 0, level: "Baru", color: "#9CA3AF", gradient: "from-gray-400 to-gray-500" };
}

export function getMastery(slug: string): number {
  const profile = getProfile();
  return profile.topicMastery?.[slug] || 0;
}

export function getAllMastery(): Record<string, number> {
  const profile = getProfile();
  return profile.topicMastery || {};
}

export function updateMastery(slug: string, isCorrect: boolean): number {
  const profile = getProfile();
  if (!profile.topicMastery) profile.topicMastery = {};

  const current = profile.topicMastery[slug] || 0;

  if (isCorrect) {
    // Diminishing returns: harder to go from 90→100 than 0→10
    const gain = Math.max(1, Math.round((100 - current) * 0.15));
    profile.topicMastery[slug] = Math.min(100, current + gain);
  } else {
    // Flat -10% penalty
    profile.topicMastery[slug] = Math.max(0, current - 10);
  }

  saveProfile(profile);
  return profile.topicMastery[slug];
}

export function getOverallMastery(): { average: number; mastered: number; total: number } {
  const profile = getProfile();
  const mastery = profile.topicMastery || {};
  const values = Object.values(mastery);

  if (values.length === 0) {
    return { average: 0, mastered: 0, total: 0 };
  }

  const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const mastered = values.filter((v) => v >= 90).length;

  return { average, mastered, total: values.length };
}

export function getMasteredTopics(): string[] {
  const profile = getProfile();
  const mastery = profile.topicMastery || {};
  return Object.entries(mastery)
    .filter(([, v]) => v >= 90)
    .map(([slug]) => slug);
}
