"use client";

import type { QuizQuestion } from "@/lib/types";
import { getAllQuizzes } from "@/lib/data";

const PARTICIPANTS_KEY = "matika_event_participants";

export type EventType =
  | "boss_battle"
  | "speed_blitz"
  | "marathon"
  | "trivia_night"
  | "elimination"
  | "mystery"
  | "challenge_week";

export interface EventData {
  id: string;
  name: string;
  type: EventType;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  topics: string[];
  difficulty: "easy" | "medium" | "hard";
  questionsCount: number;
  lives: number;
  rewards: { xp: number; gems: number; badge: string | null };
  maxParticipants: number;
  status: "draft" | "scheduled" | "active" | "ended";
  createdBy: string;
  createdAt: string;
}

export interface EventParticipant {
  eventId: string;
  userId: string;
  joinedAt: string;
  status: "joined" | "playing" | "completed" | "failed";
  score: number;
  xpEarned: number;
  gemsEarned: number;
  badgeEarned: string | null;
  completedAt?: string;
  questionsAnswered?: number;
  livesRemaining?: number;
  timeSpent?: number;
  currentBossHP?: number;
  eliminationRound?: number;
  mysteryRevealed?: number;
  challengeDay?: number;
}

export const EVENT_TYPES: Record<EventType, { label: string; icon: string; gradient: string; description: string }> = {
  boss_battle: { label: "Boss Battle", icon: "⚔️", gradient: "from-red-500 to-orange-500", description: "Lawan boss! Setiap jawaban benar kurangi HP boss." },
  speed_blitz: { label: "Speed Blitz", icon: "⚡", gradient: "from-yellow-500 to-amber-500", description: "Jawab sebanyak mungkin dalam waktu terbatas!" },
  marathon: { label: "Marathon", icon: "🏃", gradient: "from-blue-500 to-cyan-500", description: "Quiz panjang dengan lives terbatas. Selesaikan semua soal!" },
  trivia_night: { label: "Trivia Night", icon: "🧠", gradient: "from-purple-500 to-pink-500", description: "Soal campuran dari berbagai topik. Uji pengetahuanmu!" },
  elimination: { label: "Elimination", icon: "💀", gradient: "from-gray-700 to-gray-900", description: "Salah jawab = opsi berkurang. Hati-hati!" },
  mystery: { label: "Mystery", icon: "🎲", gradient: "from-emerald-500 to-teal-500", description: "Soal tersembunyi, muncul satu per satu. Tebak jawabannya!" },
  challenge_week: { label: "Challenge Week", icon: "📅", gradient: "from-indigo-500 to-violet-500", description: "7 hari, 7 challenge. Selesaikan semua untuk reward besar!" },
};

function getParticipants(): EventParticipant[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PARTICIPANTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveParticipants(list: EventParticipant[]) {
  localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(list));
}

export function getActiveEvents(): EventData[] {
  try {
    const events: EventData[] = JSON.parse(localStorage.getItem("matika-admin-events") || "[]");
    return events.filter((e) => e.status === "active");
  } catch {
    return [];
  }
}

export function getAllEvents(): EventData[] {
  try {
    return JSON.parse(localStorage.getItem("matika-admin-events") || "[]");
  } catch {
    return [];
  }
}

export function syncEventStatuses(): EventData[] {
  try {
    const events: EventData[] = JSON.parse(localStorage.getItem("matika-admin-events") || "[]");
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);
    let changed = false;
    const updated = events.map((e) => {
      if (e.status === "scheduled" && e.startDate && (e.startDate < today || (e.startDate === today && e.startTime <= currentTime))) {
        changed = true;
        return { ...e, status: "active" as const };
      }
      if (e.status === "active" && e.endDate && (e.endDate < today || (e.endDate === today && e.endTime <= currentTime))) {
        changed = true;
        return { ...e, status: "ended" as const };
      }
      return e;
    });
    if (changed) {
      localStorage.setItem("matika-admin-events", JSON.stringify(updated));
    }
    return updated;
  } catch {
    return [];
  }
}

