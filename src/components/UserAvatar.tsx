"use client";

import type { UserProfile } from "@/lib/gamification";

interface UserAvatarProps {
  profile: UserProfile | null;
  size?: number;
  className?: string;
  showLevel?: boolean;
  level?: number;
}

export default function UserAvatar({
  profile,
  size = 40,
  className = "",
  showLevel = false,
  level = 1,
}: UserAvatarProps) {
  const items = profile?.purchasedItems || [];
  const hasFrame = items.includes("frame-gold");
  const hasNinja = items.includes("avatar-ninja");
  const hasWizard = items.includes("avatar-wizard");

  const isRound = size <= 48;
  const radius = isRound ? "rounded-full" : "rounded-[28px]";

  const textContent = hasNinja ? "🥷" : hasWizard ? "🧙" : profile?.name?.charAt(0)?.toUpperCase() || "?";
  const isEmoji = hasNinja || hasWizard;
  const fontSize = Math.round(size * 0.38);

  const padding = hasFrame ? Math.round(size * 0.12) : 0;
  const outerSize = size + padding * 2;

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: outerSize, height: outerSize }}>
      <style>{`
        @keyframes frame-shimmer {
          0% { stop-color: #fcd34d; }
          50% { stop-color: #fbbf24; }
          100% { stop-color: #fcd34d; }
        }
        @keyframes frame-pulse {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.08)}px rgba(251,191,36,0.5)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.14)}px rgba(251,191,36,0.8)); }
        }
        @keyframes frame-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Gold frame border (SVG) */}
      {hasFrame && (
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          width={outerSize}
          height={outerSize}
          viewBox={`0 0 ${outerSize} ${outerSize}`}
          style={{ animation: "frame-pulse 3s ease-in-out infinite" }}
        >
          <defs>
            <linearGradient id={`gold-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d">
                <animate attributeName="stop-color" values="#fcd34d;#fbbf24;#fcd34d" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706">
                <animate attributeName="stop-color" values="#d97706;#b45309;#d97706" dur="2.5s" repeatCount="indefinite" />
              </stop>
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fcd34d">
                <animate attributeName="stop-color" values="#fcd34d;#fbbf24;#fcd34d" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <linearGradient id={`gold-inner-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <clipPath id={`clip-frame-${size}`}>
              <rect x={padding - Math.round(size * 0.02)} y={padding - Math.round(size * 0.02)} width={size + Math.round(size * 0.04)} height={size + Math.round(size * 0.04)} rx={isRound ? outerSize : 32} />
            </clipPath>
          </defs>

          {/* Outer gold border */}
          <rect
            x="1" y="1"
            width={outerSize - 2}
            height={outerSize - 2}
            rx={isRound ? outerSize / 2 : 34}
            fill="none"
            stroke={`url(#gold-grad-${size})`}
            strokeWidth={Math.round(size * 0.08)}
          />

          {/* Inner highlight border */}
          <rect
            x={padding - Math.round(size * 0.03)}
            y={padding - Math.round(size * 0.03)}
            width={size + Math.round(size * 0.06)}
            height={size + Math.round(size * 0.06)}
            rx={isRound ? size / 2 + Math.round(size * 0.03) : 30}
            fill="none"
            stroke={`url(#gold-inner-${size})`}
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Outer glow border */}
          <rect
            x={-1} y={-1}
            width={outerSize + 2}
            height={outerSize + 2}
            rx={isRound ? (outerSize + 2) / 2 : 36}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Corner ornaments (square mode only) */}
          {!isRound && size >= 60 && (
            <>
              {/* Top-left */}
              <path d={`M 4 ${padding + 2} L 4 4 L ${padding + 2} 4`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="4" cy="4" r="2.5" fill="#fcd34d" />
              {/* Top-right */}
              <path d={`M ${outerSize - padding - 2} 4 L ${outerSize - 4} 4 L ${outerSize - 4} ${padding + 2}`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={outerSize - 4} cy="4" r="2.5" fill="#fcd34d" />
              {/* Bottom-left */}
              <path d={`M 4 ${outerSize - padding - 2} L 4 ${outerSize - 4} L ${padding + 2} ${outerSize - 4}`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="4" cy={outerSize - 4} r="2.5" fill="#fcd34d" />
              {/* Bottom-right */}
              <path d={`M ${outerSize - padding - 2} ${outerSize - 4} L ${outerSize - 4} ${outerSize - 4} L ${outerSize - 4} ${outerSize - padding - 2}`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={outerSize - 4} cy={outerSize - 4} r="2.5" fill="#fcd34d" />
              {/* Center top diamond */}
              <path d={`M ${outerSize / 2} 0 L ${outerSize / 2 + 5} 4 L ${outerSize / 2} 8 L ${outerSize / 2 - 5} 4 Z`} fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              {/* Center bottom diamond */}
              <path d={`M ${outerSize / 2} ${outerSize - 8} L ${outerSize / 2 + 5} ${outerSize - 4} L ${outerSize / 2} ${outerSize} L ${outerSize / 2 - 5} ${outerSize - 4} Z`} fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            </>
          )}

          {/* Circle ornaments (round mode) */}
          {isRound && size >= 40 && (
            <>
              <circle cx={outerSize / 2} cy="2" r={Math.max(2, Math.round(size * 0.05))} fill="#fcd34d" stroke="#d97706" strokeWidth="0.5" />
              <circle cx={outerSize / 2} cy={outerSize - 2} r={Math.max(2, Math.round(size * 0.05))} fill="#fcd34d" stroke="#d97706" strokeWidth="0.5" />
              <circle cx="2" cy={outerSize / 2} r={Math.max(2, Math.round(size * 0.05))} fill="#fcd34d" stroke="#d97706" strokeWidth="0.5" />
              <circle cx={outerSize - 2} cy={outerSize / 2} r={Math.max(2, Math.round(size * 0.05))} fill="#fcd34d" stroke="#d97706" strokeWidth="0.5" />
            </>
          )}
        </svg>
      )}

      {/* Main avatar */}
      <div
        className={`${radius} flex items-center justify-center text-white font-black transition-transform duration-150 hover:scale-105 active:scale-95 overflow-hidden relative`}
        style={{
          width: size,
          height: size,
          position: "absolute",
          left: padding,
          top: padding,
          fontSize: isEmoji ? Math.round(size * 0.5) : fontSize,
          background: hasFrame
            ? "linear-gradient(145deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #f59e0b 100%)"
            : "linear-gradient(135deg, var(--primary), var(--primary-hover))",
          border: `${Math.max(2, Math.round(size * 0.03))}px solid ${hasFrame ? "#fef3c7" : "white"}`,
          boxShadow: hasFrame
            ? "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.15)"
            : "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Shimmer overlay */}
        {hasFrame && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: "inherit" }}>
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: "30%",
                background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                animation: "gold-shimmer 3s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <span className="relative z-10 leading-none" style={{
            textShadow: hasFrame ? "0 1px 3px rgba(0,0,0,0.35)" : undefined,
          }}>
            {textContent}
          </span>
        )}
      </div>

      {/* Level badge */}
      {showLevel && (
        <div
          className="absolute flex items-center justify-center text-[#78350f] font-black border-2 border-white dark:border-[var(--surface)] shadow-lg z-20"
          style={{
            width: Math.round(outerSize * 0.32),
            height: Math.round(outerSize * 0.32),
            borderRadius: Math.round(outerSize * 0.1),
            fontSize: Math.round(outerSize * 0.14),
            bottom: -Math.round(outerSize * 0.02),
            right: -Math.round(outerSize * 0.02),
            background: "linear-gradient(145deg, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
            boxShadow: "0 2px 6px rgba(217,119,6,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          {level}
        </div>
      )}
    </div>
  );
}
