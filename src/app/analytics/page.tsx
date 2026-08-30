"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import FeatureGuard from "@/components/admin/FeatureGuard";
import StudyHeatmap from "@/components/analytics/StudyHeatmap";
import {
  getBestStudyHours,
  getWeeklyPattern,
  getStudyRecommendations,
  getTotalSessions,
  type StudyRecommendation,
} from "@/lib/studyAnalytics";
import { getProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { BarChart3, Clock, Calendar, Flame, TrendingUp, Sparkles, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import type { UserProfile } from "@/lib/gamification";

const ICON_MAP: Record<string, React.ReactNode> = {
  Clock: <Clock size={18} />,
  Calendar: <Calendar size={18} />,
  Flame: <Flame size={18} />,
  Sparkles: <Sparkles size={18} />,
};

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--duo-green)] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  const analytics = useMemo(() => {
    const bestHours = getBestStudyHours();
    const weeklyPattern = getWeeklyPattern();
    const recommendations = getStudyRecommendations();
    const totalSessions = getTotalSessions();
    const totalStudyMinutes = Math.round((profile.totalStudyTime || 0) / 60000);
    const activeDays = Object.keys(profile.dailyXpHistory || {}).length;
    const avgXpPerDay = activeDays > 0 ? Math.round(profile.xp / activeDays) : 0;
    return { bestHours, weeklyPattern, recommendations, totalSessions, totalStudyMinutes, activeDays, avgXpPerDay };
  }, [profile]);

  const { bestHours, weeklyPattern, recommendations, totalSessions, totalStudyMinutes, activeDays, avgXpPerDay } = analytics;

  return (
    <FeatureGuard flag="study-analytics">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
          {/* Header */}
          <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
            <div className="max-w-4xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 size={20} className="text-blue-500" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-[var(--duo-text)]">Analisis Belajar</h1>
                  <p className="text-xs text-[var(--duo-text-muted)]">Pahami pola belajarmu dan dapatkan rekomendasi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
            {/* Stats Cards */}
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: <Zap size={18} />, label: "Total XP", value: profile.xp.toLocaleString(), color: "text-[var(--duo-xp)]" },
                { icon: <Clock size={18} />, label: "Waktu Belajar", value: `${totalStudyMinutes} menit`, color: "text-blue-500" },
                { icon: <Flame size={18} />, label: "Hari Aktif", value: `${activeDays} hari`, color: "text-orange-500" },
                { icon: <TrendingUp size={18} />, label: "XP/Hari", value: `${avgXpPerDay} XP`, color: "text-[var(--duo-green)]" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4"
                >
                  <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                  <p className="text-xs font-bold text-[var(--duo-text-muted)]">{stat.label}</p>
                  <p className="text-lg font-black text-[var(--duo-text)]">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Hourly Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-blue-500" />
                <h2 className="text-sm font-black text-[var(--duo-text)]">Aktivitas per Jam</h2>
              </div>
              <StudyHeatmap />
            </motion.div>

            {/* Weekly Pattern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-[var(--duo-green)]" />
                <h2 className="text-sm font-black text-[var(--duo-text)]">Pola Mingguan</h2>
              </div>
              <div className="flex items-end gap-3 h-32">
                {weeklyPattern.map((d) => {
                  const maxCount = Math.max(...weeklyPattern.map((x) => x.count), 1);
                  const height = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-[var(--duo-text-muted)]">{d.count}</span>
                      <div className="w-full relative" style={{ height: `${Math.max(height, 4)}%` }}>
                        <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-[var(--duo-green)] to-[var(--duo-green)]/60" />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Best Hours */}
            {bestHours.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-[var(--duo-xp)]" />
                  <h2 className="text-sm font-black text-[var(--duo-text)]">Jam Terbaikmu</h2>
                </div>
                <div className="flex gap-3">
                  {bestHours.map((h, i) => (
                    <div key={h.hour} className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                      <span className="text-lg font-black text-[var(--duo-text)]">{h.hour}:00</span>
                      <p className="text-[10px] font-bold text-[var(--duo-text-muted)]">{h.count} aktivitas</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xs font-extrabold text-[var(--duo-text-muted)] uppercase tracking-widest mb-3">
                  Rekomendasi
                </h2>
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <motion.div
                      key={rec.type}
                      variants={staggerItem}
                      className="flex items-start gap-3 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[var(--duo-green)]/10 flex items-center justify-center shrink-0">
                        {ICON_MAP[rec.icon] || <Sparkles size={18} className="text-[var(--duo-green)]" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--duo-text)]">{rec.title}</p>
                        <p className="text-xs text-[var(--duo-text-muted)]">{rec.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </FeatureGuard>
  );
}
