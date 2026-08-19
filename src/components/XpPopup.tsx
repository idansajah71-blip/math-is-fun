"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function XpPopup({ amount, show, onComplete }: {
  amount: number; show: boolean; onComplete?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); onComplete?.(); }, 2000);
      return () => clearTimeout(t);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] rounded-lg shadow-lg shadow-[var(--primary)]/30 text-white">
        <Zap size={16} fill="currentColor" />
        <span className="font-semibold text-sm">+{amount} XP</span>
      </div>
    </div>
  );
}
