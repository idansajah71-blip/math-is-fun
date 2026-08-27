"use client";

import { Heart, Crown } from "lucide-react";
import { isPremiumActive } from "@/lib/gamification";

export default function Hearts({ lives, maxLives = 5 }: { lives: number; maxLives?: number }) {
  const isPremium = isPremiumActive();
  const displayMax = isPremium ? Math.max(maxLives, 99) : maxLives;
  const heartsToShow = isPremium ? Math.min(lives, 5) : lives;

  if (isPremium) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              size={18}
              className="text-red-500 fill-red-500 scale-100"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
        <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[8px] font-black rounded-full flex items-center gap-0.5">
          <Crown size={7} /> ∞
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLives }).map((_, i) => (
        <Heart
          key={i}
          size={18}
          className={`transition-all duration-300 ${
            i < lives
              ? "text-red-500 fill-red-500 scale-100"
              : "text-gray-300 scale-75"
          }`}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}
