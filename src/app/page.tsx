"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import WorldMap from "@/components/game/WorldMap";
import Mascot from "@/components/game/Mascot";
import { useMascot } from "@/hooks/useMascot";
import QuestCard from "@/components/game/QuestCard";
import XPBar from "@/components/ui/XPBar";
import StreakBar from "@/components/ui/StreakBar";
import XpPopup from "@/components/ui/XpPopup";
import { getAllTopics } from "@/lib/data";
import {
  getProfile,
  LEVEL_NAMES,
  getXpForCurrentLevel,
  getXpForNextLevel,
  claimDailyReward,
  DAILY_REWARDS,
  saveProfile,
} from "@/lib/gamification";
import { staggerContainer, staggerItem, springGentle, springBounce, popIn, cardSlideUp } from "@/lib/animations";
import ActivityHeatmap from "@/components/ui/ActivityHeatmap";
import {
  Play,
  Trophy,
  Zap,
  BookOpen,
  Star,
  Clock,
  Gift,
  Flame,
  Target,
  Brain,
  Timer,
  TrendingUp,
  Calendar,
  Gem,
  Sparkles,
  X,
  CheckCircle2,
  ChevronRight,
  Dices,
  Rocket,
  Lightbulb,
  BarChart3,
  Gamepad2,
  PartyPopper,
  Pointer,
} from "lucide-react";
import { renderIcon, InlineIcon } from "@/lib/iconMap";
import Onboarding from "@/components/Onboarding";
import type { Topic } from "@/lib/types";
import type { UserProfile } from "@/lib/gamification";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Confetti from "@/components/ui/Confetti";

const MINI_GAMES = [
  {
    id: "speed-math",
    title: "Speed Math",
    description: "Hitung cepat 60 detik!",
    icon: Timer,
    color: "from-[var(--duo-orange)] to-[var(--duo-danger)]",
    reward: "+50 XP",
    difficulty: "Mudah",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-[var(--duo-orange)]/30",
  },
  {
    id: "memory-pairs",
    title: "Memory Pairs",
    description: "Cocokkan rumus matematika",
    icon: Brain,
    color: "from-[var(--duo-purple)] to-[var(--duo-pink)]",
    reward: "+40 XP",
    difficulty: "Sedang",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-[var(--duo-purple)]/30",
  },
  {
    id: "true-false-blitz",
    title: "True/False Blitz",
    description: "Benar atau salah, cepet!",
    icon: Target,
    color: "from-[var(--duo-info)] to-[#4DC9FF]",
    reward: "+35 XP",
    difficulty: "Mudah",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-[var(--duo-info)]/30",
  },
  {
    id: "formula-rush",
    title: "Formula Rush",
    description: "Isi rumus yang kosong",
    icon: Lightbulb,
    color: "from-[var(--duo-green)] to-[var(--duo-green-light)]",
    reward: "+60 XP",
    difficulty: "Sulit",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-[var(--duo-green)]/30",
  },
];

