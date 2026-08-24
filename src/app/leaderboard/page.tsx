"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getProfile, LEVEL_NAMES, UserProfile } from "@/lib/gamification";
import { fetchLeaderboard } from "@/lib/supabase/sync";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Flame, Info, Award, LogIn } from "lucide-react";
import Link from "next/link";
import { renderIcon } from "@/lib/iconMap";

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  streak: number;
  weeklyXpTotal?: number;
}

export default function LeaderboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"weekly" | "alltime">("weekly");
  const { user } = useAuth();

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchLeaderboard(period);
        const mapped: LeaderboardEntry[] = data.map((row: Record<string, unknown>, i: number) => ({
          rank: i + 1,
          name: (row.name as string) ?? "Pelajar",
          xp: (row.xp as number) ?? 0,
          level: (row.level as number) ?? 0,
          streak: (row.streak as number) ?? 0,
          weeklyXpTotal: row.weekly_xp_total as number | undefined,
        }));
        setEntries(mapped);
      } catch {
        // Fallback: show empty state
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period]);

  const getMyRank = (): LeaderboardEntry | null => {
    if (!profile) return null;
    const xp = period === "weekly" ? profile.weeklyXp.reduce((a, b) => a + b, 0) : profile.xp;
    const idx = entries.findIndex(e => (period === "weekly" ? e.weeklyXpTotal ?? e.xp : e.xp) <= xp);
    return {
      rank: idx >= 0 ? idx + 1 : entries.length + 1,
      name: profile.name,
      xp,
      level: profile.level,
      streak: profile.streak,
    };
  };

  const myRank = getMyRank();

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
        {/* Header */}
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--duo-xp)]/10 rounded-2xl flex items-center justify-center">
                <Trophy size={24} className="text-[var(--duo-xp)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Peringkat</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">
                  {period === "weekly" ? "Berdasarkan XP minggu ini" : "Berdasarkan total XP"}
                </p>
              </div>
            </div>

            {/* Period toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod("weekly")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  period === "weekly"
                    ? "bg-[var(--duo-green)] text-white"
                    : "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
                }`}
              >
                Minggu Ini
              </button>
              <button
                onClick={() => setPeriod("alltime")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  period === "alltime"
                    ? "bg-[var(--duo-green)] text-white"
                    : "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
                }`}
              >
                Sepanjang Masa
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-6">
          {/* Auth prompt */}
          {!user && (
            <div className="mb-6 p-4 bg-[var(--duo-green-bg)] rounded-[20px] border-2 border-[var(--duo-green)]/30 text-center">
              <p className="text-sm text-[var(--duo-text)] mb-2 font-medium">
                Masuk untuk muncul di peringkat ini
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all"
              >
                <LogIn size={14} />
                Masuk / Daftar
              </Link>
            </div>
          )}

          {loading ? (
            /* Loading skeleton */
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-[var(--duo-card)] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            /* Empty state */
            <div className="text-center py-12">
              <div className="mb-3 flex justify-center">{renderIcon("🏆", 48)}</div>
              <p className="text-sm font-bold text-[var(--duo-text)]">Belum ada peringkat</p>
              <p className="text-xs text-[var(--duo-text-muted)] mt-1">
                {user ? "Jadi yang pertama! Selesaikan materi untuk masuk peringkat." : "Masuk untuk mulai berkompetisi."}
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {entries.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end justify-center gap-4 mb-8"
                >
                  {[1, 0, 2].map((idx) => {
                    const userEntry = entries[idx];
                    if (!userEntry) return null;
                    const heights = ["h-28", "h-36", "h-24"];
                    const widths = ["w-24", "w-28", "w-24"];
                    const medalIcons = [
                      <Medal size={24} className="text-gray-400" />,
                      <Crown size={24} className="text-[var(--duo-xp)]" />,
                      <Award size={24} className="text-orange-400" />
                    ];
                    const medalColors = ["bg-gray-400", "bg-[var(--duo-xp)]", "bg-orange-400"];
                    const isTop3 = idx === 0;

                    return (
                      <motion.div
                        key={userEntry.rank}
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
                          {userEntry.name.charAt(0)}
                        </motion.div>
                        <p className="text-sm font-black text-[var(--duo-text)] mb-0.5">{userEntry.name.split(" ")[0]}</p>
                        <p className="text-[10px] font-bold text-[var(--duo-text-muted)] mb-2">
                          {period === "weekly" ? userEntry.weeklyXpTotal ?? userEntry.xp : userEntry.xp} XP
                        </p>
                        <div className={`${widths[idx]} ${heights[idx]} bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-t-2xl flex items-start justify-center pt-4 relative`}>
                          {medalIcons[idx]}
                          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 ${medalColors[idx]} rounded-full flex items-center justify-center text-xs font-black text-white shadow-md`}>
                            #{userEntry.rank}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* My Rank */}
              {myRank && user && (
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
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 px-5 py-3.5 ${
                      i < entries.length - 1 ? "border-b border-[var(--duo-border)]" : ""
                    } ${entry.rank <= 3 ? "bg-[var(--duo-xp)]/5" : ""}`}
                  >
                    <span className={`w-7 text-center text-sm font-black ${
                      entry.rank === 1 ? "text-[var(--duo-xp)]" : entry.rank === 2 ? "text-gray-400" : entry.rank === 3 ? "text-orange-400" : "text-[var(--duo-text-muted)]"
                    }`}>
                      {entry.rank <= 3 ? <Medal size={16} className="inline" /> : `#${entry.rank}`}
                    </span>

                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--duo-info)] to-[var(--duo-purple)] flex items-center justify-center text-white font-bold text-xs">
                      {entry.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--duo-text)] truncate">{entry.name}</p>
                      <p className="text-[10px] text-[var(--duo-text-muted)]">{LEVEL_NAMES[entry.level]}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-[var(--duo-xp)]">
                        {period === "weekly" ? entry.weeklyXpTotal ?? entry.xp : entry.xp}
                      </p>
                      <p className="text-[10px] text-[var(--duo-text-muted)]">XP</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-[var(--duo-purple)]/20">
            <p className="text-xs text-[var(--duo-purple)] font-bold flex items-start gap-2">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>
                {user
                  ? "Peringkat diperbarui secara real-time. Selesaikan lebih banyak materi untuk naik ke peringkat atas!"
                  : "Masuk untuk menyimpan progres dan muncul di peringkat."}
            </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
