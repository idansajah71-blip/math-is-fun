"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { heartBeat } from "@/lib/animations";

interface HeartBarProps {
  lives: number;
  maxLives?: number;
  breaking?: boolean;
}

export default function HeartBar({ lives, maxLives = 5, breaking = false }: HeartBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Heart size={20} className="text-[var(--duo-danger)] fill-[var(--duo-danger)]" />
      <div className="flex items-center gap-1">
        {Array.from({ length: maxLives }).map((_, i) => (
          <motion.div
            key={i}
            variants={heartBeat}
            animate={breaking && i === lives ? "break" : "idle"}
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                i < lives
                  ? "text-[var(--duo-danger)] fill-[var(--duo-danger)] scale-100"
                  : "text-gray-300 dark:text-gray-600 scale-75"
              }`}
              style={{
                filter: i < lives ? "drop-shadow(0 1px 2px rgba(255, 75, 75, 0.3))" : "none",
              }}
            />
          </motion.div>
        ))}
      </div>
      <span className="ml-1 text-sm font-bold text-[var(--duo-danger)]">{lives}</span>
    </div>
  );
}
