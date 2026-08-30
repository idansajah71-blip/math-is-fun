"use client";

import { motion, AnimatePresence } from "framer-motion";
import { xpFloat } from "@/lib/animations";
import { GemIcon } from "@/components/icons/CustomIcons";

interface GemPopupProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export default function GemPopup({ amount, show, onComplete }: GemPopupProps) {
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
          <div className="flex items-center gap-2 px-6 py-3 bg-[var(--duo-purple)] rounded-2xl shadow-lg shadow-[var(--duo-purple)]/30 text-white">
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 0.5 }}
            >
              <GemIcon size={20} color={{ from: "#CE82FF", to: "#9B5DE5" }} />
            </motion.div>
            <span className="font-black text-lg">+{amount} Gems</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
