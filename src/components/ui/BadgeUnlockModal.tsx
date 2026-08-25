"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Confetti from "./Confetti";
import { Star, Award, Check, Sparkles, Trophy, Crown, Flame, Brain, Gem, Zap, Sprout, Dumbbell, Medal, Diamond } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import { InlineIcon } from "@/lib/iconMap";

interface BadgeUnlockModalProps {
  show: boolean;
  badge: {
    id: string;
    name: string;
    icon: string;
    desc: string;
    rarity: "common" | "rare" | "epic" | "legendary";
  } | null;
  onClose?: () => void;
}

const rarityConfig = {
  common: {
    gradient: "from-gray-400 to-gray-500",
    border: "border-gray-400/40",
    bg: "bg-gray-400/15",
    glow: "rgba(156, 163, 175, 0.4)",
    label: "Common",
    labelColor: "text-gray-300",
    iconBg: "bg-gradient-to-br from-gray-400 to-gray-500",
  },
  rare: {
    gradient: "from-[#1CB0F6] to-[#4DC9FF]",
    border: "border-[#1CB0F6]/40",
    bg: "bg-[#1CB0F6]/15",
    glow: "rgba(28, 176, 246, 0.5)",
    label: "Rare",
    labelColor: "text-[#1CB0F6]",
    iconBg: "bg-gradient-to-br from-[#1CB0F6] to-[#4DC9FF]",
  },
  epic: {
    gradient: "from-[#CE82FF] to-[#FF86D0]",
    border: "border-[#CE82FF]/40",
    bg: "bg-[#CE82FF]/15",
    glow: "rgba(206, 130, 255, 0.5)",
    label: "Epic",
    labelColor: "text-[#CE82FF]",
    iconBg: "bg-gradient-to-br from-[#CE82FF] to-[#FF86D0]",
  },
  legendary: {
    gradient: "from-[#FFD900] via-[#FF9600] to-[#FFD900]",
    border: "border-[#FFD900]/40",
    bg: "bg-[#FFD900]/15",
    glow: "rgba(255, 217, 0, 0.6)",
    label: "★ LEGENDARY ★",
    labelColor: "text-gradient-xp",
    iconBg: "bg-gradient-to-br from-[#FFD900] via-[#FF9600] to-[#FFD900]",
  },
};

const iconMap: Record<string, React.ElementType> = {
  Sprout,
  Flame,
  Star,
  GraduationCap: Trophy,
  Trophy,
  Dumbbell,
  Crown,
  Gem,
  Medal,
  Award,
  Brain,
  Diamond,
  Zap,
  Sparkles,
};

