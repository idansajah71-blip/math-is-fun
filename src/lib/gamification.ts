"use client";

export interface UserProfile {
  name: string;
  xp: number;
  streak: number;
  lastActive: string;
  level: number;
  badges: string[];
  completedTopics: string[];
  bookmarkedTopics: string[];
  quizScores: Record<string, number>;
}

const STORAGE_KEY = "belajar-mtk-profile";

export const LEVEL_THRESHOLDS = [
  0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000, 5000,
];

export const LEVEL_NAMES = [
  "Pemula",
  "Pembelajar",
  "Murid",
  "Siswa",
  "Pelajar",
  "Cendikia",
  "Sarjana Muda",
  "Master",
  "Grandmaster",
  "Sang Guru",
  "Legenda",
];

export const BADGES = [
  { id: "first-lesson", name: "Langkah Pertama", icon: "🌱", desc: "Selesaikan materi pertama", condition: (p: UserProfile) => p.completedTopics.length >= 1 },
  { id: "five-lessons", name: "Semangat Belajar", icon: "🔥", desc: "Selesaikan 5 materi", condition: (p: UserProfile) => p.completedTopics.length >= 5 },
  { id: "ten-lessons", name: "Rajin Belajar", icon: "⭐", desc: "Selesaikan 10 materi", condition: (p: UserProfile) => p.completedTopics.length >= 10 },
  { id: "all-smp", name: "Ahli SMP", icon: "🎓", desc: "Selesaikan semua materi SMP", condition: (p: UserProfile) => false },
  { id: "all-sma", name: "Ahli SMA", icon: "🏆", desc: "Selesaikan semua materi SMA", condition: (p: UserProfile) => false },
  { id: "streak-3", name: "Konsisten 3 Hari", icon: "🔥", desc: "Belajar 3 hari berturut-turut", condition: (p: UserProfile) => p.streak >= 3 },
  { id: "streak-7", name: "Konsisten Seminggu", icon: "💪", desc: "Belajar 7 hari berturut-turut", condition: (p: UserProfile) => p.streak >= 7 },
  { id: "streak-30", name: "Dedicated", icon: "👑", desc: "Belajar 30 hari berturut-turut", condition: (p: UserProfile) => p.streak >= 30 },
  { id: "xp-100", name: "Seratus XP", icon: "💎", desc: "Kumpulkan 100 XP", condition: (p: UserProfile) => p.xp >= 100 },
  { id: "xp-500", name: "Lima Ratus XP", icon: "🏅", desc: "Kumpulkan 500 XP", condition: (p: UserProfile) => p.xp >= 500 },
  { id: "xp-1000", name: "Seribu XP", icon: "🥇", desc: "Kumpulkan 1000 XP", condition: (p: UserProfile) => p.xp >= 1000 },
  { id: "quiz-master", name: "Quiz Master", icon: "🧠", desc: "Skor quiz 100% di 5 topik", condition: (p: UserProfile) => Object.values(p.quizScores).filter(s => s === 100).length >= 5 },
];

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return getDefaultProfile();
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const profile = JSON.parse(stored);
    updateStreak(profile);
    saveProfile(profile);
    return profile;
  }
  const profile = getDefaultProfile();
  saveProfile(profile);
  return profile;
}

export function saveProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getDefaultProfile(): UserProfile {
  return {
    name: "Pelajar",
    xp: 0,
    streak: 0,
    lastActive: new Date().toISOString().split("T")[0],
    level: 0,
    badges: [],
    completedTopics: [],
    bookmarkedTopics: [],
    quizScores: {},
  };
}

function updateStreak(profile: UserProfile) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (profile.lastActive === today) return;

  if (profile.lastActive === yesterday) {
    profile.streak += 1;
  } else if (profile.lastActive !== today) {
    profile.streak = 1;
  }
  profile.lastActive = today;
}

export function addXp(amount: number): UserProfile {
  const profile = getProfile();
  profile.xp += amount;
  profile.level = getLevelForXp(profile.xp);
  checkBadges(profile);
  saveProfile(profile);
  return profile;
}

export function completeTopic(slug: string): UserProfile {
  const profile = getProfile();
  if (!profile.completedTopics.includes(slug)) {
    profile.completedTopics.push(slug);
    profile.xp += 25;
    profile.level = getLevelForXp(profile.xp);
  }
  checkBadges(profile);
  saveProfile(profile);
  return profile;
}

export function toggleBookmark(slug: string): UserProfile {
  const profile = getProfile();
  const idx = profile.bookmarkedTopics.indexOf(slug);
  if (idx >= 0) {
    profile.bookmarkedTopics.splice(idx, 1);
  } else {
    profile.bookmarkedTopics.push(slug);
  }
  saveProfile(profile);
  return profile;
}

export function saveQuizScore(slug: string, score: number): UserProfile {
  const profile = getProfile();
  profile.quizScores[slug] = Math.max(profile.quizScores[slug] || 0, score);
  profile.xp += score >= 80 ? 50 : score >= 60 ? 30 : 10;
  profile.level = getLevelForXp(profile.xp);
  checkBadges(profile);
  saveProfile(profile);
  return profile;
}

export function getLevelForXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 0;
}

export function getXpForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)];
}

export function getXpForCurrentLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] || 0;
}

function checkBadges(profile: UserProfile) {
  for (const badge of BADGES) {
    if (!profile.badges.includes(badge.id) && badge.condition(profile)) {
      profile.badges.push(badge.id);
    }
  }
}

export function getLeaderboard(): { name: string; xp: number; level: number }[] {
  const entries = Object.keys(localStorage)
    .filter((k) => k.startsWith("belajar-mtk-lb-"))
    .map((k) => JSON.parse(localStorage.getItem(k)!));
  const myProfile = getProfile();
  entries.push({ name: myProfile.name, xp: myProfile.xp, level: myProfile.level });
  return entries.sort((a, b) => b.xp - a.xp).slice(0, 20);
}
