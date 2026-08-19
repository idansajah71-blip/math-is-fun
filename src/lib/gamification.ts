"use client";

export interface UserProfile {
  name: string;
  xp: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastActive: string;
  level: number;
  badges: string[];
  completedTopics: string[];
  bookmarkedTopics: string[];
  quizScores: Record<string, number>;
  streakFreeze: number;
  purchasedItems: string[];
  totalStudyTime: number;
  weeklyXp: number[];
  weeklyAccuracy: number[];
  dailyRewardClaimed: string | null;
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
  { id: "first-lesson", name: "Langkah Pertama", icon: "Sprout", desc: "Selesaikan materi pertama", rarity: "common" as const, condition: (p: UserProfile) => p.completedTopics.length >= 1 },
  { id: "five-lessons", name: "Semangat Belajar", icon: "Flame", desc: "Selesaikan 5 materi", rarity: "common" as const, condition: (p: UserProfile) => p.completedTopics.length >= 5 },
  { id: "ten-lessons", name: "Rajin Belajar", icon: "Star", desc: "Selesaikan 10 materi", rarity: "rare" as const, condition: (p: UserProfile) => p.completedTopics.length >= 10 },
  { id: "all-smp", name: "Ahli SMP", icon: "GraduationCap", desc: "Selesaikan semua materi SMP", rarity: "epic" as const, condition: (p: UserProfile) => p.completedTopics.length >= 20 },
  { id: "all-sma", name: "Ahli SMA", icon: "Trophy", desc: "Selesaikan semua materi SMA", rarity: "epic" as const, condition: (p: UserProfile) => p.completedTopics.length >= 40 },
  { id: "streak-3", name: "Konsisten 3 Hari", icon: "Flame", desc: "Belajar 3 hari berturut-turut", rarity: "common" as const, condition: (p: UserProfile) => p.streak >= 3 },
  { id: "streak-7", name: "Konsisten Seminggu", icon: "Dumbbell", desc: "Belajar 7 hari berturut-turut", rarity: "rare" as const, condition: (p: UserProfile) => p.streak >= 7 },
  { id: "streak-30", name: "Dedicated", icon: "Crown", desc: "Belajar 30 hari berturut-turut", rarity: "legendary" as const, condition: (p: UserProfile) => p.streak >= 30 },
  { id: "xp-100", name: "Seratus XP", icon: "Gem", desc: "Kumpulkan 100 XP", rarity: "common" as const, condition: (p: UserProfile) => p.xp >= 100 },
  { id: "xp-500", name: "Lima Ratus XP", icon: "Medal", desc: "Kumpulkan 500 XP", rarity: "rare" as const, condition: (p: UserProfile) => p.xp >= 500 },
  { id: "xp-1000", name: "Seribu XP", icon: "Award", desc: "Kumpulkan 1000 XP", rarity: "epic" as const, condition: (p: UserProfile) => p.xp >= 1000 },
  { id: "quiz-master", name: "Quiz Master", icon: "Brain", desc: "Skor quiz 100% di 5 topik", rarity: "rare" as const, condition: (p: UserProfile) => Object.values(p.quizScores).filter(s => s === 100).length >= 5 },
  { id: "gem-collector", name: "Gem Collector", icon: "Diamond", desc: "Kumpulkan 500 gems", rarity: "rare" as const, condition: (p: UserProfile) => p.gems >= 500 },
  { id: "speed-demon", name: "Speed Demon", icon: "Zap", desc: "Selesaikan quiz dalam 60 detik", rarity: "epic" as const, condition: () => false },
  { id: "perfect-week", name: "Perfect Week", icon: "Sparkles", desc: "Selesaikan 1 topik setiap hari selama seminggu", rarity: "legendary" as const, condition: () => false },
];

export const SHOP_ITEMS = [
  { id: "streak-freeze", name: "Streak Freeze", icon: "Snowflake", description: "Lindungi streak saat tidak belajar", price: 100, category: "powerup" as const },
  { id: "extra-heart", name: "Extra Heart", icon: "Heart", description: "+1 max heart", price: 200, category: "powerup" as const },
  { id: "double-xp", name: "Double XP", icon: "Sparkles", description: "2x XP untuk 1 lesson", price: 150, category: "powerup" as const },
  { id: "avatar-robot", name: "Robot Avatar", icon: "Bot", description: "Avatar robot lucu", price: 300, category: "avatar" as const },
  { id: "avatar-cat", name: "Kucing Avatar", icon: "Rabbit", description: "Avatar kucing imut", price: 300, category: "avatar" as const },
  { id: "avatar-panda", name: "Panda Avatar", icon: "Smile", description: "Avatar panda menggemaskan", price: 300, category: "avatar" as const },
  { id: "avatar-fox", name: "Rubah Avatar", icon: "Wind", description: "Avatar rubah lucu", price: 300, category: "avatar" as const },
  { id: "confetti-effect", name: "Confetti Effect", icon: "PartyPopper", description: "Confetti ekstra saat jawaban benar", price: 500, category: "effect" as const },
];

