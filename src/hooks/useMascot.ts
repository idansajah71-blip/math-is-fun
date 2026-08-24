"use client";

import { useMemo } from "react";
import { getProfile, getWeakTopics, LEVEL_NAMES, UserProfile } from "@/lib/gamification";
import { getAllTopics } from "@/lib/mathData";

type MascotMood = "happy" | "thinking" | "celebrate" | "sad" | "idle" | "wink" | "love" | "surprised";

interface MascotState {
  mood: MascotMood;
  message: string;
}

const GREETINGS = [
  "Halo! Siap belajar hari ini?",
  "Hai! Ada yang bisa aku bantu?",
  "Semangat belajar! Aku di sini buat nemenin kamu.",
  "Yuk mulai! Setiap langkah itu penting.",
];

const STREAK_WARNINGS = [
  "Hati-hati, streak kamu hampir hilang! Yuk belajar sebentar.",
  "Jangan sampai streak-nya putus ya! Buka materi sekarang.",
  "Streak kamu berisiko! Satu materi aja cukup buat nyimpen.",
];

const CELEBRATE_MESSAGES = [
  "Keren banget! Terus semangat ya!",
  "Hebat! Kamu makin jago!",
  "Luar biasa! Aku bangga sama kamu!",
  "Pintar! Lanjutkan!",
];

const WEAK_TOPIC_MESSAGES = [
  "Kayaknya kamu perlu latihan di topik {topic} nih. Mau coba?",
  "Aku perhatiin kamu agak kesulitan di {topic}. Yuk belajar bareng!",
  "Topik {topic} butuh perhatian lebih. Aku yakin kamu bisa!",
];

const LEVEL_UP_MESSAGES = [
  "LEVEL UP! Kamu naik ke {level}!",
  "Selamat! Sekarang kamu {level}!",
  "Wow, level baru! {level}!",
];

const IDLE_MESSAGES = [
  "Udah lama gak belajar nih. Yuk mulai lagi!",
  "Kamu kangen aku gak? Hehe. Yuk belajar!",
  "Aku kangen kamu! Buka materi yuk.",
];

const BADGE_MESSAGES = [
  "Kamu baru aja dapet badge {badge}! Keren!",
  "Badge baru: {badge}! Terus kumpulin ya!",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMascotState(profile: UserProfile): MascotState {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Level up check — only triggers when level > lastSeenLevel
  if (profile.level > profile.lastSeenLevel && profile.level > 0) {
    const newLevel = LEVEL_NAMES[profile.level];
    const msg = pickRandom(LEVEL_UP_MESSAGES).replace("{level}", newLevel);
    // Mark as seen so it doesn't trigger again on next mount
    profile.lastSeenLevel = profile.level;
    return { mood: "celebrate", message: msg };
  }

  // Streak at risk
  if (profile.lastActive !== today && profile.lastActive !== yesterday && profile.streak > 0) {
    return { mood: "sad", message: pickRandom(STREAK_WARNINGS) };
  }

  // Weak topics (adaptive learning)
  const weakTopics = getWeakTopics(1);
  if (weakTopics.length > 0 && Math.random() > 0.6) {
    const topicSlug = weakTopics[0];
    const topic = getAllTopics().find((t) => t.slug === topicSlug);
    if (topic) {
      const msg = pickRandom(WEAK_TOPIC_MESSAGES).replace("{topic}", topic.title);
      return { mood: "thinking", message: msg };
    }
  }

  // Completed today → celebrate
  if (profile.lastActive === today && profile.streak >= 3) {
    return { mood: "celebrate", message: pickRandom(CELEBRATE_MESSAGES) };
  }

  // Streak ≥ 7 → wink
  if (profile.streak >= 7) {
    return { mood: "wink", message: `${profile.streak} hari berturut-turut! Kamu luar biasa!` };
  }

  // Idle too long
  const daysSinceActive = Math.floor((Date.now() - new Date(profile.lastActive).getTime()) / 86400000);
  if (daysSinceActive > 2) {
    return { mood: "idle", message: pickRandom(IDLE_MESSAGES) };
  }

  // Low hearts
  if (profile.hearts <= 1 && profile.maxHearts > 1) {
    return { mood: "sad", message: "Hampir kehabisan nyawa! Santai dulu atau isi hati di toko." };
  }

  // Just right → happy
  return { mood: "happy", message: pickRandom(GREETINGS) };
}

export function useMascot(): MascotState {
  const state = useMemo(() => {
    try {
      const profile = getProfile();
      return getMascotState(profile);
    } catch {
      return { mood: "happy" as MascotMood, message: pickRandom(GREETINGS) };
    }
  }, []);

  return state;
}
