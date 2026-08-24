"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

export interface MistakeItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface MistakeReviewProps {
  mistakes: MistakeItem[];
  onRetry?: () => void;
  onDone?: () => void;
}

export default function MistakeReview({ mistakes, onRetry, onDone }: MistakeReviewProps) {
  if (mistakes.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
          <XCircle size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-black text-[var(--duo-text)]">
          {mistakes.length} Soal Perlu Diperbaiki
        </h3>
        <p className="text-sm text-[var(--duo-text-muted)] mt-1">
          Review jawaban kamu dan pelajari dari kesalahan
        </p>
      </div>

      <div className="space-y-3">
        {mistakes.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border border-[var(--duo-border)] overflow-hidden"
          >
            {/* Question */}
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-start gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[var(--duo-border)] text-[var(--duo-text-muted)] text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm font-bold text-[var(--duo-text)]">
                  {m.question}
                </p>
              </div>

              {/* Answers */}
              <div className="ml-8 space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <XCircle size={14} className="text-red-400 shrink-0" />
                  <span className="text-red-500 font-bold">{m.userAnswer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-[var(--duo-green)] shrink-0" />
                  <span className="text-[var(--duo-green)] font-bold">{m.correctAnswer}</span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="px-5 py-3 bg-purple-50 dark:bg-purple-950/20 border-t border-[var(--duo-border)]">
              <p className="text-xs text-purple-600 dark:text-purple-300 leading-relaxed">
                <span className="font-black">Penjelasan: </span>
                {m.explanation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[var(--duo-green)] text-[var(--duo-green)] font-bold text-sm hover:bg-[var(--duo-green-bg)] transition-colors"
          >
            <RotateCcw size={16} />
            Coba Lagi
          </button>
        )}
        {onDone && (
          <button
            onClick={onDone}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold text-sm shadow-[0_3px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Selesai
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
