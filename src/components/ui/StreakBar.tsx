"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBarProps {
  streak: number;
  showWarning?: boolean;
}

function StreakBar({ streak, showWarning = false }: StreakBarProps) {
  const isHigh = streak >= 7;
  const isWarning = showWarning && streak > 0;

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl ${
        isHigh
          ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200 dark:border-orange-800"
          : isWarning
          ? "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800"
          : "bg-gray-100 dark:bg-gray-800"
      }`}
      animate={isHigh ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        animate={
          streak > 0
            ? {
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }
            : {}
        }
        transition={{ duration: 0.5, repeat: streak > 0 ? Infinity : 0, repeatDelay: 3 }}
      >
        <Flame
          size={18}
          className={streak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400"}
        />
      </motion.div>
      <span className={`text-sm font-black ${streak > 0 ? "text-orange-600 dark:text-orange-400" : "text-gray-400"}`}>
        {streak}
      </span>
      {isWarning && (
        <span className="text-[10px] font-bold text-orange-500 animate-pulse">!</span>
      )}
    </motion.div>
  );
}

export default memo(StreakBar);
