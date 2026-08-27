"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

interface HintButtonProps {
  hints: string[];
  hintTokens: number;
  onUseToken: () => void;
}

export default function HintButton({ hints, hintTokens, onUseToken }: HintButtonProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!hints || hints.length === 0) return null;

  const freeHints = 2;
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

  const noMoreHints = !canShowMore;
  const locked = needsToken && !hasTokens;

  return (
    <div className="space-y-2">
      <button
        onClick={showNextHint}
        disabled={noMoreHints || locked}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
          noMoreHints
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
            : locked
              ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700"
              : "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 hover:brightness-95 cursor-pointer"
        }`}
      >
        <Lightbulb size={16} />
        {visibleCount === 0
          ? `Butuh petunjuk? (${hints.length} tersedia)`
          : `Petunjuk ${visibleCount}/${hints.length}`}
        {hasTokens && (
          <span className="text-[10px] bg-yellow-400 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Sparkles size={8} /> {hintTokens}
          </span>
        )}
        {canShowMore && <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />}
      </button>

      {locked && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
          <Sparkles size={12} className="text-yellow-500 shrink-0" />
          <p className="text-[11px] text-yellow-700 dark:text-yellow-300 flex-1">
            Butuh <span className="font-black">1 Hint Token</span> untuk petunjuk selanjutnya
          </p>
          <Link href="/shop" className="shrink-0 px-2.5 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-[10px] font-black transition-colors">
            Beli di Toko
          </Link>
        </div>
      )}

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
                <span className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
                  i < freeHints ? "bg-green-400" : "bg-yellow-400"
                }`}>
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
