"use client";

import { BADGES, UserProfile } from "@/lib/gamification";

interface BadgeGridProps {
  profile: UserProfile;
}

export default function BadgeGrid({ profile }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {BADGES.map((badge) => {
        const isUnlocked = profile.badges.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`relative p-4 rounded-2xl border-2 text-center transition-all ${
              isUnlocked
                ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-300 dark:border-yellow-700 shadow-lg shadow-yellow-500/10"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50 grayscale"
            }`}
          >
            <div className={`text-4xl mb-2 ${isUnlocked ? "" : "blur-[1px]"}`}>
              {badge.icon}
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
              {badge.name}
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
              {badge.desc}
            </p>
            {isUnlocked && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
