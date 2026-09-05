"use client";

import type { UserProfile } from "@/lib/gamification";

interface UserAvatarProps {
  profile: UserProfile | null;
  size?: number;
  className?: string;
  showLevel?: boolean;
  level?: number;
}

const BORDER_IDS = [
  "frame-gold", "border-ninja", "border-wizard",
  "border-fire", "border-ice", "border-nature",
  "border-neon", "border-royal",
];

function ownsBorder(items: string[], id: string): boolean {
  if (items.includes(id)) return true;
  if (id === "border-ninja" && items.includes("avatar-ninja")) return true;
  if (id === "border-wizard" && items.includes("avatar-wizard")) return true;
  return false;
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
  const activeAccessory = profile?.activeAccessory;

  const isRound = size <= 48;
  const radius = isRound ? "rounded-full" : "rounded-[28px]";
  const hasAnyBorder = activeBorder && BORDER_IDS.includes(activeBorder) && ownsBorder(items, activeBorder);

  const textContent = profile?.name?.charAt(0)?.toUpperCase() || "?";
  const fontSize = Math.round(size * 0.38);
  const padding = hasAnyBorder ? Math.round(size * 0.12) : 0;
  const outerSize = size + padding * 2;
  const uid = `${size}-${activeBorder || "none"}`;
  const sw = Math.round(size * 0.08);

  const bgMap: Record<string, string> = {
    "frame-gold": "linear-gradient(145deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #f59e0b 100%)",
    "border-ninja": "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    "border-wizard": "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)",
    "border-fire": "linear-gradient(135deg, #7c2d12 0%, #dc2626 50%, #f97316 100%)",
    "border-ice": "linear-gradient(135deg, #164e63 0%, #06b6d4 50%, #67e8f9 100%)",
    "border-nature": "linear-gradient(135deg, #14532d 0%, #16a34a 50%, #4ade80 100%)",
    "border-neon": "linear-gradient(135deg, #022c22 0%, #10b981 50%, #34d399 100%)",
    "border-royal": "linear-gradient(135deg, #3b0764 0%, #9333ea 50%, #c084fc 100%)",
  };

  const borderBg = bgMap[activeBorder || ""] || "linear-gradient(135deg, var(--primary), var(--primary-hover))";

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: outerSize, height: outerSize }}>
      <style>{`
        @keyframes bp-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(100,100,100,0.3)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(100,100,100,0.6)); }
        }
        @keyframes bspark-${uid} {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes bfire-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(239,68,68,0.4)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.14)}px rgba(249,115,22,0.7)); }
        }
        @keyframes bice-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(6,182,212,0.3)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(103,232,249,0.6)); }
        }
        @keyframes bnature-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(22,163,74,0.3)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(74,222,128,0.6)); }
        }
        @keyframes bneon-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.08)}px rgba(16,185,129,0.5)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.16)}px rgba(52,211,153,0.9)); }
        }
        @keyframes broyal-${uid} {
          0%, 100% { filter: drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(147,51,234,0.3)); }
          50% { filter: drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(192,132,252,0.6)); }
        }
        @keyframes acc-float-${uid} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes acc-sparkle-${uid} {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes acc-wing-${uid} {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.05); }
        }
      `}</style>

      {/* ─── GOLD FRAME ─── */}
      {activeBorder === "frame-gold" && ownsBorder(items, "frame-gold") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `bp-${uid} 3s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`gg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d"><animate attributeName="stop-color" values="#fcd34d;#fbbf24;#fcd34d" dur="3s" repeatCount="indefinite" /></stop>
              <stop offset="50%" stopColor="#d97706"><animate attributeName="stop-color" values="#d97706;#b45309;#d97706" dur="2.5s" repeatCount="indefinite" /></stop>
              <stop offset="100%" stopColor="#fcd34d"><animate attributeName="stop-color" values="#fcd34d;#fbbf24;#fcd34d" dur="3s" repeatCount="indefinite" /></stop>
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#gg-${uid})`} strokeWidth={sw} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
          {isRound && size >= 40 && [0, 90, 180, 270].map(a => {
            const r = (a * Math.PI) / 180;
            const cx = outerSize / 2 + Math.cos(r) * (outerSize / 2 - 2);
            const cy = outerSize / 2 + Math.sin(r) * (outerSize / 2 - 2);
            return <circle key={a} cx={cx} cy={cy} r={Math.max(2, Math.round(size * 0.05))} fill="#fcd34d" stroke="#d97706" strokeWidth="0.5" />;
          })}
        </svg>
      )}

      {/* ─── NINJA ─── */}
      {activeBorder === "border-ninja" && ownsBorder(items, "border-ninja") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `bp-${uid} 3s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`ng-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312e81" /><stop offset="50%" stopColor="#4338ca" /><stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#ng-${uid})`} strokeWidth={sw} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
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

      {/* ─── WIZARD ─── */}
      {activeBorder === "border-wizard" && ownsBorder(items, "border-wizard") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `bp-${uid} 3s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`wg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" /><stop offset="50%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#wg-${uid})`} strokeWidth={sw} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.4" />
          {isRound && size >= 40 && (
            <>
              <circle cx={outerSize / 2} cy="3" r="2" fill="#c084fc" style={{ animation: `bspark-${uid} 2s ease-in-out infinite` }} />
              <circle cx={outerSize - 3} cy={outerSize / 2} r="1.5" fill="#e9d5ff" style={{ animation: `bspark-${uid} 2s ease-in-out 0.5s infinite` }} />
              <circle cx={outerSize / 2} cy={outerSize - 3} r="2" fill="#c084fc" style={{ animation: `bspark-${uid} 2s ease-in-out 1s infinite` }} />
              <circle cx="3" cy={outerSize / 2} r="1.5" fill="#e9d5ff" style={{ animation: `bspark-${uid} 2s ease-in-out 1.5s infinite` }} />
            </>
          )}
        </svg>
      )}

      {/* ─── FIRE ─── */}
      {activeBorder === "border-fire" && ownsBorder(items, "border-fire") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `bfire-${uid} 2s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`fg-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#991b1b" /><stop offset="40%" stopColor="#dc2626" /><stop offset="70%" stopColor="#f97316" /><stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#fg-${uid})`} strokeWidth={sw} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
          {isRound && size >= 40 && (
            <>
              <circle cx={outerSize / 2} cy="2" r="2.5" fill="#f97316" opacity="0.8" style={{ animation: `bspark-${uid} 1.5s ease-in-out infinite` }} />
              <circle cx={outerSize - 2} cy={outerSize / 2} r="2" fill="#ef4444" opacity="0.6" style={{ animation: `bspark-${uid} 1.5s ease-in-out 0.3s infinite` }} />
              <circle cx={outerSize / 2} cy={outerSize - 2} r="2.5" fill="#fbbf24" opacity="0.7" style={{ animation: `bspark-${uid} 1.5s ease-in-out 0.6s infinite` }} />
              <circle cx="2" cy={outerSize / 2} r="2" fill="#dc2626" opacity="0.6" style={{ animation: `bspark-${uid} 1.5s ease-in-out 0.9s infinite` }} />
            </>
          )}
        </svg>
      )}

      {/* ─── ICE ─── */}
      {activeBorder === "border-ice" && ownsBorder(items, "border-ice") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `bice-${uid} 3s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`ig-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#164e63" /><stop offset="50%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#ig-${uid})`} strokeWidth={sw} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.3" />
          {isRound && size >= 40 && (
            <>
              {[0, 60, 120, 180, 240, 300].map(a => {
                const r = (a * Math.PI) / 180;
                const cx = outerSize / 2 + Math.cos(r) * (outerSize / 2 - 2);
                const cy = outerSize / 2 + Math.sin(r) * (outerSize / 2 - 2);
                return <circle key={a} cx={cx} cy={cy} r="1.5" fill="#a5f3fc" opacity="0.7" style={{ animation: `bspark-${uid} 2.5s ease-in-out ${a / 360}s infinite` }} />;
              })}
            </>
          )}
        </svg>
      )}

      {/* ─── NATURE ─── */}
      {activeBorder === "border-nature" && ownsBorder(items, "border-nature") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `bnature-${uid} 3s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`natg-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14532d" /><stop offset="50%" stopColor="#16a34a" /><stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#natg-${uid})`} strokeWidth={sw} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.3" />
          {isRound && size >= 40 && (
            <>
              {[45, 135, 225, 315].map(a => {
                const r = (a * Math.PI) / 180;
                const cx = outerSize / 2 + Math.cos(r) * (outerSize / 2 - 2);
                const cy = outerSize / 2 + Math.sin(r) * (outerSize / 2 - 2);
                return <circle key={a} cx={cx} cy={cy} r="2" fill="#86efac" opacity="0.6" style={{ animation: `bspark-${uid} 3s ease-in-out ${a / 400}s infinite` }} />;
              })}
            </>
          )}
        </svg>
      )}

      {/* ─── NEON ─── */}
      {activeBorder === "border-neon" && ownsBorder(items, "border-neon") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `bneon-${uid} 2s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`neg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#022c22" /><stop offset="50%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#neg-${uid})`} strokeWidth={sw} />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.5" />
          {isRound && size >= 40 && (
            <>
              <line x1="0" y1="0" x2={outerSize} y2="0" stroke="#34d399" strokeWidth="1" opacity="0.4" />
              <line x1="0" y1={outerSize} x2={outerSize} y2={outerSize} stroke="#34d399" strokeWidth="1" opacity="0.4" />
              <line x1="0" y1="0" x2="0" y2={outerSize} stroke="#34d399" strokeWidth="1" opacity="0.4" />
              <line x1={outerSize} y1="0" x2={outerSize} y2={outerSize} stroke="#34d399" strokeWidth="1" opacity="0.4" />
            </>
          )}
        </svg>
      )}

      {/* ─── ROYAL ─── */}
      {activeBorder === "border-royal" && ownsBorder(items, "border-royal") && (
        <svg className="absolute inset-0 pointer-events-none z-0" width={outerSize} height={outerSize} viewBox={`0 0 ${outerSize} ${outerSize}`} style={{ animation: `broyal-${uid} 3s ease-in-out infinite` }}>
          <defs>
            <linearGradient id={`rg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b0764" /><stop offset="50%" stopColor="#9333ea" /><stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width={outerSize - 2} height={outerSize - 2} rx={isRound ? outerSize / 2 : 34} fill="none" stroke={`url(#rg-${uid})`} strokeWidth={sw} />
          <rect x={padding - Math.round(size * 0.03)} y={padding - Math.round(size * 0.03)} width={size + Math.round(size * 0.06)} height={size + Math.round(size * 0.06)} rx={isRound ? size / 2 + Math.round(size * 0.03) : 30} fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.3" />
          <rect x={-1} y={-1} width={outerSize + 2} height={outerSize + 2} rx={isRound ? (outerSize + 2) / 2 : 36} fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.25" />
          {isRound && size >= 40 && (
            <>
              <circle cx={outerSize / 2} cy="2" r="2" fill="#e9d5ff" opacity="0.7" style={{ animation: `bspark-${uid} 2s ease-in-out infinite` }} />
              <circle cx={outerSize - 2} cy={outerSize / 2} r="1.5" fill="#c084fc" opacity="0.6" style={{ animation: `bspark-${uid} 2s ease-in-out 0.7s infinite` }} />
              <circle cx={outerSize / 2} cy={outerSize - 2} r="2" fill="#e9d5ff" opacity="0.7" style={{ animation: `bspark-${uid} 2s ease-in-out 1.4s infinite` }} />
              <circle cx="2" cy={outerSize / 2} r="1.5" fill="#c084fc" opacity="0.6" style={{ animation: `bspark-${uid} 2s ease-in-out 2.1s infinite` }} />
            </>
          )}
        </svg>
      )}

      {/* Main avatar circle */}
      <div
        className={`${radius} flex items-center justify-center text-white font-black transition-transform duration-150 hover:scale-105 active:scale-95 overflow-hidden relative`}
        style={{
          width: size,
          height: size,
          position: "absolute",
          left: padding,
          top: padding,
          fontSize,
          background: hasAnyBorder ? borderBg : "linear-gradient(135deg, var(--primary), var(--primary-hover))",
          border: `${Math.max(2, Math.round(size * 0.03))}px solid ${hasAnyBorder ? "rgba(255,255,255,0.2)" : "white"}`,
          boxShadow: hasAnyBorder ? "0 2px 12px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300" draggable={false} />
        ) : (
          <span className="relative z-10 leading-none" style={{ textShadow: hasAnyBorder ? "0 1px 3px rgba(0,0,0,0.35)" : undefined }}>
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

      {/* ─── ACCESSORIES ─── */}
      {activeAccessory && items.includes(activeAccessory) && (
        <svg
          className="absolute inset-0 pointer-events-none z-10"
          width={outerSize}
          height={outerSize}
          viewBox={`0 0 ${outerSize} ${outerSize}`}
        >
          {/* Crown - top center */}
          {activeAccessory === "acc-crown" && (
            <g style={{ animation: `acc-float-${uid} 2s ease-in-out infinite` }}>
              <path
                d={`M ${outerSize / 2 - 8} ${padding - 2} L ${outerSize / 2 - 5} ${padding - 8} L ${outerSize / 2 - 2} ${padding - 3} L ${outerSize / 2} ${padding - 10} L ${outerSize / 2 + 2} ${padding - 3} L ${outerSize / 2 + 5} ${padding - 8} L ${outerSize / 2 + 8} ${padding - 2} Z`}
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="0.8"
              />
              <circle cx={outerSize / 2 - 5} cy={padding - 7} r="1" fill="#ef4444" />
              <circle cx={outerSize / 2} cy={padding - 9} r="1.2" fill="#3b82f6" />
              <circle cx={outerSize / 2 + 5} cy={padding - 7} r="1" fill="#22c55e" />
            </g>
          )}

          {/* Stars - 4 corners */}
          {activeAccessory === "acc-stars" && (
            <>
              {[
                { x: padding + 2, y: padding + 2, delay: "0s" },
                { x: outerSize - padding - 2, y: padding + 2, delay: "0.5s" },
                { x: padding + 2, y: outerSize - padding - 2, delay: "1s" },
                { x: outerSize - padding - 2, y: outerSize - padding - 2, delay: "1.5s" },
              ].map((s, i) => (
                <g key={i} style={{ animation: `acc-sparkle-${uid} 2s ease-in-out ${s.delay} infinite` }}>
                  <polygon
                    points={`${s.x},${s.y - 3} ${s.x + 1},${s.y - 1} ${s.x + 3},${s.y - 1} ${s.x + 1.5},${s.y + 0.5} ${s.x + 2},${s.y + 2.5} ${s.x},${s.y + 1.5} ${s.x - 2},${s.y + 2.5} ${s.x - 1.5},${s.y + 0.5} ${s.x - 3},${s.y - 1} ${s.x - 1},${s.y - 1}`}
                    fill="#fbbf24"
                    stroke="#f59e0b"
                    strokeWidth="0.3"
                  />
                </g>
              ))}
            </>
          )}

          {/* Gems - 4 corners diamond shape */}
          {activeAccessory === "acc-gems" && (
            <>
              {[
                { x: padding + 3, y: padding + 3, color: "#ef4444" },
                { x: outerSize - padding - 3, y: padding + 3, color: "#3b82f6" },
                { x: padding + 3, y: outerSize - padding - 3, color: "#22c55e" },
                { x: outerSize - padding - 3, y: outerSize - padding - 3, color: "#a855f7" },
              ].map((g, i) => (
                <g key={i} style={{ animation: `acc-sparkle-${uid} 2.5s ease-in-out ${i * 0.6}s infinite` }}>
                  <polygon
                    points={`${g.x},${g.y - 3} ${g.x + 2.5},${g.y} ${g.x},${g.y + 3} ${g.x - 2.5},${g.y}`}
                    fill={g.color}
                    opacity="0.8"
                  />
                  <polygon
                    points={`${g.x},${g.y - 3} ${g.x + 2.5},${g.y} ${g.x},${g.y - 1} ${g.x - 2.5},${g.y}`}
                    fill="white"
                    opacity="0.3"
                  />
                </g>
              ))}
            </>
          )}

          {/* Wings - left and right */}
          {activeAccessory === "acc-wings" && (
            <g style={{ animation: `acc-wing-${uid} 2s ease-in-out infinite` }}>
              {/* Left wing */}
              <path
                d={`M ${padding - 1} ${outerSize / 2} Q ${padding - 10} ${outerSize / 2 - 12} ${padding + 2} ${outerSize / 2 - 18} Q ${padding + 6} ${outerSize / 2 - 8} ${padding + 2} ${outerSize / 2}`}
                fill="white"
                opacity="0.7"
              />
              <path
                d={`M ${padding - 1} ${outerSize / 2} Q ${padding - 8} ${outerSize / 2 + 10} ${padding + 2} ${outerSize / 2 + 14} Q ${padding + 5} ${outerSize / 2 + 6} ${padding + 2} ${outerSize / 2}`}
                fill="white"
                opacity="0.5"
              />
              {/* Right wing */}
              <path
                d={`M ${outerSize - padding + 1} ${outerSize / 2} Q ${outerSize - padding + 10} ${outerSize / 2 - 12} ${outerSize - padding - 2} ${outerSize / 2 - 18} Q ${outerSize - padding - 6} ${outerSize / 2 - 8} ${outerSize - padding - 2} ${outerSize / 2}`}
                fill="white"
                opacity="0.7"
              />
              <path
                d={`M ${outerSize - padding + 1} ${outerSize / 2} Q ${outerSize - padding + 8} ${outerSize / 2 + 10} ${outerSize - padding - 2} ${outerSize / 2 + 14} Q ${outerSize - padding - 5} ${outerSize / 2 + 6} ${outerSize - padding - 2} ${outerSize / 2}`}
                fill="white"
                opacity="0.5"
              />
            </g>
          )}

          {/* Hearts - floating around */}
          {activeAccessory === "acc-heart" && (
            <>
              {[
                { x: outerSize / 2 - 8, y: padding - 4, delay: "0s", scale: 0.8 },
                { x: outerSize - padding + 2, y: outerSize / 2 - 4, delay: "0.7s", scale: 0.6 },
                { x: outerSize / 2 + 6, y: outerSize - padding + 2, delay: "1.4s", scale: 0.7 },
              ].map((h, i) => (
                <g key={i} style={{ animation: `acc-float-${uid} 2s ease-in-out ${h.delay} infinite` }} transform={`translate(${h.x}, ${h.y}) scale(${h.scale})`}>
                  <path d="M 0 3 Q 0 0 3 0 Q 6 0 6 3 Q 6 6 0 9 Q -6 6 -6 3 Q -6 0 -3 0 Q 0 0 0 3 Z" fill="#ef4444" opacity="0.7" />
                </g>
              ))}
            </>
          )}

          {/* Fire - top flame */}
          {activeAccessory === "acc-fire" && (
            <g style={{ animation: `acc-sparkle-${uid} 1.5s ease-in-out infinite` }}>
              <path
                d={`M ${outerSize / 2} ${padding - 6} Q ${outerSize / 2 + 4} ${padding - 12} ${outerSize / 2 + 2} ${padding - 16} Q ${outerSize / 2 + 5} ${padding - 10} ${outerSize / 2 + 3} ${padding - 4} Q ${outerSize / 2 + 1} ${padding - 8} ${outerSize / 2} ${padding - 6} Q ${outerSize / 2 - 1} ${padding - 8} ${outerSize / 2 - 3} ${padding - 4} Q ${outerSize / 2 - 5} ${padding - 10} ${outerSize / 2 - 2} ${padding - 16} Q ${outerSize / 2 - 4} ${padding - 12} ${outerSize / 2} ${padding - 6} Z`}
                fill="#f97316"
                opacity="0.8"
              />
              <path
                d={`M ${outerSize / 2} ${padding - 4} Q ${outerSize / 2 + 2} ${padding - 8} ${outerSize / 2 + 1} ${padding - 10} Q ${outerSize / 2 + 3} ${padding - 6} ${outerSize / 2 + 1} ${padding - 2} Q ${outerSize / 2} ${padding - 5} ${outerSize / 2} ${padding - 4} Q ${outerSize / 2} ${padding - 5} ${outerSize / 2 - 1} ${padding - 2} Q ${outerSize / 2 - 3} ${padding - 6} ${outerSize / 2 - 1} ${padding - 10} Q ${outerSize / 2 - 2} ${padding - 8} ${outerSize / 2} ${padding - 4} Z`}
                fill="#fbbf24"
                opacity="0.9"
              />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
