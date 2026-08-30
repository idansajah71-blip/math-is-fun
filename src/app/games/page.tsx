"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Timer, Brain, Target, Lightbulb, ArrowLeft, Trophy, Zap, Dices } from "lucide-react";
import { staggerContainer, staggerItem, springBounce } from "@/lib/animations";
import { getProfile, isPremiumActive } from "@/lib/gamification";
import { getCooldownRemaining } from "@/components/game/CooldownOverlay";
import type { UserProfile } from "@/lib/gamification";

const GAMES = [
  {
    id: "speed-math",
    title: "Speed Math",
    description: "Hitung cepat 60 detik! Soal makin susah seiring waktu.",
    icon: Timer,
    gradient: "from-orange-500 to-red-500",
    ring: "ring-orange-500/30",
    bg: "bg-orange-500/10",
    reward: "+50 XP",
    difficulty: "Mudah",
    diffColor: "text-[var(--duo-green)]",
  },
  {
    id: "memory-pairs",
    title: "Memory Pairs",
    description: "Cocokkan rumus dengan deskripsi. 4x4 grid, timer aktif!",
    icon: Brain,
    gradient: "from-purple-500 to-pink-500",
    ring: "ring-purple-500/30",
    bg: "bg-purple-500/10",
    reward: "+40 XP",
    difficulty: "Sedang",
    diffColor: "text-[var(--duo-info)]",
  },
  {
    id: "true-false-blitz",
    title: "True/False Blitz",
    description: "Benar atau salah? cepet! Soal makin tricky.",
    icon: Target,
    gradient: "from-cyan-500 to-blue-500",
    ring: "ring-cyan-500/30",
    bg: "bg-cyan-500/10",
    reward: "+35 XP",
    difficulty: "Mudah",
    diffColor: "text-[var(--duo-green)]",
  },
  {
    id: "formula-rush",
    title: "Formula Rush",
    description: "Isi bagian rumus yang kosong. Sulit tapi seru!",
    icon: Lightbulb,
    gradient: "from-green-500 to-emerald-500",
    ring: "ring-green-500/30",
    bg: "bg-green-500/10",
    reward: "+60 XP",
    difficulty: "Sulit",
    diffColor: "text-[var(--duo-danger)]",
  },
];

export default function GamesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const p = getProfile();
    setProfile(p);

    const hs: Record<string, number> = {};
    const cd: Record<string, number> = {};
    for (const game of GAMES) {
      hs[game.id] = Number(localStorage.getItem(`${game.id}-highscore`) || "0");
      cd[game.id] = getCooldownRemaining(game.id);
    }
    setHighScores(hs);
    setCooldowns(cd);

    const interval = setInterval(() => {
      const newCd: Record<string, number> = {};
      for (const game of GAMES) {
        newCd[game.id] = getCooldownRemaining(game.id);
      }
      setCooldowns(newCd);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPremium = isPremiumActive();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} className="text-[var(--fg)]" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-[var(--fg)] flex items-center gap-2">
              <Dices size={20} className="text-[var(--duo-purple)]" />
              Mini Games
            </h1>
            <p className="text-xs text-[var(--fg-muted)]">Latihan sambil bermain</p>
          </div>
        </div>

        {/* Games grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4"
        >
          {GAMES.map((game) => {
            const onCooldown = !isPremium && cooldowns[game.id] > 0;
            const hs = highScores[game.id] || 0;

            return (
              <motion.div key={game.id} variants={staggerItem}>
                <Link href={`/games/${game.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative rounded-3xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 overflow-hidden group ${
                      onCooldown ? "opacity-60" : ""
                    }`}
                  >
                    {/* Glow */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${game.gradient} opacity-10 group-hover:opacity-25 group-hover:scale-150 transition-all duration-700`} />

                    <div className="relative flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <game.icon size={26} className="text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-black text-[var(--fg)]">{game.title}</h3>
                          <span className={`text-[10px] font-black ${game.diffColor}`}>{game.difficulty}</span>
                        </div>
                        <p className="text-xs text-[var(--fg-muted)] mb-2">{game.description}</p>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-black text-[var(--duo-xp)]">{game.reward}</span>
                          {hs > 0 && (
                            <span className="text-[11px] font-bold text-[var(--fg-muted)] flex items-center gap-1">
                              <Trophy size={10} /> {hs}
                            </span>
                          )}
                          {onCooldown && (
                            <span className="text-[11px] font-bold text-[var(--duo-orange)] flex items-center gap-1">
                              <Timer size={10} /> {cooldowns[game.id]}s
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center self-center group-hover:translate-x-1 transition-transform">
                        <span className="text-[var(--fg-muted)] text-sm">→</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Premium banner */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--duo-purple)]/10 to-[var(--duo-pink)]/10 border border-[var(--duo-purple)]/20 text-center"
          >
            <p className="text-xs text-[var(--fg-muted)]">
              <span className="text-[var(--duo-purple)] font-bold">Sultan?</span> Upgrade premium buat ilangin cooldown!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
