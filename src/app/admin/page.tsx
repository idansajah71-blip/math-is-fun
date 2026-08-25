"use client";

import { useEffect, useState } from "react";
import { getAdminSession } from "@/lib/adminAuth";
import { getAllRegistryUsers, getRegistryStats } from "@/lib/admin/registry";
import { getContentStats } from "@/lib/admin/content";
import { getAuditStats } from "@/lib/admin/audit";
import { getAllFlags } from "@/lib/admin/flags";
import { motion } from "framer-motion";
import { Users, Trophy, Zap, TrendingUp, Shield, Crown, Activity, BookOpen, History, Flag, Calendar, Megaphone } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [session, setSession] = useState<ReturnType<typeof getAdminSession>>(null);
  const [regStats, setRegStats] = useState({ totalUsers: 0, premiumUsers: 0, newUsersToday: 0, activeLastWeek: 0 });
  const [contentStats, setContentStats] = useState({ totalTopics: 0, publishedTopics: 0, totalQuestions: 0, publishedQuestions: 0 });
  const [auditInfo, setAuditInfo] = useState({ totalEntries: 0, todayEntries: 0, uniqueAdmins: 0 });
  const [flagCount, setFlagCount] = useState({ total: 0, enabled: 0 });

  useEffect(() => {
    setSession(getAdminSession());
    setRegStats(getRegistryStats());
    setContentStats(getContentStats());
    setAuditInfo(getAuditStats());
    const flags = getAllFlags();
    setFlagCount({ total: flags.length, enabled: flags.filter((f) => f.isEnabled).length });
  }, []);

  const statCards = [
    { label: "Total Users", value: regStats.totalUsers, icon: Users, color: "from-blue-500 to-cyan-400", link: "/admin/users" },
    { label: "Premium Users", value: regStats.premiumUsers, icon: Crown, color: "from-yellow-500 to-orange-400", link: "/admin/users" },
    { label: "Topik", value: `${contentStats.publishedTopics}/${contentStats.totalTopics}`, icon: BookOpen, color: "from-green-500 to-emerald-400", link: "/admin/content" },
    { label: "Soal", value: `${contentStats.publishedQuestions}/${contentStats.totalQuestions}`, icon: Zap, color: "from-purple-500 to-pink-400", link: "/admin/content" },
  ];

  const quickActions = [
    { label: "Kelola Users", description: "Lihat, upgrade premium, manage akun", href: "/admin/users", icon: Users, color: "bg-blue-500" },
    { label: "Content Management", description: "CRUD topik & soal", href: "/admin/content", icon: BookOpen, color: "bg-green-500" },
    { label: "Events", description: "Schedule event, boss battle, dll", href: "/admin/events", icon: Calendar, color: "bg-purple-500" },
    { label: "Announcements", description: "Pengumuman ke user", href: "/admin/announcements", icon: Megaphone, color: "bg-pink-500" },
    { label: "Feature Flags", description: `${flagCount.enabled}/${flagCount.total} fitur aktif`, href: "/admin/flags", icon: Flag, color: "bg-cyan-500" },
    { label: "Audit Log", description: `${auditInfo.totalEntries} aksi tercatat`, href: "/admin/audit", icon: History, color: "bg-orange-500" },
    { label: "Analytics", description: "Statistik penggunaan aplikasi", href: "/admin/analytics", icon: TrendingUp, color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--duo-text)]">Dashboard Admin</h1>
            <p className="text-sm text-[var(--duo-text-muted)]">
              Selamat datang, <span className="font-bold text-[var(--duo-text)]">{session?.name}</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={card.link}
              className="block p-5 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] hover:border-red-300 dark:hover:border-red-700 transition-all hover:shadow-lg">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-[var(--duo-text)]">{card.value}</p>
              <p className="text-xs font-bold text-[var(--duo-text-muted)]">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-[var(--duo-text-muted)] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Link href={action.href}
                className="block p-5 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] hover:border-red-300 dark:hover:border-red-700 transition-all hover:shadow-lg group">
                <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-black text-[var(--duo-text)] mb-1">{action.label}</h3>
                <p className="text-xs text-[var(--duo-text-muted)]">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-800">
        <p className="text-xs font-bold text-[var(--duo-text-muted)] mb-2">System Info</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-[var(--duo-text-muted)]">Version: </span>
            <span className="font-bold text-[var(--duo-text)]">2.0.0</span>
          </div>
          <div>
            <span className="text-[var(--duo-text-muted)]">Storage: </span>
            <span className="font-bold text-[var(--duo-text)]">localStorage</span>
          </div>
          <div>
            <span className="text-[var(--duo-text-muted)]">Admin: </span>
            <span className="font-bold text-green-500">Active</span>
          </div>
          <div>
            <span className="text-[var(--duo-text-muted)]">Role: </span>
            <span className="font-bold text-[var(--duo-text)]">{session?.role}</span>
          </div>
          <div>
            <span className="text-[var(--duo-text-muted)]">Flags: </span>
            <span className="font-bold text-[var(--duo-text)]">{flagCount.enabled}/{flagCount.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
