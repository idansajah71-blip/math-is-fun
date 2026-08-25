"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2 } from "lucide-react";

interface ContentProgressRingProps {
  current: number;
  target: number;
}

export default function ContentProgressRing({ current, target }: ContentProgressRingProps) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow flex flex-col items-center"
    >
      <div className="flex items-center gap-2.5 mb-4 self-start">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--grad-xp)" }}>
          <Target size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--fg)]">Target Konten</h3>
          <p className="text-[10px] text-[var(--fg-muted)]">Bulan ini</p>
        </div>
      </div>

      {/* Ring */}
      <div className="relative w-[150px] h-[150px] mb-4">
        <svg width="100%" height="100%" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="var(--surface-sunken)"
            strokeWidth={stroke}
          />
          {/* Progress ring */}
          <motion.circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[var(--fg)]">{Math.round(pct)}%</span>
          <span className="text-[10px] font-bold text-[var(--fg-muted)]">{current}/{target}</span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{
        background: pct >= 100 ? "var(--success-bg)" : pct >= 50 ? "var(--warning-bg)" : "var(--surface-sunken)"
      }}>
        <CheckCircle2 size={12} style={{
          color: pct >= 100 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--fg-disabled)"
        }} />
        <span className="text-[10px] font-bold" style={{
          color: pct >= 100 ? "var(--success-ink)" : pct >= 50 ? "var(--warning-ink)" : "var(--fg-muted)"
        }}>
          {pct >= 100 ? "Target tercapai!" : `${target - current} soal lagi`}
        </span>
      </div>
    </motion.div>
  );
}
