"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { renderIcon } from "@/lib/iconMap";

interface BadgeRevealProps {
  badgeName: string;
  badgeIcon: string;
  badgeRarity?: string;
  onClose: () => void;
}

const rarityConfig: Record<string, { gradient: string; glow: string; label: string }> = {
  common: { gradient: "from-gray-400 to-gray-600", glow: "shadow-gray-500/30", label: "Common" },
  rare: { gradient: "from-blue-400 to-cyan-500", glow: "shadow-blue-500/30", label: "Rare" },
  epic: { gradient: "from-purple-400 to-pink-500", glow: "shadow-purple-500/30", label: "Epic" },
  legendary: { gradient: "from-yellow-400 to-orange-500", glow: "shadow-yellow-500/30", label: "Legendary" },
};

export default function BadgeReveal({ badgeName, badgeIcon, badgeRarity = "common", onClose }: BadgeRevealProps) {
  const [phase, setPhase] = useState<"intro" | "reveal" | "done">("intro");
  const rarity = rarityConfig[badgeRarity] || rarityConfig.common;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 600);
    const t2 = setTimeout(() => setPhase("done"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Particles */}
        {phase === "reveal" && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                }}
                transition={{ duration: 1.2, delay: Math.random() * 0.3, ease: "easeOut" }}
                className="absolute z-10"
                style={{
                  left: "50%",
                  top: "50%",
                }}
              >
                <Sparkles size={12 + Math.random() * 16} className="text-yellow-400" />
              </motion.div>
            ))}
          </>
        )}

        {/* Card */}
        <motion.div
          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
          animate={
            phase === "intro"
              ? { scale: 0.8, rotateY: 90, opacity: 0.5 }
              : phase === "reveal"
              ? { scale: 1, rotateY: 0, opacity: 1 }
              : { scale: 1, rotateY: 0, opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="relative z-20 w-full max-w-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`bg-gradient-to-br ${rarity.gradient} rounded-3xl p-1 shadow-2xl ${rarity.glow}`}>
            <div className="bg-white dark:bg-[#1a1a2e] rounded-[20px] p-6 text-center">
              {/* Glow ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={phase === "reveal" ? { scale: [0, 1.5, 1], opacity: [0, 0.6, 0] } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`absolute inset-0 m-auto w-32 h-32 rounded-full bg-gradient-to-br ${rarity.gradient} blur-2xl`}
              />

              {/* Badge icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={phase === "reveal" ? { scale: 1, rotate: 0 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                className="relative w-24 h-24 mx-auto mb-4"
              >
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${rarity.gradient} flex items-center justify-center shadow-lg`}>
                  {renderIcon(badgeIcon, 40, "")}
                </div>
                {/* Sparkle ring */}
                {phase === "reveal" && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0.5] }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute inset-0 rounded-full border-2 border-yellow-400/50"
                  />
                )}
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={phase === "reveal" ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--duo-text-muted)] mb-1">
                  {rarity.label} Badge
                </p>
                <h3 className="text-lg font-black text-[var(--duo-text)] mb-1">{badgeName}</h3>
                <p className="text-xs text-[var(--duo-text-muted)]">Badge baru terbuka!</p>
              </motion.div>

              {/* Action */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={phase === "done" ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.1 }}
                onClick={onClose}
                className="mt-5 w-full py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--duo-green-dark)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 active:translate-y-[2px] transition-all"
              >
                Keren! 🎉
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
