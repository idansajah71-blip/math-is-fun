"use client";

import { useEffect, useState } from "react";
import { getAllRegistryUsers, getRegistryStats } from "@/lib/admin/registry";
import { getAllUserProfiles } from "@/lib/gamification";
import { getContentStats } from "@/lib/admin/content";
import { getAuditStats } from "@/lib/admin/audit";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Zap, Trophy, Clock, Target, Brain, Flame, Crown } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    activeLastWeek: 0,
    totalXp: 0,
    avgXp: 0,
    totalTopicsCompleted: 0,
    avgTopicsPerUser: 0,
    totalQuizzes: 0,
    avgAccuracy: 0,
    avgStreak: 0,
    totalStudyMinutes: 0,
    wrongTopics: 0,
    reviewedTopics: 0,
    totalContent: 0,
    publishedContent: 0,
    totalAuditLogs: 0,
  });

  useEffect(() => {
    const registry = getAllRegistryUsers();
    const profiles = getAllUserProfiles();
    const profileList = Object.values(profiles);
    const regStats = getRegistryStats();
    const contentStats = getContentStats();
    const auditStats = getAuditStats();

    const totalXpSum = profileList.reduce((sum, p) => sum + (p.xp || 0), 0);
    const totalTopicsSum = profileList.reduce((sum, p) => sum + (p.completedTopics?.length || 0), 0);
    const totalQuizzesSum = profileList.reduce((sum, p) => sum + Object.keys(p.quizScores || {}).length, 0);
    const totalStudySum = profileList.reduce((sum, p) => sum + (p.totalStudyTime || 0), 0);
    const totalWrongTopics = profileList.reduce((sum, p) => sum + Object.keys(p.wrongAnswers || {}).filter((k) => (p.wrongAnswers[k] || 0) > 0).length, 0);
    const totalReviewed = profileList.reduce((sum, p) => sum + Object.keys(p.spacedRepetition || {}).length, 0);

    const allAccuracies = profileList.flatMap((p) => {
      const scores = Object.values(p.quizScores || {});
      return scores.length > 0 ? scores : [];
    });
    const avgAcc = allAccuracies.length > 0
      ? Math.round(allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length)
      : 0;

    const avgStreakVal = profileList.length > 0
      ? profileList.reduce((sum, p) => sum + (p.streak || 0), 0) / profileList.length
      : 0;

    setData({
      totalUsers: regStats.totalUsers,
      premiumUsers: regStats.premiumUsers,
      activeLastWeek: regStats.activeLastWeek,
      totalXp: totalXpSum,
      avgXp: profileList.length > 0 ? Math.round(totalXpSum / profileList.length) : 0,
      totalTopicsCompleted: totalTopicsSum,
      avgTopicsPerUser: profileList.length > 0 ? Math.round(totalTopicsSum / profileList.length * 10) / 10 : 0,
      totalQuizzes: totalQuizzesSum,
      avgAccuracy: avgAcc,
      avgStreak: Math.round(avgStreakVal * 10) / 10,
      totalStudyMinutes: Math.floor(totalStudySum / 60),
      wrongTopics: totalWrongTopics,
      reviewedTopics: totalReviewed,
      totalContent: contentStats.totalTopics + contentStats.totalQuestions,
      publishedContent: contentStats.publishedTopics + contentStats.publishedQuestions,
      totalAuditLogs: auditStats.totalEntries,
    });
  }, []);

  const cards = [
    { label: "Total Users", value: data.totalUsers, icon: Users, color: "from-blue-500 to-cyan-400", sub: `${data.premiumUsers} premium` },
    { label: "Active (7hari)", value: data.activeLastWeek, icon: Flame, color: "from-orange-500 to-red-500", sub: data.totalUsers > 0 ? `${Math.round(data.activeLastWeek / data.totalUsers * 100)}% aktif` : "0% aktif" },
    { label: "Total XP", value: data.totalXp.toLocaleString(), icon: Zap, color: "from-yellow-500 to-amber-500", sub: `rata-rata ${data.avgXp.toLocaleString()}/user` },
    { label: "Topik Selesai", value: data.totalTopicsCompleted, icon: Target, color: "from-green-500 to-emerald-500", sub: `${data.avgTopicsPerUser} topik/user` },
    { label: totalQuizzesLabel(), value: data.totalQuizzes, icon: Trophy, color: "from-purple-500 to-pink-500", sub: `akurasi ${data.avgAccuracy}%` },
    { label: "Avg Streak", value: `${data.avgStreak} hari`, icon: BarChart3, color: "from-indigo-500 to-violet-500", sub: "" },
    { label: "Waktu Belajar", value: `${data.totalStudyMinutes}m`, icon: Clock, color: "from-teal-500 to-cyan-500", sub: formatHours(data.totalStudyMinutes) },
    { label: "Konten", value: data.publishedContent, icon: Brain, color: "from-rose-500 to-pink-500", sub: `dari ${data.totalContent} total` },
  ];

  function totalQuizzesLabel() { return "Quiz Dikerjakan"; }
  function formatHours(min: number) {
    const h = Math.floor(min / 60);
    return h > 0 ? `= ${h}jam ${min % 60}m` : "";
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-[var(--fg)] flex items-center gap-3">
          <BarChart3 size={24} className="text-green-500" />
          Analytics
        </h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">Statistik agregat semua pengguna</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-[var(--fg)]">{card.value}</p>
            <p className="text-xs font-bold text-[var(--fg-muted)]">{card.label}</p>
            {card.sub && <p className="text-[10px] font-bold text-[var(--fg-muted)] mt-0.5 opacity-70">{card.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Quick summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-6">
        <h3 className="text-sm font-black text-[var(--fg)] mb-3">Ringkasan Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[var(--fg-muted)] text-xs">Topik Salah (perlu review)</p>
            <p className="font-black text-[var(--fg)]">{data.wrongTopics} topik</p>
          </div>
          <div>
            <p className="text-[var(--fg-muted)] text-xs">Spaced Repetition aktif</p>
            <p className="font-black text-[var(--fg)]">{data.reviewedTopics} topik</p>
          </div>
          <div>
            <p className="text-[var(--fg-muted)] text-xs">Premium users</p>
            <p className="font-black text-[var(--fg)]">{data.premiumUsers} / {data.totalUsers}</p>
          </div>
          <div>
            <p className="text-[var(--fg-muted)] text-xs">Audit logs</p>
            <p className="font-black text-[var(--fg)]">{data.totalAuditLogs} entri</p>
          </div>
          <div>
            <p className="text-[var(--fg-muted)] text-xs">Konten published</p>
            <p className="font-black text-[var(--fg)]">{data.publishedContent} dari {data.totalContent}</p>
          </div>
          <div>
            <p className="text-[var(--fg-muted)] text-xs">Total waktu belajar</p>
            <p className="font-black text-[var(--fg)]">{formatHours(data.totalStudyMinutes) || `${data.totalStudyMinutes}m`}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
