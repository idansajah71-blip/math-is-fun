"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
const WorldMap = dynamic(() => import("@/components/game/WorldMap"), { ssr: false });
const Mascot = dynamic(() => import("@/components/game/Mascot"), { ssr: false });
import { useMascot } from "@/hooks/useMascot";
import QuestCard from "@/components/game/QuestCard";
import XPBar from "@/components/ui/XPBar";
import StreakBar from "@/components/ui/StreakBar";
import XpPopup from "@/components/ui/XpPopup";
import { getAllTopics, getTopicStatus } from "@/lib/data";
import {
  getProfile,
  getDefaultProfile,
  LEVEL_NAMES,
  getXpForCurrentLevel,
  getXpForNextLevel,
  claimDailyReward,
  getDailyReward,
  saveProfile,
  addXp,
  getStreakFreezeNotification,
  markStreakFreezeNotified,
  getLocalDateStr,
  isPremiumActive,
} from "@/lib/gamification";
import { staggerContainer, staggerItem, springGentle, springBounce, popIn, cardSlideUp } from "@/lib/animations";
import ActivityHeatmap from "@/components/ui/ActivityHeatmap";
import { Megaphone } from "lucide-react";
import {
  Play,
  Trophy,
  Zap,
  BookOpen,
  Heart,
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
  Snowflake,
  Lock,
  Crown,
} from "lucide-react";
import { InlineIcon } from "@/lib/iconMap";
import Onboarding from "@/components/Onboarding";
import { isFlagEnabled } from "@/lib/admin/flags";
import type { Topic } from "@/lib/types";
import type { UserProfile } from "@/lib/gamification";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Confetti from "@/components/ui/Confetti";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import EventCalendar from "@/components/home/EventCalendar";
import ContinueLearning from "@/components/home/ContinueLearning";
const MonthlyProgressChart = dynamic(() => import("@/components/home/MonthlyProgressChart"), { ssr: false });
const PomodoroTimer = dynamic(() => import("@/components/pomodoro/PomodoroTimer"), { ssr: false });

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
  streak,
  canClaim,
}: {
  show: boolean;
  onClose: () => void;
  onClaim: () => void;
  streak: number;
  canClaim: boolean;
}) {
  const currentReward = getDailyReward(streak);
  const nextReward = getDailyReward(streak + 1);

  // Always show first 7 days + current position context
  const pathDays: number[] = [];
  for (let i = 0; i <= Math.max(6, streak + 2); i++) {
    pathDays.push(i);
  }

  const DAY_ICONS = [Gift, Target, Zap, Flame, Gem, Trophy, Crown];
  const DAY_COLORS = [
    "from-green-400 to-emerald-500",
    "from-blue-400 to-cyan-500",
    "from-yellow-400 to-amber-500",
    "from-orange-400 to-red-500",
    "from-purple-400 to-violet-500",
    "from-amber-400 to-yellow-500",
    "from-yellow-300 to-amber-400",
  ];

  const [rewardMsg, setRewardMsg] = useState("Reward terus naik setiap minggu! Minggu ke-2 = 1.5x, ke-3 = 2x, ke-4+ = 2.5x");
  useEffect(() => {
    const saved = localStorage.getItem("matika_site_settings");
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.dailyRewardMessage) setRewardMsg(settings.dailyRewardMessage);
    }
  }, [show]);

  function getDayIcon(dayInWeek: number) {
    const Icon = DAY_ICONS[dayInWeek] || Gift;
    return Icon;
  }

  function getDayColor(dayInWeek: number) {
    return DAY_COLORS[dayInWeek] || "from-gray-400 to-gray-500";
  }

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
            className="relative bg-white dark:bg-[var(--surface)] rounded-[32px] border-2 border-[var(--border)] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Confetti show={true} />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Header */}
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
                  {(() => {
                    const HeaderIcon = getDayIcon(currentReward.dayInWeek);
                    return <HeaderIcon size={36} strokeWidth={2.5} />;
                  })()}
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-black mb-1"
                >
                  Hadiah Harian!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-white/80 text-sm font-semibold"
                >
                  {currentReward.isMilestone
                    ? `Milestone! Minggu ke-${currentReward.weekNumber} tercapai!`
                    : `Hari ke-${currentReward.dayNumber} — terus semangat!`}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <Flame size={18} className="text-white" />
                  <span className="text-sm font-black">{streak} Hari Berturut-turut!</span>
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 mt-2">
              {/* Current reward */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={`relative z-10 rounded-2xl border-2 p-5 mb-5 shadow-lg ${
                  currentReward.isMilestone
                    ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-amber-400"
                    : "bg-white dark:bg-[var(--surface)] border-[var(--border)]"
                }`}
              >
                {currentReward.isMilestone && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Crown size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Milestone</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getDayColor(currentReward.dayInWeek)} flex items-center justify-center text-white`}>
                      {(() => {
                        const RewardIcon = getDayIcon(currentReward.dayInWeek);
                        return <RewardIcon size={24} />;
                      })()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--fg-muted)]">{currentReward.label}</p>
                      <p className="text-lg font-black text-[var(--fg)]">+{currentReward.xp} XP</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1 justify-end">
                      <Gem size={14} className="text-[var(--duo-purple)]" />
                      <span className="text-sm font-black text-[var(--duo-purple)]">+{currentReward.gems}</span>
                    </div>
                    {currentReward.hearts > 0 && (
                      <div className="flex items-center gap-1 justify-end">
                        <Heart size={12} className="text-[var(--duo-danger)]" fill="currentColor" />
                        <span className="text-xs font-bold text-[var(--duo-danger)]">+{currentReward.hearts}</span>
                      </div>
                    )}
                    {currentReward.hintTokens > 0 && (
                      <div className="flex items-center gap-1 justify-end">
                        <Lightbulb size={12} className="text-amber-500" />
                        <span className="text-xs font-bold text-amber-500">+{currentReward.hintTokens}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--fg-muted)]">
                  <span>Besok: +{nextReward.xp} XP, +{nextReward.gems} <Gem size={10} className="inline" /></span>
                  {nextReward.isMilestone && <span className="text-amber-500 font-bold">Milestone!</span>}
                </div>
              </motion.div>

              {/* Path */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-14 mb-5 pt-2"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Flame size={12} className="text-[var(--duo-orange)]" />
                    <span className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-wider">Jalur Hadiah</span>
                  </div>
                  <span className="text-[10px] font-black text-[var(--duo-orange)] bg-[var(--duo-orange)]/10 px-2 py-0.5 rounded-full">
                    Minggu ke-{currentReward.weekNumber}
                  </span>
                </div>
                <div className="relative">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {pathDays.map((dayIdx) => {
                      const r = getDailyReward(dayIdx);
                      const isPast = dayIdx < streak;
                      const isCurrent = dayIdx === streak;
                      const PathIcon = getDayIcon(r.dayInWeek);

                      return (
                        <motion.div
                          key={dayIdx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.45 + dayIdx * 0.04 }}
                          className={`relative flex-shrink-0 w-16 flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                            isPast
                              ? "bg-[var(--primary-bg)] border-[var(--primary)]/30 opacity-70"
                              : isCurrent
                              ? "bg-gradient-to-br from-[var(--duo-xp)]/20 to-[var(--duo-orange)]/20 border-[var(--duo-xp)] shadow-md"
                              : "bg-gray-50 dark:bg-gray-800/50 border-[var(--border-subtle)] opacity-50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-0.5 ${
                            isPast ? "bg-[var(--primary)]" : isCurrent ? `bg-gradient-to-br ${getDayColor(r.dayInWeek)}` : "bg-gray-200 dark:bg-gray-700"
                          }`}>
                            <PathIcon size={14} className={isPast || isCurrent ? "text-white" : "text-gray-400"} />
                          </div>
                          <span className={`text-[9px] font-black ${
                            isPast ? "text-[var(--primary)]" : isCurrent ? "text-[var(--duo-orange)]" : "text-[var(--fg-muted)]"
                          }`}>
                            H{r.dayNumber}
                          </span>
                          <span className={`text-[8px] font-bold ${
                            isPast ? "text-[var(--primary)]" : isCurrent ? "text-[var(--duo-orange)]" : "text-[var(--fg-muted)]"
                          }`}>
                            {r.xp}xp
                          </span>
                          {isPast && <CheckCircle2 size={10} className="text-[var(--primary)] mt-0.5" />}
                          {isCurrent && canClaim && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="w-2 h-2 rounded-full bg-[var(--duo-xp)] mt-0.5"
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  {/* Scroll hint */}
                  <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-[var(--surface)] to-transparent pointer-events-none flex items-center justify-end">
                    <ChevronRight size={14} className="text-[var(--fg-muted)] opacity-50" />
                  </div>
                </div>
                <p className="text-[10px] text-[var(--fg-muted)] text-center mt-2 font-semibold">
                  {rewardMsg}
                </p>
              </motion.div>

              {/* History */}
              {Object.keys(getProfile().dailyRewardHistory || {}).length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-5"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar size={12} className="text-[var(--fg-muted)]" />
                    <span className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-wider">Riwayat</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(getProfile().dailyRewardHistory)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .slice(0, 14)
                      .map(([date, day]) => (
                        <div
                          key={date}
                          className="px-2 py-1 rounded-lg bg-[var(--primary-bg)] border border-[var(--primary)]/20 text-[9px] font-bold text-[var(--primary)]"
                        >
                          {date.slice(5)} → H{day + 1}
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Claim button */}
              {canClaim ? (
                <AnimatedButton
                  fullWidth
                  variant="primary"
                  size="xl"
                  glow
                  icon={<Gift size={20} />}
                  onClick={onClaim}
                >
                  Klaim Hadiah Hari Ini
                </AnimatedButton>
              ) : (
                <div className="text-center p-4 rounded-2xl bg-[var(--primary-bg)] border-2 border-[var(--primary)]/30">
                  <p className="text-sm font-bold text-[var(--primary)] flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} />
                    Hadiah hari ini sudah diklaim!
                  </p>
                  <p className="text-xs text-[var(--fg-muted)] mt-1">Sampai jumpa besok ya!</p>
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

  // Round max to nearest clean number (25, 50, 100, etc.)
  const rawMax = Math.max(...data, 10);
  const niceMax = (() => {
    if (rawMax <= 25) return 25;
    if (rawMax <= 50) return 50;
    if (rawMax <= 100) return 100;
    if (rawMax <= 200) return 200;
    if (rawMax <= 500) return 500;
    return Math.ceil(rawMax / 100) * 100;
  })();

  const totalXp = data.reduce((a, b) => a + b, 0);
  const todayIdx = (new Date().getDay() + 6) % 7;

  // Gridline thresholds
  const gridLines = [0.25, 0.5, 0.75].filter((f) => niceMax * f < niceMax);

  return (
    <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary-bg)] flex items-center justify-center">
            <BarChart3 size={16} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--fg)]">XP Mingguan</h3>
            <p className="text-[10px] text-[var(--fg-muted)]">Semangat belajar minggu ini 💪</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-gradient-xp">{totalXp}</p>
          <p className="text-[10px] font-bold text-[var(--fg-muted)]">Total XP</p>
        </div>
      </div>

      <div className="relative flex items-end gap-1.5 h-32">
        {/* Gridlines */}
        {gridLines.map((f) => (
          <div
            key={f}
            className="absolute left-0 right-0 border-t border-dashed border-[var(--border)]"
            style={{ bottom: `${f * 100}%` }}
          />
        ))}

        {/* Bars */}
        {data.map((xp, i) => {
          const heightPct = Math.max((xp / niceMax) * 100, 0);
          const isToday = i === todayIdx;
          const hasXp = xp > 0;

          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 + i * 0.05 }}
              className="relative flex-1 flex flex-col items-center"
              style={{ height: "100%" }}
            >
              {/* XP label */}
              <div className="absolute top-0 left-0 right-0 flex justify-center" style={{ transform: "translateY(-16px)" }}>
                <span className={`text-[8px] font-black ${hasXp ? "text-[var(--fg)]" : "text-[var(--border)]"}`}>
                  {hasXp ? (xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp) : "-"}
                </span>
              </div>

              {/* Bar container */}
              <div className="w-full flex-1 flex items-end relative">
                {/* Background track */}
                <div className="absolute inset-0 rounded-t-md bg-[var(--border-subtle)] opacity-40" />

                {/* Actual bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 + i * 0.05 }}
                  className={`w-full rounded-t-md relative z-10 ${
                    hasXp
                      ? isToday
                        ? "bg-gradient-to-t from-[var(--primary)] to-[var(--duo-green-light)] shadow-md"
                        : "bg-gradient-to-t from-[var(--primary)]/80 to-[var(--primary)]/50"
                      : "bg-[var(--border-subtle)]"
                  }`}
                  style={{ minHeight: hasXp ? "4px" : "0px" }}
                />
              </div>

              {/* Day label */}
              <span
                className={`text-[9px] font-bold mt-1.5 ${
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
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [claimedQuests, setClaimedQuests] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStreakFreezeToast, setShowStreakFreezeToast] = useState(false);
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const [showLockedToast, setShowLockedToast] = useState(false);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const searchParams = useSearchParams();
  const mascotState = useMascot();

  // Loading timeout — if mounted never becomes true after 8s, show retry
  useEffect(() => {
    if (mounted) return;
    const timer = setTimeout(() => setLoadingTimedOut(true), 8000);
    return () => clearTimeout(timer);
  }, [mounted]);

  // Safety: force mounted after 3s even if init useEffect has issues
  useEffect(() => {
    const safety = setTimeout(() => {
      setMounted((prev) => {
        if (!prev) console.warn("[Matika] safety timer fired — forcing mounted");
        return true;
      });
      setProfile((prev) => {
        if (!prev) {
          console.warn("[Matika] safety timer: profile was null, loading default");
          try { return getProfile(); } catch { return getDefaultProfile(); }
        }
        return prev;
      });
    }, 3000);
    return () => clearTimeout(safety);
  }, []);

  const checkDailyReward = (prof: UserProfile) => {
    const today = getLocalDateStr();
    if (prof.dailyRewardClaimed !== today) {
      const timer = setTimeout(() => setShowDailyReward(true), 800);
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    try {
      const topicList = getAllTopics();
      if (!cancelled) setTopics(topicList);

      let prof: UserProfile;
      try {
        prof = getProfile();
      } catch {
        prof = getDefaultProfile();
        saveProfile(prof);
      }
      if (!cancelled) setProfile(prof);

      // Load claimed quests for today
      try {
        const today = getLocalDateStr();
        const claimedKey = `matika-claimed-quests-${today}`;
        const saved: number[] = JSON.parse(localStorage.getItem(claimedKey) || "[]");
        if (!cancelled) setClaimedQuests(new Set(saved));
      } catch {}

      const onboardingDone = localStorage.getItem("matika-onboarding");
      if (!onboardingDone && isFlagEnabled("onboarding")) {
        if (!cancelled) setShowOnboarding(true);
      } else {
        if (isFlagEnabled("daily-reward")) {
          const today = getLocalDateStr();
          if (prof.dailyRewardClaimed !== today) {
            const timer = setTimeout(() => {
              if (!cancelled) setShowDailyReward(true);
            }, 800);
            cleanups.push(() => clearTimeout(timer));
          }
        }
      }

      // Check streak freeze notification
      const sfNotif = getStreakFreezeNotification();
      if (sfNotif.show) {
        const timer = setTimeout(() => {
          if (!cancelled) setShowStreakFreezeToast(true);
        }, 1500);
        cleanups.push(() => clearTimeout(timer));
      }

      // Check for locked topic redirect
      if (searchParams.get("msg") === "topic-locked") {
        if (!cancelled) setShowLockedToast(true);
        const timer = setTimeout(() => {
          if (!cancelled) setShowLockedToast(false);
        }, 4000);
        cleanups.push(() => clearTimeout(timer));
        router.replace("/");
      }

      // Real-time listeners: re-fetch profile on xp-updated or storage change
      const onXpUpdated = () => {
        try {
          const p = getProfile();
          if (!cancelled) setProfile(p);
        } catch {}
      };
      const onStorage = (e: StorageEvent) => {
        if (e.key && e.key.startsWith("matika-profile")) {
          try {
            const p = getProfile();
            if (!cancelled) setProfile(p);
          } catch {}
        }
      };
      window.addEventListener("xp-updated", onXpUpdated);
      window.addEventListener("storage", onStorage);

      cleanups.push(() => {
        window.removeEventListener("xp-updated", onXpUpdated);
        window.removeEventListener("storage", onStorage);
      });
    } catch (err) {
      console.warn("[Matika] init error:", err);
    } finally {
      if (!cancelled) setMounted(true);
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const handleClaimQuest = (questIdx: number, xpReward: number) => {
    if (claimedQuests.has(questIdx)) return;
    const updated = addXp(xpReward);
    setProfile(updated);
    const today = getLocalDateStr();
    const claimedKey = `matika-claimed-quests-${today}`;
    const newClaimed = new Set(claimedQuests);
    newClaimed.add(questIdx);
    setClaimedQuests(newClaimed);
    localStorage.setItem(claimedKey, JSON.stringify([...newClaimed]));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setShowXp(true);
    setXpAmount(xpReward);
    setTimeout(() => setShowXp(false), 1500);
  };

  const handleClaimReward = () => {
    const result = claimDailyReward();
    if (result) {
      setProfile(result.profile);
      setXpAmount(result.reward.xp);
      setShowXp(true);
      setTimeout(() => setShowDailyReward(false), 1500);
    }
  };

  if (!mounted || !profile) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <div className="flex-1 flex items-center justify-center">
          {loadingTimedOut ? (
            <div className="text-center">
              <p className="text-sm text-[var(--fg-muted)] mb-4">Sepertinya ada masalah saat memuat halaman.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Muat Ulang
              </button>
            </div>
          ) : (
            <div className="w-12 h-12 border-4 border-[var(--duo-green)] border-t-transparent rounded-full animate-spin" />
          )}
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
  const totalStudyMinutes = Math.floor((profile.totalStudyTime || 0) / 60);
  const averageAccuracy = profile.weeklyAccuracy?.length
    ? Math.round(profile.weeklyAccuracy.reduce((a, b) => a + b, 0) / profile.weeklyAccuracy.filter((x) => x > 0).length || 0)
    : 85;

  const nextTopic = topics.find((t) => !profile.completedTopics?.includes(t.slug));
  const topicStatus = getTopicStatus(topics, profile.completedTopics || []);

  const mapNodes = topics.map((t) => ({
    slug: t.slug,
    title: t.title,
    icon: t.icon,
    level: t.level as "smp" | "sma" | "kuliah",
    status: topicStatus.get(t.slug) || ("locked" as const),
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
      <Confetti show={showConfetti} />

      <DailyRewardModal
        show={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onClaim={handleClaimReward}
        streak={profile?.dailyRewardStreak ?? 0}
        canClaim={profile?.dailyRewardClaimed !== getLocalDateStr()}
      />

      {/* Streak Freeze Notification Toast */}
      <AnimatePresence>
        {showStreakFreezeToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-md px-4"
          >
            <div className="bg-gradient-to-r from-[var(--duo-info)]/15 via-white to-[var(--duo-info)]/15 dark:from-[var(--duo-info)]/10 dark:via-[var(--surface)] dark:to-[var(--duo-info)]/10 border-2 border-[var(--duo-info)]/40 rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-info)]/20 flex items-center justify-center shrink-0">
                <Snowflake size={20} className="text-[var(--duo-info)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-[var(--fg)]">Streak Freeze kamu terpakai kemarin!</p>
                <p className="text-xs text-[var(--fg-muted)]">Streak tetap aman. Yuk belajar hari ini juga! <Flame size={12} className="inline text-orange-500" /></p>
              </div>
              <button
                onClick={() => {
                  markStreakFreezeNotified();
                  setShowStreakFreezeToast(false);
                }}
                className="w-8 h-8 rounded-full bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border)] transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked Topic Toast */}
      <AnimatePresence>
        {showLockedToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-md px-4"
          >
            <div className="bg-gradient-to-r from-[var(--duo-orange)]/15 via-white to-[var(--duo-orange)]/15 dark:from-[var(--duo-orange)]/10 dark:via-[var(--surface)] dark:to-[var(--duo-orange)]/10 border-2 border-[var(--duo-orange)]/40 rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-orange)]/20 flex items-center justify-center shrink-0">
                <Lock size={20} className="text-[var(--duo-orange)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-[var(--fg)]">Selesaikan topik sebelumnya dulu ya!</p>
                <p className="text-xs text-[var(--fg-muted)]">Topik ini masih terkunci 🔒</p>
              </div>
              <button
                onClick={() => setShowLockedToast(false)}
                className="w-8 h-8 rounded-full bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border)] transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-[260px] p-6 pb-24">
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
                    <h1 className="text-2xl font-black text-[var(--fg)] flex items-center gap-2 flex-wrap">
                      Halo, {profile.name || "Pelajar"}! <InlineIcon emoji="👆" size={22} />
                      {isPremiumActive() && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-black rounded-full flex items-center gap-1">
                          <Crown size={10} /> Player Sultan
                        </span>
                      )}
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

          {/* ===== ANNOUNCEMENTS BANNER ===== */}
          <AnnouncementBanner profile={profile} />

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
              subtext={streak >= 7 ? "Konsisten!" : "Lanjutkan!"}
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
            className="bg-white dark:bg-[var(--surface)] rounded-[24px] border-2 border-[var(--border)] p-5 mb-7 shadow-sm relative z-0"
          >
            <ActivityHeatmap dailyXpHistory={profile.dailyXpHistory || {}} />
          </motion.div>

          {/* ===== EVENT CALENDAR ===== */}
          <EventCalendar />

          {/* ===== TWO COLUMN: CONTINUE + CHART ===== */}
          <div className="grid lg:grid-cols-5 gap-5 mb-7 relative z-10">
            <div className="lg:col-span-3">
              <ContinueLearning profile={profile} />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2"
            >
              {/* Chart toggle */}
              <div className="flex items-center gap-1 mb-3 bg-[var(--border-subtle)] rounded-xl p-1">
                <button
                  onClick={() => setChartView("weekly")}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                    chartView === "weekly"
                      ? "bg-white dark:bg-[var(--surface)] text-[var(--fg)] shadow-sm"
                      : "text-[var(--fg-muted)]"
                  }`}
                >
                  Mingguan
                </button>
                <button
                  onClick={() => setChartView("monthly")}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                    chartView === "monthly"
                      ? "bg-white dark:bg-[var(--surface)] text-[var(--fg)] shadow-sm"
                      : "text-[var(--fg-muted)]"
                  }`}
                >
                  Bulanan
                </button>
              </div>

              {chartView === "weekly" ? (
                <WeeklyChart data={weeklyXp} />
              ) : (
                <MonthlyProgressChart profile={profile} />
              )}
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
                    <QuestCard
                      {...quest}
                      claimed={claimedQuests.has(i)}
                      onClick={quest.completed && !claimedQuests.has(i) ? () => handleClaimQuest(i, quest.xpReward) : undefined}
                    />
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

                  <h3 className="text-base font-black text-[var(--fg)] mb-1"><Zap size={16} className="inline text-yellow-500" /> Tantangan Hari Ini</h3>
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
                <Link key={game.id} href={`/games/${game.id}`}>
                <motion.div
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
                </Link>
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

      {/* ===== POMODORO TIMER ===== */}
      {isFlagEnabled("pomodoro") && <PomodoroTimer />}

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
