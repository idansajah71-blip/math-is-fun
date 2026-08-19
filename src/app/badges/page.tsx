"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getProfile, BADGES, UserProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Award, Star, Sparkles, Lock, CheckCircle2, ChevronRight } from "lucide-react";

export default function BadgesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedBadge, setSelectedBadge] = useState<typeof BADGES[0] | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (!profile) return null;

  const unlockedCount = profile.badges.length;
  const totalCount = BADGES.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = BADGES.filter(b => {
    const unlocked = profile.badges.includes(b.id);
    if (filter === "unlocked") return unlocked;
    if (filter === "locked") return !unlocked;
    return true;
  });

  const rarityColors = {
    common: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-500", border: "border-gray-200 dark:border-gray-700" },
    rare: { bg: "bg-[var(--duo-info)]/10", text: "text-[var(--duo-info)]", border: "border-[var(--duo-info)]/30" },
    epic: { bg: "bg-[var(--duo-purple)]/10", text: "text-[var(--duo-purple)]", border: "border-[var(--duo-purple)]/30" },
    legendary: { bg: "bg-[var(--duo-xp)]/10", text: "text-[var(--duo-xp)]", border: "border-[var(--duo-xp)]/30" },
  };

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 ml-[260px]">
        {/* Header */}
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-3xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--duo-pink)]/10 rounded-2xl flex items-center justify-center">
                <Award size={24} className="text-[var(--duo-pink)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Pencapaian</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">{unlockedCount} dari {totalCount} terbuka</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[var(--duo-text-muted)]">Progress</span>
                <span className="text-xs font-black text-[var(--duo-green)]">{progress}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--duo-green)] to-[var(--duo-green-dark)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {[
                { key: "all", label: "Semua", count: totalCount },
                { key: "unlocked", label: "Terbuka", count: unlockedCount },
                { key: "locked", label: "Terkunci", count: totalCount - unlockedCount },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                    filter === f.key
                      ? "bg-[var(--duo-green)] text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)] hover:text-[var(--duo-text)]"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="max-w-3xl mx-auto px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredBadges.map((badge, i) => {
              const unlocked = profile.badges.includes(badge.id);
              const rarity = rarityColors[badge.rarity];

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedBadge(badge)}
                  className={`relative p-5 rounded-[24px] border-2 text-center cursor-pointer transition-all ${
                    unlocked
                      ? `${rarity.bg} ${rarity.border} hover:shadow-lg`
                      : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60"
                  }`}
                  whileHover={unlocked ? { scale: 1.03, y: -4 } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Rarity indicator */}
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${rarity.bg} ${rarity.text}`}>
                    {badge.rarity}
                  </div>

                  {unlocked ? (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 size={16} className="text-[var(--duo-green)]" />
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3">
                      <Lock size={14} className="text-gray-400" />
                    </div>
                  )}

                  <motion.div
                    className="text-4xl mb-3 mt-2"
                    animate={unlocked ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {badge.icon}
                  </motion.div>

                  <h4 className="text-sm font-black text-[var(--duo-text)] mb-1">{badge.name}</h4>
                  <p className="text-[10px] text-[var(--duo-text-muted)] leading-tight">{badge.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-12">
              <Lock size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-sm font-bold text-[var(--duo-text-muted)]">Tidak ada badge dalam kategori ini</p>
            </div>
          )}
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white dark:bg-[var(--duo-card)] rounded-[28px] border-2 border-[var(--duo-border)] p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl mb-4 text-center"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {selectedBadge.icon}
              </motion.div>

              <h2 className="text-xl font-black text-[var(--duo-text)] text-center mb-2">{selectedBadge.name}</h2>

              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${rarityColors[selectedBadge.rarity].bg} ${rarityColors[selectedBadge.rarity].text} mx-auto block w-fit mb-3`}>
                <Sparkles size={12} />
                {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)}
              </div>

              <p className="text-sm text-[var(--duo-text-muted)] text-center mb-6">{selectedBadge.desc}</p>

              <div className={`p-4 rounded-2xl ${
                profile.badges.includes(selectedBadge.id)
                  ? "bg-[var(--duo-green-bg)] border border-[var(--duo-green)]/30"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}>
                <p className="text-xs font-bold text-center text-[var(--duo-text-muted)]">
                  {profile.badges.includes(selectedBadge.id) ? "✅ Badge Terbuka!" : "🔒 Belum Terbuka"}
                </p>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-4 py-3 rounded-2xl bg-[var(--duo-green)] text-white font-black text-sm hover:brightness-110 transition-all"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
