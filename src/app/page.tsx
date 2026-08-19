"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import WorldMap from "@/components/game/WorldMap";
import Mascot from "@/components/game/Mascot";
import QuestCard from "@/components/game/QuestCard";
import XPBar from "@/components/ui/XPBar";
import StreakBar from "@/components/ui/StreakBar";
import AnimatedButton from "@/components/ui/AnimatedButton";
import XpPopup from "@/components/ui/XpPopup";
import { getAllTopics } from "@/lib/mathData";
import { getProfile, LEVEL_NAMES, getXpForCurrentLevel, getXpForNextLevel } from "@/lib/gamification";
import { staggerContainer, staggerItem, springGentle } from "@/lib/animations";
import { Play, Trophy, Target, Zap, Flame, BookOpen, Star, Clock, Gift, ChevronRight } from "lucide-react";
import { renderIcon } from "@/lib/iconMap";
import type { Topic, Level } from "@/lib/types";

function HomeContent() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setTopics(getAllTopics());
    setProfile(getProfile());
    setMounted(true);
  }, []);

  if (!mounted || !profile) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[var(--duo-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const xp = profile.xp || 0;
  const level = profile.level || 0;
  const streak = profile.streak || 0;
  const completedCount = profile.completedTopics?.length || 0;
  const totalTopics = topics.length;
  const progressPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Next topic to learn
  const nextTopic = topics.find((t) => !profile.completedTopics?.includes(t.slug));

  // World Map nodes
  const mapNodes = topics.map((t) => ({
    slug: t.slug,
    title: t.title,
    icon: t.icon,
    level: t.level as "smp" | "sma" | "kuliah",
    status: profile.completedTopics?.includes(t.slug)
      ? ("completed" as const)
      : t === nextTopic
      ? ("available" as const)
      : ("locked" as const),
    section: t.section,
  }));

  // Daily Quests
  const dailyQuests = [
    {
      title: "Selesaikan 3 Soal",
      description: "Latihan今天 hari ini",
      progress: Math.min(completedCount, 3),
      total: 3,
      xpReward: 30,
      type: "daily" as const,
      completed: completedCount >= 3,
    },
    {
      title: "Dapatkan 50 XP",
      description: "Kumpulkan XP hari ini",
      progress: Math.min(xp % 100, 50),
      total: 50,
      xpReward: 20,
      type: "challenge" as const,
      completed: (xp % 100) >= 50,
    },
    {
      title: "Pertahankan Streak",
      description: "Belajar setiap hari",
      progress: streak,
      total: 7,
      xpReward: 50,
      type: "streak" as const,
      completed: streak >= 7,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />
      <XpPopup amount={25} show={showXp} onComplete={() => setShowXp(false)} />

      <main className="flex-1 ml-[260px] p-6 pb-24">
        <div className="max-w-4xl mx-auto">

          {/* ===== HERO SECTION ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 shadow-sm">
              <div className="flex items-center gap-5 min-h-[88px]">
                {/* Avatar */}
                <motion.div
                  className="relative shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--duo-green)] to-[var(--duo-green-dark)] flex items-center justify-center text-white text-2xl font-black border-4 border-white dark:border-[var(--duo-card)] shadow-lg">
                    {profile.name?.charAt(0) || "P"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--duo-xp)] rounded-full flex items-center justify-center text-[10px] font-black text-[#8B6914] border-2 border-white dark:border-[var(--duo-card)]">
                    {level}
                  </div>
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-xl font-black text-[var(--duo-text)]">
                      Halo, {profile.name || "Pelajar"}!
                    </h1>
                    <StreakBar streak={streak} />
                  </div>
                  <XPBar
                    currentXp={xp}
                    levelXp={getXpForCurrentLevel(level)}
                    nextLevelXp={getXpForNextLevel(level)}
                    level={level}
                    levelName={LEVEL_NAMES[level] || "Pemula"}
                  />
                </div>

                {/* Stats */}
                <div className="flex gap-3 shrink-0">
                  {[
                    { icon: Zap, value: xp, label: "XP", color: "text-[var(--duo-xp)]", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
                    { icon: BookOpen, value: completedCount, label: "Materi", color: "text-[var(--duo-green)]", bg: "bg-[var(--duo-green-bg)]" },
                    { icon: Star, value: level, label: "Level", color: "text-[var(--duo-purple)]", bg: "bg-purple-50 dark:bg-purple-950/30" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      className={`px-4 py-3 rounded-2xl ${stat.bg} text-center w-[76px]`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <stat.icon size={18} className={`${stat.color} mx-auto mb-1`} />
                      <p className="text-lg font-black text-[var(--duo-text)]">{stat.value}</p>
                      <p className="text-[10px] font-bold text-[var(--duo-text-muted)]">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===== CONTINUE LEARNING ===== */}
          {nextTopic && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-sm font-bold text-[var(--duo-text-muted)] uppercase tracking-wider mb-3">
                Lanjutkan Belajar
              </h2>
              <Link href={`/topic/${nextTopic.slug}`}>
                <motion.div
                  className="bg-gradient-to-r from-[var(--duo-green)] to-[var(--duo-green-dark)] rounded-[24px] p-6 text-white relative overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springGentle}
                >
                  {/* Background decoration */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-white/10 rounded-full" />

                  <div className="relative flex items-center gap-5">
                    <motion.div
                      className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {renderIcon(nextTopic.icon, 28, "text-white")}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-white/80 text-xs font-bold uppercase mb-1">Materi Selanjutnya</p>
                      <h3 className="text-lg font-black">{nextTopic.title}</h3>
                      <p className="text-white/70 text-xs mt-1">{nextTopic.description}</p>
                    </div>
                    <motion.div
                      className="w-14 h-14 bg-white rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Play size={24} className="text-[var(--duo-green)] ml-1" fill="currentColor" />
                    </motion.div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </div>
                    <span className="text-xs font-bold">{progressPct}%</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}

          {/* ===== DAILY QUESTS ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[var(--duo-text-muted)] uppercase tracking-wider">
                Quest Harian
              </h2>
              <div className="flex items-center gap-1 text-xs font-bold text-[var(--duo-xp)]">
                <Gift size={14} />
                <span>+100 XP</span>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {dailyQuests.map((quest, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <QuestCard {...quest} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ===== CHALLENGE OF THE DAY ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-[var(--duo-xp)]/10 to-[var(--duo-orange)]/10 rounded-[24px] border-2 border-[var(--duo-xp)]/30 p-5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--duo-xp)]/10 rounded-full" />
              <div className="relative flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 bg-[var(--duo-xp)] rounded-2xl flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy size={24} className="text-[#8B6914]" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-[var(--duo-text)]">Tantangan Hari Ini</h3>
                  <p className="text-xs text-[var(--duo-text-muted)]">Selesaikan quiz tanpa salah!</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[var(--duo-xp)]">
                    <Zap size={14} />
                    <span className="text-sm font-black">+100 XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--duo-danger)] text-xs font-bold mt-1">
                    <Clock size={12} />
                    <span>23:59</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===== WORLD MAP ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--duo-text-muted)] uppercase tracking-wider">
                Peta Belajar
              </h2>
              <span className="text-xs font-bold text-[var(--duo-green)]">
                {completedCount}/{totalTopics} selesai
              </span>
            </div>
            <WorldMap nodes={mapNodes} />
          </motion.div>

          {/* ===== MASCOT ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="fixed bottom-20 right-6 lg:bottom-6 z-40"
          >
            <Mascot
              mood={streak >= 7 ? "celebrate" : completedCount > 0 ? "happy" : "idle"}
              size={80}
              message={
                streak >= 7
                  ? "Streak mantap!"
                  : completedCount === 0
                  ? "Yuk mulai belajar!"
                  : undefined
              }
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--duo-bg)]">
        <div className="w-12 h-12 border-4 border-[var(--duo-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
