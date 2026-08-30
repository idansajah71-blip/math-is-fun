"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import FeatureGuard from "@/components/admin/FeatureGuard";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, addXp, saveProfile } from "@/lib/gamification";
import {
  getDailyChallengeQuestion,
  hasSubmittedToday,
  submitAnswer,
  getDailyLeaderboard,
  getTodayStats,
  type DailyChallengeQuestion,
  type DailyChallengeSubmission,
} from "@/lib/dailyChallenge";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import { springBounce, staggerContainer, staggerItem } from "@/lib/animations";
import { Flame, Clock, Trophy, Zap, CheckCircle2, XCircle, ChevronRight, Users, Crown } from "lucide-react";

type Phase = "intro" | "quiz" | "result" | "leaderboard";

export default function DailyChallengePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>("intro");
  const [question, setQuestion] = useState<DailyChallengeQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeMs, setTimeMs] = useState(0);
  const [result, setResult] = useState<{ xpEarned: number; isCorrect: boolean } | null>(null);
  const [leaderboard, setLeaderboard] = useState<(DailyChallengeSubmission & { rank: number })[]>([]);
  const [stats, setStats] = useState({ total: 0, correct: 0, avgTimeMs: 0 });
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/");
      return;
    }

    const q = getDailyChallengeQuestion();
    if (!q) return;
    setQuestion(q);

    if (hasSubmittedToday(user.id)) {
      setAlreadySubmitted(true);
      setLeaderboard(getDailyLeaderboard());
      setStats(getTodayStats());
    }
  }, [user, authLoading, router]);

  // Timer
  useEffect(() => {
    if (phase !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => handleTimeoutRef.current(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleTimeout = useCallback(() => {
    if (!user || !question) return;
    const res = submitAnswer(user.id, user.name, -1, 60000);
    setResult(res);
    if (res.xpEarned > 0) {
      const p = addXp(res.xpEarned);
      saveProfile(p);
    }
    playCompleteSound();
    setLeaderboard(getDailyLeaderboard());
    setStats(getTodayStats());
    setPhase("result");
  }, [user, question]);

  const handleTimeoutRef = useRef(handleTimeout);
  handleTimeoutRef.current = handleTimeout;

  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    };
  }, []);

  const startQuiz = () => {
    startTimeRef.current = Date.now();
    setTimeLeft(60);
    setPhase("quiz");
  };

  const handleAnswer = (i: number) => {
    if (selected !== null || !user || !question) return;
    setSelected(i);
    setShowResult(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const elapsed = Date.now() - startTimeRef.current;
    setTimeMs(elapsed);

    const res = submitAnswer(user.id, user.name, i, elapsed);
    setResult(res);

    if (res.isCorrect) {
      playCorrectSound();
      if (res.xpEarned > 0) {
        const p = addXp(res.xpEarned);
        saveProfile(p);
      }
    } else {
      playWrongSound();
    }

    setLeaderboard(getDailyLeaderboard());
    setStats(getTodayStats());

    resultTimeoutRef.current = setTimeout(() => setPhase("result"), 1200);
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const formatTimeMs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  return (
    <FeatureGuard flag="daily-challenge">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
          {/* Header */}
          <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
            <div className="max-w-2xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Flame size={20} className="text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-[var(--duo-text)]">Tantangan Harian</h1>
                  <p className="text-xs text-[var(--duo-text-muted)]">1 soal, semua orang sama. Siapa paling cepat?</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-8 py-6">
            {/* Intro */}
            {phase === "intro" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                {alreadySubmitted ? (
                  <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-8">
                    <CheckCircle2 size={48} className="text-[var(--duo-green)] mx-auto mb-4" />
                    <h2 className="text-lg font-black text-[var(--duo-text)] mb-2">Sudah Mengerjakan Hari Ini!</h2>
                    <p className="text-sm text-[var(--duo-text-muted)] mb-6">Kembali besok untuk tantangan baru.</p>
                    <button
                      onClick={() => setPhase("leaderboard")}
                      className="px-6 py-3 bg-[var(--duo-green)] text-white font-bold rounded-xl hover:opacity-90 transition"
                    >
                      Lihat Leaderboard
                    </button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springBounce}>
                      <Flame size={64} className="text-orange-500 mx-auto mb-4" />
                    </motion.div>
                    <h2 className="text-lg font-black text-[var(--duo-text)] mb-2">Siap Tantangan?</h2>
                    <p className="text-sm text-[var(--duo-text-muted)] mb-6">
                      1 soal pilihan ganda. Waktu 60 detik. +10 XP jika benar, +5 bonus jika cepat!
                    </p>
                    <button
                      onClick={startQuiz}
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl text-lg hover:opacity-90 transition shadow-lg"
                    >
                      Mulai!
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Quiz */}
            {phase === "quiz" && question && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {/* Timer */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-lg ${
                    timeLeft <= 10 ? "bg-red-500/10 text-red-500" : "bg-[var(--duo-card)] text-[var(--duo-text)]"
                  }`}>
                    <Clock size={18} />
                    {timeLeft}s
                  </div>
                </div>

                {/* Question */}
                <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6 mb-4">
                  <p className="text-sm font-bold text-[var(--duo-text)] mb-1">
                    Topik: {question.topicSlug}
                  </p>
                  <p className="text-base font-bold text-[var(--duo-text)] leading-relaxed">
                    {question.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === question.correctIndex;
                    const showCorrect = showResult && isCorrect;
                    const showWrong = showResult && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                          showCorrect
                            ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                            : showWrong
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : isSelected
                            ? "border-[var(--duo-info)] bg-[var(--duo-info)]/10"
                            : "border-[var(--duo-border)] hover:border-[var(--duo-info)]/50 text-[var(--duo-text)]"
                        }`}
                      >
                        <span className="mr-2 text-[var(--duo-text-muted)]">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Result */}
            {phase === "result" && result && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springBounce} className="text-center">
                <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-8">
                  {result.isCorrect ? (
                    <>
                      <CheckCircle2 size={64} className="text-[var(--duo-green)] mx-auto mb-4" />
                      <h2 className="text-xl font-black text-[var(--duo-green)] mb-2">Benar!</h2>
                      <p className="text-sm text-[var(--duo-text-muted)] mb-2">Waktu: {formatTimeMs(timeMs)}</p>
                      <p className="text-lg font-black text-[var(--duo-xp)]">+{result.xpEarned} XP</p>
                    </>
                  ) : (
                    <>
                      <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                      <h2 className="text-xl font-black text-red-500 mb-2">Salah!</h2>
                      {question && (
                        <p className="text-sm text-[var(--duo-text-muted)] mb-4">
                          Jawaban: {question.options[question.correctIndex]}
                        </p>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[var(--duo-text-muted)]">
                    <span>{stats.total} peserta</span>
                    <span>•</span>
                    <span>{stats.correct} benar</span>
                  </div>

                  <button
                    onClick={() => setPhase("leaderboard")}
                    className="mt-6 px-6 py-3 bg-[var(--duo-green)] text-white font-bold rounded-xl hover:opacity-90 transition"
                  >
                    Lihat Leaderboard
                  </button>
                </div>
              </motion.div>
            )}

            {/* Leaderboard */}
            {phase === "leaderboard" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] overflow-hidden">
                  <div className="p-4 border-b-2 border-[var(--duo-border)] flex items-center gap-2">
                    <Trophy size={18} className="text-[var(--duo-xp)]" />
                    <h2 className="font-black text-[var(--duo-text)]">Leaderboard Hari Ini</h2>
                  </div>

                  {leaderboard.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[var(--duo-text-muted)]">Belum ada peserta hari ini.</div>
                  ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="divide-y divide-[var(--duo-border)]">
                      {leaderboard.slice(0, 20).map((entry) => (
                        <motion.div key={entry.userId} variants={staggerItem} className="flex items-center gap-3 px-4 py-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                            entry.rank === 1 ? "bg-yellow-400 text-white" :
                            entry.rank === 2 ? "bg-gray-300 text-gray-700" :
                            entry.rank === 3 ? "bg-amber-600 text-white" :
                            "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)]"
                          }`}>
                            {entry.rank}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[var(--duo-text)] truncate">{entry.userName}</p>
                          </div>
                          <span className="text-xs text-[var(--duo-text-muted)]">{formatTimeMs(entry.timeMs)}</span>
                          {entry.isCorrect && (
                            <span className="text-xs font-bold text-[var(--duo-xp)]">+{entry.xpEarned} XP</span>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[var(--duo-text-muted)]">
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{stats.total} peserta</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>{stats.correct} benar</span>
                  </div>
                  {stats.avgTimeMs > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Rata-rata {formatTimeMs(stats.avgTimeMs)}</span>
                      </div>
                    </>
                  )}
                </div>

                {!alreadySubmitted && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setPhase("intro")}
                      className="px-6 py-3 bg-[var(--duo-green)] text-white font-bold rounded-xl hover:opacity-90 transition"
                    >
                      Kerjakan Sekarang
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab buttons */}
            {phase !== "quiz" && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPhase(alreadySubmitted ? "leaderboard" : "intro")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    phase === "intro" || (alreadySubmitted && phase === "leaderboard")
                      ? "bg-[var(--duo-green)] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)]"
                  }`}
                >
                  Tantangan
                </button>
                <button
                  onClick={() => { setLeaderboard(getDailyLeaderboard()); setStats(getTodayStats()); setPhase("leaderboard"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    phase === "leaderboard" && !alreadySubmitted
                      ? "bg-[var(--duo-green)] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)]"
                  }`}
                >
                  Leaderboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </FeatureGuard>
  );
}
