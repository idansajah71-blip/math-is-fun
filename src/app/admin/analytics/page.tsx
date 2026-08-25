"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Zap, Trophy, Clock, Target, Brain } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState({
    totalXp: 0,
    totalTopics: 0,
    totalQuizzes: 0,
    avgAccuracy: 0,
    streakDays: 0,
    studyMinutes: 0,
    wrongTopics: 0,
    reviewedTopics: 0,
  });

  useEffect(() => {
    const profile = getProfile();
    const quizScores = Object.values(profile.quizScores || {});
    const avgAcc = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

    setData({
      totalXp: profile.xp,
      totalTopics: profile.completedTopics?.length || 0,
      totalQuizzes: quizScores.length,
      avgAccuracy: avgAcc,
      streakDays: profile.streak,
      studyMinutes: profile.totalStudyTime,
      wrongTopics: Object.keys(profile.wrongAnswers || {}).filter((k) => (profile.wrongAnswers[k] || 0) > 0).length,
      reviewedTopics: Object.keys(profile.spacedRepetition || {}).length,
    });
  }, []);

  const cards = [
    { label: "Total XP", value: data.totalXp.toLocaleString(), icon: Zap, color: "from-yellow-500 to-amber-500" },
    { label: "Topik Selesai", value: data.totalTopics, icon: Target, color: "from-green-500 to-emerald-500" },
    { label: "Quiz Dikerjakan", value: data.totalQuizzes, icon: Trophy, color: "from-purple-500 to-pink-500" },
    { label: "Akurasi Rata-rata", value: `${data.avgAccuracy}%`, icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
    { label: "Streak Hari", value: data.streakDays, icon: BarChart3, color: "from-orange-500 to-red-500" },
    { label: "Waktu Belajar", value: `${data.studyMinutes}m`, icon: Clock, color: "from-indigo-500 to-violet-500" },
    { label: "Topik Salah", value: data.wrongTopics, icon: Target, color: "from-red-500 to-pink-500" },
    { label: "Topik Diulang", value: data.reviewedTopics, icon: Brain, color: "from-teal-500 to-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
          <BarChart3 size={24} className="text-green-500" />
          Analytics
        </h1>
        <p className="text-sm text-[var(--duo-text-muted)] mt-1">Statistik penggunaan aplikasi</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-[var(--duo-text)]">{card.value}</p>
            <p className="text-xs font-bold text-[var(--duo-text-muted)]">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
