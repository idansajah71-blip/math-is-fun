"use client";

import { motion } from "framer-motion";

type MascotMood = "happy" | "thinking" | "celebrate" | "sad" | "idle" | "wink";

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  message?: string;
  className?: string;
}

const expressions = {
  happy: { eyes: "◕", mouth: "◡", color: "#58CC02", blush: true },
  thinking: { eyes: "◑", mouth: "—", color: "#1CB0F6", blush: false },
  celebrate: { eyes: "★", mouth: "▽", color: "#FFD900", blush: true },
  sad: { eyes: "◕", mouth: "︵", color: "#FF4B4B", blush: false },
  idle: { eyes: "◕", mouth: "◡", color: "#58CC02", blush: true },
  wink: { eyes: "◕", mouth: "◡", color: "#CE82FF", blush: true },
};

export default function Mascot({ mood = "happy", size = 120, message, className = "" }: MascotProps) {
  const expr = expressions[mood];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id={`bodyGrad-${mood}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={expr.color} />
              <stop offset="100%" stopColor={`${expr.color}CC`} />
            </linearGradient>
            <filter id={`shadow-${mood}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={expr.color} floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Body */}
          <ellipse cx="100" cy="115" rx="70" ry="65" fill={`url(#bodyGrad-${mood})`} filter={`url(#shadow-${mood})`} />

          {/* Belly */}
          <ellipse cx="100" cy="125" rx="45" ry="40" fill="white" opacity="0.9" />

          {/* Eyes */}
          <text x="72" y="100" fontSize="28" textAnchor="middle" fill="white">{expr.eyes}</text>
          <text x="128" y="100" fontSize="28" textAnchor="middle" fill="white">
            {mood === "wink" ? "—" : expr.eyes}
          </text>

          {/* Eye shine */}
          <circle cx="76" cy="94" r="4" fill="white" opacity="0.8" />
          <circle cx="132" cy="94" r="4" fill="white" opacity="0.8" />

          {/* Mouth */}
          <text x="100" y="138" fontSize="22" textAnchor="middle" fill={expr.color}>{expr.mouth}</text>

          {/* Blush */}
          {expr.blush && (
            <>
              <circle cx="55" cy="118" r="12" fill="#FF86D0" opacity="0.3" />
              <circle cx="145" cy="118" r="12" fill="#FF86D0" opacity="0.3" />
            </>
          )}

          {/* Graduation Cap */}
          <polygon points="100,30 55,52 100,74 145,52" fill="#1e3a5f" />
          <rect x="95" y="30" width="10" height="18" fill="#1e3a5f" rx="2" />
          <line x1="145" y1="52" x2="155" y2="72" stroke="#FFD900" strokeWidth="2.5" />
          <circle cx="157" cy="74" r="5" fill="#FFD900" />
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white dark:bg-[var(--duo-card)] px-4 py-2 rounded-2xl shadow-lg border border-[var(--duo-border)] max-w-[200px] text-center"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[var(--duo-card)] border-l border-t border-[var(--duo-border)] rotate-45" />
          <p className="relative text-xs font-bold text-[var(--duo-text)]">{message}</p>
        </motion.div>
      )}
    </div>
  );
}
