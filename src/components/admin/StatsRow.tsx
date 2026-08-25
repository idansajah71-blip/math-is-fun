"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Crown, Zap, Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  index: number;
}

function StatCard({ label, value, trend, icon: Icon, gradient, glowColor, index }: StatCardProps) {
  const trendUp = trend && trend.value > 0;
  const trendDown = trend && trend.value < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      className="relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] p-5 group hover:shadow-[var(--shadow-lg)] transition-all duration-300"
    >
      {/* Gradient accent top-left */}
      <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25" style={{ background: gradient }} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: gradient }}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
            trendUp ? "bg-[var(--success-bg)] text-[var(--success-ink)]" :
            trendDown ? "bg-[var(--danger-bg)] text-[var(--danger-ink)]" :
            "bg-[var(--surface-sunken)] text-[var(--fg-muted)]"
          }`}>
            {trendUp ? <TrendingUp size={10} /> : trendDown ? <TrendingDown size={10} /> : <Minus size={10} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <p className="text-2xl font-black text-[var(--fg)] leading-none mb-1">{value}</p>
      <p className="text-xs font-bold text-[var(--fg-muted)]">{label}</p>
      {trend && <p className="text-[10px] text-[var(--fg-disabled)] mt-1">{trend.label}</p>}
    </motion.div>
  );
}

interface StatsRowProps {
  registryStats: { totalUsers: number; premiumUsers: number };
  totalXp: number;
  avgStreak: number;
}

export default function StatsRow({ registryStats, totalXp, avgStreak }: StatsRowProps) {
  const stats: StatCardProps[] = [
    {
      label: "Total User",
      value: registryStats.totalUsers,
      trend: { value: 12, label: "vs bulan lalu" },
      icon: Users,
      gradient: "var(--grad-ocean)",
      glowColor: "var(--info-glow)",
      index: 0,
    },
    {
      label: "User Premium Aktif",
      value: registryStats.premiumUsers,
      trend: { value: 8, label: "vs bulan lalu" },
      icon: Crown,
      gradient: "var(--grad-xp)",
      glowColor: "var(--accent-xp-glow)",
      index: 1,
    },
    {
      label: "Total XP Hari Ini",
      value: totalXp.toLocaleString(),
      icon: Zap,
      gradient: "var(--grad-primary)",
      glowColor: "var(--primary-glow)",
      index: 2,
    },
    {
      label: "Streak Rata-rata",
      value: avgStreak.toFixed(1),
      trend: { value: 0, label: "hari aktif" },
      icon: Flame,
      gradient: "var(--grad-fire)",
      glowColor: "var(--orange-glow)",
      index: 3,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
