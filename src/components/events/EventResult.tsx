"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Gem, Award, ArrowLeft, PartyPopper, Frown } from "lucide-react";

interface EventResultProps {
  eventName: string;
  eventType: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  gemsEarned: number;
  badgeEarned: string | null;
  isWin: boolean;
  onBack: () => void;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function EventResult({
  eventName,
  score,
  totalQuestions,
  xpEarned,
  gemsEarned,
  badgeEarned,
  isWin,
  onBack,
}: EventResultProps) {
  const displayXp = useCountUp(xpEarned);
  const displayGems = useCountUp(gemsEarned);

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-full max-w-md mx-auto"
    >
      <div
        className={`rounded-3xl border-2 p-8 text-center ${
          isWin
            ? "bg-gradient-to-br from-[var(--duo-green)]/10 to-emerald-500/10 border-[var(--duo-green)]/30"
            : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-700"
        }`}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
          className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isWin
              ? "bg-[var(--duo-green)]/15"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          {isWin ? (
            <PartyPopper size={40} className="text-[var(--duo-green)]" />
          ) : (
            <Frown size={40} className="text-gray-400" />
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-3xl font-black mb-1 ${
            isWin ? "text-[var(--duo-green)]" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {isWin ? "Menang!" : "Kalah!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-[var(--duo-text-muted)] mb-6"
        >
          {eventName}
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="text-4xl font-black text-[var(--duo-text)]">
            {score} <span className="text-lg text-[var(--duo-text-muted)]">/ {totalQuestions}</span>
          </div>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">Benar</p>
          <div
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
              percentage >= 70
                ? "bg-[var(--duo-green)]/15 text-[var(--duo-green)]"
                : "bg-[var(--duo-orange)]/15 text-[var(--duo-orange)]"
            }`}
          >
            {percentage}%
          </div>
        </motion.div>

        {/* Rewards */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 mb-8"
        >
          <h3 className="text-xs font-bold text-[var(--duo-text-muted)] uppercase tracking-wider">Hadiah</h3>

          <div className="flex items-center justify-between bg-white dark:bg-[var(--duo-card)] rounded-xl border border-[var(--duo-border)] px-4 py-3">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-[var(--duo-xp)]" />
              <span className="text-sm font-bold text-[var(--duo-text)]">XP</span>
            </div>
            <span className="text-sm font-black text-[var(--duo-xp)]">+{displayXp}</span>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-[var(--duo-card)] rounded-xl border border-[var(--duo-border)] px-4 py-3">
            <div className="flex items-center gap-2">
              <Gem size={18} className="text-[var(--duo-green)]" />
              <span className="text-sm font-bold text-[var(--duo-text)]">Gems</span>
            </div>
            <span className="text-sm font-black text-[var(--duo-green)]">+{displayGems}</span>
          </div>

          {badgeEarned && (
            <div className="flex items-center justify-between bg-white dark:bg-[var(--duo-card)] rounded-xl border border-[var(--duo-orange)]/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[var(--duo-orange)]" />
                <span className="text-sm font-bold text-[var(--duo-text)]">Badge</span>
              </div>
              <span className="text-sm font-black text-[var(--duo-orange)]">{badgeEarned}</span>
            </div>
          )}
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ArrowLeft size={16} />
          Kembali ke Event
        </motion.button>
      </div>
    </motion.div>
  );
}
