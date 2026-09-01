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
  wrongAnswers: Record<string, number>;
  streakFreeze: number;
  purchasedItems: string[];
  totalStudyTime: number;
  weeklyXp: number[];
  weeklyAccuracy: number[];
  dailyRewardClaimed: string | null;
  dailyRewardStreak: number;
  doubleXpNextLesson: boolean;
  lastSeenLevel: number;
  dailyXpHistory: Record<string, number>;
  dailyQuizDate: string | null;
  spacedRepetition: Record<string, { lastReview: string; nextReview: string; easeFactor: number; interval: number; reviewCount: number }>;
  isPremium: boolean;
  premiumActivatedAt: string | null;
  premiumExpiresAt: string | null;
  streakFreezeUsedAt: string | null;
  streakFreezeNotified: boolean;
  hintTokens: number;
  xpBoostUntil: number | null;
  dailyXpLog: Record<string, number>;
  topicMastery: Record<string, number>;
  hourlyActivity: Record<string, number>;
  pomodoroSessions: number;
  pomodoroSettings: { workMin: number; breakMin: number; longBreakMin: number; sessionsBeforeLong: number };
  dailyChallengeDate: string | null;
  dailyRewardHistory: Record<string, number>;
  _lastHeartTime?: number;
}

export const STORAGE_KEY = "matika-profile";

export function getLocalDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getProfileKey(): string {
  if (typeof window === "undefined") return STORAGE_KEY;
  try {
    const raw = localStorage.getItem("matika_session");
    if (raw) {
      const session = JSON.parse(raw);
      if (session.id) return `matika-profile-${session.id}`;
    }
  } catch {}
  return STORAGE_KEY;
}

export const LEVEL_THRESHOLDS = [
  0, 30, 75, 150, 300, 500, 750, 1100, 1500, 2000,
  2700, 3500, 4500, 6000, 8000, 10500, 14000, 18500, 25000, 35000,
];

export const LEVEL_NAMES = [
  "Pemula",
  "Penjelajah",
  "Pelajar",
  "Murid Rajin",
  "Siswa Cerdas",
  "Penuntut Ilmu",
  "Cendikia",
  "Sarjana Muda",
  "Ahli Matematika",
  "Master Angka",
  "Grandmaster",
  "Profesor Muda",
  "Sang Ahli",
  "Doktor Matematika",
  "Guru Besar",
  "Jenius",
  "Dewa Angka",
  "Sang Legenda",
  "Oracle",
  "Dewa Matematika",
];

export const LEVEL_COLORS = [
  "#9CA3AF", "#6B7280", "#3DD34C", "#25B2F6", "#25B2F6",
  "#BA75FF", "#BA75FF", "#FF86D0", "#FF86D0", "#FFC629",
  "#FFC629", "#FF8A25", "#FF8A25", "#FF5252", "#FF5252",
  "#BA75FF", "#FFC629", "#FF5252", "#FFC629", "#FF5252",
];

type BadgeDef = { id: string; name: string; icon: string; desc: string; rarity: "common" | "rare" | "epic" | "legendary"; condition: (p: UserProfile) => boolean };

