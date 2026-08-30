"use client";

import { useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Trophy } from "lucide-react";
import KaTeX from "@/components/ui/KaTeX";
import { getFormulaMeta } from "@/lib/formulaRegistry";
import FormulaVisual from "./FormulaVisual";
import FormulaSimulator from "./FormulaSimulator";
import StepByStep from "./StepByStep";
import FormulaPractice from "./FormulaPractice";
import type { FormulaMeta } from "@/lib/types";

interface Props {
  formula: string;
  desc: string;
}

/* ── Rich text renderer: splits text on $...$ and renders KaTeX inline ── */
function RichText({ text, className = "" }: { text: string; className?: string }) {
  const parts: ReactNode[] = [];
  const regex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`t${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(<span key={`k${match.index}`} className="inline-block mx-0.5 align-middle"><KaTeX formula={match[1]} /></span>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`t${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <span className={className}>{parts}</span>;
}

export default function FormulaDetailCard({ formula, desc }: Props) {
  const meta: FormulaMeta | undefined = getFormulaMeta(formula);
  const [values, setValues] = useState<Record<string, number>>(() => {
    if (!meta) return {};
    const v: Record<string, number> = {};
    meta.variables.forEach((vv) => { v[vv.name] = vv.defaultValue; });
    return v;
  });

  const steps = useMemo(() => {
    if (!meta?.stepByStep) return null;
    return meta.stepByStep(values);
  }, [meta, values]);

  const hasVisual = meta?.visual;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* ── Formula Hero + Visual ── */}
      <div className="flex gap-5 items-stretch">
        {/* Formula */}
        <div className="flex-1 py-8 px-6 bg-gradient-to-br from-emerald-50 via-white to-violet-50 dark:from-emerald-950/30 dark:via-[var(--surface)] dark:to-violet-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 text-center">
          <KaTeX formula={formula} displayMode />
        </div>

        {/* Visual diagram */}
        {hasVisual && meta && (
          <div className="w-[220px] shrink-0 py-6 px-4 bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] flex items-center justify-center">
            <FormulaVisual visual={meta.visual!} values={values} />
          </div>
        )}
      </div>

      {/* ── Description ── */}
      <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-[var(--fg)]">Penjelasan</span>
        </div>
        <p className="text-sm text-[var(--fg)] leading-relaxed">
          <RichText text={meta?.description || desc || "Rumus ini merupakan salah satu rumus penting dalam matematika yang perlu dipahami."} />
        </p>
      </div>

      {/* ── Step-by-step worked example ── */}
      {steps && (
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5">
          <StepByStep steps={steps} />
        </div>
      )}

      {/* ── Calculator ── */}
      {meta && (
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={16} className="text-violet-500" />
            <span className="text-sm font-bold text-[var(--fg)]">Kalkulator Interaktif</span>
          </div>
          <FormulaSimulator meta={meta} onExampleClick={setValues} />
        </div>
      )}

      {/* ── Practice ── */}
      {meta && meta.practice.length > 0 && (
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-amber-500" />
            <span className="text-sm font-bold text-[var(--fg)]">Uji Pemahaman</span>
            <span className="text-xs text-[var(--fg-muted)] ml-1">{meta.practice.length} soal</span>
          </div>
          <FormulaPractice practices={meta.practice} />
        </div>
      )}
    </motion.div>
  );
}
