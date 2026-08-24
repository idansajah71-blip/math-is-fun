"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Confetti from "./Confetti";
import { Star, Sparkles, Zap, Gem, Trophy, Rocket, Crown, TrendingUp } from "lucide-react";
import { LEVEL_NAMES } from "@/lib/gamification";
import AnimatedButton from "./AnimatedButton";
import { renderIcon } from "@/lib/iconMap";

interface LevelUpModalProps {
  show: boolean;
  level: number;
  oldLevel?: number;
  onClose?: () => void;
  rewards?: { xp?: number; gems?: number; badge?: string };
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  icon: React.ElementType;
  color: string;
  size: number;
}

const particleIcons: Array<{ icon: React.ElementType; color: string }> = [
  { icon: Star, color: "#FFD900" },
  { icon: Sparkles, color: "#58CC02" },
  { icon: Zap, color: "#1CB0F6" },
  { icon: Gem, color: "#CE82FF" },
  { icon: Trophy, color: "#FF9600" },
  { icon: Rocket, color: "#FF4B4B" },
];

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const iconData = particleIcons[i % particleIcons.length];
    particles.push({
      id: i,
      x: (Math.random() - 0.5) * 100,
      y: 20 + Math.random() * 80,
      delay: Math.random() * 0.8,
      icon: iconData.icon,
      color: iconData.color,
      size: 18 + Math.random() * 22,
    });
  }
  return particles;
}