export const BADGES: BadgeDef[] = [
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
  { id: "speed-demon", name: "Speed Demon", icon: "Zap", desc: "Selesaikan quiz dengan skor 100%", rarity: "epic" as const, condition: (p: UserProfile) => Object.values(p.quizScores).some(s => s === 100) },
  { id: "perfect-week", name: "Perfect Week", icon: "Sparkles", desc: "Streak 7 hari dan selesaikan 7+ materi", rarity: "legendary" as const, condition: (p: UserProfile) => p.streak >= 7 && p.completedTopics.length >= 7 },

  // === HARD-TO-GET BADGES ===

  // Streak & Konsistensi
  { id: "streak-60", name: "Iron Will", icon: "Shield", desc: "Belajar 60 hari berturut-turut tanpa henti", rarity: "legendary" as const, condition: (p: UserProfile) => p.streak >= 60 },
  { id: "streak-100", name: "Centurion", icon: "Swords", desc: "Belajar 100 hari berturut-turut — legenda hidup", rarity: "legendary" as const, condition: (p: UserProfile) => p.streak >= 100 },

  // Mastery & Perfect
  { id: "perfect-all-quiz", name: "Flawless Mind", icon: "Target", desc: "Quiz 100% di 20+ topik berbeda", rarity: "legendary" as const, condition: (p: UserProfile) => Object.values(p.quizScores).filter(s => s === 100).length >= 20 },
  { id: "zero-wrong-20", name: "Perfectionist", icon: "CheckCircle2", desc: "Selesaikan 20 materi dengan total 0 jawaban salah", rarity: "epic" as const, condition: (p: UserProfile) => p.completedTopics.length >= 20 && Object.values(p.wrongAnswers).reduce((a, b) => a + b, 0) === 0 },
  { id: "quiz-streak-20", name: "Unstoppable", icon: "FlameKindling", desc: "Jawab 20 quiz berturut-turut tanpa pernah salah", rarity: "epic" as const, condition: (p: UserProfile) => { const scores = Object.values(p.quizScores); return scores.length >= 20 && scores.every(s => s >= 80); } },
  { id: "all-smp-master", name: "Master SMP", icon: "GraduationCap", desc: "Quiz 100% di semua materi SMP", rarity: "epic" as const, condition: (p: UserProfile) => { const smpScores = Object.entries(p.quizScores).filter(([k]) => k.startsWith("smp-")); return smpScores.length >= 15 && smpScores.every(([, s]) => s === 100); } },

  // Time & Dedication
  { id: "study-50h", name: "Scholar of Time", icon: "Hourglass", desc: "Total waktu belajar mencapai 50 jam", rarity: "legendary" as const, condition: (p: UserProfile) => p.totalStudyTime >= 180000 },
  { id: "study-100h", name: "Time Lord", icon: "Clock", desc: "Total waktu belajar mencapai 100 jam — waktu tidak lagi relevan", rarity: "legendary" as const, condition: (p: UserProfile) => p.totalStudyTime >= 360000 },
  { id: "level-15", name: "Grandmaster", icon: "Crown", desc: "Mencapai level 15 — di atas rata-rata manusia", rarity: "legendary" as const, condition: (p: UserProfile) => p.level >= 15 },
  { id: "xp-25000", name: "XP Titan", icon: "Mountain", desc: "Kumpulkan 25.000 XP — gunung yang mustahil didaki", rarity: "legendary" as const, condition: (p: UserProfile) => p.xp >= 25000 },

  // Koleksi & Eksplorasi
  { id: "all-topics", name: "Mathemagician", icon: "Sparkles", desc: "Selesaikan SEMUA 90+ materi — pencapaian tertinggi", rarity: "legendary" as const, condition: (p: UserProfile) => p.completedTopics.length >= 90 },
  { id: "all-badges", name: "Ultimate Collector", icon: "Trophy", desc: "Unlock SEMUA badge lainnya — mustahil tanpa dedikasi total", rarity: "legendary" as const, condition: (p: UserProfile) => p.badges.length >= 32 },
  { id: "shopaholic", name: "Shopaholic", icon: "ShoppingBag", desc: "Beli semua item di shop — butuh ribuan gems", rarity: "epic" as const, condition: (p: UserProfile) => p.purchasedItems.length >= SHOP_ITEMS.length },
  { id: "bookmark-20", name: "Curious Mind", icon: "BookmarkCheck", desc: "Bookmark 20+ topik — selalu ingin tahu lebih banyak", rarity: "rare" as const, condition: (p: UserProfile) => p.bookmarkedTopics.length >= 20 },
  { id: "review-50", name: "Review Wizard", icon: "RotateCcw", desc: "Lakukan 50+ review spaced repetition — otakmu patut diacungi jempol", rarity: "rare" as const, condition: (p: UserProfile) => Object.values(p.spacedRepetition).reduce((a, b) => a + (b.reviewCount || 0), 0) >= 50 },

  // Mastery
  { id: "mastery-1", name: "Mastery Pioneer", icon: "Target", desc: "Capai mastery 90% di 1 topik", rarity: "common" as const, condition: (p: UserProfile) => Object.values(p.topicMastery || {}).filter(v => v >= 90).length >= 1 },
  { id: "mastery-10", name: "Mastery Master", icon: "Crown", desc: "Capai mastery 90% di 10 topik", rarity: "legendary" as const, condition: (p: UserProfile) => Object.values(p.topicMastery || {}).filter(v => v >= 90).length >= 10 },

  // Quiz Editor
  { id: "quiz-creator", name: "Quiz Creator", icon: "PencilLine", desc: "Buat 5 quiz sendiri", rarity: "rare" as const, condition: (p: UserProfile) => { try { const quizzes = JSON.parse(localStorage.getItem("matika_user_quizzes") || "[]"); return quizzes.filter((q: { createdBy: string }) => q.createdBy === "local").length >= 5; } catch { return false; } } },
];

