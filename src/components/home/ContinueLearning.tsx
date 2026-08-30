"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Zap, AlertTriangle, Lock } from "lucide-react";
import { getAllTopics, getTopicStatus } from "@/lib/data";
import { getWeakTopics } from "@/lib/gamification";
import { renderIcon } from "@/lib/iconMap";
import MasteryBar from "@/components/ui/MasteryBar";
import { getMastery } from "@/lib/mastery";
import type { UserProfile } from "@/lib/gamification";
import type { Topic } from "@/lib/types";

function ContinueLearning({ profile }: { profile: UserProfile }) {
  const { nextTopics, weakTopics } = useMemo(() => {
    const all = getAllTopics();
    const statusMap = getTopicStatus(all, profile.completedTopics || []);

    // Show next 4 unfinished topics (available + locked), in order
    const unfinished = all.filter((t) => {
      const s = statusMap.get(t.slug);
      return s === "available" || s === "locked";
    });
    const nextTopics = unfinished.slice(0, 4);

    // Weak topics: show even if not "available" because they were previously accessed
    const weakSlugs = getWeakTopics(3);
    const completed = new Set(profile.completedTopics || []);
    const weakTopics = weakSlugs
      .map((slug) => all.find((t) => t.slug === slug))
      .filter((t): t is Topic => !!t && !completed.has(t.slug))
      .slice(0, 2);

    return { nextTopics, weakTopics };
  }, [profile]);

  const combined = useMemo(() => {
    const map = new Map<string, { topic: Topic; isWeak: boolean; isLocked: boolean }>();
    for (const t of weakTopics) map.set(t.slug, { topic: t, isWeak: true, isLocked: false });
    for (const t of nextTopics) {
      if (!map.has(t.slug)) {
        const status = getTopicStatus(getAllTopics(), profile.completedTopics || []).get(t.slug);
        map.set(t.slug, { topic: t, isWeak: false, isLocked: status === "locked" });
      }
    }
    return Array.from(map.values()).slice(0, 5);
  }, [nextTopics, weakTopics, profile]);

  if (combined.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-7"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-black text-[var(--fg-muted)] uppercase tracking-wider flex items-center gap-2">
          <Play size={14} className="text-[var(--primary)]" />
          Lanjutkan Belajar
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {combined.map(({ topic, isWeak, isLocked }, i) => {
          const card = (
            <div className={`relative w-[180px] shrink-0 rounded-2xl border-2 p-4 transition-all ${
              isLocked
                ? "bg-gray-50 dark:bg-[var(--surface)] border-[var(--border)] opacity-60 cursor-not-allowed"
                : "bg-white dark:bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-md cursor-pointer group"
            }`}>
              {isWeak && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[var(--duo-orange)] rounded-full flex items-center gap-1 z-10">
                  <AlertTriangle size={8} className="text-white" />
                  <span className="text-[8px] font-black text-white">Perlu Diulang</span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                isLocked
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-[var(--primary-bg)] group-hover:scale-110 transition-transform"
              }`}>
                {renderIcon(topic.icon, 24, isLocked ? "text-gray-400 dark:text-gray-500" : "text-[var(--primary)]")}
              </div>

              <h3 className={`text-xs font-black mb-1 line-clamp-2 min-h-[32px] ${
                isLocked ? "text-gray-400 dark:text-gray-500" : "text-[var(--fg)]"
              }`}>{topic.title}</h3>
              <p className="text-[9px] text-[var(--fg-muted)] mb-2 line-clamp-1">{topic.description}</p>

              <div className="mb-3">
                <MasteryBar slug={topic.slug} mastery={getMastery(topic.slug)} size="sm" showLabel={false} showPct={false} />
              </div>

              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1 text-[10px] font-black ${
                  isLocked ? "text-gray-300 dark:text-gray-600" : "text-[var(--duo-xp)]"
                }`}>
                  <Zap size={10} /> +25 XP
                </span>
                {isLocked ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Lock size={12} className="text-gray-400 dark:text-gray-500" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                  </div>
                )}
              </div>
            </div>
          );

          return (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              {isLocked ? card : <Link href={`/topic/${topic.slug}`}>{card}</Link>}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default ContinueLearning;
