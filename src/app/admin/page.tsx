"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getRegistryStats } from "@/lib/admin/registry";
import { getAllUserProfiles } from "@/lib/gamification";
import { getContentStats, getAllQuestions, getAllTopics } from "@/lib/admin/content";
import { getAuditStats } from "@/lib/admin/audit";
import { getAllFlags } from "@/lib/admin/flags";
import { getAdminSession } from "@/lib/adminAuth";
import { Settings, Save, Check } from "lucide-react";

import StatsRow from "@/components/admin/StatsRow";
import WeeklyActivityChart from "@/components/admin/WeeklyActivityChart";
import LevelDistributionDonut from "@/components/admin/LevelDistributionDonut";
import RecentActivityList from "@/components/admin/RecentActivityList";
import QuickActionsGrid from "@/components/admin/QuickActionsGrid";
import ProblemQuestionsTable from "@/components/admin/ProblemQuestionsTable";
import ContentProgressRing from "@/components/admin/ContentProgressRing";

export default function AdminDashboardPage() {
  const [regStats, setRegStats] = useState({ totalUsers: 0, premiumUsers: 0, newUsersToday: 0, activeLastWeek: 0 });
  const [totalXp, setTotalXp] = useState(0);
  const [avgStreak, setAvgStreak] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [levelDist, setLevelDist] = useState({ smp: 0, sma: 0, kuliah: 0 });
  const [contentTarget, setContentTarget] = useState({ current: 0, target: 50 });
  const [rewardMsg, setRewardMsg] = useState("");
  const [rewardSaved, setRewardSaved] = useState(false);
  const timersRef = useRef<number[]>([]);

  const scheduleTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    return () => { timersRef.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("matika_site_settings");
    if (saved) {
      const settings = JSON.parse(saved);
      setRewardMsg(settings.dailyRewardMessage || "Reward terus naik setiap minggu! Minggu ke-2 = 1.5x, ke-3 = 2x, ke-4+ = 2.5x");
    } else {
      setRewardMsg("Reward terus naik setiap minggu! Minggu ke-2 = 1.5x, ke-3 = 2x, ke-4+ = 2.5x");
    }
  }, []);

  function saveSiteSettings() {
    const settings = JSON.parse(localStorage.getItem("matika_site_settings") || "{}");
    settings.dailyRewardMessage = rewardMsg;
    localStorage.setItem("matika_site_settings", JSON.stringify(settings));
    setRewardSaved(true);
    scheduleTimer(() => setRewardSaved(false), 2000);
  }

  useEffect(() => {
    // Registry stats
    const profiles = getAllUserProfiles();
    const reg = getRegistryStats();
    setRegStats(reg);

    // Aggregate user data
    const profileList = Object.values(profiles);
    const totalXpSum = profileList.reduce((sum, p) => sum + (p.xp || 0), 0);
    const avgStreakVal = profileList.length > 0
      ? profileList.reduce((sum, p) => sum + (p.streak || 0), 0) / profileList.length
      : 0;

    setTotalXp(totalXpSum);
    setAvgStreak(avgStreakVal);

    // Weekly activity from dailyXpHistory
    const now = new Date();
    const weekData = [0, 0, 0, 0, 0, 0, 0];
    for (const profile of profileList) {
      if (profile.dailyXpHistory) {
        for (let i = 0; i < 7; i++) {
          const d = new Date(now);
          d.setDate(d.getDate() - (6 - i));
          const key = d.toISOString().split("T")[0];
          if (profile.dailyXpHistory[key]) {
            weekData[i] += Math.ceil(profile.dailyXpHistory[key] / 10);
          }
        }
      }
    }
    setWeeklyData(weekData);

    // Level distribution
    const topics = getAllTopics();
    const smp = topics.filter((t) => t.level === "smp").length;
    const sma = topics.filter((t) => t.level === "sma").length;
    const kuliah = topics.filter((t) => t.level === "kuliah").length;
    setLevelDist({ smp, sma, kuliah });

    // Content target
    const cs = getContentStats();
    setContentTarget({ current: cs.totalQuestions, target: Math.max(cs.totalQuestions + 20, 50) });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-[var(--fg)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Overview aktivitas Matika
        </p>
      </motion.div>

      {/* Stats Row */}
      <StatsRow registryStats={regStats} totalXp={totalXp} avgStreak={avgStreak} />

      {/* Middle Row: Chart + Donut + Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WeeklyActivityChart data={weeklyData} />
        </div>
        <ContentProgressRing current={contentTarget.current} target={contentTarget.target} />
      </div>

      {/* Second Row: Donut + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LevelDistributionDonut smpCount={levelDist.smp} smaCount={levelDist.sma} kuliahCount={levelDist.kuliah} />
        <QuickActionsGrid />
      </div>

      {/* Third Row: Activity Feed + Problem Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivityList />
        <ProblemQuestionsTable />
      </div>

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--surface)] rounded-2xl border-2 border-[var(--border-subtle)] p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-[var(--primary)]" />
          <h2 className="text-lg font-black text-[var(--fg)]">Site Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Daily Reward Message */}
          <div>
            <label htmlFor="daily-reward-message" className="text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider block mb-1.5">
              Daily Reward — multiplier text (bawah jalur hadiah)
            </label>
            <div className="flex gap-2">
              <input
                id="daily-reward-message"
                type="text"
                value={rewardMsg}
                onChange={(e) => setRewardMsg(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Reward terus naik setiap minggu!..."
              />
              <button
                onClick={saveSiteSettings}
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
                  rewardSaved
                    ? "bg-green-500 text-white"
                    : "bg-[var(--primary)] text-white hover:opacity-90"
                }`}
              >
                {rewardSaved ? <Check size={14} /> : <Save size={14} />}
                {rewardSaved ? "Tersimpan!" : "Simpan"}
              </button>
            </div>
            <p className="text-[10px] text-[var(--fg-muted)] mt-1">Preview: {rewardMsg}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
