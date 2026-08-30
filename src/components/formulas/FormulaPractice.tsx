"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Target, Zap } from "lucide-react";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import type { FormulaPractice as PracticeType } from "@/lib/types";

interface Props {
  practices: PracticeType[];
}

export default function FormulaPractice({ practices }: Props) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = practices[current];
  const progress = ((current + (showResult ? 1 : 0)) / practices.length) * 100;

  const shuffled = useMemo(() => {
    if (!q) return { options: [], correctIndex: 0 };
    const idx = q.options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return {
      options: idx.map((i) => q.options[i]),
      correctIndex: idx.indexOf(0),
    };
  }, [current, q]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowResult(true);

    if (i === shuffled.correctIndex) {
      playCorrectSound();
      setScore((s) => s + 1);
    } else {
      setShaking(true);
      playWrongSound();
      setTimeout(() => setShaking(false), 400);
    }
  };

  const handleNext = () => {
    if (current + 1 >= practices.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setShowResult(false);
  };

  /* ── Finished screen ── */
  if (finished) {
    const pct = Math.round((score / practices.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rumus-lab-bg rounded-2xl border border-[var(--border)] overflow-hidden"
      >
        <div className="px-5 py-3 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border-b border-[var(--border)] flex items-center gap-2">
          <Target size={16} className="text-amber-600" />
          <span className="text-sm font-black text-[var(--fg)]">Hasil Tantangan</span>
        </div>
        <div className="p-8 text-center space-y-5">
          {/* Score circle */}
          <div className="relative w-36 h-36 mx-auto">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="7" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${pct * 2.64} ${264 - pct * 2.64}`}
                initial={{ strokeDasharray: "0 264" }}
                animate={{ strokeDasharray: `${pct * 2.64} ${264 - pct * 2.64}` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${pct >= 80 ? "text-emerald-500" : pct >= 50 ? "text-amber-500" : "text-red-500"}`}>
                {pct}%
              </span>
            </div>
          </div>

          <div>
            <p className="text-xl font-black text-[var(--fg)]">{score}/{practices.length} Benar</p>
            <p className="text-sm text-[var(--fg-muted)] mt-1">
              {pct >= 80 ? "Kamu sudah menguasai rumus ini! 🎉" : pct >= 50 ? "Hampir bisa, coba sekali lagi!" : "Terus berlatih, kamu pasti bisa!"}
            </p>
          </div>

          <button
            onClick={() => { setCurrent(0); setScore(0); setSelected(null); setShowResult(false); setFinished(false); }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors"
          >
            <Zap size={14} />
            Coba Lagi
          </button>
        </div>
      </motion.div>
    );
  }

  if (!q) return null;

  /* ── Active question ── */
  return (
    <div className={`rumus-lab-bg rounded-2xl border border-[var(--border)] overflow-hidden ${shaking ? "animate-shake" : ""}`}>
      {/* Header with progress */}
      <div className="px-5 py-3 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-amber-600" />
            <span className="text-sm font-black text-[var(--fg)]">Tantangan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600">{score} benar</span>
            <span className="text-xs text-[var(--fg-muted)]">·</span>
            <span className="text-xs font-bold text-[var(--fg-muted)]">Soal {current + 1}/{practices.length}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Question */}
        <p className="text-base font-semibold text-[var(--fg)] leading-relaxed">{q.question}</p>

        {/* Options */}
        <div className="space-y-2.5">
          {shuffled.options.map((opt, i) => {
            const isCorrect = i === shuffled.correctIndex;
            const isSelected = i === selected;
            let style = "border-[var(--border)] hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20";
            if (showResult) {
              if (isCorrect) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20";
              else if (isSelected) style = "border-red-500 bg-red-50 dark:bg-red-950/30";
              else style = "border-[var(--border)] opacity-40";
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.01 } : {}}
                whileTap={!showResult ? { scale: 0.99 } : {}}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm transition-all ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    showResult && isCorrect ? "bg-emerald-500 text-white" :
                    showResult && isSelected ? "bg-red-500 text-white" :
                    "bg-[var(--surface-sunken)] text-[var(--fg-muted)]"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-[var(--fg)]">{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 size={18} className="ml-auto text-emerald-500" />}
                  {showResult && isSelected && !isCorrect && <XCircle size={18} className="ml-auto text-red-500" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-800/40">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">💡</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">Penjelasan</p>
                    <p className="text-sm text-[var(--fg)] leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        {showResult && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors"
          >
            {current + 1 >= practices.length ? "Lihat Hasil" : "Soal Berikutnya"}
            <ChevronRight size={16} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
