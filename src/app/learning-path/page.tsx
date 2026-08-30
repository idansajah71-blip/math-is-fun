"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import LearningPathGraph from "@/components/learning/LearningPathGraph";
import FeatureGuard from "@/components/admin/FeatureGuard";
import { getProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Map, Route } from "lucide-react";
import type { UserProfile } from "@/lib/gamification";

export default function LearningPathPage() {
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

  return (
    <FeatureGuard flag="learning-path">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
          {/* Header */}
          <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
            <div className="max-w-6xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--duo-green)]/10 flex items-center justify-center">
                  <Map size={20} className="text-[var(--duo-green)]" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-[var(--duo-text)]">Peta Belajar</h1>
                  <p className="text-xs text-[var(--duo-text-muted)]">Visualisasi alur belajarmu dari SMP hingga Universitas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LearningPathGraph profile={profile} />
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-4 px-2"
            >
              <span className="text-[10px] font-bold text-[var(--duo-text-muted)] uppercase tracking-wider">Legend:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gray-600" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Terkunci</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-700" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Tersedia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Selesai</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-amber-600" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Master (90%+)</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </FeatureGuard>
  );
}