export default function BadgeUnlockModal({ show, badge, onClose }: BadgeUnlockModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (show && badge) {
      setShowConfetti(false);
      setStage(0);
      const timers = [
        setTimeout(() => setShowConfetti(true), 150),
        setTimeout(() => setStage(1), 300),
        setTimeout(() => setStage(2), 1100),
        setTimeout(() => setStage(3), 1700),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [show, badge]);

  if (!badge) return null;

  const rarity = rarityConfig[badge.rarity];
  const IconComponent = iconMap[badge.icon] || Award;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" />
          <Confetti show={showConfetti} duration={3500} particleCount={badge.rarity === "legendary" ? 180 : 100} />

          {/* Beam lights */}
          {badge.rarity === "legendary" && stage >= 1 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0], rotate: [0, 30, -30, 0] }}
                transition={{ duration: 3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-gradient-to-r from-transparent via-[var(--duo-xp)]/30 to-transparent blur-2xl"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0], rotate: [0, -45, 45, 0] }}
                transition={{ duration: 3, delay: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-gradient-to-r from-transparent via-[var(--duo-purple)]/30 to-transparent blur-2xl"
              />
            </>
          )}

          <motion.div
            initial={{ scale: 0.2, y: 100, opacity: 0, rotate: -15 }}
            animate={{
              scale: stage >= 1 ? 1 : 0.2,
              y: stage >= 1 ? 0 : 100,
              opacity: stage >= 1 ? 1 : 0,
              rotate: stage >= 1 ? 0 : -15,
            }}
            exit={{ scale: 0.4, y: 50, opacity: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="relative w-full max-w-sm"
          >
            {/* Outer glow */}
            <motion.div
              className="absolute -inset-6 rounded-[56px] blur-3xl opacity-70"
              style={{
                background: `radial-gradient(circle, ${rarity.glow} 0%, transparent 70%)`,
              }}
              animate={badge.rarity === "legendary" ? { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Main Card */}
            <div className={`relative overflow-hidden rounded-[32px] border-2 ${rarity.border} bg-gradient-to-br from-[#0d0820] via-[#151030] to-[#0d0820] shadow-2xl`}>
              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0 opacity-40"
                style={{
                  background: `linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)`,
                  backgroundSize: "200% 200%",
                }}
                animate={{ backgroundPosition: ["-100% -100%", "200% 200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />

              {/* Top corners decoration */}
              <div className="absolute top-3 left-3 w-6 h-6 rounded-tl-xl border-t-2 border-l-2 border-white/20" />
              <div className="absolute top-3 right-3 w-6 h-6 rounded-tr-xl border-t-2 border-r-2 border-white/20" />
              <div className="absolute bottom-3 left-3 w-6 h-6 rounded-bl-xl border-b-2 border-l-2 border-white/20" />
              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-br-xl border-b-2 border-r-2 border-white/20" />

              <div className="relative p-8 text-center">
                {/* Rarity Label */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] ${rarity.bg} ${rarity.labelColor} border ${rarity.border}`}>
                    {badge.rarity === "legendary" && "✦ "}
                    {rarity.label}
                    {badge.rarity === "legendary" && " ✦"}
                  </span>
                </motion.div>

                {/* Badge Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180, y: 20 }}
                  animate={
                    stage >= 1
                      ? { scale: 1, rotate: 0, y: 0 }
                      : {}
                  }
                  transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.3 }}
                  className="relative mx-auto mb-6"
                >
                
                  <div className="relative">
                    <div className={`relative w-32 h-32 mx-auto rounded-3xl ${rarity.iconBg} shadow-2xl flex items-center justify-center overflow-hidden`}>
                      {/* Inner shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" />
                      <motion.div
                        animate={stage >= 2 ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
                        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.5 }}
                        className="relative z-10"
                      >
                        <IconComponent size={56} className="text-white drop-shadow-lg" strokeWidth={2.5} />
                      </motion.div>
                    </div>

                    {/* Orbiting dots for legendary */}
                    {badge.rarity === "legendary" && (
                      <>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[var(--duo-xp)] shadow-lg"
                            style={{ boxShadow: "0 0 10px var(--duo-xp)" }}
                            animate={{
                              x: [0, Math.cos((i * 120 * Math.PI) / 180) * 70, 0],
                              y: [0, Math.sin((i * 120 * Math.PI) / 180) * 70, 0],
                              scale: [0, 1.2, 0],
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Badge Name */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={stage >= 2 ? { opacity: 1, y: 0 } : {}}
                  transition={{ type: "spring", delay: 0.7 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles size={16} className={rarity.labelColor} />
                    <h3 className="text-2xl font-black text-white tracking-wide">
                      {badge.name}
                    </h3>
                    <Sparkles size={16} className={rarity.labelColor} />
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-5">
                    {[...Array(badge.rarity === "legendary" ? 5 : badge.rarity === "epic" ? 4 : badge.rarity === "rare" ? 3 : 2)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={stage >= 2 ? { opacity: 1, scale: 1 } : {}}
                        transition={{ type: "spring", stiffness: 300, delay: 0.8 + i * 0.08 }}
                      >
                        <Star
                          size={14}
                          className={badge.rarity === "legendary" ? "text-[var(--duo-xp)]" : badge.rarity === "epic" ? "text-[var(--duo-purple)]" : badge.rarity === "rare" ? "text-[var(--duo-info)]" : "text-gray-400"}
                          fill="currentColor"
                        />
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.1 }}
                  className="mb-7"
                >
                  <div className={`p-4 rounded-2xl ${rarity.bg} border ${rarity.border}`}>
                    <p className="text-sm text-white/90 font-semibold leading-relaxed flex items-start gap-1.5">
                      <InlineIcon emoji="🎉" size={15} className="mt-0.5 shrink-0" /> <span>{badge.desc}</span>
                    </p>
                  </div>
                </motion.div>

                {/* Unlocked indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={stage >= 3 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ type: "spring", delay: 1.2 }}
                  className="mb-5 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-bg)] border border-[var(--primary)]/30 inline-flex"
                >
                  <Check size={14} className="text-[var(--primary)]" strokeWidth={3} />
                  <span className="text-xs font-black text-[var(--primary)]">BADGE DIBUKA!</span>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.3 }}
                >
                  <AnimatedButton
                    fullWidth
                    variant={badge.rarity === "legendary" ? "gold" : badge.rarity === "epic" ? "purple" : "primary"}
                    size="xl"
                    icon={<Trophy size={18} />}
                    onClick={onClose}
                  >
                    Koleksi Sekarang!
                  </AnimatedButton>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
