"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Flame, Zap, Clock, Pause, Play } from "lucide-react";
import Link from "next/link";
import { springSnappy } from "@/lib/animations";

interface GameHeaderProps {
  title: string;
  timer: number;
  maxTimer: number;
  score: number;
  streak: number;
  onBack?: string;
  paused?: boolean;
  onPause?: () => void;
  showPause?: boolean;
}

export default function GameHeader({
  timer,
  maxTimer,
  score,
  streak,
  onBack = "/games",
  paused = false,
  onPause,
  showPause = false,
}: GameHeaderProps) {
  const timerPct = Math.max(0, (timer / maxTimer) * 100);
  const isLow = timer <= 10;
  const isCritical = timer <= 5;

  return (
    <div className="mb-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <Link
          href={onBack}
          className="w-10 h-10 rounded-xl bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-[var(--fg)]" />
        </Link>

        {/* Score */}
        <motion.div
          key={score}
          initial={{ scale: 1.3, y: -5 }}
          animate={{ scale: 1, y: 0 }}
          transition={springSnappy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[var(--duo-xp)]/10 border-2 border-[var(--duo-xp)]/30"
        >
          <Zap size={16} className="text-[var(--duo-xp)]" fill="currentColor" />
          <motion.span
            key={score}
            initial={{ scale: 1.5, color: "#FFD700" }}
            animate={{ scale: 1, color: "var(--fg)" }}
            className="text-sm font-black"
          >
            {score}
          </motion.span>
        </motion.div>

        {/* Streak */}
        <AnimatePresence>
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: 20 }}
              transition={springSnappy}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[var(--duo-orange)]/10 border-2 border-[var(--duo-orange)]/30"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <Flame size={16} className="text-[var(--duo-orange)]" />
              </motion.div>
              <span className="text-sm font-black text-[var(--duo-orange)]">{streak}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {showPause && onPause && (
          <button
            onClick={onPause}
            className="w-10 h-10 rounded-xl bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            {paused ? <Play size={16} className="text-[var(--fg)]" /> : <Pause size={16} className="text-[var(--fg)]" />}
          </button>
        )}
      </div>

      {/* Timer bar */}
      <div className="relative h-3 rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            isCritical
              ? "bg-[var(--duo-danger)]"
              : isLow
              ? "bg-[var(--duo-orange)]"
              : "bg-[var(--duo-green)]"
          }`}
          initial={false}
          animate={{
            width: `${timerPct}%`,
            ...(isLow ? { opacity: [1, 0.6, 1] } : {}),
          }}
          transition={
            isLow
              ? { width: { duration: 0.3 }, opacity: { duration: 0.5, repeat: Infinity } }
              : { duration: 0.3 }
          }
        />
        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isCritical ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, repeat: isCritical ? Infinity : 0 }}
            className="flex items-center gap-1"
          >
            <Clock size={10} className={isCritical ? "text-white" : "text-[var(--fg-muted)]"} />
            <span className={`text-[10px] font-black ${isCritical ? "text-white" : "text-[var(--fg-muted)]"}`}>
              {Math.ceil(timer)}s
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