export function getEventById(id: string): EventData | undefined {
  return getAllEvents().find((e) => e.id === id);
}

export function isEventJoined(eventId: string, userId: string): boolean {
  return getParticipants().some((p) => p.eventId === eventId && p.userId === userId);
}

export function joinEvent(eventId: string, userId: string): { participant?: EventParticipant; error?: string } {
  const event = getEventById(eventId);
  if (!event) return { error: "Event tidak ditemukan" };
  if (event.status !== "active") return { error: "Event belum aktif atau sudah berakhir" };

  const participants = getParticipants();
  const existing = participants.find((p) => p.eventId === eventId && p.userId === userId);
  if (existing) return { participant: existing };

  if (event.maxParticipants > 0) {
    const eventParticipants = participants.filter((p) => p.eventId === eventId);
    if (eventParticipants.length >= event.maxParticipants) {
      return { error: "Event sudah penuh" };
    }
  }

  const participant: EventParticipant = {
    eventId,
    userId,
    joinedAt: new Date().toISOString(),
    status: "joined",
    score: 0,
    xpEarned: 0,
    gemsEarned: 0,
    badgeEarned: null,
  };
  participants.push(participant);
  saveParticipants(participants);
  return { participant };
}

export function updateParticipant(eventId: string, userId: string, updates: Partial<EventParticipant>): void {
  const participants = getParticipants();
  const idx = participants.findIndex((p) => p.eventId === eventId && p.userId === userId);
  if (idx !== -1) {
    participants[idx] = { ...participants[idx], ...updates };
    saveParticipants(participants);
  }
}

export function resetParticipant(eventId: string, userId: string): void {
  updateParticipant(eventId, userId, {
    status: "joined",
    score: 0,
    xpEarned: 0,
    gemsEarned: 0,
    badgeEarned: null,
    completedAt: undefined,
    questionsAnswered: 0,
    livesRemaining: undefined,
    timeSpent: undefined,
    currentBossHP: undefined,
    eliminationRound: 0,
    mysteryRevealed: 0,
    challengeDay: 0,
  });
}

export function getParticipant(eventId: string, userId: string): EventParticipant | undefined {
  return getParticipants().find((p) => p.eventId === eventId && p.userId === userId);
}

export function getEventParticipants(eventId: string): EventParticipant[] {
  return getParticipants().filter((p) => p.eventId === eventId);
}

export function getEventLeaderboard(eventId: string): EventParticipant[] {
  return getEventParticipants(eventId)
    .filter((p) => p.status === "completed")
    .sort((a, b) => b.score - a.score);
}

export function getEventQuestions(event: EventData): QuizQuestion[] {
  const allQuizzes = getAllQuizzes();
  let pool = allQuizzes.filter((q) => event.topics.includes(q.topicSlug));

  if (pool.length === 0) {
    pool = [...allQuizzes];
  }

  const diffFiltered = pool.filter((q) => q.difficulty === event.difficulty);
  if (diffFiltered.length >= event.questionsCount) {
    pool = diffFiltered;
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, event.questionsCount);
}

export function calculateRewards(
  event: EventData,
  score: number,
  totalQuestions: number,
  timeSpent: number
): { xp: number; gems: number; badge: string | null } {
  const pct = totalQuestions > 0 ? score / totalQuestions : 0;
  const baseXP = event.rewards.xp;
  const baseGems = event.rewards.gems;

  const xpMultiplier = pct >= 0.9 ? 1.5 : pct >= 0.7 ? 1.2 : pct >= 0.5 ? 1.0 : 0.5;
  const xp = Math.round(baseXP * xpMultiplier);

  const gemsMultiplier = pct >= 0.9 ? 1.3 : pct >= 0.7 ? 1.1 : 1.0;
  const gems = Math.round(baseGems * gemsMultiplier);

  const badge = pct >= 0.8 ? event.rewards.badge : null;

  return { xp, gems, badge };
}
