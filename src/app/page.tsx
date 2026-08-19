"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TopicCard from "@/components/TopicCard";
import Sidebar from "@/components/Sidebar";
import { getAllTopics } from "@/lib/mathData";
import { getProfile } from "@/lib/gamification";
import { Search, BookOpen, GraduationCap, BarChart3, Target, Trophy, FileText, ChevronRight, Zap } from "lucide-react";
import type { Topic, Level } from "@/lib/types";

function HomeContent() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeLevel, setActiveLevel] = useState<Level | "all">("all");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const level = searchParams.get("level") as Level | null;
    if (level && ["smp", "sma", "kuliah"].includes(level)) setActiveLevel(level);
  }, [searchParams]);

  useEffect(() => {
    setTopics(getAllTopics());
    setProfile(getProfile());
    setMounted(true);
  }, []);

  const filtered = topics.filter((t) => {
    if (activeLevel !== "all" && t.level !== activeLevel) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  const smp = topics.filter((t) => t.level === "smp");
  const sma = topics.filter((t) => t.level === "sma");
  const kuliah = topics.filter((t) => t.level === "kuliah");

  const stats = [
    { label: "SMP", total: smp.length, done: smp.filter((t) => profile?.completedTopics?.includes(t.slug)).length, icon: BookOpen, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "SMA", total: sma.length, done: sma.filter((t) => profile?.completedTopics?.includes(t.slug)).length, icon: GraduationCap, color: "text-[#1a73e8] bg-[#e8f0fe] dark:bg-blue-950/30" },
    { label: "Kuliah", total: kuliah.length, done: kuliah.filter((t) => profile?.completedTopics?.includes(t.slug)).length, icon: BarChart3, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" },
  ];

  const quickActions = [
    { href: "/practice", label: "Latihan Bebas", icon: Target, desc: "Pilih topik & soal" },
    { href: "/tryout", label: "Try Out", icon: Trophy, desc: "Simulasi ujian" },
    { href: "/formulas", label: "Rumus Sheet", icon: FileText, desc: "Koleksi rumus" },
  ];

  // Learning path - topik yang belum selesai
  const nextTopics = topics.filter((t) => !profile?.completedTopics?.includes(t.slug)).slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {profile?.name ? `Halo, ${profile.name}` : "Selamat Datang"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile?.completedTopics?.length || 0} materi sudah dipelajari
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-8 stagger">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.href} href={a.href}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md hover:border-[#1a73e8]/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e8f0fe] dark:bg-blue-950/30 rounded-lg flex items-center justify-center group-hover:bg-[#1a73e8] group-hover:text-white transition-colors">
                      <Icon size={18} className="text-[#1a73e8] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{a.label}</p>
                      <p className="text-[10px] text-gray-500">{a.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8 stagger">
            {stats.map((s) => {
              const Icon = s.icon;
              const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{s.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{s.done}/{s.total}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a73e8] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Learning Path */}
          {nextTopics.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Lanjutkan Belajar</h2>
              <div className="relative">
                {/* Path line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2 stagger">
                  {nextTopics.map((topic, i) => (
                    <Link key={topic.id} href={`/topic/${topic.slug}`}
                      className="relative flex items-center gap-4 pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-[#1a73e8]/20 transition-all group">
                      {/* Node */}
                      <div className={`absolute left-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        profile?.completedTopics?.includes(topic.slug)
                          ? "bg-[#1a73e8] border-[#1a73e8] text-white"
                          : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-400"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#1a73e8] truncate">{topic.title}</p>
                        <p className="text-[10px] text-gray-500">{topic.level.toUpperCase()}</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#1a73e8]" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari topik..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 transition-all" />
            </div>
            <div className="flex gap-1.5">
              {[
                { id: "all" as const, label: "Semua" },
                { id: "smp" as const, label: "SMP" },
                { id: "sma" as const, label: "SMA" },
                { id: "kuliah" as const, label: "Kuliah" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveLevel(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeLevel === tab.id ? "bg-[#1a73e8] text-white" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}>{tab.label}</button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-3">{filtered.length} topik</p>

          {/* Topic List */}
          <div className="space-y-1.5 stagger">
            {filtered.map((topic, i) => (
              <TopicCard key={topic.id} slug={topic.slug} title={topic.title} level={topic.level}
                icon={topic.icon} description={topic.description} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500">Tidak ditemukan</p>
            </div>
          )}

          <footer className="mt-16 text-center text-xs text-gray-400 pb-8">BelajarMTK</footer>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
