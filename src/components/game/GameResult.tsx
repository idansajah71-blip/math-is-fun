"use client";

import { motion } from "framer-motion";
import { Trophy, RotateCcw, Home, Zap, Target, Flame, Star } from "lucide-react";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Confetti from "@/components/ui/Confetti";
import { springBounce, staggerContainer, staggerItem } from "@/lib/animations";

interface GameResultProps {
  score: number;
  highScore: number;
  xpEarned: number;
  accuracy?: number;
  totalQuestions?: number;
  streak?: number;
  isNewHighScore: boolean;
  onRetry: () => void;
  gameTitle: string;
  gameColor: string;
}

export default function GameResult({
  score,
  highScore,
  xpEarned,
  accuracy,
  totalQuestions,
  streak = 0,
  isNewHighScore,
  onRetry,
  gameTitle,
  gameColor,
}: GameResultProps) {
  return (
    <>
      <Confetti show={isNewHighScore} duration={3000} particleCount={120} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springBounce}
        className="flex flex-col items-center justify-center min-h-[70vh] px-4"
      >
        {/* Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-black text-[var(--fg)] mb-2">
            {isNewHighScore ? "New Record!" : "Game Selesai!"}
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">{gameTitle}</p>
        </motion.div>

        {/* Score circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, ...springBounce }}
          className="relative mb-8"
        >
          <div className={`w-36 h-36 rounded-full border-8 ${gameColor} flex flex-col items-center justify-center bg-[var(--surface)]`}>
            <Zap size={24} className="text-[var(--duo-xp)] mb-1" fill="currentColor" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-black text-[var(--fg)]"
            >
              {score}
            </motion.span>
            <span className="text-xs text-[var(--fg-muted)] font-bold">poin</span>
          </div>
          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, ...springBounce }}
              className="absolute -top-2 -right-2 bg-[var(--duo-xp)] text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1"
            >
              <Star size={10} fill="currentColor" /> BEST
            </motion.div>
          )}
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8"
        >
          <motion.div variants={staggerItem} className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-3 text-center">
            <Trophy size={18} className="mx-auto mb-1 text-[var(--duo-xp)]" />
            <p className="text-lg font-black text-[var(--fg)]">{highScore}</p>
            <p className="text-[10px] text-[var(--fg-muted)] font-bold">Best</p>
          </motion.div>
          {accuracy !== undefined && (
            <motion.div variants={staggerItem} className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-3 text-center">
              <Target size={18} className="mx-auto mb-1 text-[var(--duo-info)]" />
              <p className="text-lg font-black text-[var(--fg)]">{accuracy}%</p>
              <p className="text-[10px] text-[var(--fg-muted)] font-bold">Akurasi</p>
            </motion.div>
          )}
          {totalQuestions !== undefined && (
            <motion.div variants={staggerItem} className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-3 text-center">
              <Zap size={18} className="mx-auto mb-1 text-[var(--duo-green)]" />
              <p className="text-lg font-black text-[var(--fg)]">{totalQuestions}</p>
              <p className="text-[10px] text-[var(--fg-muted)] font-bold">Soal</p>
            </motion.div>
          )}
          {streak > 0 && (
            <motion.div variants={staggerItem} className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-3 text-center">
              <Flame size={18} className="mx-auto mb-1 text-[var(--duo-orange)]" />
              <p className="text-lg font-black text-[var(--fg)]">{streak}</p>
              <p className="text-[10px] text-[var(--fg-muted)] font-bold">Max Streak</p>
            </motion.div>
          )}
        </motion.div>

        {/* XP earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--duo-xp)]/10 border-2 border-[var(--duo-xp)]/30 rounded-2xl mb-6"
        >
          <Zap size={18} className="text-[var(--duo-xp)]" fill="currentColor" />
          <span className="text-sm font-black text-[var(--duo-xp)]">+{xpEarned} XP</span>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 w-full max-w-sm"
        >
          <Link href="/games" className="flex-1">
            <AnimatedButton variant="surface" size="lg" fullWidth icon={<Home size={18} />}>
              Menu
            </AnimatedButton>
          </Link>
          <div className="flex-1">
            <AnimatedButton variant="primary" size="lg" fullWidth icon={<RotateCcw size={18} />} onClick={onRetry}>
              Main Lagi
            </AnimatedButton>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
