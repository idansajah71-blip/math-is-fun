"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Lock } from "lucide-react";
import { springSnappy } from "@/lib/animations";

interface CooldownOverlayProps {
  gameId: string;
  cooldownSec?: number;
  isPremium: boolean;
  onReady: () => void;
}

export function getCooldownKey(gameId: string): string {
  return `cooldown-${gameId}`;
}

export function getCooldownRemaining(gameId: string): number {
  if (typeof window === "undefined") return 0;
  const key = getCooldownKey(gameId);
  const end = localStorage.getItem(key);
  if (!end) return 0;
  const remaining = Math.ceil((Number(end) - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

export function setCooldown(gameId: string, seconds: number): void {
  const key = getCooldownKey(gameId);
  localStorage.setItem(key, String(Date.now() + seconds * 1000));
}

export function clearCooldown(gameId: string): void {
  localStorage.removeItem(getCooldownKey(gameId));
}

export default function CooldownOverlay({
  gameId,
  cooldownSec = 30,
  isPremium,
  onReady,
}: CooldownOverlayProps) {
  const [remaining, setRemaining] = useState(() =>
    isPremium ? 0 : getCooldownRemaining(gameId)
  );

  useEffect(() => {
    if (isPremium || remaining <= 0) {
      onReady();
      return;
    }
    const interval = setInterval(() => {
      const r = getCooldownRemaining(gameId);
      setRemaining(r);
      if (r <= 0) {
        clearInterval(interval);
        onReady();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPremium, remaining, gameId, onReady]);

  if (isPremium || remaining <= 0) return null;

  const pct = ((cooldownSec - remaining) / cooldownSec) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={springSnappy}
        className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-3xl p-8 text-center max-w-xs mx-4"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--duo-orange)]/10 flex items-center justify-center">
          <Lock size={28} className="text-[var(--duo-orange)]" />
        </div>
        <h3 className="text-lg font-black text-[var(--fg)] mb-2">Cooldown</h3>
        <p className="text-sm text-[var(--fg-muted)] mb-4">
          Tunggu sebentar sebelum main lagi
        </p>

        {/* Circular progress */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="var(--duo-orange)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={213.6}
              initial={{ strokeDashoffset: 213.6 }}
              animate={{ strokeDashoffset: 213.6 * (1 - pct / 100) }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={remaining}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-xl font-black text-[var(--fg)]"
            >
              {remaining}s
            </motion.span>
          </div>
        </div>

        <p className="text-xs text-[var(--fg-muted)]">
          <span className="text-[var(--duo-purple)] font-bold">Sultan?</span> Upgrade ke premium buat ilangin cooldown!
        </p>
      </motion.div>
    </motion.div>
  );
}