export const SHOP_ITEMS = [
  { id: "streak-freeze", name: "Streak Freeze", icon: "Snowflake", description: "Lindungi streak saat tidak belajar", price: 100, category: "powerup" as const },
  { id: "extra-heart", name: "Extra Heart", icon: "Heart", description: "+1 max heart", price: 200, category: "powerup" as const },
  { id: "double-xp", name: "Double XP", icon: "Sparkles", description: "2x XP untuk 1 lesson berikutnya", price: 150, category: "powerup" as const },
  { id: "hint-token", name: "Hint Token", icon: "Lightbulb", description: "Dapatkan 3 petunjuk gratis", price: 80, category: "powerup" as const },
  { id: "refill-hearts", name: "Refill Hearts", icon: "HeartPulse", description: "Isi ulang semua heart ke max", price: 120, category: "powerup" as const },
  { id: "xp-boost-30m", name: "XP Boost 30m", icon: "Zap", description: "+50% XP selama 30 menit", price: 250, category: "powerup" as const },
  { id: "avatar-ninja", name: "Avatar Ninja", icon: "Ninja", description: "Avatar khusus: Ninja Matematika", price: 500, category: "avatar" as const },
  { id: "avatar-wizard", name: "Avatar Wizard", icon: "Wizard", description: "Avatar khusus: Penyihir Angka", price: 500, category: "avatar" as const },
  { id: "frame-gold", name: "Frame Emas", icon: "Frame", description: "Border profil emas berkilau", price: 300, category: "effect" as const },
  { id: "title-myth", name: "Title: Mitos", icon: "Crown", description: "Gelar 'Mitos' — untuk yang benar-benar legenda", price: 5000, category: "effect" as const },
];

export interface DailyRewardResult {
  xp: number;
  gems: number;
  hearts: number;
  hintTokens: number;
  isMilestone: boolean;
  dayNumber: number;
  weekNumber: number;
  label: string;
  dayInWeek: number;
}

const DAILY_BASE_REWARDS = [
  { xp: 20,  gems: 5 },
  { xp: 30,  gems: 10 },
  { xp: 40,  gems: 15 },
  { xp: 50,  gems: 20 },
  { xp: 60,  gems: 25 },
  { xp: 80,  gems: 30 },
  { xp: 100, gems: 50 },
];

function isMilestoneDay(streak: number): boolean {
  const day = streak + 1;
  return day === 7 || day === 14 || day === 21 || day === 30 || day % 30 === 0;
}

function getMilestoneBonus(streak: number): { hearts: number; hintTokens: number } {
  const day = streak + 1;
  if (day >= 30) return { hearts: 10, hintTokens: 5 };
  if (day >= 21) return { hearts: 5, hintTokens: 3 };
  if (day >= 14) return { hearts: 5, hintTokens: 2 };
  return { hearts: 3, hintTokens: 1 };
}

export function getDailyReward(streak: number): DailyRewardResult {
  const weekIndex = Math.floor(streak / 7);
  const dayInWeek = streak % 7;
  const base = DAILY_BASE_REWARDS[dayInWeek];
  const multiplier = weekIndex === 0 ? 1 : weekIndex === 1 ? 1.5 : weekIndex === 2 ? 2 : 2.5;
  const milestone = isMilestoneDay(streak);
  const bonus = milestone ? getMilestoneBonus(streak) : { hearts: 0, hintTokens: 0 };

  const dayNumber = streak + 1;
  const weekNumber = weekIndex + 1;

  return {
    xp: Math.round(base.xp * multiplier),
    gems: Math.round(base.gems * multiplier),
    hearts: bonus.hearts,
    hintTokens: bonus.hintTokens,
    isMilestone: milestone,
    dayNumber,
    weekNumber,
    label: milestone ? `Minggu ${weekNumber}` : `Hari ${dayNumber}`,
    dayInWeek,
  };
}

