"use client";

import { motion } from "framer-motion";

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  progress: number;
  total: number;
  color?: string;
  icon?: React.ReactNode;
}

export default function ProgressCard({
  title,
  subtitle,
  progress,
  total,
  color = "var(--duo-green)",
  icon,
}: ProgressCardProps) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <motion.div
      className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[var(--duo-text)] truncate">{title}</p>
          {subtitle && <p className="text-[10px] text-[var(--duo-text-muted)]">{subtitle}</p>}
        </div>
        <span className="text-xs font-black" style={{ color }}>{pct}%</span>
      </div>

      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-[var(--duo-text-muted)]">{progress} / {total}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
      </div>
    </motion.div>
  );
}
