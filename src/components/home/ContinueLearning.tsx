"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Zap, AlertTriangle } from "lucide-react";
import { getAllTopics, getTopicStatus } from "@/lib/data";
import { getWeakTopics } from "@/lib/gamification";
import { renderIcon } from "@/lib/iconMap";
import type { UserProfile } from "@/lib/gamification";
import type { Topic } from "@/lib/types";

function ContinueLearning({ profile }: { profile: UserProfile }) {
  const { nextTopics, weakTopics } = useMemo(() => {
    const all = getAllTopics();
    const statusMap = getTopicStatus(all, profile.completedTopics || []);

    // Only show "available" topics (not locked ones)
    const nextTopics = all.filter((t) => statusMap.get(t.slug) === "available");

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
    const map = new Map<string, { topic: Topic; isWeak: boolean }>();
    for (const t of weakTopics) map.set(t.slug, { topic: t, isWeak: true });
    for (const t of nextTopics) {
      if (!map.has(t.slug)) map.set(t.slug, { topic: t, isWeak: false });
    }
    return Array.from(map.values()).slice(0, 5);
  }, [nextTopics, weakTopics]);

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
        {combined.map(({ topic, isWeak }, i) => (
          <motion.div
            key={topic.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link href={`/topic/${topic.slug}`}>
              <div className="relative w-[180px] shrink-0 bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-4 hover:border-[var(--primary)]/50 hover:shadow-md transition-all cursor-pointer group">
                {isWeak && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[var(--duo-orange)] rounded-full flex items-center gap-1 z-10">
                    <AlertTriangle size={8} className="text-white" />
                    <span className="text-[8px] font-black text-white">Perlu Diulang</span>
                  </div>
                )}

                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-bg)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {renderIcon(topic.icon, 24, "text-[var(--primary)]")}
                </div>

                <h3 className="text-xs font-black text-[var(--fg)] mb-1 line-clamp-2 min-h-[32px]">{topic.title}</h3>
                <p className="text-[9px] text-[var(--fg-muted)] mb-3 line-clamp-1">{topic.description}</p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-black text-[var(--duo-xp)]">
                    <Zap size={10} /> +25 XP
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ContinueLearning;