export const DAILY_REWARDS = [
  { day: 1, xp: 20, gems: 5, label: "Hari 1" },
  { day: 2, xp: 30, gems: 10, label: "Hari 2" },
  { day: 3, xp: 40, gems: 15, label: "Hari 3" },
  { day: 4, xp: 50, gems: 20, label: "Hari 4" },
  { day: 5, xp: 60, gems: 25, label: "Hari 5" },
  { day: 6, xp: 80, gems: 30, label: "Hari 6" },
  { day: 7, xp: 100, gems: 50, label: "Hari 7" },
];

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return getDefaultProfile();
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const profile = JSON.parse(stored);
    updateStreak(profile);
    regenerateHearts(profile);
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
    gems: 50,
    hearts: 5,
    maxHearts: 5,
    streak: 0,
    lastActive: new Date().toISOString().split("T")[0],
    level: 0,
    badges: [],
    completedTopics: [],
    bookmarkedTopics: [],
    quizScores: {},
    streakFreeze: 1,
    purchasedItems: [],
    totalStudyTime: 0,
    weeklyXp: [0, 0, 0, 0, 0, 0, 0],
    weeklyAccuracy: [0, 0, 0, 0, 0, 0, 0],
    dailyRewardClaimed: null,
  };
}

function updateStreak(profile: UserProfile) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (profile.lastActive === today) return;

  if (profile.lastActive === yesterday) {
    profile.streak += 1;
  } else if (profile.streakFreeze > 0 && profile.lastActive !== today) {
    // Use streak freeze
    profile.streakFreeze -= 1;
  } else {
    profile.streak = 1;
  }
  profile.lastActive = today;
}

function regenerateHearts(profile: UserProfile) {
  const now = Date.now();
  const lastHeartTime = (profile as any)._lastHeartTime || now;
  const elapsed = now - lastHeartTime;
  const heartRegenTime = 30 * 60 * 1000; // 30 minutes per heart

  if (profile.hearts < profile.maxHearts && elapsed > heartRegenTime) {
    const heartsToRegen = Math.floor(elapsed / heartRegenTime);
    profile.hearts = Math.min(profile.hearts + heartsToRegen, profile.maxHearts);
    (profile as any)._lastHeartTime = now;
  }
}

export function addXp(amount: number): UserProfile {
  const profile = getProfile();
  const oldLevel = profile.level;
  profile.xp += amount;
  profile.level = getLevelForXp(profile.xp);

  // Track weekly XP
  const today = new Date().getDay();
  profile.weeklyXp[today] = (profile.weeklyXp[today] || 0) + amount;

  checkBadges(profile);
  saveProfile(profile);

  if (profile.level > oldLevel) {
    // Level up! Award gems
    profile.gems += 25;
    saveProfile(profile);
  }

  return profile;
}

export function addGems(amount: number): UserProfile {
  const profile = getProfile();
  profile.gems += amount;
  checkBadges(profile);
  saveProfile(profile);
  return profile;
}

export function useHeart(): boolean {
  const profile = getProfile();
  if (profile.hearts <= 0) return false;
  profile.hearts -= 1;
  saveProfile(profile);
  return true;
}

export function refillHearts(): UserProfile {
  const profile = getProfile();
  profile.hearts = profile.maxHearts;
  saveProfile(profile);
  return profile;
}

export function claimDailyReward(): { profile: UserProfile; reward: typeof DAILY_REWARDS[0] } | null {
  const profile = getProfile();
  const today = new Date().toISOString().split("T")[0];

  if (profile.dailyRewardClaimed === today) return null;

  // Calculate consecutive days
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let dayIndex = 0;

  if (profile.dailyRewardClaimed === yesterday) {
    // Check which day of streak we're on
    const lastReward = DAILY_REWARDS.find(r => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return profile.dailyRewardClaimed === d.toISOString().split("T")[0];
    });
    dayIndex = lastReward ? Math.min(lastReward.day, 6) : 0;
  }

  const reward = DAILY_REWARDS[dayIndex];
  profile.xp += reward.xp;
  profile.gems += reward.gems;
  profile.level = getLevelForXp(profile.xp);
  profile.dailyRewardClaimed = today;
  checkBadges(profile);
  saveProfile(profile);

  return { profile, reward };
}

export function completeTopic(slug: string): UserProfile {
  const profile = getProfile();
  if (!profile.completedTopics.includes(slug)) {
    profile.completedTopics.push(slug);
    profile.xp += 25;
    profile.gems += 5;
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

export function saveQuizScore(slug: string, score: number, withReward = true): UserProfile {
  const profile = getProfile();
  profile.quizScores[slug] = Math.max(profile.quizScores[slug] || 0, score);

  if (withReward) {
    let xpGain = 10;
    if (score >= 80) xpGain = 50;
    else if (score >= 60) xpGain = 30;

    // Gem bonus for high scores
    if (score >= 90) profile.gems += 10;
    else if (score >= 70) profile.gems += 5;

    profile.xp += xpGain;
    profile.level = getLevelForXp(profile.xp);
  }

  checkBadges(profile);
  saveProfile(profile);
  return profile;
}

export function purchaseItem(itemId: string): UserProfile {
  const profile = getProfile();
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item || profile.gems < item.price || profile.purchasedItems.includes(itemId)) {
    return profile;
  }

  profile.gems -= item.price;
  profile.purchasedItems.push(itemId);

  // Apply item effects
  if (itemId === "streak-freeze") {
    profile.streakFreeze += 1;
  } else if (itemId === "extra-heart") {
    profile.maxHearts += 1;
    profile.hearts = profile.maxHearts;
  }

  saveProfile(profile);
  return profile;
}

export function setProfileName(name: string): UserProfile {
  const profile = getProfile();
  profile.name = name;
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
