"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";

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
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  function handleDragStart(index: number) {
    dragItem.current = index;
  }

  function handleDragEnter(index: number) {
    dragOverItem.current = index;
  }

  function handleDragEnd() {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newOrder = [...order];
    const draggedItem = newOrder.splice(dragItem.current, 1)[0];
    newOrder.splice(dragOverItem.current, 0, draggedItem);

    setOrder(newOrder);
    dragItem.current = null;
    dragOverItem.current = null;
  }

  function handleSubmit() {
    if (answered) return;
    setAnswered(true);

    // Check if current order matches correct order
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
        {order.map((itemIndex, pos) => {
          const isCorrectPos = answered && itemIndex === correctOrder[pos];
          const isWrongPos = answered && itemIndex !== correctOrder[pos];

          return (
            <motion.div
              key={itemIndex}
              layout
              draggable={!answered}
              onDragStart={() => handleDragStart(pos)}
              onDragEnter={() => handleDragEnter(pos)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-colors ${
                isCorrectPos
                  ? "border-[var(--duo-green)] bg-[var(--duo-green-bg)]"
                  : isWrongPos
                  ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                  : "border-[var(--duo-border)] bg-[var(--duo-card)] hover:border-[var(--duo-green)]/40"
              }`}
            >
              <GripVertical size={16} className="text-[var(--duo-text-muted)] shrink-0" />
              <span className="w-6 h-6 rounded-full bg-[var(--duo-border)] text-[var(--duo-text-muted)] text-xs font-black flex items-center justify-center shrink-0">
                {pos + 1}
              </span>
              <span className="text-sm font-bold text-[var(--duo-text)] font-mono">
                {items[itemIndex]}
              </span>
            </motion.div>
          );
        })}
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
            <span>Urutan benar! 🎯</span>
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
