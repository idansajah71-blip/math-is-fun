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

  const bg = hasFrame
    ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500"
    : "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)]";

  const ring = hasFrame
    ? "ring-[3px] ring-yellow-300/60 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
    : "border-2 border-white dark:border-[var(--surface)]";

  const textContent = hasNinja ? "🥷" : hasWizard ? "🧙" : profile?.name?.charAt(0)?.toUpperCase() || "?";
  const isEmoji = hasNinja || hasWizard;

  const fontSize = Math.round(size * 0.38);

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`${radius} ${bg} ${ring} flex items-center justify-center text-white font-black shadow-md transition-transform duration-150 hover:scale-105 active:scale-95 overflow-hidden`}
        style={{ width: size, height: size, fontSize: isEmoji ? Math.round(size * 0.5) : fontSize }}
      >
        {hasFrame && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10 pointer-events-none" />
        )}
        <span className="relative z-10 leading-none">{textContent}</span>
      </div>
      {showLevel && (
        <div
          className="absolute -bottom-1 -right-1 bg-gradient-to-br from-[var(--duo-xp)] to-[var(--duo-orange)] flex items-center justify-center text-[#8B6914] font-black border-2 border-white dark:border-[var(--surface)] shadow-lg"
          style={{ width: Math.round(size * 0.4), height: Math.round(size * 0.4), borderRadius: Math.round(size * 0.12), fontSize: Math.round(size * 0.18) }}
        >
          {level}
        </div>
      )}
    </div>
  );
}
