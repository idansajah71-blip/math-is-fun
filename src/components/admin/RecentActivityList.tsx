"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, BookOpen, Zap, Trophy, Star } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  action: string;
  target: string;
  timestamp: string;
  type: "quiz" | "topic" | "badge" | "premium" | "level";
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  quiz: CheckCircle2,
  topic: BookOpen,
  badge: Star,
  premium: Trophy,
  level: Zap,
};

const TYPE_COLORS: Record<string, string> = {
  quiz: "var(--primary)",
  topic: "var(--info)",
  badge: "var(--accent-xp)",
  premium: "var(--purple)",
  level: "var(--primary)",
};

function formatRelativeTime(ts: string): string {
  const now = Date.now();
  const diff = now - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

const DEMO_ACTIVITIES: Activity[] = [
  { id: "1", name: "Budi Santoso", action: "menyelesaikan quiz", target: "Aljabar Linear", timestamp: new Date(Date.now() - 120000).toISOString(), type: "quiz" },
  { id: "2", name: "Siti Rahma", action: "membuka materi", target: "Trigonometri", timestamp: new Date(Date.now() - 300000).toISOString(), type: "topic" },
  { id: "3", name: "Andi Pratama", action: "mendapatkan badge", target: "Quiz Master", timestamp: new Date(Date.now() - 600000).toISOString(), type: "badge" },
  { id: "4", name: "Rina Wati", action: "upgrade ke", target: "Premium", timestamp: new Date(Date.now() - 1200000).toISOString(), type: "premium" },
  { id: "5", name: "Dika Ramadhan", action: "naik level ke", target: "Level 5 - Siswa Cerdas", timestamp: new Date(Date.now() - 1800000).toISOString(), type: "level" },
  { id: "6", name: "Maya Putri", action: "menyelesaikan quiz", target: "Peluang & Statistika", timestamp: new Date(Date.now() - 3600000).toISOString(), type: "quiz" },
];

interface RecentActivityListProps {
  activities?: Activity[];
}

export default function RecentActivityList({ activities = DEMO_ACTIVITIES }: RecentActivityListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--grad-fire)" }}>
          <Clock size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--fg)]">Aktivitas Terkini</h3>
          <p className="text-[10px] text-[var(--fg-muted)]">Live activity feed</p>
        </div>
      </div>

      <div className="space-y-1">
        {activities.map((act, i) => {
          const Icon = TYPE_ICONS[act.type] || CheckCircle2;
          const color = TYPE_COLORS[act.type] || "var(--primary)";
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-sunken)] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--fg)]">
                  <span className="font-black">{act.name}</span>{" "}
                  <span className="text-[var(--fg-muted)]">{act.action}</span>{" "}
                  <span className="font-bold" style={{ color }}>{act.target}</span>
                </p>
              </div>
              <span className="text-[10px] text-[var(--fg-disabled)] shrink-0 font-medium">
                {formatRelativeTime(act.timestamp)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
