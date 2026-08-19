"use client";

import { Zap } from "lucide-react";

export default function XpBar({ currentXp, levelXp, nextLevelXp, level, levelName }: {
  currentXp: number; levelXp: number; nextLevelXp: number; level: number; levelName: string;
}) {
  const xpInLevel = currentXp - levelXp;
  const xpNeeded = nextLevelXp - levelXp;
  const pct = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-[#1a73e8] rounded-md flex items-center justify-center text-white text-[10px] font-bold">{level}</div>
          <span className="text-xs font-medium text-gray-700">{levelName}</span>
        </div>
        <span className="text-[10px] text-gray-400">{xpInLevel}/{xpNeeded} XP</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#1a73e8] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
