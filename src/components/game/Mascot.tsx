"use client";

import { motion, type TargetAndTransition } from "framer-motion";

type MascotMood = "happy" | "thinking" | "celebrate" | "sad" | "idle" | "wink";

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  message?: string;
  className?: string;
  level?: number;
}

const expressions = {
  happy: { eyes: "◕", mouth: "◡", color: "#58CC02", blush: true },
  thinking: { eyes: "◑", mouth: "—", color: "#1CB0F6", blush: false },
  celebrate: { eyes: "★", mouth: "▽", color: "#FFD900", blush: true },
  sad: { eyes: "◕", mouth: "︵", color: "#FF4B4B", blush: false },
  idle: { eyes: "◕", mouth: "◡", color: "#58CC02", blush: true },
  wink: { eyes: "◕", mouth: "◡", color: "#CE82FF", blush: true },
};

// Evolution stages based on level
function getEvolution(level: number) {
  if (level >= 10) return { cap: "👑", capColor: "#FFD900", size: 1.1 };
  if (level >= 7) return { cap: "🎓", capColor: "#1CB0F6", size: 1.05 };
  if (level >= 4) return { cap: "🧢", capColor: "#CE82FF", size: 1.0 };
  return { cap: "🎓", capColor: "#1e3a5f", size: 1.0 };
}

// Different mood animations
const moodAnimations: Record<MascotMood, TargetAndTransition> = {
  happy: { y: [0, -5, 0] },
  thinking: { y: [0, -3, 0], rotate: [0, -2, 0, 2, 0] },
  celebrate: { y: [0, -10, 0], scale: [1, 1.05, 1] },
  sad: { y: [0, 2, 0] },
  idle: { y: [0, -3, 0] },
  wink: { y: [0, -5, 0] },
};

export default function Mascot({ mood = "happy", size = 120, message, className = "", level = 0 }: MascotProps) {
  const expr = expressions[mood];
  const evo = getEvolution(level);
  const effectiveSize = size * evo.size;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        animate={moodAnimations[mood]}
        transition={{
          duration: mood === "celebrate" ? 0.6 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          ...(mood === "thinking" ? { duration: 3 } : {}),
        }}
      >
        <svg width={effectiveSize} height={effectiveSize} viewBox="0 0 200 200" fill="none">
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

          {/* Headwear — evolves with level */}
          {level >= 7 ? (
            /* Crown for level 7+ */
            <>
              <polygon points="75,45 85,25 100,40 115,25 125,45" fill="#FFD900" />
              <circle cx="85" cy="28" r="3" fill="#FF4B4B" />
              <circle cx="100" cy="35" r="3" fill="#1CB0F6" />
              <circle cx="115" cy="28" r="3" fill="#58CC02" />
            </>
          ) : level >= 4 ? (
            /* Graduation cap for level 4+ */
            <>
              <polygon points="100,30 55,52 100,74 145,52" fill="#1e3a5f" />
              <rect x="95" y="30" width="10" height="18" fill="#1e3a5f" rx="2" />
              <line x1="145" y1="52" x2="155" y2="72" stroke="#FFD900" strokeWidth="2.5" />
              <circle cx="157" cy="74" r="5" fill="#FFD900" />
            </>
          ) : (
            /* Basic cap for low levels */
            <>
              <polygon points="100,38 60,55 100,72 140,55" fill="#1CB0F6" />
              <rect x="95" y="38" width="10" height="14" fill="#1CB0F6" rx="2" />
            </>
          )}
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white dark:bg-[var(--duo-card)] px-4 py-2.5 rounded-2xl shadow-lg border border-[var(--duo-border)] max-w-[220px] text-center"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[var(--duo-card)] border-l border-t border-[var(--duo-border)] rotate-45" />
          <p className="relative text-xs font-bold text-[var(--duo-text)] leading-relaxed">{message}</p>
        </motion.div>
      )}
    </div>
  );
}
