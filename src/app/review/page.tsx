"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Confetti from "@/components/ui/Confetti";
import XpPopup from "@/components/ui/XpPopup";
import { quizzes } from "@/lib/quizzes";
import { getAllTopics } from "@/lib/mathData";
import { getProfile, saveQuizScore, addXp, UserProfile } from "@/lib/gamification";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import { AlertTriangle, CheckCircle2, XCircle, RotateCcw, ChevronRight, BookOpen, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { renderIcon } from "@/lib/iconMap";

type Tab = "wrong" | "quiz" | "result";

export default function ReviewPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<Tab>("wrong");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [quizTopicSlug, setQuizTopicSlug] = useState<string>("");
  const [questions, setQuestions] = useState<typeof quizzes>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showXp, setShowXp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const topics = getAllTopics();

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const wrongTopics = useMemo(() => {
    if (!profile || !profile.wrongAnswers) return [];
    const entries = Object.entries(profile.wrongAnswers)
      .filter(([slug, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    return entries.map(([slug, wrongCount]) => {
      const topic = topics.find((t) => t.slug === slug);
      return {
        slug,
        title: topic?.title || slug,
        icon: topic?.icon || "📝",
        level: topic?.level || "smp",
        wrongCount,
      };
    });
  }, [profile, topics]);

  const filteredTopics = useMemo(() => {
    if (filterLevel === "all") return wrongTopics;
    return wrongTopics.filter((t) => t.level === filterLevel);
  }, [wrongTopics, filterLevel]);

  const shuffled = useMemo(() => {
    if (questions.length === 0) return null;
    const q = questions[currentQ];
    if (!q || q.type !== "choice" || q.options.length === 0) return null;
    const idx = q.options.map((_: string, i: number) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.floor(Math.random() * (i + 1)));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return { options: idx.map((i: number) => q.options[i]), correctIndex: idx.indexOf(q.correctIndex) };
  }, [currentQ, questions]);

  function startQuiz(slug: string) {
    const pool = quizzes
      .filter((q) => q.topicSlug === slug && q.type === "choice" && q.options.length > 0)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    if (pool.length === 0) return;
    setQuizTopicSlug(slug);
    setQuestions(pool);
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setShowXp(false);
    setShowConfetti(false);
    setTab("quiz");
  }

  function handleAnswer(i: number) {
    if (selected !== null || !shuffled) return;
    setSelected(i);
    setShowResult(true);
    const correct = i === shuffled.correctIndex;
    setAnswers([...answers, correct]);
    if (correct) {
      setScore((s) => s + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const pct = Math.round((score / questions.length) * 100);
      saveQuizScore(`review-${quizTopicSlug}`, pct);
      addXp(score * 5);
      if (pct >= 80) { setShowConfetti(true); playCompleteSound(); }
      setShowXp(true);
      setTab("result");
      setProfile(getProfile());
    }
  }

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const quizTopic = topics.find((t) => t.slug === quizTopicSlug);

  // ── Wrong Answers Tab ──
  if (tab === "wrong") {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] p-8 pb-24 lg:pb-0">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--danger-bg)] flex items-center justify-center">
                <AlertTriangle size={20} className="text-[var(--danger)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--duo-text)]">Salah Jawab Review</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">
                  {wrongTopics.length} topik perlu diperbaiki
                </p>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 mt-4 mb-6">
              <Filter size={14} className="text-[var(--duo-text-muted)]" />
              {["all", "smp", "sma", "kuliah"].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filterLevel === level
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--duo-card)] border border-[var(--duo-border)] text-[var(--duo-text-muted)] hover:bg-[var(--duo-bg)]"
                  }`}
                >
                  {level === "all" ? "Semua" : level.toUpperCase()}
                </button>
              ))}
            </div>

            {/* List */}
            {filteredTopics.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--duo-card)] rounded-2xl border border-[var(--duo-border)] p-12 text-center"
              >
                <CheckCircle2 size={48} className="text-[var(--primary)] mx-auto mb-4" />
                <h2 className="text-lg font-bold text-[var(--duo-text)] mb-2">Semua Benar!</h2>
                <p className="text-sm text-[var(--duo-text-muted)]">Tidak ada soal yang salah. Bagus sekali!</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredTopics.map((topic, i) => (
                  <motion.div
                    key={topic.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 flex items-center gap-4 hover:border-[var(--danger)] transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--danger-bg)] flex items-center justify-center shrink-0">
                      {renderIcon(topic.icon, 24)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[var(--duo-text)] truncate">{topic.title}</h3>
                      <p className="text-xs text-[var(--duo-text-muted)]">
                        <span className="uppercase font-bold">{topic.level}</span> · {topic.wrongCount}x salah
                      </p>
                    </div>
                    <button
                      onClick={() => startQuiz(topic.slug)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--danger)] text-white text-xs font-bold hover:brightness-110 transition-all active:scale-95"
                    >
                      <RotateCcw size={12} />
                      Retry
                      <ChevronRight size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Quiz Tab ──
  if (tab === "quiz" && questions.length > 0) {
    const q = questions[currentQ];
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] p-8 pb-24 lg:pb-0">
          <div className="max-w-lg mx-auto">
            {showXp && <XpPopup amount={score * 5} show={true} />}
            {showConfetti && <Confetti show={true} />}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setTab("wrong")} className="text-xs font-bold text-[var(--duo-text-muted)] hover:text-[var(--duo-text)]">
                ← Kembali
              </button>
              <span className="text-xs font-bold text-[var(--duo-text-muted)]">
                {currentQ + 1} / {questions.length}
              </span>
              <span className="text-xs font-bold text-[var(--primary)]">{score} benar</span>
            </div>

            {/* Progress */}
            <div className="h-2 bg-[var(--border)] rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6 mb-6"
            >
              <p className="text-base font-bold text-[var(--duo-text)] mb-1">{q.question}</p>
              {quizTopic && (
                <p className="text-xs text-[var(--duo-text-muted)] mb-4">
                  {renderIcon(quizTopic.icon, 14)} {quizTopic.title}
                </p>
              )}

              {shuffled && (
                <div className="space-y-2.5">
                  {shuffled.options.map((opt, i) => {
                    let cls = "border-[var(--duo-border)] bg-[var(--duo-card)]";
                    if (selected !== null) {
                      if (i === shuffled.correctIndex) cls = "border-green-500 bg-green-50 dark:bg-green-950/30";
                      else if (i === selected) cls = "border-red-500 bg-red-50 dark:bg-red-950/30";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${cls} ${
                          selected === null ? "hover:border-[var(--primary)] hover:bg-[var(--primary-bg)]" : ""
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-2xl p-4 mb-4 ${
                    selected !== null && shuffled && selected === shuffled.correctIndex
                      ? "bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {selected !== null && shuffled && selected === shuffled.correctIndex ? (
                      <CheckCircle2 size={20} className="text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-[var(--duo-text)]">
                        {selected !== null && shuffled && selected === shuffled.correctIndex
                          ? "Benar! 🎉"
                          : "Salah 😅"}
                      </p>
                      <p className="text-xs text-[var(--duo-text-muted)] mt-1">{q.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {selected !== null && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm shadow-[0_4px_0_var(--primary-hover)] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {currentQ < questions.length - 1 ? "Soal Berikutnya →" : "Lihat Hasil"}
              </motion.button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Result Tab ──
  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8 pb-24 lg:pb-0">
        <div className="max-w-lg mx-auto text-center">
          {showConfetti && <Confetti show={true} />}
          {showXp && <XpPopup amount={score * 5} show={true} />}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-8"
          >
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              pct >= 80 ? "bg-green-100 dark:bg-green-950/40" : pct >= 50 ? "bg-yellow-100 dark:bg-yellow-950/40" : "bg-red-100 dark:bg-red-950/40"
            }`}>
              <span className="text-3xl font-black">{pct}%</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--duo-text)] mb-1">
              {pct >= 80 ? "Luar Biasa! 🎉" : pct >= 50 ? "Cukup Bagus! 👍" : "Terus Belajar! 💪"}
            </h2>
            <p className="text-sm text-[var(--duo-text-muted)] mb-6">
              {score} dari {questions.length} soal benar
            </p>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--primary)]">{score}</p>
                <p className="text-xs text-[var(--duo-text-muted)]">Benar</p>
              </div>
              <div className="w-px h-8 bg-[var(--duo-border)]" />
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--danger)]">{questions.length - score}</p>
                <p className="text-xs text-[var(--duo-text-muted)]">Salah</p>
              </div>
              <div className="w-px h-8 bg-[var(--duo-border)]" />
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--accent-xp)]">+{score * 5}</p>
                <p className="text-xs text-[var(--duo-text-muted)]">XP</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setTab("wrong"); setProfile(getProfile()); }}
                className="flex-1 py-3 rounded-xl border-2 border-[var(--duo-border)] text-[var(--duo-text)] font-bold text-sm hover:bg-[var(--duo-bg)] transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={() => startQuiz(quizTopicSlug)}
                className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm shadow-[0_4px_0_var(--primary-hover)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                Coba Lagi
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
