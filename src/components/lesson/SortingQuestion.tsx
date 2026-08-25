"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, ArrowUpDown } from "lucide-react";

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
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [swapFromIdx, setSwapFromIdx] = useState<number | null>(null);

  function handleItemClick(pos: number) {
    if (answered) return;

    if (swapFromIdx === null) {
      setSwapFromIdx(pos);
      setSelectedIdx(pos);
    } else if (swapFromIdx === pos) {
      setSwapFromIdx(null);
      setSelectedIdx(null);
    } else {
      const newOrder = [...order];
      const temp = newOrder[swapFromIdx];
      newOrder[swapFromIdx] = newOrder[pos];
      newOrder[pos] = temp;
      setOrder(newOrder);
      setSwapFromIdx(null);
      setSelectedIdx(null);
    }
  }

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
    setSelectedIdx(null);
    setSwapFromIdx(null);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-[var(--duo-text)] text-center">{label}</p>

      {!answered && swapFromIdx !== null && (
        <p className="text-xs text-center text-[var(--primary)] font-bold animate-pulse">
          Tap item lain untuk tukar posisi
        </p>
      )}

      {/* Sortable list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {order.map((itemIndex, pos) => {
            const isCorrectPos = answered && itemIndex === correctOrder[pos];
            const isWrongPos = answered && itemIndex !== correctOrder[pos];
            const isSelected = swapFromIdx === pos;

            return (
              <motion.div
                key={`${itemIndex}-${pos}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => handleItemClick(pos)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all select-none ${
                  !answered
                    ? isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-md ring-2 ring-[var(--primary)]/30 cursor-pointer"
                      : "border-[var(--duo-border)] bg-[var(--duo-card)] hover:border-[var(--duo-green)]/40 cursor-pointer active:scale-[0.98]"
                    : isCorrectPos
                    ? "border-[var(--duo-green)] bg-[var(--duo-green-bg)]"
                    : isWrongPos
                    ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                    : "border-[var(--duo-border)] bg-[var(--duo-card)]"
                }`}
              >
                <GripVertical size={16} className="text-[var(--duo-text-muted)] shrink-0" />
                <span
                  className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
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
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveUp(pos); }}
                      disabled={pos === 0}
                      className="w-7 h-7 rounded-lg bg-[var(--duo-border)] hover:bg-[var(--primary)] hover:text-white flex items-center justify-center text-[var(--duo-text-muted)] disabled:opacity-30 disabled:hover:bg-[var(--duo-border)] disabled:hover:text-[var(--duo-text-muted)] transition-colors text-xs font-bold"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveDown(pos); }}
                      disabled={pos === order.length - 1}
                      className="w-7 h-7 rounded-lg bg-[var(--duo-border)] hover:bg-[var(--primary)] hover:text-white flex items-center justify-center text-[var(--duo-text-muted)] disabled:opacity-30 disabled:hover:bg-[var(--duo-border)] disabled:hover:text-[var(--duo-text-muted)] transition-colors text-xs font-bold"
                    >
                      ↓
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
