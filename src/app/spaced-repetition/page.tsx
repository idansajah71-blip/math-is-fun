"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getProfile, getDueTopics, getUpcomingReviews, recordReview, addXp } from "@/lib/gamification";
import { getTopicBySlug, getAllQuizzes } from "@/lib/data";
import { renderIcon } from "@/lib/iconMap";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, XCircle, ChevronRight, Calendar, Clock, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import FeatureGuard from "@/components/admin/FeatureGuard";

export default function SpacedRepetitionPage() {
  const [dueSlugs, setDueSlugs] = useState<string[]>([]);
  const [upcoming, setUpcoming] = useState<{ slug: string; nextReview: string; interval: number; reviewCount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalReviewed, setTotalReviewed] = useState(0);

  const load = useCallback(() => {
    setDueSlugs(getDueTopics());
    setUpcoming(getUpcomingReviews());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function startReview(slug: string) {
    setCurrentSlug(slug);
    setCurrentQuizIdx(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setReviewMode(true);
  }

  const topicQuizzes = currentSlug ? getAllQuizzes().filter((q) => q.topicSlug === currentSlug) : [];
  const currentQuiz = topicQuizzes[currentQuizIdx];

  function handleAnswer(i: number) {
    if (selected !== null || !currentQuiz) return;
    setSelected(i);
    setShowResult(true);
    if (i === currentQuiz.correctIndex) {
      setScore((s) => s + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }
  }

  function nextQuestion() {
    if (!currentSlug) return;
    if (currentQuizIdx + 1 >= Math.min(topicQuizzes.length, 5)) {
      const pct = Math.round((score / Math.min(topicQuizzes.length, 5)) * 100);
      const quality = pct >= 80 ? 5 : pct >= 60 ? 4 : pct >= 40 ? 3 : pct >= 20 ? 2 : 1;
      recordReview(currentSlug, quality);
      const xp = score * 3;
      if (xp > 0) addXp(xp);
      setTotalReviewed((t) => t + 1);
      setReviewMode(false);
      setCurrentSlug(null);
      load();
    } else {
      setCurrentQuizIdx((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <FeatureGuard flag="spaced-repetition">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />

        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[var(--duo-purple)]/10 rounded-2xl flex items-center justify-center">
                <Brain size={24} className="text-[var(--duo-purple)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Ulangan Bertahap</h1>
                <p className="text-xs text-[var(--duo-text-muted)]">
                  Ulangan Bertahap = jadwal ulang topik yang sudah selesai
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
          ) : reviewMode && currentQuiz ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[var(--duo-text-muted)]">
                  Soal {currentQuizIdx + 1} / {Math.min(topicQuizzes.length, 5)}
                </span>
                <div className="flex gap-1">
                  {[...Array(Math.min(topicQuizzes.length, 5))].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < currentQuizIdx ? "bg-[var(--duo-green)]" : i === currentQuizIdx ? "bg-[var(--duo-info)]" : "bg-gray-200 dark:bg-gray-700"}`} />
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 mb-4">
                <p className="text-base font-bold text-[var(--duo-text)] leading-relaxed">{currentQuiz.question}</p>
              </div>

              <div className="space-y-3 mb-4">
                {currentQuiz.options.map((opt, i) => {
                  const isCorrect = i === currentQuiz.correctIndex;
                  const isSelected = i === selected;
                  let ring = "";
                  if (showResult && isSelected) ring = isCorrect ? "ring-2 ring-[var(--duo-green)]" : "ring-2 ring-red-400";
                  else if (showResult && isCorrect) ring = "ring-2 ring-[var(--duo-green)]";
                  const bg = showResult ? isCorrect ? "bg-[var(--duo-green)]/10" : isSelected ? "bg-red-50 dark:bg-red-950/30" : "" : "";

                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                      className={`w-full text-left p-4 rounded-2xl border-2 border-[var(--duo-border)] transition-all ${ring} ${bg} ${selected === null ? "hover:border-[var(--duo-green)] active:scale-[0.98]" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${showResult && isCorrect ? "border-[var(--duo-green)] bg-[var(--duo-green)] text-white" : showResult && isSelected && !isCorrect ? "border-red-400 bg-red-400 text-white" : "border-[var(--duo-border)]"}`}>
                          {showResult && isCorrect ? <CheckCircle2 size={14} /> : showResult && isSelected && !isCorrect ? <XCircle size={14} /> : String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm font-bold text-[var(--duo-text)]">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-[var(--duo-purple)]/20 mb-4">
                    <p className="text-xs font-bold text-[var(--duo-purple)] mb-1">Penjelasan</p>
                    <p className="text-sm text-[var(--duo-text)] leading-relaxed">{currentQuiz.explanation}</p>
                  </div>
                  <button onClick={nextQuestion}
                    className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all">
                    {currentQuizIdx + 1 >= Math.min(topicQuizzes.length, 5) ? "Selesai" : "Soal Berikutnya"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              {dueSlugs.length === 0 && upcoming.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 bg-[var(--duo-purple)]/10 rounded-full flex items-center justify-center">
                      <Brain size={32} className="text-[var(--duo-purple)]" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[var(--duo-text)] mb-1">Belum ada ulangan</p>
                  <p className="text-xs text-[var(--duo-text-muted)] mb-4">Selesaikan materi dulu, nanti akan muncul jadwal ulangannya.</p>
                  <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all">
                    Mulai Belajar <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <>
                  {dueSlugs.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold text-[var(--duo-text)] mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-[var(--duo-green)]" />
                        Siap Diulang ({dueSlugs.length})
                      </h2>
                      <div className="space-y-3">
                        {dueSlugs.map((slug) => {
                          const topic = getTopicBySlug(slug);
                          const data = getProfile().spacedRepetition[slug];
                          if (!topic) return null;
                          return (
                            <motion.div key={slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                              className="bg-white dark:bg-[var(--duo-card)] rounded-[20px] border-2 border-[var(--duo-border)] p-4 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[var(--duo-green)]/10">
                                {renderIcon(topic.icon, 28)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[var(--duo-text)] truncate">{topic.title}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-[10px] font-bold text-[var(--duo-green)]">Jatuh tempo hari ini</span>
                                  <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Interval: {data?.interval ?? 1} hari</span>
                                </div>
                              </div>
                              <button onClick={() => startReview(slug)}
                                className="px-4 py-2 bg-[var(--duo-green)] text-white rounded-xl text-xs font-bold shadow-[0_2px_0_var(--duo-green-dark)] hover:brightness-110 transition-all">
                                Ulang
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {upcoming.filter((u) => u.nextReview > today).length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold text-[var(--duo-text)] mb-3 flex items-center gap-2">
                        <Calendar size={14} className="text-[var(--duo-text-muted)]" />
                        Mendatang
                      </h2>
                      <div className="bg-white dark:bg-[var(--duo-card)] rounded-[20px] border-2 border-[var(--duo-border)] overflow-hidden">
                        {upcoming.filter((u) => u.nextReview > today).slice(0, 10).map((item, i) => {
                          const topic = getTopicBySlug(item.slug);
                          if (!topic) return null;
                          const daysUntil = Math.ceil((new Date(item.nextReview).getTime() - Date.now()) / 86400000);
                          return (
                            <div key={item.slug} className={`flex items-center gap-3 px-4 py-3 ${i < upcoming.length - 1 ? "border-b border-[var(--duo-border)]" : ""}`}>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--duo-info)]/10">
                                <Clock size={14} className="text-[var(--duo-info)]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[var(--duo-text)] truncate">{topic.title}</p>
                                <p className="text-[10px] text-[var(--duo-text-muted)]">{daysUntil <= 1 ? "Besok" : `Dalam ${daysUntil} hari`}</p>
                              </div>
                              <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">×{item.reviewCount}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {totalReviewed > 0 && (
                    <div className="text-center p-4 bg-[var(--duo-green-bg)] rounded-2xl border border-[var(--duo-green)]/20">
                      <p className="text-xs font-bold text-[var(--duo-green)]">+{totalReviewed} topik diulang hari ini</p>
                    </div>
                  )}

                  {/* Cross-link to Review */}
                  <div className="mt-4 p-4 rounded-2xl bg-[var(--danger-bg)] border-2 border-[var(--danger)]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--danger-bg)] flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-[var(--danger)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--duo-text)]">Ingin review soal yang pernah salah?</p>
                        <p className="text-xs text-[var(--duo-text-muted)]">Coba halaman Review Salah untuk latihan lebih fokus.</p>
                      </div>
                      <Link href="/review" className="shrink-0">
                        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--danger)] text-white text-xs font-bold hover:brightness-110 transition-all">
                          Buka <ArrowRight size={12} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
        </div>
      </FeatureGuard>
    );
  }