export default function LevelUpModal({ show, level, onClose, rewards = {} }: LevelUpModalProps) {
  const [particles] = useState<Particle[]>(() => generateParticles(24));
  const [showConfetti, setShowConfetti] = useState(false);
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (show) {
      setShowConfetti(false);
      setStage(0);
      const timers = [
        setTimeout(() => { setShowConfetti(true); setStage(1); }, 200),
        setTimeout(() => setStage(2), 900),
        setTimeout(() => setStage(3), 1600),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [show, level]);

  const levelName = LEVEL_NAMES[level] || "Pelajar Hebat";
  const prevLevelName = LEVEL_NAMES[Math.max(0, level - 1)] || "Pemula";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90 backdrop-blur-xl" />
          <Confetti show={showConfetti} duration={4000} particleCount={150} />

          {/* Floating particle icons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 50, scale: 0, x: `${p.x}%` }}
                animate={{
                  opacity: stage >= 1 ? [0, 1, 1, 0] : 0,
                  y: stage >= 1 ? [p.y, p.y - 100, p.y - 150, p.y - 200] : p.y,
                  scale: stage >= 1 ? [0, 1.2, 1, 0.8] : 0,
                  rotate: stage >= 1 ? [0, 180, 360] : 0,
                }}
                transition={{
                  duration: 2.5,
                  delay: p.delay,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2"
                style={{ color: p.color }}
              >
                <p.icon size={p.size} fill={p.color} fillOpacity={0.3} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.3, y: 80, opacity: 0, rotate: -5 }}
            animate={{
              scale: stage >= 1 ? 1 : 0.3,
              y: stage >= 1 ? 0 : 80,
              opacity: stage >= 1 ? 1 : 0,
              rotate: stage >= 1 ? 0 : -5,
            }}
            exit={{ scale: 0.5, y: 50, opacity: 0, rotate: 5 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            className="relative w-full max-w-md"
          >
            {/* Glow background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--duo-xp)]/30 via-[var(--duo-purple)]/30 to-[var(--duo-info)]/30 rounded-[60px] blur-2xl" />
            <div className="absolute -inset-8 bg-gradient-to-r from-[var(--primary)]/20 via-[var(--duo-pink)]/20 to-[var(--duo-orange)]/20 rounded-[80px] blur-3xl opacity-60" />

            {/* Main Card */}
            <div className="relative overflow-hidden rounded-[36px] border-2 border-white/20 bg-gradient-to-br from-[#1a1140] via-[#2d1b69] to-[#1a1140] shadow-2xl">
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-[36px] p-[2px]">
                <motion.div
                  className="absolute inset-0 rounded-[36px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,217,0,0.5), rgba(206,130,255,0.5), rgba(28,176,246,0.5), transparent)",
                    backgroundSize: "300% 100%",
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "300% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Top decoration */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-b from-[var(--duo-xp)]/40 to-transparent blur-2xl" />
              <div className="absolute top-4 left-4 text-4xl opacity-20">✨</div>
              <div className="absolute top-6 right-6 text-3xl opacity-20">🌟</div>

              <div className="relative p-8 pt-10 text-center">
                {/* Crown / Badge */}
                <motion.div
                  initial={{ y: -80, scale: 0, rotate: -45 }}
                  animate={stage >= 1 ? { y: 0, scale: 1, rotate: 0 } : {}}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                  className="relative mx-auto mb-6"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "conic-gradient(from 0deg, #FFD900, #FF86D0, #CE82FF, #1CB0F6, #58CC02, #FFD900)",
                      }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner ring */}
                    <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#1a1140] to-[#2d1b69] flex items-center justify-center">
                      <motion.div
                        animate={stage >= 2 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--duo-xp)] via-[var(--duo-orange)] to-[#FFD900] flex items-center justify-center shadow-2xl"
                      >
                        <Crown size={40} className="text-[#5C4300]" fill="#FFE066" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Level Up text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2 px-5 py-1.5 mb-3 rounded-full bg-gradient-to-r from-[var(--duo-xp)]/20 to-[var(--duo-orange)]/20 border border-[var(--duo-xp)]/40"
                    animate={stage >= 2 ? { scale: [1, 1.03, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp size={14} className="text-[var(--duo-xp)]" />
                    <span className="text-xs font-black text-[var(--duo-xp)] uppercase tracking-wider">Level Up!</span>
                    <Sparkles size={14} className="text-[var(--duo-xp)]" />
                  </motion.div>
                </motion.div>

                {/* Level numbers */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={stage >= 2 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                  className="flex items-center justify-center gap-4 mb-3"
                >
                  <div className="text-center">
                    <p className="text-xs font-bold text-white/50 mb-1">Level Lama</p>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <span className="text-2xl font-black text-white/70">{Math.max(0, level - 1)}</span>
                    </div>
                  </div>

                  <motion.div
                    animate={stage >= 3 ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-14 h-1.5 rounded-full bg-gradient-to-r from-transparent via-[var(--duo-xp)] to-transparent" />
                    <Rocket size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--duo-xp)]" />
                  </motion.div>

                  <div className="text-center">
                    <p className="text-xs font-bold text-[var(--duo-xp)] mb-1">Level Baru</p>
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                      <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--duo-xp)] via-[var(--duo-orange)] to-[var(--duo-xp)] bg-[length:200%_200%]" animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }} transition={{ duration: 2, repeat: Infinity }} />
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-black text-[#5C4300]">{level}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Title name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={stage >= 2 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 }}
                  className="mb-6"
                >
                  <h3 className="text-2xl font-black text-white mb-1">
                    <span className="text-gradient-xp">{levelName}</span>
                  </h3>
                  <p className="text-sm text-white/60">
                    {prevLevelName} → <span className="text-white font-bold">{levelName}</span>
                  </p>
                </motion.div>

                {/* Rewards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9, type: "spring" }}
                  className="grid grid-cols-2 gap-3 mb-7"
                >
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[var(--duo-xp)]/20 to-[var(--duo-orange)]/10 border border-[var(--duo-xp)]/30 overflow-hidden">
                    <div className="absolute -top-3 -right-3 text-3xl opacity-20">⚡</div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--duo-xp)] to-[var(--duo-orange)] flex items-center justify-center mb-2 mx-auto">
                      <Zap size={18} className="text-[#5C4300]" />
                    </div>
                    <p className="text-xl font-black text-[var(--duo-xp)]">+{rewards.xp || 25 * level}</p>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">XP Earned</p>
                  </div>

                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[var(--duo-purple)]/20 to-[var(--duo-pink)]/10 border border-[var(--duo-purple)]/30 overflow-hidden">
                    <div className="absolute -top-3 -right-3 opacity-20">{renderIcon("💎", 32)}</div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--duo-purple)] to-[var(--duo-pink)] flex items-center justify-center mb-2 mx-auto">
                      <Gem size={18} className="text-white" />
                    </div>
                    <p className="text-xl font-black text-[var(--duo-purple)]">+{rewards.gems || 25}</p>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Gems Bonus</p>
                  </div>
                </motion.div>

                {/* Badge reward if any */}
                {rewards.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={stage >= 3 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.1 }}
                    className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <Trophy size={16} className="text-[var(--duo-xp)] inline mr-2" />
                    <span className="text-sm font-bold text-white/80">Badge baru: </span>
                    <span className="text-sm font-black text-gradient-xp">{rewards.badge}</span>
                  </motion.div>
                )}

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2 }}
                >
                  <AnimatedButton
                    fullWidth
                    variant="gold"
                    size="xl"
                    glow
                    icon={<Sparkles size={20} />}
                    onClick={onClose}
                  >
                    Lanjutkan Petualangan!
                  </AnimatedButton>

                  <p className="text-xs text-white/40 mt-3 font-semibold">
                    Pertahankan semangatmu, {levelName}! 🔥
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
