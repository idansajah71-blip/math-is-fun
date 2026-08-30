"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopicContent from "@/components/TopicContent";
import LessonClient from "@/components/lesson/LessonClient";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { getTopicBySlug, getTopicsByLevel, getAllTopics, getTopicStatus } from "@/lib/data";
import { toggleBookmark, getProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Bookmark, Play, ChevronRight, StickyNote, Save } from "lucide-react";
import { renderIcon } from "@/lib/iconMap";
import MasteryBar from "@/components/ui/MasteryBar";
import { getMastery } from "@/lib/mastery";
import type { Topic } from "@/lib/types";

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [related, setRelated] = useState<Topic[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState(false);
  const [mastery, setMastery] = useState(0);

  useEffect(() => {
    const found = getTopicBySlug(slug);
    if (found) {
      // Check lock status
      const p = getProfile();
      const allTopics = getAllTopics();
      const statusMap = getTopicStatus(allTopics, p.completedTopics || []);
      const status = statusMap.get(slug);

      if (status === "locked") {
        router.replace("/?msg=topic-locked");
        return;
      }

      setTopic(found);
      setRelated(getTopicsByLevel(found.level).filter((t) => t.slug !== slug).slice(0, 5));
      setIsBookmarked(p.bookmarkedTopics.includes(slug));
      setMastery(getMastery(slug));
      const savedNotes = localStorage.getItem(`note-${slug}`) || "";
      setNotes(savedNotes);
    }
  }, [slug, router]);

  const handleBookmark = () => {
    toggleBookmark(slug);
    setIsBookmarked(!isBookmarked);
  };

  if (!topic) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-[var(--duo-text-muted)] mb-4">Topik tidak ditemukan</p>
            <Link href="/" className="text-sm text-[var(--duo-green)] hover:underline">Kembali ke beranda</Link>
          </div>
        </main>
      </div>
    );
  }

  // Show lesson flow
  if (showLesson) {
    return <LessonClient topic={topic} related={related} />;
  }

  const levelLabel = { smp: "SMP", sma: "SMA", kuliah: "Universitas" }[topic.level];
  const levelDot = { smp: "bg-emerald-500", sma: "bg-[var(--duo-info)]", kuliah: "bg-[var(--duo-purple)]" }[topic.level];

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
        {/* Header */}
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <nav className="flex items-center gap-2 text-xs text-[var(--duo-text-muted)] mb-4">
              <Link href="/" className="hover:text-[var(--duo-text)]">Beranda</Link>
              <ChevronRight size={12} />
              <Link href={`/?level=${topic.level}`} className="hover:text-[var(--duo-text)]">{levelLabel}</Link>
              <ChevronRight size={12} />
              <span className="text-[var(--duo-text)]">{topic.title}</span>
            </nav>

            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--duo-green)]/10 dark:bg-[var(--duo-green)]/20 border-2 border-[var(--duo-green)]/20 flex items-center justify-center shrink-0 mt-1">
                  {renderIcon(topic.icon, 28, "text-[var(--duo-green)]")}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${levelDot}`} />
                    <span className="text-xs font-bold text-[var(--duo-text-muted)]">{levelLabel}</span>
                  </div>
                  <h1 className="text-2xl font-black text-[var(--duo-text)] leading-tight">{topic.title}</h1>
                  <div className="mt-2 max-w-xs">
                    <MasteryBar slug={slug} mastery={mastery} size="sm" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleBookmark}
                  className={`p-2.5 rounded-xl border-2 transition-colors ${
                    isBookmarked
                      ? "border-[var(--duo-xp)] bg-yellow-50 dark:bg-yellow-950/30 text-[var(--duo-xp)]"
                      : "border-[var(--duo-border)] text-[var(--duo-text-muted)] hover:text-[var(--duo-xp)]"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                </motion.button>
                <AnimatedButton
                  onClick={() => setShowLesson(true)}
                  variant="primary"
                  size="md"
                  icon={<Play size={16} fill="currentColor" />}
                >
                  Mulai Lesson
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
          {/* Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-8"
          >
            <TopicContent content={topic.content} slug={slug} />
          </motion.div>

          {/* Related Topics */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xs font-extrabold text-[var(--duo-text-muted)] uppercase tracking-widest mb-3">
                Topik Terkait
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((rt) => (
                  <Link key={rt.id} href={`/topic/${rt.slug}`}>
                    <motion.div
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] hover:border-[var(--duo-green)]/50 hover:shadow-md transition-all cursor-pointer"
                      whileHover={{ x: 4, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="w-9 h-9 rounded-xl bg-[var(--duo-green)]/10 flex items-center justify-center shrink-0">
                        {renderIcon(rt.icon, 20, "text-[var(--duo-green)]")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--duo-text)] truncate">{rt.title}</p>
                      </div>
                      <ChevronRight size={16} className="text-[var(--duo-text-muted)] shrink-0" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={16} className="text-[var(--duo-text-muted)]" />
              <h2 className="text-sm font-bold text-[var(--duo-text-muted)] uppercase tracking-wider">
                Catatan Pribadi
              </h2>
            </div>
            <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-4">
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setSavedNotes(false); }}
                placeholder="Tulis catatan belajarmu di sini..."
                rows={4}
                className="w-full text-sm text-[var(--duo-text)] placeholder-gray-400 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--duo-border)]">
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">{notes.length} karakter</span>
                <AnimatedButton
                  onClick={() => { localStorage.setItem(`note-${slug}`, notes); setSavedNotes(true); }}
                  size="sm"
                  variant="primary"
                  icon={<Save size={12} />}
                >
                  {savedNotes ? "Tersimpan!" : "Simpan"}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
