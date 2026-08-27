"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, Sparkles, Lock } from "lucide-react";
import Link from "next/link";

interface HintButtonProps {
  hints: string[];
  hintTokens: number;
  onUseToken: () => void;
  /** Changing this value resets the hint state (e.g. question index) */
  resetKey?: string | number;
}

export default function HintButton({ hints, hintTokens, onUseToken, resetKey }: HintButtonProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [expanded, setExpanded] = useState(true);

  // Reset state when question changes
  useEffect(() => {
    setVisibleCount(0);
    setExpanded(true);
  }, [resetKey]);

  if (!hints || hints.length === 0) return null;

  const freeHints = 2;
  const hasTokens = hintTokens > 0;
  const canShowMore = visibleCount < hints.length;
  const needsToken = visibleCount >= freeHints;
  const locked = needsToken && !hasTokens;
  const noMoreHints = !canShowMore;

  function showNextHint() {
    if (!canShowMore || locked) return;
    if (needsToken && hasTokens) {
      onUseToken();
    }
    setVisibleCount((c) => c + 1);
  }

  return (
    <div className="space-y-2">
      {/* Main button */}
      <button
        onClick={showNextHint}
        disabled={noMoreHints || locked}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
          noMoreHints
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
            : locked
              ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
              : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:brightness-95"
        }`}
      >
        <Lightbulb size={16} className={visibleCount > 0 ? "fill-amber-400" : ""} />
        {visibleCount === 0
          ? `Butuh petunjuk? (${hints.length} tersedia)`
          : `Petunjuk ${visibleCount}/${hints.length}`}
        {hasTokens && (
          <span className="text-[10px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Sparkles size={8} /> {hintTokens}
          </span>
        )}
        {!noMoreHints && (
          <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        )}
      </button>

      {/* Token required CTA */}
      {locked && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
          <Lock size={12} className="text-amber-500 shrink-0" />
          <p className="text-[11px] text-amber-700 dark:text-amber-300 flex-1">
            Petunjuk berikutnya butuh <span className="font-black">1 Hint Token</span>
          </p>
          <Link
            href="/shop"
            className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-900 text-[10px] font-black transition-colors"
          >
            Beli di Toko
          </Link>
        </div>
      )}

      {/* Hint list */}
      <AnimatePresence mode="popLayout">
        {hints.slice(0, visibleCount).map((hint, i) => (
          <motion.div
            key={`${resetKey}-${i}`}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
                    i < freeHints ? "bg-green-400" : "bg-amber-400"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{hint}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
