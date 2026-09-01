"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import LearningPathGraph from "@/components/learning/LearningPathGraph";
import FeatureGuard from "@/components/admin/FeatureGuard";
import { getProfile } from "@/lib/gamification";
import { getAllTopics, getTopicStatus } from "@/lib/data";
import { getMastery } from "@/lib/mastery";
import { motion } from "framer-motion";
import { Map, Route, BookOpen } from "lucide-react";
import { LEVEL_CONFIG } from "@/lib/learningPath";
import type { UserProfile } from "@/lib/gamification";

export default function LearningPathPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const allTopics = useMemo(() => getAllTopics(), []);
  const statusMap = useMemo(() => {
    if (!profile) return null;
    return getTopicStatus(allTopics, profile.completedTopics || []);
  }, [allTopics, profile]);

  const levelStats = useMemo(() => {
    const levels = ["smp", "sma", "kuliah"] as const;
    return levels.map((level) => {
      const topics = allTopics.filter((t) => t.level === level);
      const completed = topics.filter((t) => {
        const s = statusMap?.get(t.slug);
        return s === "completed";
      }).length;
      const mastered = topics.filter((t) => getMastery(t.slug) >= 90).length;
      return { level, total: topics.length, completed, mastered };
    });
  }, [allTopics, statusMap]);

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 lg:ml-[260px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--duo-green)] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <FeatureGuard flag="learning-path">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-0">
          {/* Header */}
          <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
            <div className="max-w-6xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--duo-green)]/10 flex items-center justify-center">
                  <Map size={20} className="text-[var(--duo-green)]" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-[var(--duo-text)]">Peta Belajar</h1>
                  <p className="text-xs text-[var(--duo-text-muted)]">Ikuti jalur dari SMP — SMA — Universitas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-8 py-6 space-y-5">
            {/* Level section headers */}
            {levelStats.map((ls, i) => {
              const cfg = LEVEL_CONFIG[ls.level];
              const pct = ls.total > 0 ? Math.round((ls.completed / ls.total) * 100) : 0;
              return (
                <motion.div
                  key={ls.level}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color}88)` }}
                >
                  <div className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <BookOpen size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                        Bagian {i + 1} · {ls.level.toUpperCase()}
                      </p>
                      <p className="text-base font-black text-white">{cfg.label}</p>
                      <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white/70 shrink-0">
                      {ls.completed}/{ls.total}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LearningPathGraph profile={profile} />
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 px-2 py-3"
            >
              <span className="text-[10px] font-bold text-[var(--duo-text-muted)] uppercase tracking-wider">Legend:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gray-600" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Terkunci</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-700" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Tersedia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Selesai</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-amber-600" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Master (90%+)</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </FeatureGuard>
  );
}
