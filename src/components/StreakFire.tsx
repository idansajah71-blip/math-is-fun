"use client";

import { Flame } from "lucide-react";

export default function StreakFire({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 rounded-md text-orange-600">
      <Flame size={14} />
      <span className="text-xs font-semibold">{streak}</span>
    </div>
  );
}
