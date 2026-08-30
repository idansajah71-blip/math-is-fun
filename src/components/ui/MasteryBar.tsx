"use client";

import { motion } from "framer-motion";
import { getMasteryLevel, type MasteryInfo } from "@/lib/mastery";

interface MasteryBarProps {
  mastery?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showPct?: boolean;
}

export default function MasteryBar({ mastery: masteryProp, size = "md", showLabel = true, showPct = true }: MasteryBarProps) {
  const pct = masteryProp ?? 0;
  const info: MasteryInfo = getMasteryLevel(pct);

  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };
  const textSizes = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" };

  const isMaster = pct >= 90;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className={`${textSizes[size]} font-bold`} style={{ color: info.color }}>
            {isMaster ? "★ " : ""}{info.level}
          </span>
          {showPct && (
            <span className={`${textSizes[size]} font-black text-[var(--duo-text-muted)]`}>
              {pct}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${info.gradient}${isMaster ? " shadow-[0_0_8px_rgba(255,198,41,0.5)]" : ""}`}
        />
      </div>
    </div>
  );
}
