"use client";

import { motion } from "framer-motion";

interface XPBarProps {
  currentXp: number;
  levelXp: number;
  nextLevelXp: number;
  level: number;
  levelName: string;
  showLabel?: boolean;
}

export default function XPBar({
  currentXp,
  levelXp,
  nextLevelXp,
  level,
  levelName,
  showLabel = true,
}: XPBarProps) {
  const xpInLevel = currentXp - levelXp;
  const xpNeeded = nextLevelXp - levelXp;
  const pct = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--duo-xp)] rounded-lg flex items-center justify-center text-xs font-black text-[#8B6914] shadow-sm">
              {level}
            </div>
            <span className="text-sm font-bold text-[var(--duo-text)]">{levelName}</span>
          </div>
          <span className="text-xs font-semibold text-[var(--duo-text-muted)]">
            {xpInLevel}/{xpNeeded} XP
          </span>
        </div>
      )}
      <div className="h-4 bg-[var(--duo-border)] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
        <motion.div
          className="h-full progress-glow rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
