"use client";

import { motion } from "framer-motion";
import { cardHover, springGentle } from "@/lib/animations";
import { CheckCircle2, Clock, Gift, Flame, Target, Zap } from "lucide-react";

interface QuestCardProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  xpReward: number;
  type: "daily" | "challenge" | "streak";
  completed?: boolean;
  timeLeft?: string;
}

const typeConfig = {
  daily: { icon: Target, color: "var(--duo-green)", bg: "bg-[var(--duo-green-bg)]" },
  challenge: { icon: Zap, color: "var(--duo-xp)", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
  streak: { icon: Flame, color: "var(--duo-orange)", bg: "bg-orange-50 dark:bg-orange-950/30" },
};

export default function QuestCard({
  title,
  description,
  progress,
  total,
  xpReward,
  type,
  completed = false,
  timeLeft,
}: QuestCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const pct = Math.min((progress / total) * 100, 100);

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={springGentle}
      className={`relative overflow-hidden rounded-[var(--radius-card)] border-2 p-4 ${
        completed
          ? "bg-[var(--duo-green-bg)] border-[var(--duo-green)]/30"
          : "bg-white dark:bg-[var(--duo-card)] border-[var(--duo-border)]"
      }`}
    >
      {/* Completed Glow */}
      {completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--duo-green)]/5 to-transparent" />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}
          >
            {completed ? (
              <CheckCircle2 size={20} style={{ color: config.color }} />
            ) : (
              <Icon size={20} style={{ color: config.color }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-[var(--duo-text)]">{title}</h4>
            <p className="text-[11px] text-[var(--duo-text-muted)]">{description}</p>
          </div>
          {timeLeft && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--duo-text-muted)]">
              <Clock size={12} />
              {timeLeft}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-[var(--duo-text)]">
              {progress}/{total}
            </span>
            <span className="font-bold" style={{ color: config.color }}>
              +{xpReward} XP
            </span>
          </div>
          <div className="h-2.5 bg-[var(--duo-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        {/* Reward */}
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-2 bg-[var(--duo-green)] rounded-xl text-white text-xs font-bold"
          >
            <Gift size={14} />
            Selesai! +{xpReward} XP
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
