"use client";

import { motion } from "framer-motion";
import { cardHover, springGentle } from "@/lib/animations";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Lock, Star } from "lucide-react";

interface LessonCardProps {
  title: string;
  description: string;
  slug: string;
  level: "smp" | "sma" | "kuliah";
  status: "locked" | "available" | "completed" | "legendary";
  xpReward?: number;
  icon?: string;
  index?: number;
}

const levelColors = {
  smp: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600", border: "border-emerald-200 dark:border-emerald-800" },
  sma: { bg: "bg-[var(--duo-info)]/10", text: "text-[var(--duo-info)]", border: "border-[var(--duo-info)]/20" },
  kuliah: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-[var(--duo-purple)]", border: "border-purple-200 dark:border-purple-800" },
};

const statusConfig = {
  locked: { icon: Lock, color: "text-gray-400", bg: "bg-gray-100 dark:bg-gray-800", border: "border-gray-200 dark:border-gray-700", opacity: "opacity-60" },
  available: { icon: ChevronRight, color: "text-[var(--duo-green)]", bg: "bg-white dark:bg-[var(--duo-card)]", border: "border-[var(--duo-border)]", opacity: "" },
  completed: { icon: CheckCircle2, color: "text-[var(--duo-green)]", bg: "bg-[var(--duo-green-bg)]", border: "border-[var(--duo-green)]/30", opacity: "" },
  legendary: { icon: Star, color: "text-[var(--duo-xp)]", bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30", border: "border-[var(--duo-xp)]/40", opacity: "" },
};

export default function LessonCard({
  title,
  description,
  slug,
  level,
  status,
  xpReward = 25,
  icon,
  index = 0,
}: LessonCardProps) {
  const config = statusConfig[status];
  const levelColor = levelColors[level];
  const StatusIcon = config.icon;

  const inner = (
    <div className={`relative overflow-hidden rounded-[var(--radius-card)] border-2 p-4 transition-all duration-200 ${config.bg} ${config.border} ${config.opacity} ${
      status !== "locked" ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5" : ""
    }`}>
      {status === "legendary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 animate-pulse" />
      )}

      <div className="relative flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${levelColor.bg} ${levelColor.text}`}>
          {icon ? (
            <span className="text-xl">{icon}</span>
          ) : status === "legendary" ? (
            <Star size={22} fill="currentColor" />
          ) : status === "completed" ? (
            <CheckCircle2 size={22} />
          ) : (
            <span className="text-lg font-bold">{(index || 0) + 1}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-[var(--duo-text)] truncate">{title}</h3>
            {status === "legendary" && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[var(--duo-xp)] text-[#8B6914] rounded-full">
                LEGENDARY
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--duo-text-muted)] truncate">{description}</p>
          {status !== "locked" && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] font-bold text-[var(--duo-xp)]">+{xpReward} XP</span>
            </div>
          )}
        </div>

        <div className={`shrink-0 ${config.color}`}>
          <StatusIcon size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover={status === "locked" ? "rest" : "hover"}
      whileTap={status === "locked" ? "rest" : "tap"}
      transition={springGentle}
    >
      {status === "locked" ? (
        <div>{inner}</div>
      ) : (
        <Link href={`/topic/${slug}`} className="block">{inner}</Link>
      )}
    </motion.div>
  );
}
