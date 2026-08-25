"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getProfile, toggleBookmark } from "@/lib/gamification";
import { getTopicBySlug } from "@/lib/data";
import { renderIcon } from "@/lib/iconMap";
import { motion } from "framer-motion";
import { Bookmark, Trash2, ChevronRight } from "lucide-react";
import type { Topic } from "@/lib/types";
import FeatureGuard from "@/components/admin/FeatureGuard";

interface BookmarkedTopic {
  slug: string;
  topic: Topic;
}

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  function loadBookmarks() {
    const profile = getProfile();
    const items: BookmarkedTopic[] = [];
    for (const slug of profile.bookmarkedTopics) {
      const topic = getTopicBySlug(slug);
      if (topic) items.push({ slug, topic });
    }
    setBookmarks(items);
    setLoading(false);
  }

  function handleRemove(slug: string) {
    toggleBookmark(slug);
    loadBookmarks();
  }

  const levelLabel: Record<string, string> = {
    smp: "SMP",
    sma: "SMA",
    kuliah: "Universitas",
  };
  const levelColor: Record<string, string> = {
    smp: "bg-emerald-500",
    sma: "bg-[var(--duo-info)]",
    kuliah: "bg-[var(--duo-purple)]",
  };

  return (
    <FeatureGuard flag="bookmarks">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />

        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center">
                <Bookmark size={24} className="text-yellow-500" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Bookmark Soal</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">
                  {bookmarks.length} topik tersimpan
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-[var(--duo-card)] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Bookmark size={32} className="text-yellow-400" />
                </div>
              </div>
              <p className="text-sm font-bold text-[var(--duo-text)] mb-1">Belum ada bookmark</p>
              <p className="text-xs text-[var(--duo-text-muted)] mb-4">
                Klik ikon bookmark di halaman topik untuk menyimpan soal favorit.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all"
              >
                Jelajahi Topik
                <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((item, i) => {
                const level = item.topic.level;
                return (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-[var(--duo-card)] rounded-[20px] border-2 border-[var(--duo-border)] p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-yellow-50 dark:bg-yellow-900/20">
                      {renderIcon(item.topic.icon, 28)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/topic/${item.slug}`}
                        className="text-sm font-bold text-[var(--duo-text)] hover:text-[var(--duo-green)] transition-colors line-clamp-1"
                      >
                        {item.topic.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${levelColor[level]}`} />
                        <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">
                          {levelLabel[level]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/topic/${item.slug}`}
                        className="px-3 py-1.5 bg-[var(--duo-green)]/10 text-[var(--duo-green)] rounded-lg text-xs font-bold hover:bg-[var(--duo-green)]/20 transition-colors"
                      >
                        Buka
                      </Link>
                      <button
                        onClick={() => handleRemove(item.slug)}
                        className="p-2 text-[var(--duo-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        title="Hapus bookmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
        </div>
      </FeatureGuard>
    );
  }