let _profileCache: UserProfile | null = null;
let _profileCacheKey = "";

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return getDefaultProfile();
  }
  const key = getProfileKey();
  // Return cached profile if key hasn't changed
  if (_profileCache && _profileCacheKey === key) return _profileCache;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      const profile = { ...getDefaultProfile(), ...parsed };
      // Migration: weeklyXp switched from Sunday-first to Monday-first indexing
      if ((profile as Record<string, unknown>).weeklyXpVersion !== 2) {
        profile.weeklyXp = [0, 0, 0, 0, 0, 0, 0];
        (profile as Record<string, unknown>).weeklyXpVersion = 2;
      }
      updateStreak(profile);
      regenerateHearts(profile);
      saveProfile(profile);
      _profileCache = profile;
      _profileCacheKey = key;
      return profile;
    }
  } catch {
    // Corrupt data — clear and fall through to default
    try { localStorage.removeItem(key); } catch {}
  }
  // Migration: try loading from old default key
  if (key !== STORAGE_KEY) {
    try {
      const old = localStorage.getItem(STORAGE_KEY);
      if (old) {
        const profile = { ...getDefaultProfile(), ...JSON.parse(old) };
        saveProfile(profile);
        _profileCache = profile;
        _profileCacheKey = key;
        return profile;
      }
    } catch {}
  }
  const profile = getDefaultProfile();
  saveProfile(profile);
  _profileCache = profile;
  _profileCacheKey = key;
  return profile;
}

let _syncTimer: ReturnType<typeof setTimeout> | null = null;

export function saveProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  const key = getProfileKey();
  localStorage.setItem(key, JSON.stringify(profile));
  // Update cache
  _profileCache = profile;
  _profileCacheKey = key;
  // Debounced background sync to Supabase
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => {
    import("@/lib/supabase/sync").then(({ pushProfile }) => pushProfile(profile)).catch(() => {});
  }, 2000);
}

export function saveProfileForKey(userId: string, profile: UserProfile) {
  if (typeof window === "undefined") return;
  const key = `matika-profile-${userId}`;
  localStorage.setItem(key, JSON.stringify(profile));
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => {
    import("@/lib/supabase/sync").then(({ pushProfile }) => pushProfile(profile)).catch(() => {});
  }, 2000);
}

export function getDefaultProfile(): UserProfile {
  return {
    name: "Pelajar",
    xp: 0,
    gems: 50,
    hearts: 5,
    maxHearts: 5,
    streak: 0,
    lastActive: getLocalDateStr(),
    level: 0,
    badges: [],
    completedTopics: [],
    bookmarkedTopics: [],
    quizScores: {},
    wrongAnswers: {},
    streakFreeze: 1,
    purchasedItems: [],
    totalStudyTime: 0,
    weeklyXp: [0, 0, 0, 0, 0, 0, 0],
    weeklyAccuracy: [0, 0, 0, 0, 0, 0, 0],
    dailyRewardClaimed: null,
    dailyRewardStreak: 0,
    doubleXpNextLesson: false,
    lastSeenLevel: 0,
    dailyXpHistory: {},
    dailyQuizDate: null,
    spacedRepetition: {},
    isPremium: false,
    premiumActivatedAt: null,
    premiumExpiresAt: null,
    streakFreezeUsedAt: null,
    streakFreezeNotified: false,
    hintTokens: 0,
    xpBoostUntil: null,
    dailyXpLog: {},
    topicMastery: {},
    hourlyActivity: {},
    pomodoroSessions: 0,
    pomodoroSettings: { workMin: 25, breakMin: 5, longBreakMin: 15, sessionsBeforeLong: 4 },
    dailyChallengeDate: null,
    dailyRewardHistory: {},
  };
}

