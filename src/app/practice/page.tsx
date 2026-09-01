"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Confetti from "@/components/ui/Confetti";
import Hearts from "@/components/Hearts";
import XpPopup from "@/components/ui/XpPopup";
import { getAllTopics, getAllQuizzes } from "@/lib/data";
import { saveQuizScore, addXp } from "@/lib/gamification";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import { updateMastery } from "@/lib/mastery";
import { CheckCircle2, XCircle, ChevronRight, Timer, RotateCcw, Settings2 } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import type { QuizQuestion } from "@/lib/types";

export default function PracticePage() {
  const [step, setStep] = useState<"config" | "quiz" | "result">("config");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showXp, setShowXp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const topics = getAllTopics();

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

  const startQuiz = useCallback(() => {
    let pool = selectedTopic === "all" ? getAllQuizzes() : getAllQuizzes().filter((q) => q.topicSlug === selectedTopic);
    pool = [...pool].sort(() => Math.random() - 0.5).slice(0, numQuestions);
    if (pool.length === 0) return;
    setQuestions(pool);
    setCurrentQ(0);
    setScore(0);
    setLives(5);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(timeLimit * 60);
    setStep("quiz");
  }, [selectedTopic, numQuestions, timeLimit]);

  useEffect(() => {
    if (step !== "quiz" || timeLimit === 0 || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setStep("result"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step, timeLimit, timeLeft]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowResult(true);
    const correct = !!shuffled && i === shuffled.correctIndex;
    setAnswers([...answers, correct]);
    const topicSlug = questions[currentQ]?.topicSlug;
    if (correct) {
      setScore((s) => s + 1);
      if (soundOn) playCorrectSound();
      if (topicSlug) updateMastery(topicSlug, true);
    } else {
      setLives((l) => {
        if (l <= 1) { setStep("result"); return 0; }
        return l - 1;
      });
      if (soundOn) playWrongSound();
      if (topicSlug) updateMastery(topicSlug, false);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const pct = Math.round((score / questions.length) * 100);
      saveQuizScore("practice", pct);
      addXp(score * 5);
      if (pct >= 80) { setShowConfetti(true); if (soundOn) playCompleteSound(); }
      setShowXp(true);
      setStep("result");
    }
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (step === "config") {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 lg:ml-[260px] p-8 pb-24 lg:pb-0">
          <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-bold text-[var(--duo-text)] mb-1">Latihan Bebas</h1>
            <p className="text-sm text-[var(--duo-text-muted)] mb-8">Pilih topik dan jumlah soal sesuai keinginanmu</p>

            <div className="bg-[var(--duo-card)] rounded-xl border border-[var(--duo-border)] p-6 space-y-5">
              {/* Topic */}
              <div>
                <label className="text-xs font-semibold text-[var(--duo-text-muted)] mb-2 block">Topik</label>
                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--duo-border)] text-sm focus:outline-none focus:border-[var(--primary)]">
                  <option value="all">Semua Topik (Campur)</option>
                  {topics.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
                </select>
              </div>

              {/* Jumlah Soal */}
              <div>
                <label className="text-xs font-semibold text-[var(--duo-text-muted)] mb-2 block">Jumlah Soal</label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((n) => (
                    <button key={n} onClick={() => setNumQuestions(n)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        numQuestions === n ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "border-[var(--duo-border)] text-gray-600 hover:bg-[var(--duo-bg)]"
                      }`}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div>
                <label className="text-xs font-semibold text-[var(--duo-text-muted)] mb-2 block">Batas Waktu</label>
                <div className="flex gap-2">
                  {[{ v: 0, l: "Tanpa" }, { v: 5, l: "5 min" }, { v: 10, l: "10 min" }, { v: 15, l: "15 min" }].map((t) => (
                    <button key={t.v} onClick={() => setTimeLimit(t.v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        timeLimit === t.v ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "border-[var(--duo-border)] text-gray-600 hover:bg-[var(--duo-bg)]"
                      }`}>{t.l}</button>
                  ))}
                </div>
              </div>

              {/* Sound */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--duo-text-muted)]">Suara</span>
                <button onClick={() => setSoundOn(!soundOn)}
                  className={`w-10 h-5 rounded-full transition-colors ${soundOn ? "bg-[var(--primary)]" : "bg-gray-300"} relative`}>
                  <div className={`w-4 h-4 bg-[var(--duo-card)] rounded-full absolute top-0.5 transition-all ${soundOn ? "left-5" : "left-0.5"}`} />
                </button>
              </div>

              <AnimatedButton onClick={startQuiz} fullWidth variant="primary" size="lg" icon={<Settings2 size={16} />}>
                Mulai Latihan
              </AnimatedButton>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "quiz") {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        <XpPopup amount={score * 5} show={showXp} onComplete={() => setShowXp(false)} />
        <main className="flex-1 lg:ml-[260px] p-8 pb-24 lg:pb-0">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Hearts lives={lives} />
              <div className="flex items-center gap-3">
                {timeLimit > 0 && (
                  <span className={`text-sm font-mono font-semibold ${timeLeft < 60 ? "text-red-500" : "text-gray-600"}`}>
                    <Timer size={14} className="inline mr-1" />
                    {formatTime(timeLeft)}
                  </span>
                )}
                <span className="text-sm text-[var(--duo-text-muted)]">{currentQ + 1}/{questions.length}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {/* Question */}
            <h3 className="text-lg font-semibold text-[var(--duo-text)] mb-6">{q.question}</h3>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {shuffled && shuffled.options.map((opt, i) => {
                let style = "border-2 border-[var(--duo-border)] bg-[var(--duo-card)] hover:border-[var(--primary)]/40";
                if (showResult) {
                  if (i === shuffled.correctIndex) style = "border-2 border-emerald-500 bg-emerald-50";
                  else if (i === selected) style = "border-2 border-red-500 bg-red-50";
                  else style = "border-2 border-[var(--duo-border)] opacity-40";
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                    className={`w-full p-3.5 text-left rounded-lg transition-all text-sm font-medium ${style}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        showResult && i === shuffled.correctIndex ? "bg-emerald-500 text-white" :
                        showResult && i === selected ? "bg-red-500 text-white" : "bg-[var(--surface-elevated)] text-[var(--duo-text-muted)]"
                      }`}>{String.fromCharCode(65 + i)}</span>
                      <span className="text-[var(--duo-text)]">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && shuffled && (
              <div className={`p-3 rounded-lg mb-4 flex items-start gap-2 ${
                selected === shuffled.correctIndex ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
              }`}>
                {selected === shuffled.correctIndex ? <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" /> : <XCircle size={16} className="text-red-600 mt-0.5" />}
                <p className="text-xs text-[var(--duo-text-muted)]">{q.explanation}</p>
              </div>
            )}

            {selected !== null && (
              <AnimatedButton onClick={handleNext} fullWidth variant="primary" size="lg"
                icon={currentQ < questions.length - 1 ? <ChevronRight size={16} /> : undefined}>
                {currentQ < questions.length - 1 ? "Selanjutnya" : "Lihat Hasil"}
              </AnimatedButton>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Result
  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />
      <Confetti show={pct >= 80} />
      <main className="flex-1 lg:ml-[260px] p-8 pb-24 lg:pb-0">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-[var(--duo-card)] rounded-[24px] border border-[var(--duo-border)] p-8">
            <div className="w-20 h-20 bg-[var(--primary-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-[var(--primary)]">{pct}%</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--duo-text)] mb-1">
              {pct >= 80 ? "Luar Biasa!" : pct >= 50 ? "Bagus!" : "Terus Belajar!"}
            </h2>
            <p className="text-sm text-[var(--duo-text-muted)] mb-6">{score}/{questions.length} soal benar</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-lg font-bold text-emerald-600">{score}</p>
                <p className="text-[10px] text-[var(--duo-text-muted)]">Benar</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-lg font-bold text-red-600">{questions.length - score}</p>
                <p className="text-[10px] text-[var(--duo-text-muted)]">Salah</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-[var(--primary)]">{score * 5}</p>
                <p className="text-[10px] text-[var(--duo-text-muted)]">XP</p>
              </div>
            </div>

            <div className="flex gap-3">
              <AnimatedButton onClick={() => setStep("config")} fullWidth variant="outline" size="lg" icon={<RotateCcw size={14} />}>
                Ulangi
              </AnimatedButton>
              <AnimatedButton onClick={() => window.location.href = "/"} fullWidth variant="primary" size="lg">
                Ke Beranda
              </AnimatedButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
