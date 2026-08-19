"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import MathContent from "@/components/MathContent";
import QuizModal from "@/components/QuizModal";
import XpPopup from "@/components/XpPopup";
import { getTopicBySlug, getTopicsByLevel } from "@/lib/mathData";
import { completeTopic, toggleBookmark, getProfile } from "@/lib/gamification";
import { ArrowLeft, Bookmark, CheckCircle2, Play, ChevronRight, StickyNote, Save } from "lucide-react";
import type { Topic } from "@/lib/types";

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [related, setRelated] = useState<Topic[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState(false);

  useEffect(() => {
    const found = getTopicBySlug(slug);
    if (found) {
      setTopic(found);
      setRelated(getTopicsByLevel(found.level).filter((t) => t.slug !== slug).slice(0, 5));
      const p = getProfile();
      setIsBookmarked(p.bookmarkedTopics.includes(slug));
      setIsCompleted(p.completedTopics.includes(slug));
      const savedNotes = localStorage.getItem(`note-${slug}`) || "";
      setNotes(savedNotes);
    }
  }, [slug]);

  const handleComplete = () => {
    completeTopic(slug);
    setIsCompleted(true);
    setXpAmount(25);
    setShowXp(true);
  };

  const handleBookmark = () => {
    toggleBookmark(slug);
    setIsBookmarked(!isBookmarked);
  };

  if (!topic) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-[260px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Topik tidak ditemukan</p>
            <Link href="/" className="text-sm text-[#1a73e8] hover:underline">Kembali ke beranda</Link>
          </div>
        </main>
      </div>
    );
  }

  const levelLabel = { smp: "SMP", sma: "SMA", kuliah: "Universitas" }[topic.level];
  const levelDot = { smp: "bg-emerald-500", sma: "bg-[#1a73e8]", kuliah: "bg-purple-500" }[topic.level];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <XpPopup amount={xpAmount} show={showXp} onComplete={() => setShowXp(false)} />

      <main className="flex-1 ml-[260px]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-gray-600">Beranda</Link>
              <ChevronRight size={12} />
              <Link href={`/?level=${topic.level}`} className="hover:text-gray-600">{levelLabel}</Link>
              <ChevronRight size={12} />
              <span className="text-gray-600">{topic.title}</span>
            </nav>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${levelDot}`} />
                  <span className="text-xs text-gray-500">{levelLabel}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{topic.title}</h1>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleBookmark} className={`p-2 rounded-lg border transition-colors ${isBookmarked ? "border-amber-300 bg-amber-50 text-amber-600" : "border-gray-200 text-gray-400 hover:text-amber-500"}`}>
                  <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
                <button onClick={() => setShowQuiz(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Play size={14} />
                  Quiz
                </button>
                {!isCompleted ? (
                  <button onClick={handleComplete} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a73e8] text-white text-sm font-medium hover:bg-[#1557b0] transition-colors">
                    <CheckCircle2 size={14} />
                    Selesai (+25 XP)
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
                    <CheckCircle2 size={14} />
                    Selesai
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <article className="bg-white rounded-xl border border-gray-200 p-8">
            <MathContent content={topic.content} />
          </article>

          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Topik Terkait</h2>
              <div className="space-y-1.5">
                {related.map((rt) => (
                  <Link key={rt.id} href={`/topic/${rt.slug}`} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-gray-200 hover:border-[#1a73e8]/30 hover:shadow-sm transition-all group">
                    <div className={`w-2 h-2 rounded-full ${levelDot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-[#1a73e8] truncate">{rt.title}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-[#1a73e8]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={16} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Catatan Pribadi</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setSavedNotes(false); }}
                placeholder="Tulis catatan belajarmu di sini..."
                rows={4}
                className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">{notes.length} karakter</span>
                <button
                  onClick={() => { localStorage.setItem(`note-${slug}`, notes); setSavedNotes(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a73e8] text-white text-xs font-medium rounded-lg hover:bg-[#1557b0] transition-colors"
                >
                  <Save size={12} /> {savedNotes ? "Tersimpan!" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuizModal topicSlug={slug} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