function updateStreak(profile: UserProfile) {
  const today = getLocalDateStr();
  const yesterday = getLocalDateStr(new Date(Date.now() - 86400000));

  if (profile.lastActive === today) return;

  if (profile.lastActive === yesterday) {
    profile.streak += 1;
  } else if (profile.streakFreeze > 0 && profile.lastActive !== today) {
    // Use streak freeze
    profile.streakFreeze -= 1;
    profile.streakFreezeUsedAt = yesterday;
    profile.streakFreezeNotified = false;
  } else {
    profile.streak = 1;
  }
  profile.lastActive = today;
}

function regenerateHearts(profile: UserProfile) {
  const now = Date.now();
  const lastHeartTime = profile._lastHeartTime || now;
  const elapsed = now - lastHeartTime;
  const heartRegenTime = 30 * 60 * 1000; // 30 minutes per heart

  if (profile.hearts < profile.maxHearts && elapsed > heartRegenTime) {
    const heartsToRegen = Math.floor(elapsed / heartRegenTime);
    profile.hearts = Math.min(profile.hearts + heartsToRegen, profile.maxHearts);
    profile._lastHeartTime = now;
  }
}

export function addXp(amount: number): UserProfile {
  const profile = getProfile();
  const oldLevel = profile.level;
  const xpGain = isPremiumActive() ? amount * 2 : amount;
  profile.xp += xpGain;
  profile.level = getLevelForXp(profile.xp);

  // Track weekly XP (0=Senin...6=Minggu)
  const today = (new Date().getDay() + 6) % 7;
  profile.weeklyXp[today] = (profile.weeklyXp[today] || 0) + xpGain;

  // Track daily XP history for heatmap
  const todayStr = getLocalDateStr();
  profile.dailyXpHistory[todayStr] = (profile.dailyXpHistory[todayStr] || 0) + xpGain;

  // Track daily XP log for monthly chart
  if (!profile.dailyXpLog) profile.dailyXpLog = {};
  profile.dailyXpLog[todayStr] = (profile.dailyXpLog[todayStr] || 0) + xpGain;

  // Track hourly activity for study analytics
  if (!profile.hourlyActivity) profile.hourlyActivity = {};
  const currentHour = new Date().getHours();
  profile.hourlyActivity[String(currentHour)] = (profile.hourlyActivity[String(currentHour)] || 0) + 1;
  // Prune entries older than 90 days
  const cutoff = getLocalDateStr(new Date(Date.now() - 90 * 86400000));
  for (const key of Object.keys(profile.dailyXpLog)) {
    if (key < cutoff) delete profile.dailyXpLog[key];
  }

  checkBadges(profile);
  saveProfile(profile);

  // Notify listeners (heatmap, charts, etc.) that XP changed
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("xp-updated"));
  }

  if (profile.level > oldLevel) {
    // Level up! Award gems + update lastSeenLevel
    profile.gems += 25;
    profile.lastSeenLevel = profile.level;
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
  if (isPremiumActive()) return true;
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

export function claimDailyReward(): { profile: UserProfile; reward: DailyRewardResult } | null {
  const profile = getProfile();
  const today = getLocalDateStr();

  if (profile.dailyRewardClaimed === today) return null;

  const yesterday = getLocalDateStr(new Date(Date.now() - 86400000));

  if (profile.dailyRewardClaimed === yesterday) {
    profile.dailyRewardStreak += 1;
  } else if (profile.dailyRewardClaimed !== today) {
    profile.dailyRewardStreak = 0;
  }

  const reward = getDailyReward(profile.dailyRewardStreak);
  const xpGain = isPremiumActive() ? reward.xp * 2 : reward.xp;
  const gemBonus = isPremiumActive() ? 50 : 0;

  profile.xp += xpGain;
  profile.gems += reward.gems + gemBonus;
  profile.hearts = Math.min(profile.hearts + reward.hearts, profile.maxHearts);
  profile.hintTokens += reward.hintTokens;
  profile.level = getLevelForXp(profile.xp);
  profile.dailyRewardClaimed = today;
  profile.dailyRewardHistory[today] = profile.dailyRewardStreak;
  checkBadges(profile);
  saveProfile(profile);

  return { profile, reward };
}

export function completeTopic(slug: string): { xp: number; gems: number; profile: UserProfile } {
  const profile = getProfile();
  let xp = 0;
  let gems = 0;
  if (!profile.completedTopics.includes(slug)) {
    profile.completedTopics.push(slug);
    xp = isPremiumActive() ? 50 : 25;
    gems = isPremiumActive() ? 10 : 5;
    profile.gems += gems;
  }
  checkBadges(profile);
  saveProfile(profile);
  return { xp, gems, profile };
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

    if (isPremiumActive()) xpGain *= 2;

    // Gem bonus for high scores
    if (score >= 90) profile.gems += isPremiumActive() ? 20 : 10;
    else if (score >= 70) profile.gems += isPremiumActive() ? 10 : 5;

    profile.xp += xpGain;
    profile.level = getLevelForXp(profile.xp);
  }

  checkBadges(profile);
  saveProfile(profile);
  return profile;
}