function DailyRewardModal({
  show,
  onClose,
  onClaim,
  claimedDay,
}: {
  show: boolean;
  onClose: () => void;
  onClaim: (day: number) => void;
  claimedDay: number | null;
}) {
  const todayIndex = new Date().getDay();
  const adjustedIndex = (todayIndex + 6) % 7;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={springBounce}
            className="relative bg-white dark:bg-[var(--surface)] rounded-[32px] border-2 border-[var(--border)] w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Confetti show={true} />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="bg-gradient-to-br from-[var(--duo-xp)] via-[var(--duo-orange)] to-[var(--duo-danger)] p-8 pb-12 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-white/10 rounded-full" />

              <div className="relative flex flex-col items-center text-center text-white">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 mb-4 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
                >
                  <Calendar size={40} strokeWidth={2.5} />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-black mb-1"
                >
                  Hadiah Harian! <InlineIcon emoji="🎁" size={22} className="ml-1" />
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-white/80 text-sm font-semibold"
                >
                  Masuk setiap hari untuk dapat hadiah lebih besar
                </motion.p>
              </div>
            </div>

            <div className="p-6 -mt-6">
              <div className="relative z-10 bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-4 mb-5 shadow-lg">
                <div className="grid grid-cols-7 gap-2">
                  {DAILY_REWARDS.map((reward, idx) => {
                    const isClaimed = claimedDay !== null && idx <= claimedDay;
                    const isToday = idx === adjustedIndex;
                    const isLocked = idx > adjustedIndex;

                    return (
                      <motion.div
                        key={reward.day}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.3 + idx * 0.05 }}
                        className={`relative flex flex-col items-center p-2.5 rounded-xl border-2 transition-all ${
                          isClaimed
                            ? "bg-[var(--primary-bg)] border-[var(--primary)]/40"
                            : isToday
                            ? "bg-gradient-to-br from-[var(--duo-xp)]/20 to-[var(--duo-orange)]/20 border-[var(--duo-xp)] pulse-ring"
                            : "bg-gray-50 dark:bg-gray-800/50 border-[var(--border-subtle)]"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-black mb-1.5 ${
                            isClaimed ? "text-[var(--primary)]" : isToday ? "text-[var(--duo-orange)]" : "text-[var(--fg-muted)]"
                          }`}
                        >
                          H{reward.day}
                        </span>

                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 ${
                            isClaimed ? "bg-[var(--primary)]" : isToday ? "bg-[var(--duo-xp)] animate-pulse" : "bg-[var(--border-subtle)]"
                          }`}
                        >
                          {isClaimed ? (
                            <CheckCircle2 size={18} className="text-white" />
                          ) : isLocked ? (
                            <Gem size={16} className="text-[var(--fg-muted)] opacity-40" />
                          ) : (
                            <Zap size={16} className={isToday ? "text-[#8B6914]" : "text-[var(--fg-muted)]"} />
                          )}
                        </div>

                        <div className="text-center leading-tight">
                          <p
                            className={`text-[10px] font-black ${
                              isClaimed ? "text-[var(--primary)]" : isToday ? "text-[var(--duo-orange)]" : "text-[var(--fg-muted)]"
                            }`}
                          >
                            {reward.xp} XP
                          </p>
                          <p className={`text-[9px] font-bold ${isClaimed ? "text-[var(--primary)]/70" : "text-[var(--fg-muted)]"} flex items-center justify-center gap-0.5`}>
                            {reward.gems}<InlineIcon emoji="💎" size={10} />
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {claimedDay === null || claimedDay < adjustedIndex ? (
                <AnimatedButton
                  fullWidth
                  variant="primary"
                  size="xl"
                  glow
                  icon={<Gift size={20} />}
                  onClick={() => onClaim(adjustedIndex)}
                >
                  Klaim Hadiah Hari Ini
                </AnimatedButton>
              ) : (
                <div className="text-center p-4 rounded-2xl bg-[var(--primary-bg)] border-2 border-[var(--primary)]/30">
                  <p className="text-sm font-bold text-[var(--primary)] flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} />
                    Hadiah hari ini sudah diklaim!
                  </p>
                  <p className="text-xs text-[var(--fg-muted)] mt-1 flex items-center justify-center gap-1">Sampai jumpa besok ya! <InlineIcon emoji="😊" size={12} /></p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  bg,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  bg: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      className={`relative p-4 rounded-2xl ${bg} border-2 border-[var(--border-subtle)] overflow-hidden`}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30" style={{ background: color }} />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: color, opacity: 0.9 }}>
          <Icon size={18} className="text-white" />
        </div>
        <p className="text-2xl font-black text-[var(--fg)] mb-0.5">{value}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-bold text-[var(--fg-muted)]">{label}</p>
          {trend === "up" && <TrendingUp size={12} className="text-[var(--primary)]" />}
        </div>
        {subtext && <p className="text-[10px] text-[var(--fg-muted)] mt-1">{subtext}</p>}
      </div>
    </motion.div>
  );
}

function WeeklyChart({ data }: { data: number[] }) {
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const maxVal = Math.max(...data, 10);

  return (
    <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary-bg)] flex items-center justify-center">
            <BarChart3 size={16} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--fg)]">XP Mingguan</h3>
            <p className="text-[10px] text-[var(--fg-muted)]">Performa belajarmu 7 hari terakhir</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-gradient-xp">
            {data.reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-[10px] font-bold text-[var(--fg-muted)]">Total XP</p>
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-28">
        {data.map((xp, i) => {
          const height = Math.max((xp / maxVal) * 100, 4);
          const isToday = i === new Date().getDay();
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 + i * 0.05 }}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-lg ${
                    isToday
                      ? "bg-gradient-to-t from-[var(--primary)] to-[var(--duo-green-light)] shadow-lg"
                      : "bg-gradient-to-t from-[var(--border)] to-[var(--border-strong)]"
                  }`}
                  style={{ minHeight: "4px" }}
                />
              </div>
              <span
                className={`text-[9px] font-bold ${
                  isToday ? "text-[var(--primary)]" : "text-[var(--fg-muted)]"
                }`}
              >
                {days[i]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function HomeContent() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [claimedDay, setClaimedDay] = useState<number | null>(null);
  const mascotState = useMascot();

  const checkDailyReward = (prof: UserProfile) => {
    const today = new Date().toISOString().split("T")[0];
    if (prof.dailyRewardClaimed !== today) {
      const timer = setTimeout(() => setShowDailyReward(true), 800);
      return () => clearTimeout(timer);
    } else {
      setClaimedDay(prof.dailyRewardStreak);
    }
  };

  useEffect(() => {
    setTopics(getAllTopics());
    const prof = getProfile();
    setProfile(prof);
    setMounted(true);

    const onboardingDone = localStorage.getItem("belajar-mtk-onboarding");
    if (!onboardingDone) {
      setShowOnboarding(true);
    } else {
      const cleanup = checkDailyReward(prof);
      return cleanup;
    }
  }, []);

  const handleClaimReward = (dayIdx: number) => {
    const result = claimDailyReward();
    if (result) {
      setProfile(result.profile);
      setClaimedDay(dayIdx);
      setXpAmount(result.reward.xp);
      setShowXp(true);
      setTimeout(() => setShowDailyReward(false), 1500);
    }
  };

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
  const gems = profile.gems || 0;
  const completedCount = profile.completedTopics?.length || 0;
  const totalTopics = topics.length;
  const progressPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const totalStudyMinutes = Math.floor((profile.totalStudyTime || 0) / 60);
  const averageAccuracy = profile.weeklyAccuracy?.length
    ? Math.round(profile.weeklyAccuracy.reduce((a, b) => a + b, 0) / profile.weeklyAccuracy.filter((x) => x > 0).length || 0)
    : 85;

  const nextTopic = topics.find((t) => !profile.completedTopics?.includes(t.slug));

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

  const dailyQuests = [
    {
      title: "Selesaikan 3 Soal",
      description: "Latihan hari ini",
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

  const weeklyXp = profile.weeklyXp?.length === 7 ? profile.weeklyXp : [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />
      {showOnboarding && (
        <Onboarding
          onComplete={() => {
            setShowOnboarding(false);
            const prof = getProfile();
            setProfile(prof);
            checkDailyReward(prof);
          }}
        />
      )}
      <XpPopup amount={xpAmount} show={showXp} onComplete={() => setShowXp(false)} />

      <DailyRewardModal
        show={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onClaim={handleClaimReward}
        claimedDay={claimedDay}
      />

      <main className="flex-1 ml-[260px] p-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* ===== HERO SECTION ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springGentle}
            className="mb-7"
          >
            <div className="relative bg-white dark:bg-[var(--surface)] rounded-[28px] border-2 border-[var(--border)] p-6 shadow-sm overflow-hidden">
              <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--primary-bg)] via-transparent to-transparent opacity-60" />
              <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-[var(--duo-purple)]/10 via-transparent to-transparent" />

              <div className="relative flex items-center gap-6 min-h-[100px] flex-wrap lg:flex-nowrap">
                <motion.div
                  className="relative shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[var(--primary)] to-[var(--duo-green-dark)] flex items-center justify-center text-white text-3xl font-black border-4 border-white dark:border-[var(--surface)] shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                    <span className="relative z-10">{profile.name?.charAt(0) || "P"}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-gradient-to-br from-[var(--duo-xp)] to-[var(--duo-orange)] flex items-center justify-center text-xs font-black text-[#8B6914] border-2 border-white dark:border-[var(--surface)] shadow-lg">
                    {level}
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-2xl font-black text-[var(--fg)] flex items-center gap-2">
                      Halo, {profile.name || "Pelajar"}! <InlineIcon emoji="👆" size={22} />
                    </h1>
                    <StreakBar streak={streak} />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--duo-purple)]/15 to-[var(--duo-pink)]/15 border border-[var(--duo-purple)]/30 cursor-pointer"
                      onClick={() => setShowDailyReward(true)}
                    >
                      <Gift size={14} className="text-[var(--duo-purple)]" />
                      <span className="text-xs font-black text-[var(--duo-purple)] flex items-center gap-1">
                        {gems} <InlineIcon emoji="💎" size={12} />
                      </span>
                    </motion.div>
                  </div>
                  <XPBar
                    currentXp={xp}
                    levelXp={getXpForCurrentLevel(level)}
                    nextLevelXp={getXpForNextLevel(level)}
                    level={level}
                    levelName={LEVEL_NAMES[level] || "Pemula"}
                  />
                </div>

                <div className="flex gap-3 shrink-0 w-full lg:w-auto justify-center">
                  {[
                    { icon: Zap, value: xp, label: "XP", color: "text-[var(--duo-xp)]", bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30" },
                    { icon: BookOpen, value: completedCount, label: "Materi", color: "text-[var(--primary)]", bg: "bg-[var(--primary-bg)]" },
                    { icon: Star, value: level, label: "Level", color: "text-[var(--duo-purple)]", bg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      variants={staggerItem}
                      className={`px-5 py-3.5 rounded-2xl ${stat.bg} text-center w-[88px] border border-[var(--border-subtle)]`}
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <stat.icon size={20} className={`${stat.color} mx-auto mb-1.5`} />
                      <p className="text-xl font-black text-[var(--fg)]">{stat.value}</p>
                      <p className="text-[10px] font-bold text-[var(--fg-muted)]">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===== STATS ROW ===== */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7"
          >
            <StatCard
              icon={Flame}
              label="Streak"
              value={`${streak} hari`}
              subtext={streak >= 7 ? "🔥 Konsisten!" : "Lanjutkan!"}
              color="linear-gradient(135deg, #FF9600, #FF4B4B)"
              bg="bg-white dark:bg-[var(--surface)]"
              trend="up"
            />
            <StatCard
              icon={Target}
              label="Akurasi"
              value={`${averageAccuracy}%`}
              subtext="Rata-rata jawaban"
              color="linear-gradient(135deg, #58CC02, #1CB0F6)"
              bg="bg-white dark:bg-[var(--surface)]"
              trend="neutral"
            />
            <StatCard
              icon={Clock}
              label="Waktu Belajar"
              value={`${totalStudyMinutes}m`}
              subtext="Total durasi"
              color="linear-gradient(135deg, #CE82FF, #FF86D0)"
              bg="bg-white dark:bg-[var(--surface)]"
            />
            <StatCard
              icon={Trophy}
              label="Badge"
              value={`${profile.badges?.length || 0}`}
              subtext="Dikumpulkan"
              color="linear-gradient(135deg, #FFD900, #FF9600)"
              bg="bg-white dark:bg-[var(--surface)]"
              trend="up"
            />
          </motion.div>

          {/* ===== ACTIVITY HEATMAP ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-[var(--surface)] rounded-[24px] border-2 border-[var(--border)] p-5 mb-7 shadow-sm"
          >
            <ActivityHeatmap dailyXpHistory={profile.dailyXpHistory || {}} />
          </motion.div>

          {/* ===== TWO COLUMN: CONTINUE + WEEKLY CHART ===== */}
          <div className="grid lg:grid-cols-5 gap-5 mb-7">
            {nextTopic && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-3"
              >
                <Link href={`/topic/${nextTopic.slug}`}>
                  <motion.div
                    className="relative bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-[var(--duo-green-dark)] rounded-[28px] p-6 text-white overflow-hidden cursor-pointer shadow-xl"
                    whileHover={{ scale: 1.015, y: -3 }}
                    whileTap={{ scale: 0.99 }}
                    transition={springGentle}
                  >
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -right-4 -bottom-12 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute left-4 top-4 text-5xl opacity-10">📚</div>

                    <div className="relative flex items-center gap-5">
                      <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shrink-0 transition-transform duration-200 hover:rotate-[-6deg] hover:scale-105">
                        {renderIcon(nextTopic.icon, 36, "text-white")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-xs font-black uppercase tracking-wider mb-1.5">
                          🚀 Materi Selanjutnya
                        </p>
                        <h3 className="text-2xl font-black mb-1">{nextTopic.title}</h3>
                        <p className="text-white/70 text-sm mb-4 line-clamp-1">{nextTopic.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <Zap size={14} />
                            </div>
                            <span className="text-sm font-bold">+25 XP</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <Gem size={14} />
                            </div>
                            <span className="text-sm font-bold">+5 💎</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95">
                        <Play size={28} className="text-[var(--primary)] ml-1.5" fill="currentColor" />
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white/70">Progress Keseluruhan</span>
                        <span className="text-xs font-black text-white">{progressPct}%</span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          className="h-full bg-white rounded-full progress-glow"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2"
            >
              <WeeklyChart data={weeklyXp} />
            </motion.div>
          </div>

          {/* ===== DAILY QUESTS + CHALLENGE ===== */}
          <div className="grid lg:grid-cols-3 gap-5 mb-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[var(--fg-muted)] uppercase tracking-wider flex items-center gap-2">
                  <Target size={14} className="text-[var(--primary)]" />
                  Quest Harian
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-black text-gradient-xp">
                  <Gift size={14} />
                  <span>+100 XP</span>
                </div>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {dailyQuests.map((quest, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <QuestCard {...quest} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="h-full bg-gradient-to-br from-[var(--duo-xp)]/15 via-[var(--duo-orange)]/10 to-[var(--duo-danger)]/15 rounded-[28px] border-2 border-[var(--duo-xp)]/40 p-5 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gradient-to-br from-[var(--duo-xp)]/20 to-transparent group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[var(--duo-xp)]/5 to-transparent transition-opacity" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--duo-xp)] to-[var(--duo-orange)] flex items-center justify-center shadow-lg transition-transform duration-200 hover:rotate-[10deg] hover:scale-105">
                      <Trophy size={26} className="text-[#8B6914]" fill="#fff8" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gradient-xp mb-1">
                        <Zap size={14} />
                        <span className="text-base font-black">+100 XP</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--duo-danger)] text-xs font-bold">
                        <Clock size={11} />
                        <span>23:59</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[var(--fg)] mb-1">⚡ Tantangan Hari Ini</h3>
                  <p className="text-xs text-[var(--fg-muted)] mb-4">
                    Selesaikan quiz tanpa salah satu pun untuk dapat bonus!
                  </p>

                  <Link href="/tryout">
                    <AnimatedButton fullWidth variant="gold" size="md" icon={<Rocket size={16} />}>
                      Coba Tantangan
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ===== MINI GAMES ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-7"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-[var(--fg-muted)] uppercase tracking-wider flex items-center gap-2">
                <Dices size={14} className="text-[var(--duo-purple)]" />
                Mini Games
              </h2>
              <span className="text-xs font-bold text-[var(--duo-purple)] flex items-center gap-1.5"><InlineIcon emoji="🎮" size={12} /> Latihan Sambil Bermain</span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {MINI_GAMES.map((game, i) => (
                <motion.div
                  key={game.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.04, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative rounded-[22px] border-2 ${game.borderColor} ${game.bgColor} p-4 overflow-hidden cursor-pointer group`}
                >
                  <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500`} />

                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      <game.icon size={22} className="text-white" />
                    </div>

                    <h3 className="text-sm font-black text-[var(--fg)] mb-0.5">{game.title}</h3>
                    <p className="text-[11px] text-[var(--fg-muted)] mb-3 min-h-[28px]">{game.description}</p>

                    <div className="flex items-center justify-between">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black ${
                        game.difficulty === "Mudah"
                          ? "bg-[var(--primary-bg)] text-[var(--primary)]"
                          : game.difficulty === "Sedang"
                          ? "bg-[var(--duo-info)]/15 text-[var(--duo-info)]"
                          : "bg-[var(--duo-danger)]/15 text-[var(--duo-danger)]"
                      }`}>
                        {game.difficulty}
                      </span>
                      <span className="text-[11px] font-black text-gradient-xp">{game.reward}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ===== WORLD MAP ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-7"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-[var(--fg-muted)] uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--primary)]" />
                Peta Belajar
              </h2>
              <span className="text-xs font-black text-[var(--primary)]">
                {completedCount}/{totalTopics} selesai
              </span>
            </div>
            <WorldMap nodes={mapNodes} />
          </motion.div>
        </div>
      </main>

      {/* ===== MASCOT ===== */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="fixed bottom-20 right-5 lg:bottom-6 z-40"
      >
        <Mascot
          mood={mascotState.mood}
          size={85}
          message={mascotState.message}
          level={profile?.level ?? 0}
          interactive={true}
        />
      </motion.div>
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
