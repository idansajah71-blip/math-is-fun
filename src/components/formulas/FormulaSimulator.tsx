"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, RotateCcw, MousePointerClick } from "lucide-react";
import type { FormulaMeta } from "@/lib/types";

interface Props {
  meta: FormulaMeta;
  onExampleClick?: (input: Record<string, number>) => void;
}

export default function FormulaSimulator({ meta, onExampleClick }: Props) {
  const initialValues = useMemo(() => {
    const vals: Record<string, number> = {};
    meta.variables.forEach((v) => { vals[v.name] = v.defaultValue; });
    return vals;
  }, [meta]);

  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [result, setResult] = useState<number>(() => meta.compute(initialValues));
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    try {
      const r = meta.compute(values);
      setResult(r);
      setAnimKey((k) => k + 1);
    } catch {
      setResult(NaN);
    }
  }, [values, meta]);

  const handleChange = (name: string, val: string) => {
    if (val === "" || val === "-") {
      setValues((prev) => ({ ...prev, [name]: 0 }));
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setValues((prev) => ({ ...prev, [name]: num }));
    }
  };

  const handleStep = (name: string, delta: number) => {
    setValues((prev) => {
      const cur = prev[name] ?? 0;
      const next = cur + delta;
      const v = meta.variables.find((vv) => vv.name === name);
      if (v) {
        if (v.min !== undefined && next < v.min) return prev;
        if (v.max !== undefined && next > v.max) return prev;
      }
      return { ...prev, [name]: next };
    });
  };

  const handleReset = () => setValues(initialValues);

  const handleExampleClick = (input: Record<string, number>) => {
    setValues(input);
    onExampleClick?.(input);
  };

  const resultFormatted = isNaN(result) ? "---" : meta.formatResult(result);

  const useGrid = meta.variables.length >= 2;

  return (
    <div className="space-y-5">
      {/* Input fields — 2-column grid when 2+ vars */}
      <div className={useGrid ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-3"}>
        {meta.variables.map((v, i) => (
          <motion.div
            key={v.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rumus-input-row flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
          >
            <label className="text-xs font-bold text-[var(--fg-muted)] w-20 shrink-0 leading-tight">{v.label}</label>
            <button
              onClick={() => handleStep(v.name, -(v.step || 1))}
              className="w-9 h-9 rounded-lg bg-[var(--surface-sunken)] hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center text-[var(--fg-muted)] hover:text-red-500 transition-colors shrink-0 active:scale-95"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={values[v.name] ?? v.defaultValue}
              onChange={(e) => handleChange(v.name, e.target.value)}
              min={v.min}
              max={v.max}
              step={v.step}
              className="rumus-lab-input w-20 px-2 py-2 rounded-lg bg-white dark:bg-[var(--surface)] border border-[var(--border)] text-lg font-mono font-bold text-center text-[var(--fg)] focus:outline-none focus:border-violet-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => handleStep(v.name, v.step || 1)}
              className="w-9 h-9 rounded-lg bg-[var(--surface-sunken)] hover:bg-emerald-100 dark:hover:bg-emerald-900/30 flex items-center justify-center text-[var(--fg-muted)] hover:text-emerald-500 transition-colors shrink-0 active:scale-95"
            >
              <Plus size={14} />
            </button>
            <span className="text-[9px] text-[var(--fg-disabled)] shrink-0 ml-auto">{v.min}–{v.max}</span>
          </motion.div>
        ))}
      </div>

      {/* Result */}
      <motion.div
        key={animKey}
        className="rumus-result-animate rumus-result-card p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 text-center"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-1">{meta.outputLabel}</p>
        <p className="text-4xl md:text-5xl font-black text-emerald-700 dark:text-emerald-300 leading-none">
          {resultFormatted}
        </p>
      </motion.div>

      {/* Reset + examples row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-sunken)] transition-colors"
        >
          <RotateCcw size={12} />
          Reset
        </button>

        {meta.examples.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <MousePointerClick size={12} className="text-[var(--fg-disabled)]" />
            {meta.examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(ex.input)}
                className="px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors active:scale-95"
              >
                {ex.formatted}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