export function trackWrongAnswer(slug: string): void {
  const profile = getProfile();
  profile.wrongAnswers[slug] = (profile.wrongAnswers[slug] || 0) + 1;
  saveProfile(profile);
}

export function getWeakTopics(limit = 5): string[] {
  const profile = getProfile();
  return Object.entries(profile.wrongAnswers)
    .filter(([slug]) => !profile.completedTopics.includes(slug))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
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
  } else if (itemId === "double-xp") {
    profile.doubleXpNextLesson = true;
  } else if (itemId === "refill-hearts") {
    profile.hearts = profile.maxHearts;
  } else if (itemId === "hint-token") {
    profile.hintTokens = (profile.hintTokens || 0) + 3;
  } else if (itemId === "xp-boost-30m") {
    const now = Date.now();
    profile.xpBoostUntil = Math.max(profile.xpBoostUntil || 0, now) + 30 * 60 * 1000;
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

export function consumeDoubleXp(): boolean {
  const profile = getProfile();
  if (profile.doubleXpNextLesson) {
    profile.doubleXpNextLesson = false;
    saveProfile(profile);
    return true;
  }
  return false;
}

export function consumeHintToken(): boolean {
  const profile = getProfile();
  if ((profile.hintTokens || 0) > 0) {
    profile.hintTokens -= 1;
    saveProfile(profile);
    return true;
  }
  return false;
}

export function isXpBoostActive(): boolean {
  const profile = getProfile();
  return !!profile.xpBoostUntil && Date.now() < profile.xpBoostUntil;
}

export function getXpBoostRemainingMs(): number {
  const profile = getProfile();
  if (!profile.xpBoostUntil) return 0;
  const remaining = profile.xpBoostUntil - Date.now();
  return remaining > 0 ? remaining : 0;
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

export function getLeaderboard(
  period: "weekly" | "alltime" = "weekly"
): { name: string; xp: number; level: number; streak: number; weeklyXpTotal?: number }[] {
  const entries = Object.keys(localStorage)
    .filter((k) => k.startsWith("matika-lb-"))
    .map((k) => JSON.parse(localStorage.getItem(k)!));

  const myProfile = getProfile();
  const myWeeklyTotal = myProfile.weeklyXp.reduce((a, b) => a + b, 0);
  entries.push({
    name: myProfile.name,
    xp: myProfile.xp,
    level: myProfile.level,
    streak: myProfile.streak,
    weeklyXpTotal: myWeeklyTotal,
  });

  if (period === "weekly") {
    return entries
      .sort((a, b) => (b.weeklyXpTotal ?? b.xp) - (a.weeklyXpTotal ?? a.xp))
      .slice(0, 50);
  }
  return entries.sort((a, b) => b.xp - a.xp).slice(0, 50);
}

export async function getLeaderboardAsync(
  period: "weekly" | "alltime" = "weekly"
): Promise<{ name: string; xp: number; level: number; streak: number; weeklyXpTotal?: number }[]> {
  try {
    const { fetchLeaderboard } = await import("@/lib/supabase/sync");
    const remote = await fetchLeaderboard(period);
    if (remote.length > 0) {
      return remote.map((row: Record<string, unknown>) => ({
        name: (row.name as string) ?? "Pelajar",
        xp: (row.xp as number) ?? 0,
        level: (row.level as number) ?? 0,
        streak: (row.streak as number) ?? 0,
        weeklyXpTotal: row.weekly_xp_total as number | undefined,
      }));
    }
  } catch {}
  return getLeaderboard(period);
}

export function recordReview(slug: string, quality: number): void {
  const profile = getProfile();
  const today = getLocalDateStr();
  const existing = profile.spacedRepetition[slug];

  let easeFactor = existing?.easeFactor ?? 2.5;
  let interval = existing?.interval ?? 1;

  if (quality >= 3) {
    if (!existing) {
      interval = 1;
    } else if (existing.interval <= 1) {
      interval = 6;
    } else {
      interval = Math.round(existing.interval * easeFactor);
    }
  } else {
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  profile.spacedRepetition[slug] = {
    lastReview: today,
    nextReview: getLocalDateStr(nextDate),
    easeFactor,
    interval,
    reviewCount: (existing?.reviewCount ?? 0) + 1,
  };

  saveProfile(profile);
}

export function getDueTopics(): string[] {
  const profile = getProfile();
  const today = getLocalDateStr();
  return Object.entries(profile.spacedRepetition)
    .filter(([, data]) => data.nextReview <= today)
    .sort((a, b) => a[1].nextReview.localeCompare(b[1].nextReview))
    .map(([slug]) => slug);
}

export function getUpcomingReviews(): { slug: string; nextReview: string; interval: number; reviewCount: number }[] {
  const profile = getProfile();
  return Object.entries(profile.spacedRepetition)
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview));
}

export function isPremiumActive(): boolean {
  const profile = getProfile();
  if (!profile.isPremium) return false;
  if (!profile.premiumExpiresAt) return true;
  const expiry = new Date(profile.premiumExpiresAt);
  expiry.setHours(23, 59, 59, 999);
  const active = expiry > new Date();
  if (!active) {
    // Auto-revoke expired premium
    profile.isPremium = false;
    profile.premiumExpiresAt = null;
    saveProfile(profile);
  }
  return active;
}

export function activatePremium(days: number): UserProfile {
  const profile = getProfile();
  const now = new Date();
  const expires = new Date(now.getTime() + days * 86400000);
  profile.isPremium = true;
  profile.premiumActivatedAt = getLocalDateStr(now);
  profile.premiumExpiresAt = getLocalDateStr(expires);
  saveProfile(profile);
  return profile;
}

export function grantTrialPremium(): UserProfile {
  return activatePremium(7);
}

export function markStreakFreezeNotified(): void {
  const profile = getProfile();
  profile.streakFreezeNotified = true;
  saveProfile(profile);
}

export function getStreakFreezeNotification(): { show: boolean; date: string | null } {
  const profile = getProfile();
  if (profile.streakFreezeUsedAt && !profile.streakFreezeNotified) {
    return { show: true, date: profile.streakFreezeUsedAt };
  }
  return { show: false, date: null };
}

export function getAllUserProfiles(): Record<string, UserProfile> {
  if (typeof window === "undefined") return {};
  const result: Record<string, UserProfile> = {};

  // Read from user registry
  try {
    const registryRaw = localStorage.getItem("matika_user_registry");
    if (registryRaw) {
      const registry: { id: string; email: string; name: string }[] = JSON.parse(registryRaw);
      for (const reg of registry) {
        const profileKey = `matika-profile-${reg.id}`;
        const stored = localStorage.getItem(profileKey);
        if (stored) {
          result[reg.id] = { ...getDefaultProfile(), ...JSON.parse(stored), name: reg.name };
        }
      }
    }
  } catch {}

  // Fallback: current user from session
  const current = getProfile();
  const sessionRaw = localStorage.getItem("matika_session");
  let sessionKey = "current";
  try {
    if (sessionRaw) {
      const s = JSON.parse(sessionRaw);
      sessionKey = s.id || s.email || "current";
    }
  } catch {}
  if (!result[sessionKey]) {
    result[sessionKey] = current;
  }

  return result;
}
