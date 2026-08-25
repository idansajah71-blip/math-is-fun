"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface SortingQuestionProps {
  items: string[];
  correctOrder: number[];
  label?: string;
  onCorrect: () => void;
  onWrong: () => void;
}

export default function SortingQuestion({
  items,
  correctOrder,
  label = "Susun dari yang terkecil ke terbesar",
  onCorrect,
  onWrong,
}: SortingQuestionProps) {
  const [order, setOrder] = useState<number[]>(items.map((_, i) => i));
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleMoveUp(pos: number) {
    if (answered || pos === 0) return;
    const newOrder = [...order];
    [newOrder[pos - 1], newOrder[pos]] = [newOrder[pos], newOrder[pos - 1]];
    setOrder(newOrder);
  }

  function handleMoveDown(pos: number) {
    if (answered || pos === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[pos], newOrder[pos + 1]] = [newOrder[pos + 1], newOrder[pos]];
    setOrder(newOrder);
  }

  function handleSubmit() {
    if (answered) return;
    setAnswered(true);
    const correct = order.every((item, idx) => item === correctOrder[idx]);
    setIsCorrect(correct);
    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }
  }

  function handleReset() {
    setOrder(items.map((_, i) => i));
    setAnswered(false);
    setIsCorrect(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-[var(--duo-text)] text-center">{label}</p>

      {/* Sortable list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {order.map((itemIndex, pos) => {
            const isCorrectPos = answered && itemIndex === correctOrder[pos];
            const isWrongPos = answered && itemIndex !== correctOrder[pos];

            return (
              <motion.div
                key={`${itemIndex}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 ${
                  isCorrectPos
                    ? "border-[var(--duo-green)] bg-[var(--duo-green-bg)]"
                    : isWrongPos
                    ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                    : "border-[var(--duo-border)] bg-[var(--duo-card)]"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                    isCorrectPos
                      ? "bg-[var(--duo-green)] text-white"
                      : isWrongPos
                      ? "bg-red-400 text-white"
                      : "bg-[var(--duo-border)] text-[var(--duo-text-muted)]"
                  }`}
                >
                  {pos + 1}
                </span>
                <span className="flex-1 text-sm font-bold text-[var(--duo-text)] font-mono">
                  {items[itemIndex]}
                </span>
                {!answered && (
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMoveUp(pos); }}
                      disabled={pos === 0}
                      className="w-9 h-9 rounded-lg bg-[var(--duo-border)] active:bg-[var(--primary)] active:text-white flex items-center justify-center text-[var(--duo-text-muted)] disabled:opacity-20 transition-colors"
                    >
                      <ChevronUp size={18} strokeWidth={3} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMoveDown(pos); }}
                      disabled={pos === order.length - 1}
                      className="w-9 h-9 rounded-lg bg-[var(--duo-border)] active:bg-[var(--primary)] active:text-white flex items-center justify-center text-[var(--duo-text-muted)] disabled:opacity-20 transition-colors"
                    >
                      <ChevronDown size={18} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
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
            <span>Urutan benar!</span>
          ) : (
            <span>Urutan yang benar: {correctOrder.map((i) => items[i]).join(" → ")}</span>
          )}
        </motion.div>
      )}

      {/* Actions */}
      {!answered ? (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all"
        >
          Cek Urutan
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
