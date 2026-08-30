"use client";

import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import type { FormulaStep } from "@/lib/types";

interface Props {
  steps: FormulaStep[];
}

export default function StepByStep({ steps }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Calculator size={16} className="text-violet-500" />
        <span className="text-sm font-bold text-[var(--fg)]">Contoh Perhitungan</span>
      </div>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex gap-3"
        >
          <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-black text-violet-600 dark:text-violet-300">{i + 1}</span>
          </div>
          <div className="flex-1 pb-2 border-b border-[var(--border-subtle)]">
            <p className="text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">{step.label}</p>
            <p className="text-sm text-[var(--fg)] mt-0.5 font-mono">{step.detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
