"use client";

import { useEffect, useState } from "react";
import { getAdminSession } from "@/lib/adminAuth";
import { getProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Users, Trophy, Zap, TrendingUp, Shield, Crown, Activity } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  totalXp: number;
  activeUsers: number;
}

export default function AdminDashboardPage() {
  const [session, setSession] = useState<ReturnType<typeof getAdminSession>>(null);
  const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, premiumUsers: 0, totalXp: 0, activeUsers: 0 });

  useEffect(() => {
    setSession(getAdminSession());

    const profile = getProfile();
    const usersJson = localStorage.getItem("belajar-mtk-all-users");
    let users: Record<string, unknown>[] = [];
    try {
      users = usersJson ? Object.values(JSON.parse(usersJson)) : [];
    } catch {}

    setStats({
      totalUsers: Math.max(1, users.length),
      premiumUsers: users.filter((u: Record<string, unknown>) => (u as { isPremium?: boolean }).isPremium).length || (profile.isPremium ? 1 : 0),
      totalXp: profile.xp || 0,
      activeUsers: 1,
    });
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-cyan-400", link: "/admin/users" },
    { label: "Premium Users", value: stats.premiumUsers, icon: Crown, color: "from-yellow-500 to-orange-400", link: "/admin/users" },
    { label: "Total XP", value: stats.totalXp.toLocaleString(), icon: Zap, color: "from-purple-500 to-pink-400", link: "/admin/analytics" },
    { label: "Active Now", value: stats.activeUsers, icon: Activity, color: "from-green-500 to-emerald-400", link: "/admin/analytics" },
  ];

  const quickActions = [
    { label: "Kelola Users", description: "Lihat, upgrade premium, manage akun", href: "/admin/users", icon: Users, color: "bg-blue-500" },
    { label: "Buat Event", description: "Schedule event, boss battle, dll", href: "/admin/events", icon: Trophy, color: "bg-purple-500" },
    { label: "Analytics", description: "Statistik penggunaan aplikasi", href: "/admin/analytics", icon: TrendingUp, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-[var(--duo-text-muted)] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
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

      {/* System Info */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-800">
        <p className="text-xs font-bold text-[var(--duo-text-muted)] mb-2">System Info</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[var(--duo-text-muted)]">Version: </span>
            <span className="font-bold text-[var(--duo-text)]">1.0.0</span>
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
            <span className="text-[var(--duo-text-muted)]">Session: </span>
            <span className="font-bold text-[var(--duo-text)]">{session?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
