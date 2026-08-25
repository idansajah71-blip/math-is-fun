"use client";

import { motion } from "framer-motion";
import { Users, Crown, Zap, Flame } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  gradient: string;
  index: number;
}

function StatCard({ label, value, subtitle, icon: Icon, gradient, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      className="relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] p-5 group hover:shadow-[var(--shadow-lg)] transition-all duration-300"
    >
      <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25" style={{ background: gradient }} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: gradient }}>
          <Icon size={20} />
        </div>
      </div>

      <p className="text-2xl font-black text-[var(--fg)] leading-none mb-1">{value}</p>
      <p className="text-xs font-bold text-[var(--fg-muted)]">{label}</p>
      {subtitle && <p className="text-[10px] text-[var(--fg-disabled)] mt-1">{subtitle}</p>}
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
      subtitle: "terdaftar di perangkat ini",
      icon: Users,
      gradient: "var(--grad-ocean)",
      index: 0,
    },
    {
      label: "User Premium Aktif",
      value: registryStats.premiumUsers,
      subtitle: registryStats.premiumUsers > 0 ? `${registryStats.totalUsers > 0 ? Math.round((registryStats.premiumUsers / registryStats.totalUsers) * 100) : 0}% dari total` : "belum ada",
      icon: Crown,
      gradient: "var(--grad-xp)",
      index: 1,
    },
    {
      label: "Total XP Terdistribusi",
      value: totalXp.toLocaleString(),
      subtitle: "akumulasi semua user",
      icon: Zap,
      gradient: "var(--grad-primary)",
      index: 2,
    },
    {
      label: "Streak Rata-rata",
      value: avgStreak.toFixed(1),
      subtitle: "hari belajar berturut-turut",
      icon: Flame,
      gradient: "var(--grad-fire)",
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
