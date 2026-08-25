"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Confetti from "@/components/ui/Confetti";
import Hearts from "@/components/Hearts";
import { getAllQuizzes } from "@/lib/data";
import { saveQuizScore, addXp } from "@/lib/gamification";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import { CheckCircle2, XCircle, ChevronRight, Timer, Trophy, RotateCcw } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import type { QuizQuestion } from "@/lib/types";

export default function TryOutPage() {
  const [step, setStep] = useState<"start" | "quiz" | "result">("start");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 30);
  const [soundOn, setSoundOn] = useState(true);

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

  const startTryOut = useCallback(() => {
    const pool = [...getAllQuizzes()].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(pool);
    setCurrentQ(0);
    setScore(0);
    setLives(3);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(60 * 30);
    setStep("quiz");
  }, []);

  useEffect(() => {
    if (step !== "quiz") return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setStep("result"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowResult(true);
    const correct = !!shuffled && i === shuffled.correctIndex;
    setAnswers([...answers, correct]);
    if (correct) { setScore((s) => s + 1); if (soundOn) playCorrectSound(); }
    else { setLives((l) => { if (l <= 1) { setStep("result"); return 0; } return l - 1; }); if (soundOn) playWrongSound(); }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const pct = Math.round((score / questions.length) * 100);
      saveQuizScore("tryout-" + Date.now(), pct);
      addXp(pct >= 80 ? 100 : pct >= 50 ? 60 : 20);
      if (soundOn) playCompleteSound();
      setStep("result");
    }
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (step === "start") {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] p-8 pb-24 lg:pb-0">
          <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-bold text-[var(--duo-text)] mb-1">Try Out</h1>
            <p className="text-sm text-[var(--duo-text-muted)] mb-8">Simulasi ujian - 20 soal campur, 30 menit, 3 nyawa</p>

            <div className="bg-[var(--duo-card)] rounded-xl border border-[var(--duo-border)] p-6">
              <div className="space-y-3 mb-6">
                {[
                  { label: "Jumlah Soal", value: "20 soal" },
                  { label: "Batas Waktu", value: "30 menit" },
                  { label: "Nyawa", value: "3 (salah 3x selesai)" },
                  { label: "Skor", value: "Campur semua topik" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-[var(--duo-text-muted)]">{item.label}</span>
                    <span className="text-sm font-semibold text-[var(--duo-text)]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[var(--duo-text-muted)]">Suara</span>
                <button onClick={() => setSoundOn(!soundOn)}
                  className={`w-10 h-5 rounded-full transition-colors ${soundOn ? "bg-[var(--primary)]" : "bg-gray-300"} relative`}>
                  <div className={`w-4 h-4 bg-[var(--duo-card)] rounded-full absolute top-0.5 transition-all ${soundOn ? "left-5" : "left-0.5"}`} />
                </button>
              </div>

              <AnimatedButton onClick={startTryOut} fullWidth variant="primary" size="lg" icon={<Trophy size={16} />}>
                Mulai Try Out
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
        <main className="flex-1 ml-[260px] p-8 pb-24 lg:pb-0">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Hearts lives={lives} maxLives={3} />
              <div className="flex items-center gap-3">
                <span className={`text-sm font-mono font-semibold ${timeLeft < 300 ? "text-red-500" : "text-gray-600"}`}>
                  <Timer size={14} className="inline mr-1" />{formatTime(timeLeft)}
                </span>
                <span className="text-sm text-[var(--duo-text-muted)]">{currentQ + 1}/{questions.length}</span>
              </div>
            </div>

            <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <h3 className="text-lg font-semibold text-[var(--duo-text)] mb-6">{q.question}</h3>

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
      <Confetti show={pct >= 75} />
      <main className="flex-1 ml-[260px] p-8 pb-24 lg:pb-0">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-[var(--duo-card)] rounded-[24px] border border-[var(--duo-border)] p-8">
            <Trophy size={40} className={`mx-auto mb-4 ${pct >= 75 ? "text-yellow-500" : "text-gray-400"}`} />
            <h2 className="text-xl font-bold text-[var(--duo-text)] mb-1">Try Out Selesai!</h2>
            <p className="text-sm text-[var(--duo-text-muted)] mb-6">Skor akhir</p>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle cx="64" cy="64" r="56" fill="none"
                  stroke={pct >= 75 ? "#22c55e" : pct >= 50 ? "var(--primary)" : "#ef4444"}
                  strokeWidth="6" strokeDasharray={351.86} strokeDashoffset={351.86 - (pct / 100) * 351.86}
                  strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--duo-text)]">{pct}%</span>
                <span className="text-[10px] text-gray-400">{score}/{questions.length}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <AnimatedButton onClick={() => setStep("start")} fullWidth variant="outline" size="lg" icon={<RotateCcw size={14} />}>
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
