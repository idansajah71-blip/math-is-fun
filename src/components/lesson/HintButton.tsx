"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown } from "lucide-react";

interface HintButtonProps {
  hints: string[];
  hintTokens: number;
  onUseToken: () => void;
}

export default function HintButton({ hints, hintTokens, onUseToken }: HintButtonProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!hints || hints.length === 0) return null;

  const freeHints = 1;
  const hasTokens = hintTokens > 0;
  const canShowMore = visibleCount < hints.length;
  const needsToken = visibleCount >= freeHints;

  function showNextHint() {
    if (!canShowMore) return;
    if (needsToken && !hasTokens) return;
    if (needsToken && hasTokens) {
      onUseToken();
    }
    setVisibleCount((c) => c + 1);
    setExpanded(true);
  }

  const disabled = !canShowMore || (needsToken && !hasTokens);

  return (
    <div className="space-y-2">
      <button
        onClick={showNextHint}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
          disabled
            ? "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)] cursor-not-allowed opacity-50"
            : "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 hover:brightness-95"
        }`}
      >
        <Lightbulb size={16} />
        {visibleCount === 0
          ? `Butuh petunjuk? (${hints.length} tersedia)`
          : `Petunjuk ${visibleCount}/${hints.length}`}
        {hasTokens && <span className="text-[10px] bg-yellow-400 text-white px-1.5 py-0.5 rounded-full">{hintTokens}</span>}
        {canShowMore && <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />}
      </button>

      <AnimatePresence>
        {hints.slice(0, visibleCount).map((hint, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">{hint}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
