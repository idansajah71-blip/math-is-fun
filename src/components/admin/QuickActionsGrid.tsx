"use client";

import { motion } from "framer-motion";
import { PlusCircle, CheckSquare, BarChart3, Megaphone } from "lucide-react";
import Link from "next/link";

const ACTIONS = [
  {
    label: "Tambah Soal",
    description: "Buat soal baru",
    href: "/admin/content",
    icon: PlusCircle,
    gradient: "var(--grad-primary)",
    glow: "var(--primary-glow)",
  },
  {
    label: "Kelola Event",
    description: "Lihat & approve event",
    href: "/admin/events",
    icon: CheckSquare,
    gradient: "var(--grad-purple)",
    glow: "var(--purple-glow)",
  },
  {
    label: "Lihat Report",
    description: "Analytics & audit log",
    href: "/admin/analytics",
    icon: BarChart3,
    gradient: "var(--grad-ocean)",
    glow: "var(--info-glow)",
  },
  {
    label: "Broadcast",
    description: "Kirim pengumuman",
    href: "/admin/announcements",
    icon: Megaphone,
    gradient: "var(--grad-xp)",
    glow: "var(--accent-xp-glow)",
  },
];

export default function QuickActionsGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <h3 className="text-sm font-black text-[var(--fg)] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.05 }}
          >
            <Link
              href={action.href}
              className="block p-4 rounded-xl border border-[var(--border-subtle)] hover:border-transparent hover:shadow-lg transition-all group relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity" style={{ background: action.gradient }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform" style={{ background: action.gradient }}>
                <action.icon size={18} />
              </div>
              <p className="text-xs font-black text-[var(--fg)] mb-0.5">{action.label}</p>
              <p className="text-[10px] text-[var(--fg-muted)]">{action.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
