"use client";

import { useEffect, useState } from "react";
import { Trophy, Zap, Star, ArrowUp } from "lucide-react";
import AnimatedButton from "./ui/AnimatedButton";

export default function LevelUp({ show, level, levelName, onClose }: {
  show: boolean; level: number; levelName: string; onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); onClose(); }, 3000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative animate-scale-in">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-xs">
          <div className="w-20 h-20 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <Trophy size={36} className="text-[#1a73e8]" />
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
              <ArrowUp size={14} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Level Up!</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">Level {level}</p>
          <p className="text-sm text-[#1a73e8] font-medium mb-4">{levelName}</p>
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-4">
            {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <AnimatedButton onClick={onClose} fullWidth variant="primary" size="lg">
            Lanjutkan
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
