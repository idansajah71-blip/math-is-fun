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
  const activeBorder = profile?.activeBorder;

  const isRound = size <= 48;
  const radius = isRound ? "rounded-full" : "rounded-[28px]";

  const hasGold = activeBorder === "frame-gold" && items.includes("frame-gold");
  const hasNinja = activeBorder === "border-ninja" && (items.includes("border-ninja") || items.includes("avatar-ninja"));
  const hasWizard = activeBorder === "border-wizard" && (items.includes("border-wizard") || items.includes("avatar-wizard"));

  const hasFrame = hasGold;
  const hasAnyBorder = hasGold || hasNinja || hasWizard;

  const textContent = profile?.name?.charAt(0)?.toUpperCase() || "?";
  const fontSize = Math.round(size * 0.38);

  const padding = hasAnyBorder ? Math.round(size * 0.12) : 0;
  const outerSize = size + padding * 2;

  const uid = `${size}-${activeBorder || "none"}`;

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: outerSize, height: outerSize }}>
      <style>{`
        @keyframes frame-shimmer-${uid} {
          0% { stop-color: #fcd34d; }
          50% { stop-color: #fbbf24; }
          100% { stop-color: #fcd34d; }
        }
        @keyframes frame-pulse-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.08)}px rgba(251,191,36,0.5)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.14)}px rgba(251,191,36,0.8)); }
        }
        @keyframes ninja-pulse-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(99,102,241,0.4)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(99,102,241,0.7)); }
        }
        @keyframes ninja-shimmer-${uid} {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
        @keyframes wizard-pulse-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(168,85,247,0.4)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(168,85,247,0.7)); }
        }
        @keyframes wizard-sparkle-${uid} {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Gold frame border */}
      {hasGold && (
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          width={outerSize}
          height={outerSize}
          viewBox={`0 0 ${outerSize} ${outerSize}`}
          style={{ animation: `frame-pulse-${uid} 3s ease-in-out infinite` }}
        >
          <defs>
            <linearGradient id={`gold-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
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
            <linearGradient id={`gold-inner-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#gold-grad-${uid})`} strokeWidth={Math.round(size * 0.08)} />
          <rect x={padding - Math.round(size * 0.03)} y={padding - Math.round(size * 0.03)} width={size + Math.round(size * 0.06)} height={size + Math.round(size * 0.06)} rx={isRound ? size / 2 + Math.round(size * 0.03) : 30} fill="none" stroke={`url(#gold-inner-${uid})`} strokeWidth="1.5" opacity="0.6" />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
          {!isRound && size >= 60 && (
            <>
              <path d={`M 4 ${padding + 2} L 4 4 L ${padding + 2} 4`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="4" cy="4" r="2.5" fill="#fcd34d" />
              <path d={`M ${outerSize - padding - 2} 4 L ${outerSize - 4} 4 L ${outerSize - 4} ${padding + 2}`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={outerSize - 4} cy="4" r="2.5" fill="#fcd34d" />
              <path d={`M 4 ${outerSize - padding - 2} L 4 ${outerSize - 4} L ${padding + 2} ${outerSize - 4}`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="4" cy={outerSize - 4} r="2.5" fill="#fcd34d" />
              <path d={`M ${outerSize - padding - 2} ${outerSize - 4} L ${outerSize - 4} ${outerSize - 4} L ${outerSize - 4} ${outerSize - padding - 2}`} fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={outerSize - 4} cy={outerSize - 4} r="2.5" fill="#fcd34d" />
              <path d={`M ${outerSize / 2} 0 L ${outerSize / 2 + 5} 4 L ${outerSize / 2} 8 L ${outerSize / 2 - 5} 4 Z`} fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              <path d={`M ${outerSize / 2} ${outerSize - 8} L ${outerSize / 2 + 5} ${outerSize - 4} L ${outerSize / 2} ${outerSize} L ${outerSize / 2 - 5} ${outerSize - 4} Z`} fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            </>
          )}
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

      {/* Ninja border */}
      {hasNinja && (
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          width={outerSize}
          height={outerSize}
          viewBox={`0 0 ${outerSize} ${outerSize}`}
          style={{ animation: `ninja-pulse-${uid} 3s ease-in-out infinite` }}
        >
          <defs>
            <linearGradient id={`ninja-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="50%" stopColor="#4338ca" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#ninja-grad-${uid})`} strokeWidth={Math.round(size * 0.08)} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
          {/* Shuriken accents */}
          {isRound && size >= 40 && (
            <>
              <line x1={outerSize / 2 - 4} y1="3" x2={outerSize / 2 + 4} y2="3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1={outerSize / 2} y1="0" x2={outerSize / 2} y2="6" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1={outerSize / 2 - 4} y1={outerSize - 3} x2={outerSize / 2 + 4} y2={outerSize - 3} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1={outerSize / 2} y1={outerSize - 6} x2={outerSize / 2} y2={outerSize} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="3" y1={outerSize / 2 - 4} x2="3" y2={outerSize / 2 + 4} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="0" y1={outerSize / 2} x2="6" y2={outerSize / 2} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1={outerSize - 3} y1={outerSize / 2 - 4} x2={outerSize - 3} y2={outerSize / 2 + 4} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1={outerSize - 6} y1={outerSize / 2} x2={outerSize} y2={outerSize / 2} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </>
          )}
        </svg>
      )}

      {/* Wizard border */}
      {hasWizard && (
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          width={outerSize}
          height={outerSize}
          viewBox={`0 0 ${outerSize} ${outerSize}`}
          style={{ animation: `wizard-pulse-${uid} 3s ease-in-out infinite` }}
        >
          <defs>
            <linearGradient id={`wiz-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#wiz-grad-${uid})`} strokeWidth={Math.round(size * 0.08)} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.4" />
          {/* Sparkle dots */}
          {isRound && size >= 40 && (
            <>
              <circle cx={outerSize / 2} cy="3" r="2" fill="#c084fc" style={{ animation: `wizard-sparkle-${uid} 2s ease-in-out infinite` }} />
              <circle cx={outerSize - 3} cy={outerSize / 2} r="1.5" fill="#e9d5ff" style={{ animation: `wizard-sparkle-${uid} 2s ease-in-out 0.5s infinite` }} />
              <circle cx={outerSize / 2} cy={outerSize - 3} r="2" fill="#c084fc" style={{ animation: `wizard-sparkle-${uid} 2s ease-in-out 1s infinite` }} />
              <circle cx="3" cy={outerSize / 2} r="1.5" fill="#e9d5ff" style={{ animation: `wizard-sparkle-${uid} 2s ease-in-out 1.5s infinite` }} />
              <circle cx={outerSize * 0.25} cy={outerSize * 0.25} r="1" fill="#ddd6fe" style={{ animation: `wizard-sparkle-${uid} 2.5s ease-in-out 0.3s infinite` }} />
              <circle cx={outerSize * 0.75} cy={outerSize * 0.75} r="1" fill="#ddd6fe" style={{ animation: `wizard-sparkle-${uid} 2.5s ease-in-out 1.2s infinite` }} />
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
          fontSize,
          background: hasGold
            ? "linear-gradient(145deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #f59e0b 100%)"
            : hasNinja
            ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)"
            : hasWizard
            ? "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)"
            : "linear-gradient(135deg, var(--primary), var(--primary-hover))",
          border: `${Math.max(2, Math.round(size * 0.03))}px solid ${hasGold ? "#fef3c7" : hasNinja ? "#312e81" : hasWizard ? "#7c3aed" : "white"}`,
          boxShadow: hasAnyBorder
            ? hasGold
              ? "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.15)"
              : "0 2px 12px rgba(0,0,0,0.25)"
            : "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Shimmer overlay */}
        {hasGold && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: "inherit" }}>
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: "30%",
                background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                animation: `gold-shimmer-${uid} 3s ease-in-out infinite`,
              }}
            />
          </div>
        )}

        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300"
            draggable={false}
          />
        ) : (
          <span className="relative z-10 leading-none" style={{
            textShadow: hasAnyBorder ? "0 1px 3px rgba(0,0,0,0.35)" : undefined,
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
