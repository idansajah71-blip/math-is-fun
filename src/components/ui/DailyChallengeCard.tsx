"use client";

import { motion } from "framer-motion";
import { ZapIcon, TargetIcon, TrophyIcon, SparklesIcon, FlameIcon } from "@/components/icons/CustomIcons";
import AnimatedButton from "./AnimatedButton";
import { InlineIcon } from "@/lib/iconMap";

interface DailyChallengeCardProps {
  className?: string;
  progress?: number;
  target?: number;
  rewardXp?: number;
  rewardGems?: number;
  onClaim?: () => void;
  claimed?: boolean;
  title?: string;
}

export default function DailyChallengeCard({
  className = "",
  progress = 3,
  target = 5,
  rewardXp = 100,
  rewardGems = 10,
  onClaim,
  claimed = false,
  title = "Selesaikan 5 Quiz Hari Ini",
}: DailyChallengeCardProps) {
  const pct = Math.min(100, Math.round((progress / target) * 100));
  const done = progress >= target;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative rounded-[26px] overflow-hidden shadow-[var(--shadow-lg)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-12 w-64 h-64 rounded-full bg-black/10 blur-3xl" />
      </div>
      <div className="absolute top-3 right-3 opacity-40">
        <SparklesIcon size={46} color="#FFFFFF" />
      </div>
      <div className="absolute bottom-2 left-2 opacity-25">
        <FlameIcon size={36} color="#FFFFFF" />
      </div>

      <div className="relative p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <TargetIcon size={18} color="#FFFFFF" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">Daily Challenge</span>
          </div>
        </div>

        <h3 className="text-lg font-black mb-0.5 leading-tight drop-shadow-sm">{title}</h3>
        <p className="text-[11px] font-bold text-white/75 mb-4 flex items-center gap-1.5">
          <span className="flex items-center gap-1">
            <InlineIcon emoji="🔥" size={11} /> Tanpa jawaban salah → Bonus XP!
          </span>
        </p>

        <div className="mb-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">Progress</p>
              <p className="text-xl font-black leading-none drop-shadow-sm">
                {progress}<span className="text-white/60 text-base font-bold">/{target}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <ZapIcon size={14} color="#FFD900" />
                <span className="text-[11px] font-black text-yellow-100">+{rewardXp}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <TrophyIcon size={13} color="#FFD900" />
                <span className="text-[11px] font-black text-yellow-100">+{rewardGems}</span>
              </div>
            </div>
          </div>

          <div className="relative h-3 w-full bg-black/25 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #FFD900 0%, #FF86D0 50%, #FFFFFF 100%)",
                boxShadow: "0 0 16px rgba(255,217,0,0.6)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
            />
            <div className="absolute inset-0 flex pointer-events-none">
              {Array.from({ length: target }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-black/15 last:border-r-0"
                  style={{ opacity: i < progress ? 0 : 0.5 }}
                />
              ))}
            </div>
          </div>
        </div>

        <AnimatedButton
          size="md"
          fullWidth
          variant={claimed ? "ghost" : done ? "gold" : "primary"}
          glow={!claimed && done}
          disabled={claimed || !done}
          onClick={onClaim}
          className="!shadow-xl"
          icon={claimed ? undefined : done ? undefined : <TargetIcon size={16} color="#FFFFFF" />}
        >
          {claimed ? (
            <span className="flex items-center gap-1">
              <InlineIcon emoji="✅" size={14} /> Sudah Diklaim
            </span>
          ) : done ? (
            <span className="flex items-center gap-1">
              <InlineIcon emoji="🎉" size={15} /> Klaim Bonus!
            </span>
          ) : (
            <span>Ayo Kerjakan {target - progress} Lagi</span>
          )}
        </AnimatedButton>
      </div>
    </motion.div>
  );
}
