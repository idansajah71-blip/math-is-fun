"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  color = "text-[var(--duo-green)]",
  bg = "bg-[var(--duo-green-bg)]",
  trend,
  trendValue,
}: StatsCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 text-center"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${bg}`}>
        <Icon size={18} className={color} />
      </div>
      <p className="text-lg font-black text-[var(--duo-text)]">{value}</p>
      <p className="text-[10px] font-bold text-[var(--duo-text-muted)]">{label}</p>
      {trend && trendValue && (
        <div className={`mt-1 text-[9px] font-bold ${
          trend === "up" ? "text-[var(--duo-green)]" : trend === "down" ? "text-[var(--duo-danger)]" : "text-[var(--duo-text-muted)]"
        }`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendValue}
        </div>
      )}
    </motion.div>
  );
}
