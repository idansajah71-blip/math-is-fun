"use client";

import { motion } from "framer-motion";
import { Users, Zap, Heart, HelpCircle } from "lucide-react";
import type { EventData } from "@/lib/events";
import { EVENT_TYPES } from "@/lib/events";
import { staggerItem } from "@/lib/animations";

interface EventCardProps {
  event: EventData;
  isJoined: boolean;
  participantCount: number;
  onClick: () => void;
}

const difficultyConfig = {
  easy: { label: "Mudah", color: "bg-[var(--duo-green)]/15 text-[var(--duo-green)]" },
  medium: { label: "Sedang", color: "bg-[var(--duo-xp)]/15 text-[var(--duo-xp)]" },
  hard: { label: "Sulit", color: "bg-red-500/15 text-red-500" },
};

const gradientMap: Record<string, string> = {
  "from-red-500 to-orange-500": "from-red-500 to-orange-500",
  "from-yellow-500 to-amber-500": "from-yellow-500 to-amber-500",
  "from-blue-500 to-cyan-500": "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500": "from-purple-500 to-pink-500",
  "from-gray-700 to-gray-900": "from-gray-700 to-gray-900",
  "from-emerald-500 to-teal-500": "from-emerald-500 to-teal-500",
  "from-indigo-500 to-violet-500": "from-indigo-500 to-violet-500",
};

export default function EventCard({ event, isJoined, participantCount, onClick }: EventCardProps) {
  const eventType = EVENT_TYPES[event.type];
  const diff = difficultyConfig[event.difficulty];
  const gradientClass = gradientMap[eventType.gradient] || "from-gray-500 to-gray-700";

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
    >
      <div className={`h-1 bg-gradient-to-r ${gradientClass}`} />

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{eventType.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--duo-text-muted)]">
            {eventType.label}
          </span>
        </div>

        <h3 className="text-lg font-black text-[var(--duo-text)] mb-1 line-clamp-1">
          {event.name}
        </h3>
        <p className="text-sm text-[var(--duo-text-muted)] mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${diff.color}`}>
            {diff.label}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]">
            <HelpCircle size={10} />
            {event.questionsCount} soal
          </span>
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
            <Heart size={10} />
            {event.lives} nyawa
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--duo-border)]">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--duo-text-muted)]">
            <Users size={12} />
            {participantCount} peserta
          </span>

          {isJoined ? (
            <span className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold bg-[var(--duo-green)]/10 text-[var(--duo-green)]">
              Joined ✓
            </span>
          ) : (
            <span className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold bg-[var(--duo-green)] text-white shadow-[0_2px_0_var(--duo-green-dark)]">
              <Zap size={12} />
              Join
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
