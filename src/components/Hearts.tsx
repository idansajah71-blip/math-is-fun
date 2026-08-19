"use client";

import { Heart } from "lucide-react";

export default function Hearts({ lives, maxLives = 5 }: { lives: number; maxLives?: number }) {
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
