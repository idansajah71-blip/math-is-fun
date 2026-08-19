"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getProfile, LEVEL_NAMES, UserProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Flame, Zap, ChevronRight } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  streak: number;
}

const MOCK_USERS: LeaderboardEntry[] = [
  { rank: 1, name: "Rina Sari", xp: 2450, level: 8, streak: 15 },
  { rank: 2, name: "Budi Santoso", xp: 1980, level: 7, streak: 12 },
  { rank: 3, name: "Citra Dewi", xp: 1650, level: 6, streak: 8 },
  { rank: 4, name: "Andi Pratama", xp: 1320, level: 5, streak: 5 },
  { rank: 5, name: "Dian Kusuma", xp: 980, level: 4, streak: 3 },
  { rank: 6, name: "Eka Putri", xp: 750, level: 3, streak: 2 },
  { rank: 7, name: "Fajar Nugroho", xp: 520, level: 3, streak: 1 },
  { rank: 8, name: "Gita Sari", xp: 380, level: 2, streak: 0 },
  { rank: 9, name: "Hendra Wijaya", xp: 250, level: 2, streak: 0 },
  { rank: 10, name: "Indah Permata", xp: 120, level: 1, streak: 0 },
];

export default function LeaderboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"weekly" | "alltime">("weekly");

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const getMyRank = (): LeaderboardEntry | null => {
    if (!profile) return null;
    const idx = MOCK_USERS.findIndex(u => u.xp <= profile.xp);
    return {
      rank: idx >= 0 ? idx + 1 : MOCK_USERS.length + 1,
      name: profile.name,
      xp: profile.xp,
      level: profile.level,
      streak: profile.streak,
    };
  };

  const myRank = getMyRank();

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 ml-[260px]">
        {/* Header */}
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--duo-xp)]/10 rounded-2xl flex items-center justify-center">
                <Trophy size={24} className="text-[var(--duo-xp)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Peringkat</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">Berdasarkan total XP</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { key: "weekly", label: "Mingguan" },
                { key: "alltime", label: "Semua Waktu" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === tab.key
                      ? "bg-[var(--duo-green)] text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)] hover:text-[var(--duo-text)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-6">
          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-center gap-4 mb-8"
          >
            {[1, 0, 2].map((idx) => {
              const user = MOCK_USERS[idx];
              const heights = ["h-28", "h-36", "h-24"];
              const widths = ["w-24", "w-28", "w-24"];
              const medals = ["🥈", "🥇", "🥉"];
              const medalColors = ["bg-gray-400", "bg-[var(--duo-xp)]", "bg-orange-400"];
              const isTop3 = idx === 0;

              return (
                <motion.div
                  key={user.rank}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg mb-2 shadow-lg ${
                      isTop3 ? "bg-gradient-to-br from-[var(--duo-xp)] to-[var(--duo-orange)]" : "bg-gradient-to-br from-gray-400 to-gray-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {user.name.charAt(0)}
                  </motion.div>
                  <p className="text-sm font-black text-[var(--duo-text)] mb-0.5">{user.name.split(" ")[0]}</p>
                  <p className="text-[10px] font-bold text-[var(--duo-text-muted)] mb-2">{user.xp} XP</p>
                  <div className={`${widths[idx]} ${heights[idx]} bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-t-2xl flex items-start justify-center pt-4 relative`}>
                    <span className="text-2xl">{medals[idx]}</span>
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 ${medalColors[idx]} rounded-full flex items-center justify-center text-xs font-black text-white shadow-md`}>
                      #{user.rank}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* My Rank */}
          {myRank && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-[var(--duo-green-bg)] rounded-[20px] border-2 border-[var(--duo-green)]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--duo-green)] flex items-center justify-center text-white font-black text-sm">
                  {profile?.name?.charAt(0) || "P"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[var(--duo-text)]">{profile?.name || "Pelajar"} (Kamu)</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-bold text-[var(--duo-green)]">#{myRank.rank}</span>
                    <span className="text-[10px] font-bold text-[var(--duo-xp)]">{myRank.xp} XP</span>
                    {myRank.streak > 0 && (
                      <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5">
                        <Flame size={10} /> {myRank.streak}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[var(--duo-text-muted)]">{LEVEL_NAMES[myRank.level]}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Full List */}
          <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] overflow-hidden">
            {MOCK_USERS.map((user, i) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 px-5 py-3.5 ${
                  i < MOCK_USERS.length - 1 ? "border-b border-[var(--duo-border)]" : ""
                } ${user.rank <= 3 ? "bg-[var(--duo-xp)]/5" : ""}`}
              >
                <span className={`w-7 text-center text-sm font-black ${
                  user.rank === 1 ? "text-[var(--duo-xp)]" : user.rank === 2 ? "text-gray-400" : user.rank === 3 ? "text-orange-400" : "text-[var(--duo-text-muted)]"
                }`}>
                  {user.rank <= 3 ? ["🥇","🥈","🥉"][user.rank-1] : `#${user.rank}`}
                </span>

                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--duo-info)] to-[var(--duo-purple)] flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--duo-text)] truncate">{user.name}</p>
                  <p className="text-[10px] text-[var(--duo-text-muted)]">{LEVEL_NAMES[user.level]}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-[var(--duo-xp)]">{user.xp}</p>
                  <p className="text-[10px] text-[var(--duo-text-muted)]">XP</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-[var(--duo-purple)]/20">
            <p className="text-xs text-[var(--duo-purple)] font-bold">
              💡 Peringkat diperbarui setiap minggu. Selesaikan lebih banyak materi untuk naik ke peringkat atas!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
