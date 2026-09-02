"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, CheckCircle2, XCircle } from "lucide-react";

interface MatchingPair {
  left: string;
  right: string;
}

interface MatchingQuestionProps {
  pairs: MatchingPair[];
  label?: string;
  onCorrect: () => void;
  onWrong: () => void;
}

export default function MatchingQuestion({
  pairs,
  label = "Pasangkan yang sesuai",
  onCorrect,
  onWrong,
}: MatchingQuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Shuffle right-side items once
  const [shuffledRight] = useState(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  function handleLeftClick(idx: number) {
    if (answered || Object.values(matches).includes(idx)) return;
    setSelectedLeft(idx);
  }

  function handleRightClick(rightIdx: number) {
    if (answered || selectedLeft === null) return;
    const newMatches = { ...matches, [selectedLeft]: rightIdx };
    setMatches(newMatches);
    setSelectedLeft(null);
  }

  function handleSubmit() {
    if (answered) return;
    setAnswered(true);
    const correct = pairs.every((_, i) => matches[i] === i);
    setIsCorrect(correct);
    if (correct) onCorrect();
    else onWrong();
  }

  function handleReset() {
    setMatches({});
    setSelectedLeft(null);
    setAnswered(false);
    setIsCorrect(false);
  }

  const allMatched = Object.keys(matches).length === pairs.length;

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-[var(--duo-text)] text-center">{label}</p>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
        {/* Left column */}
        <div className="space-y-2">
          {pairs.map((pair, i) => {
            const matchIdx = matches[i];
            const isMatched = matchIdx !== undefined;
            const isMatchCorrect = answered && isMatched && matchIdx === i;
            const isMatchWrong = answered && isMatched && matchIdx !== i;
            const isSelected = selectedLeft === i;

            return (
              <motion.button
                key={`left-${i}`}
                type="button"
                onClick={() => handleLeftClick(i)}
                disabled={answered || isMatched}
                whileHover={!answered && !isMatched ? { scale: 1.03 } : {}}
                whileTap={!answered && !isMatched ? { scale: 0.97 } : {}}
                className={`w-full p-3 rounded-xl border-2 text-left text-sm font-bold transition-all ${
                  isMatchCorrect
                    ? "border-[var(--duo-green)] bg-[var(--duo-green-bg)]"
                    : isMatchWrong
                    ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                    : isSelected
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/30"
                    : isMatched
                    ? "border-[var(--duo-border)] bg-[var(--duo-card)] opacity-60"
                    : "border-[var(--duo-border)] bg-[var(--duo-card)] hover:border-[var(--primary)]/50"
                }`}
              >
                <span className="text-[var(--duo-text)]">{pair.left}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Connection lines */}
        <div className="flex flex-col justify-center items-center h-full py-2">
          {pairs.map((_, i) => (
            <div key={`line-${i}`} className="h-12 flex items-center">
              <Link2 size={14} className="text-[var(--duo-border)]" />
            </div>
          ))}
        </div>

        {/* Right column (shuffled) */}
        <div className="space-y-2">
          {shuffledRight.map((origIdx, displayIdx) => {
            const matchedBy = Object.entries(matches).find(([_, r]) => r === origIdx);
            const isMatched = matchedBy !== undefined;
            const isMatchCorrect = answered && isMatched && Number(matchedBy[0]) === origIdx;
            const isMatchWrong = answered && isMatched && Number(matchedBy[0]) !== origIdx;

            return (
              <motion.button
                key={`right-${origIdx}`}
                type="button"
                onClick={() => handleRightClick(origIdx)}
                disabled={answered || isMatched || selectedLeft === null}
                whileHover={!answered && !isMatched && selectedLeft !== null ? { scale: 1.03 } : {}}
                whileTap={!answered && !isMatched && selectedLeft !== null ? { scale: 0.97 } : {}}
                className={`w-full p-3 rounded-xl border-2 text-right text-sm font-bold transition-all ${
                  isMatchCorrect
                    ? "border-[var(--duo-green)] bg-[var(--duo-green-bg)]"
                    : isMatchWrong
                    ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                    : isMatched
                    ? "border-[var(--duo-border)] bg-[var(--duo-card)] opacity-60"
                    : selectedLeft !== null
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 hover:border-[var(--primary)] cursor-pointer"
                    : "border-[var(--duo-border)] bg-[var(--duo-card)]"
                }`}
              >
                <span className="text-[var(--duo-text)]">{pairs[origIdx].right}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-center text-sm font-bold ${
            isCorrect
              ? "bg-[var(--duo-green-bg)] text-[var(--duo-green)] border-2 border-[var(--duo-green)]/30"
              : "bg-red-50 dark:bg-red-950/30 text-red-500 border-2 border-red-300 dark:border-red-700"
          }`}
        >
          {isCorrect ? (
            <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Semua pasangan benar!</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <XCircle size={16} /> Jawaban benar: {pairs.map((p) => `${p.left} → ${p.right}`).join(", ")}
            </span>
          )}
        </motion.div>
      )}

      {/* Actions */}
      {!answered ? (
        <button
          onClick={handleSubmit}
          disabled={!allMatched}
          className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {allMatched ? "Cek Jawaban" : `Pilih pasangan (${Object.keys(matches).length}/${pairs.length})`}
        </button>
      ) : (
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl border-2 border-[var(--duo-green)] text-[var(--duo-green)] font-bold hover:bg-[var(--duo-green-bg)] transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
