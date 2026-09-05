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

  const borderW = hasFrame ? Math.max(2, Math.round(size * 0.04)) : Math.max(1, Math.round(size * 0.03));
  const glowSize = Math.round(size * 0.12);

  return (
    <div className={`relative shrink-0 ${className}`}>
      <style>{`
        @keyframes gold-shimmer {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
        @keyframes gold-pulse {
          0%, 100% { box-shadow: 0 0 ${glowSize}px rgba(251,191,36,0.5), 0 0 ${glowSize * 2}px rgba(251,191,36,0.2); }
          50% { box-shadow: 0 0 ${glowSize * 1.5}px rgba(251,191,36,0.7), 0 0 ${glowSize * 3}px rgba(251,191,36,0.35); }
        }
        @keyframes gold-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sparkle-float {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>

      {/* Outer glow ring */}
      {hasFrame && (
        <div
          className={`absolute inset-0 ${radius} pointer-events-none`}
          style={{
            margin: -Math.round(size * 0.06),
            background: "conic-gradient(from 0deg, transparent, rgba(251,191,36,0.3), transparent, rgba(255,200,50,0.3), transparent)",
            animation: "gold-rotate 4s linear infinite",
            filter: `blur(${Math.round(size * 0.04)}px)`,
          }}
        />
      )}

      {/* Main avatar circle */}
      <div
        className={`${radius} flex items-center justify-center text-white font-black transition-transform duration-150 hover:scale-105 active:scale-95 overflow-hidden relative`}
        style={{
          width: size,
          height: size,
          fontSize: isEmoji ? Math.round(size * 0.5) : fontSize,
          background: hasFrame
            ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #f59e0b 100%)"
            : undefined,
          border: `${borderW}px solid ${hasFrame ? "#fcd34d" : "white"}`,
          boxShadow: hasFrame
            ? `0 0 ${glowSize}px rgba(251,191,36,0.5), 0 0 ${glowSize * 2}px rgba(251,191,36,0.2), inset 0 1px 2px rgba(255,255,255,0.3)`
            : `0 2px 8px rgba(0,0,0,0.15)`,
          animation: hasFrame ? "gold-pulse 2.5s ease-in-out infinite" : undefined,
        }}
      >
        {/* Dark overlay for depth */}
        {hasFrame && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
        )}

        {/* Shimmer sweep */}
        {hasFrame && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ borderRadius: "inherit" }}
          >
            <div
              className="absolute top-0 left-0 w-[40%] h-full"
              style={{
                background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                animation: "gold-shimmer 3s ease-in-out infinite",
              }}
            />
          </div>
        )}

        <span className="relative z-10 leading-none" style={{ textShadow: hasFrame ? "0 1px 3px rgba(0,0,0,0.3)" : undefined }}>
          {textContent}
        </span>
      </div>

      {/* Sparkle decorations */}
      {hasFrame && size >= 60 && (
        <>
          <div className="absolute pointer-events-none" style={{ top: -2, right: Math.round(size * 0.1), animation: "sparkle-float 2s ease-in-out infinite 0s" }}>
            <svg width={Math.round(size * 0.15)} height={Math.round(size * 0.15)} viewBox="0 0 24 24" fill="#fcd34d"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z"/></svg>
          </div>
          <div className="absolute pointer-events-none" style={{ bottom: Math.round(size * 0.08), left: -1, animation: "sparkle-float 2s ease-in-out infinite 0.8s" }}>
            <svg width={Math.round(size * 0.11)} height={Math.round(size * 0.11)} viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z"/></svg>
          </div>
          <div className="absolute pointer-events-none" style={{ top: Math.round(size * 0.3), left: -3, animation: "sparkle-float 2.5s ease-in-out infinite 1.5s" }}>
            <svg width={Math.round(size * 0.08)} height={Math.round(size * 0.08)} viewBox="0 0 24 24" fill="#fde68a"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z"/></svg>
          </div>
        </>
      )}

      {/* Level badge */}
      {showLevel && (
        <div
          className="absolute -bottom-1 -right-1 flex items-center justify-center text-[#8B6914] font-black border-2 border-white dark:border-[var(--surface)] shadow-lg"
          style={{
            width: Math.round(size * 0.4),
            height: Math.round(size * 0.4),
            borderRadius: Math.round(size * 0.12),
            fontSize: Math.round(size * 0.18),
            background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
          }}
        >
          {level}
        </div>
      )}
    </div>
  );
}
