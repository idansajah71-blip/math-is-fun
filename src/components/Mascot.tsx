"use client";

export default function Mascot({ mood = "happy", size = 120 }: { mood?: "happy" | "thinking" | "celebrate" | "sad"; size?: number }) {
  const expressions = {
    happy: { eyes: "◕", mouth: "◡", color: "#3b82f6" },
    thinking: { eyes: "◑", mouth: "—", color: "#8b5cf6" },
    celebrate: { eyes: "★", mouth: "▽", color: "#10b981" },
    sad: { eyes: "◕", mouth: "︵", color: "#f59e0b" },
  };

  const expr = expressions[mood];

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={expr.color} />
          <stop offset="100%" stopColor={`${expr.color}cc`} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={expr.color} floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Body */}
      <ellipse cx="100" cy="115" rx="70" ry="65" fill="url(#bodyGrad)" filter="url(#shadow)" />

      {/* Belly */}
      <ellipse cx="100" cy="125" rx="45" ry="40" fill="white" opacity="0.9" />

      {/* Eyes */}
      <text x="72" y="100" fontSize="28" textAnchor="middle" fill="white">{expr.eyes}</text>
      <text x="128" y="100" fontSize="28" textAnchor="middle" fill="white">{expr.eyes}</text>

      {/* Eye shine */}
      <circle cx="76" cy="94" r="4" fill="white" opacity="0.8" />
      <circle cx="132" cy="94" r="4" fill="white" opacity="0.8" />

      {/* Mouth */}
      <text x="100" y="135" fontSize="20" textAnchor="middle" fill={expr.color}>{expr.mouth}</text>

      {/* Blush */}
      <circle cx="60" cy="118" r="10" fill="#f9a8d4" opacity="0.4" />
      <circle cx="140" cy="118" r="10" fill="#f9a8d4" opacity="0.4" />

      {/* Graduation cap */}
      <polygon points="100,30 60,50 100,70 140,50" fill="#1e3a5f" />
      <rect x="95" y="30" width="10" height="15" fill="#1e3a5f" rx="2" />
      <line x1="140" y1="50" x2="148" y2="68" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="150" cy="70" r="4" fill="#f59e0b" />
    </svg>
  );
}
