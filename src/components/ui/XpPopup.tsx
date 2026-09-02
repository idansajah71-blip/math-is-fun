"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { xpFloat } from "@/lib/animations";

interface XpPopupProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

function XpPopup({ amount, show, onComplete }: XpPopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={xpFloat}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          onAnimationComplete={onComplete}
        >
          <div className="flex items-center gap-2 px-6 py-3 bg-[var(--duo-xp)] rounded-2xl shadow-lg shadow-[var(--duo-xp)]/30 text-[#8B6914]">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Zap size={20} fill="currentColor" />
            </motion.div>
            <span className="font-black text-lg">+{amount} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(XpPopup);
