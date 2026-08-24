"use client";

import { useState, useEffect } from "react";
import { quizzes } from "@/lib/quizzes";
import { saveQuizScore } from "@/lib/gamification";
import XpPopup from "./XpPopup";
import { CheckCircle2, XCircle, ChevronRight, Trophy } from "lucide-react";
import AnimatedButton from "./ui/AnimatedButton";

export default function QuizModal({ topicSlug, isOpen, onClose }: {
  topicSlug: string; isOpen: boolean; onClose: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showXp, setShowXp] = useState(false);
  const [shaking, setShaking] = useState(false);

  const topicQuizzes = quizzes.filter((q) => q.topicSlug === topicSlug);

  useEffect(() => {
    if (isOpen) { setCurrentQ(0); setSelected(null); setShowResult(false); setScore(0); setAnswers([]); setFinished(false); }
  }, [isOpen, topicSlug]);

  if (!isOpen || topicQuizzes.length === 0) return null;

  const q = topicQuizzes[currentQ];
  const total = topicQuizzes.length;
  const progress = ((currentQ + 1) / total) * 100;

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowResult(true);
    const correct = i === q.correctIndex;
    setAnswers([...answers, correct]);
    if (correct) setScore((s) => s + 1);
    else { setShaking(true); setTimeout(() => setShaking(false), 500); }
  };

  const handleNext = () => {
    if (currentQ < total - 1) { setCurrentQ((c) => c + 1); setSelected(null); setShowResult(false); }
    else {
      const pct = Math.round((score / total) * 100);
      saveQuizScore(topicSlug, pct);
      setShowXp(true);
      setTimeout(() => setFinished(true), 100);
    }
  };

  const isCorrect = selected === q.correctIndex;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <XpPopup amount={pct >= 80 ? 50 : pct >= 50 ? 30 : 10} show={showXp} />

      <div className={`relative bg-[var(--surface)] rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden ${shaking ? "animate-[shake_0.4s]" : ""}`}>
        {!finished ? (
          <>
            <div className="h-1.5 bg-[var(--surface-elevated)]">
              <div className="h-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="p-6">
              <p className="text-xs text-[var(--fg-muted)] mb-3">Soal {currentQ + 1} dari {total}</p>
              <h3 className="text-[15px] font-semibold text-[var(--fg)] mb-6 leading-relaxed">{q.question}</h3>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  let style = "border-2 border-gray-200 bg-white hover:border-[var(--primary)]/40";
                  if (showResult) {
                    if (i === q.correctIndex) style = "border-2 border-emerald-500 bg-emerald-50";
                    else if (i === selected) style = "border-2 border-red-500 bg-red-50";
                    else style = "border-2 border-gray-200 opacity-40";
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                      className={`w-full p-3 text-left rounded-lg transition-all text-sm font-medium ${style}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          showResult && i === q.correctIndex ? "bg-emerald-500 text-white" :
                          showResult && i === selected ? "bg-red-500 text-white" :
                          "bg-[var(--surface-elevated)] text-[var(--fg-muted)]"
                        }`}>{String.fromCharCode(65 + i)}</span>
                        <span className="text-[var(--fg)]">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
                  isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
                }`}>
                  {isCorrect ? <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" /> : <XCircle size={16} className="text-red-600 mt-0.5" />}
                  <div>
                    <p className={`text-xs font-semibold ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                      {isCorrect ? "Benar" : "Salah"}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>

            {selected !== null && (
              <div className="px-6 pb-6">
                <AnimatedButton onClick={handleNext} fullWidth variant="primary" size="lg"
                  icon={currentQ < total - 1 ? <ChevronRight size={16} /> : undefined}>
                  {currentQ < total - 1 ? "Selanjutnya" : "Lihat Hasil"}
                </AnimatedButton>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[var(--primary-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy size={28} className="text-[var(--primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--fg)] mb-1">
              {pct >= 80 ? "Luar Biasa!" : pct >= 50 ? "Bagus!" : "Terus Belajar!"}
            </h3>
            <p className="text-xs text-[var(--fg-muted)] mb-6">Skor quiz kamu</p>

            <div className="relative w-28 h-28 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle cx="56" cy="56" r="48" fill="none" stroke={pct >= 80 ? "#22c55e" : pct >= 50 ? "var(--primary)" : "#ef4444"}
                  strokeWidth="6" strokeDasharray={301.6} strokeDashoffset={301.6 - (pct / 100) * 301.6}
                  strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--fg)]">{pct}%</span>
                <span className="text-[10px] text-[var(--fg-muted)]">{score}/{total}</span>
              </div>
            </div>

            <AnimatedButton onClick={onClose} fullWidth variant="primary" size="lg">
              Selesai
            </AnimatedButton>
          </div>
        )}
      </div>

      <style jsx>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`}</style>
    </div>
  );
}
