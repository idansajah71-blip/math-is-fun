"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, BookOpen, Zap, Trophy, Star } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  action: string;
  target: string;
  timestamp: string;
  type: "quiz" | "topic" | "badge" | "premium" | "level";
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  quiz: CheckCircle2,
  topic: BookOpen,
  badge: Star,
  premium: Trophy,
  level: Zap,
};

const TYPE_COLORS: Record<string, string> = {
  quiz: "var(--primary)",
  topic: "var(--info)",
  badge: "var(--accent-xp)",
  premium: "var(--purple)",
  level: "var(--primary)",
};

function formatRelativeTime(ts: string): string {
  const now = Date.now();
  const diff = now - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function getActivitiesFromLocalStorage(): Activity[] {
  if (typeof window === "undefined") return [];
  const activities: Activity[] = [];

  try {
    // Get all profile keys
    const registryRaw = localStorage.getItem("matika_user_registry");
    const registry: { id: string; name: string }[] = registryRaw ? JSON.parse(registryRaw) : [];

    // Also check current session user
    const sessionRaw = localStorage.getItem("matika_session");
    let currentUserId = "";
    let currentUserName = "Pelajar";
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      currentUserId = session.id;
      currentUserName = session.name || "Pelajar";
    }

    // Get all user IDs from registry
    const userIds = registry.map((r) => ({ id: r.id, name: r.name }));
    if (currentUserId && !userIds.find((u) => u.id === currentUserId)) {
      userIds.push({ id: currentUserId, name: currentUserName });
    }

    for (const user of userIds) {
      const profileKey = `matika-profile-${user.id}`;
      const stored = localStorage.getItem(profileKey);
      if (!stored) continue;

      const profile = JSON.parse(stored);

      // Quiz completions from quizScores
      if (profile.quizScores) {
        for (const [slug, score] of Object.entries(profile.quizScores)) {
          activities.push({
            id: `quiz-${user.id}-${slug}`,
            name: user.name,
            action: "menyelesaikan quiz",
            target: slug.replace(/-/g, " ").replace(/^\d+\s*/, ""),
            timestamp: profile.lastActive || new Date().toISOString(),
            type: "quiz",
          });
        }
      }

      // Topic completions
      if (profile.completedTopics?.length > 0) {
        const lastTopic = profile.completedTopics[profile.completedTopics.length - 1];
        activities.push({
          id: `topic-${user.id}-${lastTopic}`,
          name: user.name,
          action: "menyelesaikan materi",
          target: lastTopic.replace(/-/g, " ").replace(/^\d+\s*/, ""),
          timestamp: profile.lastActive || new Date().toISOString(),
          type: "topic",
        });
      }

      // Badges
      if (profile.badges?.length > 0) {
        const lastBadge = profile.badges[profile.badges.length - 1];
        activities.push({
          id: `badge-${user.id}-${lastBadge}`,
          name: user.name,
          action: "mendapatkan badge",
          target: lastBadge.replace(/-/g, " "),
          timestamp: profile.lastActive || new Date().toISOString(),
          type: "badge",
        });
      }

      // Level ups
      if (profile.level > 0) {
        activities.push({
          id: `level-${user.id}`,
          name: user.name,
          action: "naik ke level",
          target: `Level ${profile.level}`,
          timestamp: profile.lastActive || new Date().toISOString(),
          type: "level",
        });
      }

      // Premium
      if (profile.isPremium) {
        activities.push({
          id: `premium-${user.id}`,
          name: user.name,
          action: "aktif sebagai",
          target: "Premium User",
          timestamp: profile.premiumActivatedAt || profile.lastActive || new Date().toISOString(),
          type: "premium",
        });
      }
    }
  } catch {}

  // Sort by most recent, take top 10
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return activities.slice(0, 10);
}

export default function RecentActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(getActivitiesFromLocalStorage());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--grad-fire)" }}>
          <Clock size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--fg)]">Aktivitas Terkini</h3>
          <p className="text-[10px] text-[var(--fg-muted)]">Aktivitas dari data lokal</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-10 text-center">
          <Clock size={32} className="text-[var(--fg-disabled)] mx-auto mb-3" />
          <p className="text-xs font-bold text-[var(--fg-muted)]">Belum ada aktivitas</p>
          <p className="text-[10px] text-[var(--fg-disabled)]">Aktivitas akan muncul setelah user belajar</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((act, i) => {
            const Icon = TYPE_ICONS[act.type] || CheckCircle2;
            const color = TYPE_COLORS[act.type] || "var(--primary)";
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-sunken)] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--fg)]">
                    <span className="font-black">{act.name}</span>{" "}
                    <span className="text-[var(--fg-muted)]">{act.action}</span>{" "}
                    <span className="font-bold" style={{ color }}>{act.target}</span>
                  </p>
                </div>
                <span className="text-[10px] text-[var(--fg-disabled)] shrink-0 font-medium">
                  {formatRelativeTime(act.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
