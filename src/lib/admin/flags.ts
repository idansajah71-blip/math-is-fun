"use client";

const FLAGS_KEY = "matika_feature_flags";

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  isEnabled: boolean;
  category: string;
}

const DEFAULT_FLAGS: FeatureFlag[] = [
  { key: "shop", label: "Shop", description: "Fitur belanja gems", isEnabled: true, category: "gamification" },
  { key: "leaderboard", label: "Leaderboard", description: "Papan peringkat", isEnabled: true, category: "gamification" },
  { key: "daily-reward", label: "Daily Reward", description: "Reward harian login", isEnabled: true, category: "gamification" },
  { key: "bookmarks", label: "Bookmark", description: "Tandai topik favorit", isEnabled: true, category: "learning" },
  { key: "daily-quiz", label: "Quiz Harian", description: "Quiz acak harian", isEnabled: true, category: "learning" },
  { key: "spaced-repetition", label: "Ulangan Berkala", description: "Spaced repetition review", isEnabled: true, category: "learning" },
  { key: "friends", label: "Teman", description: "Fitur pertemanan & challenge", isEnabled: true, category: "social" },
  { key: "events", label: "Events", description: "Event & kompetisi", isEnabled: true, category: "engagement" },
  { key: "sound", label: "Sound Effects", description: "Efek suara interaktif", isEnabled: true, category: "ux" },
  { key: "onboarding", label: "Onboarding", description: "Tutorial untuk user baru", isEnabled: true, category: "ux" },
  { key: "guest-mode", label: "Guest Mode", description: "Izinkan akses tanpa login", isEnabled: true, category: "access" },
  { key: "premium", label: "Premium", description: "Sistem langganan premium", isEnabled: true, category: "monetization" },
];

function getFlags(): FeatureFlag[] {
  if (typeof window === "undefined") return DEFAULT_FLAGS;
  try {
    const stored = JSON.parse(localStorage.getItem(FLAGS_KEY) || "[]");
    if (stored.length === 0) {
      localStorage.setItem(FLAGS_KEY, JSON.stringify(DEFAULT_FLAGS));
      return DEFAULT_FLAGS;
    }
    const merged = DEFAULT_FLAGS.map((df) => {
      const existing = stored.find((s: FeatureFlag) => s.key === df.key);
      return existing || df;
    });
    const newKeys = stored.filter((s: FeatureFlag) => !DEFAULT_FLAGS.some((df) => df.key === s.key));
    return [...merged, ...newKeys];
  } catch {
    return DEFAULT_FLAGS;
  }
}

function saveFlags(flags: FeatureFlag[]) {
  localStorage.setItem(FLAGS_KEY, JSON.stringify(flags));
}

export function getAllFlags(): FeatureFlag[] {
  return getFlags();
}

export function isFlagEnabled(key: string): boolean {
  const flags = getFlags();
  const flag = flags.find((f) => f.key === key);
  return flag?.isEnabled ?? true;
}

export function setFlag(key: string, isEnabled: boolean): void {
  const flags = getFlags();
  const flag = flags.find((f) => f.key === key);
  if (flag) {
    flag.isEnabled = isEnabled;
  } else {
    flags.push({ key, label: key, description: "", isEnabled, category: "custom" });
  }
  saveFlags(flags);
}

export function toggleFlag(key: string): void {
  const flags = getFlags();
  const flag = flags.find((f) => f.key === key);
  if (flag) {
    flag.isEnabled = !flag.isEnabled;
    saveFlags(flags);
  }
}

export function getFlagsByCategory(): Record<string, FeatureFlag[]> {
  const flags = getFlags();
  const grouped: Record<string, FeatureFlag[]> = {};
  for (const flag of flags) {
    if (!grouped[flag.category]) grouped[flag.category] = [];
    grouped[flag.category].push(flag);
  }
  return grouped;
}
