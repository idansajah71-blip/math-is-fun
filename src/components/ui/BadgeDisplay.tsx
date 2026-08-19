"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { renderIcon } from "@/lib/iconMap";

interface BadgeProps {
  icon: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked?: boolean;
  size?: "sm" | "md" | "lg";
}

const rarityColors = {
  common: { bg: "bg-gray-100 dark:bg-gray-800", border: "border-gray-300 dark:border-gray-600", text: "text-gray-600 dark:text-gray-400" },
  rare: { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-300 dark:border-blue-700", text: "text-blue-600 dark:text-blue-400" },
  epic: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-300 dark:border-purple-700", text: "text-purple-600 dark:text-purple-400" },
  legendary: { bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-300 dark:border-yellow-700", text: "text-yellow-600 dark:text-yellow-400" },
};

const rarityGlows = {
  common: "",
  rare: "shadow-blue-200 dark:shadow-blue-900",
  epic: "shadow-purple-200 dark:shadow-purple-900",
  legendary: "shadow-yellow-200 dark:shadow-yellow-900 animate-pulse",
};

const sizes = {
  sm: "w-12 h-12 text-xl",
  md: "w-16 h-16 text-2xl",
  lg: "w-20 h-20 text-3xl",
};

export default function Badge({ icon, name, rarity, unlocked = false, size = "md" }: BadgeProps) {
  const colors = rarityColors[rarity];
  const glow = rarityGlows[rarity];

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-1.5`}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`${sizes[size]} rounded-2xl border-2 ${colors.border} ${unlocked ? colors.bg : "bg-gray-100 dark:bg-gray-800 opacity-40"} flex items-center justify-center ${unlocked ? `shadow-lg ${glow}` : ""}`}>
        <span className={unlocked ? "" : "grayscale"}>{renderIcon(icon, size === "lg" ? 28 : size === "md" ? 22 : 16)}</span>
      </div>
      <span className={`text-[10px] font-bold ${unlocked ? colors.text : "text-gray-400"} text-center leading-tight max-w-[60px] truncate`}>
        {name}
      </span>
      {rarity === "legendary" && unlocked && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Star size={8} className="text-white" fill="currentColor" />
        </motion.div>
      )}
    </motion.div>
  );
}
