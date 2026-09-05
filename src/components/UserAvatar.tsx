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

  const borderW = hasFrame ? Math.max(3, Math.round(size * 0.05)) : Math.max(1, Math.round(size * 0.03));
  const glowSize = Math.round(size * 0.15);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ filter: hasFrame ? `drop-shadow(0 0 ${glowSize * 0.6}px rgba(251,191,36,0.35))` : undefined }}>
      <style>{`
        @keyframes gold-shimmer {
          0% { transform: translateX(-150%) rotate(30deg); }
          100% { transform: translateX(250%) rotate(30deg); }
        }
        @keyframes gold-pulse {
          0%, 100% {
            box-shadow:
              0 0 ${glowSize}px rgba(251,191,36,0.5),
              0 0 ${glowSize * 2}px rgba(245,158,11,0.25),
              inset 0 1px 3px rgba(255,255,255,0.3);
          }
          50% {
            box-shadow:
              0 0 ${glowSize * 1.8}px rgba(251,191,36,0.75),
              0 0 ${glowSize * 3}px rgba(245,158,11,0.4),
              inset 0 1px 3px rgba(255,255,255,0.4);
          }
        }
        @keyframes gold-ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sparkle-float-1 {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          15% { opacity: 1; transform: scale(1.2) rotate(45deg); }
          30% { opacity: 1; transform: scale(0.9) rotate(90deg); }
          50% { opacity: 0.8; transform: scale(1) rotate(180deg); }
          70% { opacity: 0.4; transform: scale(0.6) rotate(270deg); }
          90% { opacity: 0; transform: scale(0) rotate(340deg); }
        }
        @keyframes sparkle-float-2 {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg) translateY(0); }
          20% { opacity: 1; transform: scale(1) rotate(60deg) translateY(-3px); }
          50% { opacity: 0.9; transform: scale(0.8) rotate(180deg) translateY(-6px); }
          80% { opacity: 0; transform: scale(0) rotate(300deg) translateY(-2px); }
        }
        @keyframes sparkle-float-3 {
          0%, 100% { opacity: 0; transform: scale(0); }
          30% { opacity: 1; transform: scale(1.3); }
          60% { opacity: 0.7; transform: scale(0.7); }
        }
        @keyframes halo-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        @keyframes orbit-particle {
          0% { transform: rotate(0deg) translateX(${size * 0.65}px) rotate(0deg); opacity: 0.8; }
          50% { opacity: 1; }
          100% { transform: rotate(360deg) translateX(${size * 0.65}px) rotate(-360deg); opacity: 0.8; }
        }
        @keyframes crown-bob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-${Math.round(size * 0.04)}px) scale(1.05); }
        }
      `}</style>

      {/* Halo glow behind everything */}
      {hasFrame && (
        <div
          className={`absolute ${radius} pointer-events-none`}
          style={{
            inset: -Math.round(size * 0.15),
            background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(245,158,11,0.1) 40%, transparent 70%)",
            animation: "halo-glow 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Rotating conic border */}
      {hasFrame && (
        <div
          className={`absolute pointer-events-none`}
          style={{
            inset: -Math.round(size * 0.06),
            borderRadius: "inherit",
            background: "conic-gradient(from 0deg, #fcd34d, #f59e0b, #d97706, #b45309, #fbbf24, #fcd34d, #f59e0b, #d97706, #fcd34d)",
            animation: "gold-ring-spin 3s linear infinite",
            filter: `blur(${Math.max(1, Math.round(size * 0.02))}px)`,
          }}
        />
      )}

      {/* Orbit particles */}
      {hasFrame && size >= 60 && (
        <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "inherit" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: Math.round(size * 0.07),
                height: Math.round(size * 0.07),
                marginTop: -Math.round(size * 0.035),
                marginLeft: -Math.round(size * 0.035),
                background: i === 0 ? "#fcd34d" : i === 1 ? "#fbbf24" : "#f59e0b",
                borderRadius: "50%",
                animation: `orbit-particle ${2.5 + i * 0.8}s linear infinite ${i * 0.8}s`,
                boxShadow: `0 0 ${Math.round(size * 0.06)}px ${i === 0 ? "#fcd34d" : "#fbbf24"}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main avatar */}
      <div
        className={`${radius} flex items-center justify-center text-white font-black transition-transform duration-150 hover:scale-105 active:scale-95 overflow-hidden relative z-10`}
        style={{
          width: size,
          height: size,
          fontSize: isEmoji ? Math.round(size * 0.5) : fontSize,
          background: hasFrame
            ? "linear-gradient(145deg, #fcd34d 0%, #f59e0b 20%, #d97706 45%, #b45309 65%, #d97706 80%, #f59e0b 100%)"
            : "linear-gradient(135deg, var(--primary), var(--primary-hover))",
          border: `${borderW}px solid ${hasFrame ? "#fef3c7" : "white"}`,
          animation: hasFrame ? "gold-pulse 2.5s ease-in-out infinite" : undefined,
        }}
      >
        {/* Depth layer */}
        {hasFrame && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)",
          }} />
        )}

        {/* Holographic shimmer */}
        {hasFrame && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: "inherit" }}>
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: "35%",
                background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.15) 75%, transparent 100%)",
                animation: "gold-shimmer 2.8s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* Subtle inner ring */}
        {hasFrame && (
          <div className="absolute pointer-events-none" style={{
            inset: Math.round(size * 0.06),
            borderRadius: "inherit",
            border: `1px solid rgba(255,255,255,0.25)`,
          }} />
        )}

        <span className="relative z-10 leading-none" style={{
          textShadow: hasFrame ? "0 1px 4px rgba(0,0,0,0.4), 0 0 8px rgba(251,191,36,0.3)" : undefined,
          filter: hasFrame ? "drop-shadow(0 1px 2px rgba(180,83,9,0.5))" : undefined,
        }}>
          {textContent}
        </span>
      </div>

      {/* Crown for gold frame */}
      {hasFrame && size >= 50 && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: -Math.round(size * 0.18),
            left: "50%",
            transform: "translateX(-50%)",
            animation: "crown-bob 2s ease-in-out infinite",
            filter: `drop-shadow(0 2px 4px rgba(217,119,6,0.5))`,
          }}
        >
          <svg width={Math.round(size * 0.35)} height={Math.round(size * 0.28)} viewBox="0 0 24 20" fill="none">
            <path
              d="M2 18L4 7L8 12L12 2L16 12L20 7L22 18H2Z"
              fill="url(#crownGrad)"
              stroke="#b45309"
              strokeWidth="0.8"
            />
            <circle cx="4" cy="6.5" r="1.2" fill="#fcd34d" />
            <circle cx="12" cy="1.5" r="1.5" fill="#fef3c7" />
            <circle cx="20" cy="6.5" r="1.2" fill="#fcd34d" />
            <defs>
              <linearGradient id="crownGrad" x1="2" y1="2" x2="22" y2="18">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Sparkle stars */}
      {hasFrame && size >= 50 && (
        <>
          <div className="absolute pointer-events-none z-20" style={{ top: -1, right: Math.round(size * 0.05), animation: "sparkle-float-1 2.2s ease-in-out infinite 0s" }}>
            <svg width={Math.round(size * 0.17)} height={Math.round(size * 0.17)} viewBox="0 0 24 24">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z" fill="#fef3c7" />
            </svg>
          </div>
          <div className="absolute pointer-events-none z-20" style={{ bottom: Math.round(size * 0.1), left: -2, animation: "sparkle-float-2 2.8s ease-in-out infinite 0.6s" }}>
            <svg width={Math.round(size * 0.12)} height={Math.round(size * 0.12)} viewBox="0 0 24 24">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z" fill="#fbbf24" />
            </svg>
          </div>
          <div className="absolute pointer-events-none z-20" style={{ top: Math.round(size * 0.25), left: -4, animation: "sparkle-float-3 3s ease-in-out infinite 1.2s" }}>
            <svg width={Math.round(size * 0.09)} height={Math.round(size * 0.09)} viewBox="0 0 24 24">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z" fill="#fde68a" />
            </svg>
          </div>
          <div className="absolute pointer-events-none z-20" style={{ top: Math.round(size * 0.05), left: Math.round(size * 0.02), animation: "sparkle-float-1 2.5s ease-in-out infinite 1.8s" }}>
            <svg width={Math.round(size * 0.07)} height={Math.round(size * 0.07)} viewBox="0 0 24 24">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z" fill="#fffbeb" />
            </svg>
          </div>
        </>
      )}

      {/* Level badge */}
      {showLevel && (
        <div
          className="absolute -bottom-1 -right-1 flex items-center justify-center text-[#78350f] font-black border-2 border-white dark:border-[var(--surface)] shadow-lg z-20"
          style={{
            width: Math.round(size * 0.4),
            height: Math.round(size * 0.4),
            borderRadius: Math.round(size * 0.12),
            fontSize: Math.round(size * 0.18),
            background: "linear-gradient(145deg, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
            boxShadow: "0 2px 8px rgba(217,119,6,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          {level}
        </div>
      )}
    </div>
  );
}
