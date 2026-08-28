"use client";

import { createClient } from "@/lib/supabase/client";
import { UserProfile, getDefaultProfile, STORAGE_KEY, getLocalDateStr } from "@/lib/gamification";

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

/** Convert snake_case DB row → camelCase UserProfile */
function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    name: (row.name as string) ?? "Pelajar",
    xp: (row.xp as number) ?? 0,
    gems: (row.gems as number) ?? 0,
    hearts: (row.hearts as number) ?? 5,
    maxHearts: (row.max_hearts as number) ?? 5,
    streak: (row.streak as number) ?? 0,
    lastActive: (row.last_active as string) ?? getLocalDateStr(),
    level: (row.level as number) ?? 0,
    badges: (row.badges as string[]) ?? [],
    completedTopics: (row.completed_topics as string[]) ?? [],
    bookmarkedTopics: (row.bookmarked_topics as string[]) ?? [],
    quizScores: (row.quiz_scores as Record<string, number>) ?? {},
    wrongAnswers: (row.wrong_answers as Record<string, number>) ?? {},
    streakFreeze: (row.streak_freeze as number) ?? 0,
    purchasedItems: (row.purchased_items as string[]) ?? [],
    totalStudyTime: (row.total_study_time as number) ?? 0,
    weeklyXp: (row.weekly_xp as number[]) ?? [0, 0, 0, 0, 0, 0, 0],
    weeklyAccuracy: (row.weekly_accuracy as number[]) ?? [0, 0, 0, 0, 0, 0, 0],
    dailyRewardClaimed: (row.daily_reward_claimed as string) ?? null,
    dailyRewardStreak: (row.daily_reward_streak as number) ?? 0,
    doubleXpNextLesson: (row.double_xp_next_lesson as boolean) ?? false,
    lastSeenLevel: (row.last_seen_level as number) ?? 0,
    dailyXpHistory: (row.daily_xp_history as Record<string, number>) ?? {},
    dailyQuizDate: (row.daily_quiz_date as string) ?? null,
    spacedRepetition: (row.spaced_repetition as Record<string, { lastReview: string; nextReview: string; easeFactor: number; interval: number; reviewCount: number }>) ?? {},
    isPremium: (row.is_premium as boolean) ?? false,
    premiumActivatedAt: (row.premium_activated_at as string) ?? null,
    premiumExpiresAt: (row.premium_expires_at as string) ?? null,
    streakFreezeUsedAt: (row.streak_freeze_used_at as string) ?? null,
    streakFreezeNotified: (row.streak_freeze_notified as boolean) ?? false,
    hintTokens: (row.hint_tokens as number) ?? 0,
    xpBoostUntil: (row.xp_boost_until as number) ?? null,
    dailyXpLog: (row.daily_xp_log as Record<string, number>) ?? {},
  };
}

/** Convert UserProfile → snake_case for DB upsert */
function profileToRow(profile: UserProfile) {
  return {
    name: profile.name,
    xp: profile.xp,
    gems: profile.gems,
    hearts: profile.hearts,
    max_hearts: profile.maxHearts,
    streak: profile.streak,
    last_active: profile.lastActive,
    level: profile.level,
    badges: profile.badges,
    completed_topics: profile.completedTopics,
    bookmarked_topics: profile.bookmarkedTopics,
    quiz_scores: profile.quizScores,
    wrong_answers: profile.wrongAnswers,
    streak_freeze: profile.streakFreeze,
    purchased_items: profile.purchasedItems,
    total_study_time: profile.totalStudyTime,
    weekly_xp: profile.weeklyXp,
    weekly_accuracy: profile.weeklyAccuracy,
    daily_reward_claimed: profile.dailyRewardClaimed,
    daily_reward_streak: profile.dailyRewardStreak,
    double_xp_next_lesson: profile.doubleXpNextLesson,
    last_seen_level: profile.lastSeenLevel,
    daily_xp_history: profile.dailyXpHistory,
    daily_quiz_date: profile.dailyQuizDate,
    spaced_repetition: profile.spacedRepetition,
    is_premium: profile.isPremium,
    premium_activated_at: profile.premiumActivatedAt,
    premium_expires_at: profile.premiumExpiresAt,
    streak_freeze_used_at: profile.streakFreezeUsedAt,
    streak_freeze_notified: profile.streakFreezeNotified,
    hint_tokens: profile.hintTokens,
    xp_boost_until: profile.xpBoostUntil,
    daily_xp_log: profile.dailyXpLog,
  };
}

/**
 * Pull profile from Supabase and merge with localStorage.
 * Returns the merged profile (Supabase wins on conflict).
 */
export async function pullProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await getClient().auth.getUser();
  if (!user) return null;

  const { data, error } = await getClient()
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  const remote = rowToProfile(data);

  // Merge: remote wins, but keep local-only fields
  const localRaw = localStorage.getItem(STORAGE_KEY);
  const local: UserProfile | null = localRaw ? JSON.parse(localRaw) : null;

  if (!local) {
    // First time on this device — write remote to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    return remote;
  }

  // Merge: use whichever has more recent data (higher XP = more progress)
  const merged: UserProfile = remote.xp >= local.xp ? remote : local;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

/**
 * Push localStorage profile to Supabase.
 * Call this after every profile mutation (addXp, completeTopic, etc.)
 */
export async function pushProfile(profile: UserProfile): Promise<void> {
  const { data: { user } } = await getClient().auth.getUser();
  if (!user) return;

  const row = profileToRow(profile);

  const { error } = await getClient()
    .from("profiles")
    .upsert({ id: user.id, ...row }, { onConflict: "id" });

  if (error) {
    console.error("[sync] pushProfile failed:", error.message);
  }
}

/**
 * Full sync: pull from DB, merge, push back.
 * Use on app load and periodically.
 */
export async function syncProfile(): Promise<UserProfile> {
  const remote = await pullProfile();
  if (!remote) return getDefaultProfile();

  await pushProfile(remote);
  return remote;
}

/**
 * Get leaderboard data from Supabase views.
 */
export async function fetchLeaderboard(type: "weekly" | "alltime" = "weekly") {
  const viewName = type === "weekly" ? "leaderboard_weekly" : "leaderboard_alltime";

  const { data, error } = await getClient()
    .from(viewName)
    .select("*")
    .limit(50);

  if (error) {
    console.error("[sync] fetchLeaderboard failed:", error.message);
    return [];
  }

  return data ?? [];
}
