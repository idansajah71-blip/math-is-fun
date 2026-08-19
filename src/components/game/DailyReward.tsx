"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Zap, Gem, X, Calendar } from "lucide-react";
import { claimDailyReward, DAILY_REWARDS, getProfile } from "@/lib/gamification";
import AnimatedButton from "@/components/ui/AnimatedButton";

interface DailyRewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyRewardPopup({ isOpen, onClose }: DailyRewardPopupProps) {
  const [reward, setReward] = useState<typeof DAILY_REWARDS[0] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const profile = getProfile();
      const today = new Date().toISOString().split("T")[0];
      if (profile.dailyRewardClaimed === today) {
        setAlreadyClaimed(true);
      }
    }
  }, [isOpen]);

  const handleClaim = () => {
    if (spinning) return;

    setSpinning(true);

    setTimeout(() => {
      const result = claimDailyReward();
      if (result) {
        setReward(result.reward);
        setClaimed(true);
      }
      setSpinning(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={alreadyClaimed ? onClose : undefined} />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white dark:bg-[var(--duo-card)] rounded-[28px] border-2 border-[var(--duo-border)] p-8 max-w-sm w-full shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--duo-text-muted)]"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[var(--duo-xp)] to-[var(--duo-orange)] rounded-full flex items-center justify-center"
              animate={spinning ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
              transition={spinning ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity }}
            >
              <Gift size={36} className="text-white" />
            </motion.div>
            <h2 className="text-xl font-black text-[var(--duo-text)]">Reward Harian!</h2>
            <p className="text-sm text-[var(--duo-text-muted)] mt-1">Klaim hadiahmu setiap hari</p>
          </div>

          {/* Reward Calendar */}
          {!claimed && !alreadyClaimed && (
            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {DAILY_REWARDS.map((r, i) => (
                <motion.div
                  key={i}
                  className={`relative p-2 rounded-xl text-center ${
                    i < 6
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-gradient-to-br from-[var(--duo-xp)]/20 to-[var(--duo-orange)]/20 border border-[var(--duo-xp)]/30"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-[9px] font-bold text-[var(--duo-text-muted)] block">{r.label}</span>
                  <Zap size={10} className="mx-auto text-[var(--duo-xp)]" />
                  <span className="text-[8px] font-bold text-[var(--duo-text)]">{r.xp}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Claimed State */}
          {claimed && reward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-[var(--duo-green-bg)] rounded-2xl">
                  <Zap size={20} className="text-[var(--duo-green)]" />
                  <span className="text-xl font-black text-[var(--duo-green)]">+{reward.xp}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
                  <Gem size={20} className="text-[var(--duo-purple)]" />
                  <span className="text-xl font-black text-[var(--duo-purple)]">+{reward.gems}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-[var(--duo-text-muted)]">
                {reward.label} - {reward.xp} XP + {reward.gems} Gems!
              </p>
            </motion.div>
          )}

          {/* Already Claimed */}
          {alreadyClaimed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6"
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <Calendar size={32} className="mx-auto text-[var(--duo-text-muted)] mb-2" />
                <p className="text-sm font-bold text-[var(--duo-text-muted)]">
                  Sudah diklaim hari ini!
                </p>
                <p className="text-xs text-[var(--duo-text-muted)] mt-1">
                  Kembali besok untuk reward berikutnya
                </p>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          {alreadyClaimed ? (
            <AnimatedButton onClick={onClose} fullWidth size="lg" variant="primary">
              Tutup
            </AnimatedButton>
          ) : !claimed ? (
            <AnimatedButton
              onClick={handleClaim}
              fullWidth
              size="lg"
              variant="primary"
              glow
              loading={spinning}
              icon={<Gift size={18} />}
            >
              {spinning ? "Mengklaim..." : "Klaim Reward"}
            </AnimatedButton>
          ) : (
            <AnimatedButton onClick={onClose} fullWidth size="lg" variant="primary" glow>
              Selesai!
            </AnimatedButton>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
