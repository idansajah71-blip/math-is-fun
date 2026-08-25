"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Confetti from "@/components/ui/Confetti";
import XpPopup from "@/components/ui/XpPopup";
import { quizzes } from "@/lib/quizzes";
import { getProfile, saveProfile, addXp, getWeakTopics } from "@/lib/gamification";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import { CheckCircle2, XCircle, Timer, RotateCcw, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { QuizQuestion } from "@/lib/types";

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function seedRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

function generateDailyQuiz(dateStr: string, weakTopics: string[]): QuizQuestion[] {
  const rng = seedRandom(dateStr);
  const pool = [...quizzes];

  const weakQuestions = pool.filter((q) => weakTopics.includes(q.topicSlug));
  const otherQuestions = pool.filter((q) => !weakTopics.includes(q.topicSlug));

  const picked: QuizQuestion[] = [];
  const maxWeak = Math.min(4, weakQuestions.length);

  for (let i = weakQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [weakQuestions[i], weakQuestions[j]] = [weakQuestions[j], weakQuestions[i]];
  }
  for (let i = otherQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [otherQuestions[i], otherQuestions[j]] = [otherQuestions[j], otherQuestions[i]];
  }

  picked.push(...weakQuestions.slice(0, maxWeak));
  const remaining = 10 - picked.length;
  picked.push(...otherQuestions.slice(0, remaining));

  if (picked.length < 10) {
    const extra = pool.filter((q) => !picked.includes(q));
    for (let i = extra.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [extra[i], extra[j]] = [extra[j], extra[i]];
    }
    picked.push(...extra.slice(0, 10 - picked.length));
  }

  return picked;
}

export default function DailyQuizPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showXp, setShowXp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const todayStr = getTodayStr();

  useEffect(() => {
    const profile = getProfile();
    if (profile.dailyQuizDate === todayStr) {
      setAlreadyCompleted(true);
    }
  }, [todayStr]);

  const startQuiz = useCallback(() => {
    const weakTopics = getWeakTopics(5);
    const daily = generateDailyQuiz(todayStr, weakTopics);
    setQuestions(daily);
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(10 * 60);
    setStep("quiz");
  }, [todayStr]);

  const shuffled = useMemo(() => {
    if (questions.length === 0) return null;
    const q = questions[currentQ];
    const idx = q.options.map((_: string, i: number) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return { options: idx.map((i: number) => q.options[i]), correctIndex: idx.indexOf(q.correctIndex) };
  }, [currentQ, questions]);

  useEffect(() => {
    if (step !== "quiz" || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStep("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step, timeLeft]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowResult(true);
    const correct = !!shuffled && i === shuffled.correctIndex;
    setAnswers([...answers, correct]);
    if (correct) {
      setScore((s) => s + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      const profile = getProfile();
      profile.dailyQuizDate = todayStr;
      saveProfile(profile);
      const bonusXp = score * 5 + (score >= 8 ? 20 : score >= 5 ? 10 : 0);
      addXp(bonusXp);
      if (score >= 5) playCompleteSound();
      if (score >= 8) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      setShowXp(true);
      setStep("result");
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />
      {showXp && <XpPopup amount={score * 5 + (score >= 8 ? 20 : score >= 5 ? 10 : 0)} show={true} onComplete={() => setShowXp(false)} />}
      {showConfetti && <Confetti show={true} />}

      <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[var(--duo-info)]/10 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} className="text-[var(--duo-info)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Quiz Harian</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">
                  {step === "intro" ? "10 soal acak berdasarkan topik lemah kamu" : `Soal ${currentQ + 1} / ${questions.length}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-6">
          {step === "intro" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[var(--duo-info)]/10 rounded-full flex items-center justify-center">
                  <Calendar size={32} className="text-[var(--duo-info)]" />
                </div>
                <h2 className="text-lg font-black text-[var(--duo-text)] mb-2">{todayStr}</h2>
                <p className="text-sm text-[var(--duo-text-muted)] mb-6">
                  {alreadyCompleted
                    ? "Kamu sudah menyelesaikan quiz harian hari ini! Kembali besok."
                    : "10 soal pilihan ganda. Fokus di topik yang belum kamu kuasai. Waktu: 10 menit."}
                </p>

                {alreadyCompleted ? (
                  <button
                    disabled
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  >
                    Sudah Selesai
                  </button>
                ) : (
                  <button
                    onClick={startQuiz}
                    className="px-8 py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all"
                  >
                    Mulai Quiz Harian
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === "quiz" && questions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Timer */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--duo-text-muted)]">
                  <Timer size={14} />
                  <span className={timeLeft < 60 ? "text-red-500" : ""}>{formatTime(timeLeft)}</span>
                </div>
                <div className="flex gap-1">
                  {answers.map((correct, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${correct ? "bg-[var(--duo-green)]" : "bg-red-400"}`} />
                  ))}
                  {[...Array(questions.length - answers.length)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-[var(--duo-green)] rounded-full transition-all duration-300"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 mb-4">
                <p className="text-sm text-[var(--duo-text-muted)] mb-1 font-bold">Soal {currentQ + 1}</p>
                <p className="text-base font-bold text-[var(--duo-text)] leading-relaxed">{questions[currentQ].question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {shuffled?.options.map((opt, i) => {
                  const isCorrect = i === shuffled.correctIndex;
                  const isSelected = i === selected;
                  let ring = "";
                  if (showResult && isSelected) ring = isCorrect ? "ring-2 ring-[var(--duo-green)]" : "ring-2 ring-red-400";
                  else if (showResult && isCorrect) ring = "ring-2 ring-[var(--duo-green)]";
                  const bg = showResult
                    ? isCorrect
                      ? "bg-[var(--duo-green)]/10"
                      : isSelected
                        ? "bg-red-50 dark:bg-red-950/30"
                        : ""
                    : "";

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selected !== null}
                      className={`w-full text-left p-4 rounded-2xl border-2 border-[var(--duo-border)] transition-all ${ring} ${bg} ${
                        selected === null ? "hover:border-[var(--duo-green)] active:scale-[0.98]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          showResult && isCorrect
                            ? "border-[var(--duo-green)] bg-[var(--duo-green)] text-white"
                            : showResult && isSelected && !isCorrect
                              ? "border-red-400 bg-red-400 text-white"
                              : "border-[var(--duo-border)]"
                        }`}>
                          {showResult && isCorrect ? <CheckCircle2 size={14} /> : showResult && isSelected && !isCorrect ? <XCircle size={14} /> : String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm font-bold text-[var(--duo-text)]">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation + next */}
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-[var(--duo-purple)]/20 mb-4">
                    <p className="text-xs font-bold text-[var(--duo-purple)] mb-1">Penjelasan</p>
                    <p className="text-sm text-[var(--duo-text)] leading-relaxed">{questions[currentQ].explanation}</p>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all"
                  >
                    {currentQ + 1 >= questions.length ? "Selesai" : "Soal Berikutnya"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === "result" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  accuracy >= 80 ? "bg-[var(--duo-green)]/10" : accuracy >= 50 ? "bg-[var(--duo-xp)]/10" : "bg-red-100 dark:bg-red-900/30"
                }`}>
                  <span className="text-3xl font-black text-[var(--duo-text)]">{accuracy}%</span>
                </div>
                <h2 className="text-lg font-black text-[var(--duo-text)] mb-1">
                  {accuracy >= 80 ? "Luar Biasa!" : accuracy >= 50 ? "Bagus!" : "Terus Berlatih!"}
                </h2>
                <p className="text-sm text-[var(--duo-text-muted)]">
                  {score} dari {questions.length} benar
                </p>
                <p className="text-xs text-[var(--duo-text-muted)] mt-1">Quiz Harian {todayStr}</p>
              </div>

              {/* XP earned */}
              <div className="bg-[var(--duo-xp)]/10 rounded-2xl p-4 text-center border border-[var(--duo-xp)]/20">
                <p className="text-xs font-bold text-[var(--duo-xp)]">XP Diperoleh</p>
                <p className="text-2xl font-black text-[var(--duo-xp)]">+{score * 5 + (accuracy >= 80 ? 20 : accuracy >= 50 ? 10 : 0)}</p>
                <p className="text-[10px] text-[var(--duo-text-muted)] mt-1">
                  {score * 5} (soal) {accuracy >= 50 ? `+ ${accuracy >= 80 ? 20 : 10} (bonus)` : ""}
                </p>
              </div>

              {/* Answers review */}
              <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-4">
                <p className="text-sm font-bold text-[var(--duo-text)] mb-3">Ringkasan Jawaban</p>
                <div className="flex flex-wrap gap-2">
                  {answers.map((correct, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                        correct ? "bg-[var(--duo-green)]" : "bg-red-400"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep("intro")}
                className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all"
              >
                Kembali
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
