"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sigma, PenLine, BookOpen, Check, Copy, ChevronDown, ArrowRight } from "lucide-react";
import katex from "katex";
import Link from "next/link";
import { normalizeAndRenderMarkdown } from "@/components/MathContent";

interface TopicContentProps {
  content: string;
  slug?: string;
}

interface ParsedSection {
  type: "konsep" | "rumusKunci" | "contoh" | "topikUtama";
  content: string;
}

type TabId = "konsep" | "rumusKunci" | "contoh" | "topikUtama";

const TABS: { id: TabId; label: string; icon: React.ReactNode; activeBg: string; activeText: string; ring: string }[] = [
  { id: "konsep", label: "Konsep", icon: <Lightbulb size={16} />, activeBg: "bg-blue-50 dark:bg-blue-950/50", activeText: "text-blue-700 dark:text-blue-300", ring: "ring-blue-200 dark:ring-blue-800" },
  { id: "topikUtama", label: "Topik", icon: <BookOpen size={16} />, activeBg: "bg-violet-50 dark:bg-violet-950/50", activeText: "text-violet-700 dark:text-violet-300", ring: "ring-violet-200 dark:ring-violet-800" },
  { id: "rumusKunci", label: "Rumus", icon: <Sigma size={16} />, activeBg: "bg-emerald-50 dark:bg-emerald-950/50", activeText: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-200 dark:ring-emerald-800" },
  { id: "contoh", label: "Contoh", icon: <PenLine size={16} />, activeBg: "bg-amber-50 dark:bg-amber-950/50", activeText: "text-amber-700 dark:text-amber-300", ring: "ring-amber-200 dark:ring-amber-800" },
];

/* ── Parse sections (handles decorated headers like "Rumus Kunci — xxx:") ── */

function parseSections(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const parts = content.split(/(\*\*(?:Konsep|Rumus Kunci[^*]*|Topik Utama|Contoh):?\*\*\s*)/);

  let currentType: TabId | null = null;

  for (const part of parts) {
    const markerMatch = part.match(/\*\*(Konsep|Rumus Kunci|Topik Utama|Contoh)[^*]*:\*\*\s*/);
    if (markerMatch) {
      const name = markerMatch[1];
      if (name === "Rumus Kunci") currentType = "rumusKunci";
      else if (name === "Topik Utama") currentType = "topikUtama";
      else currentType = name.toLowerCase() as TabId;
    } else if (part.trim() && currentType) {
      sections.push({ type: currentType, content: part.trim() });
    }
  }

  return sections;
}

/* ── Shared utilities ── */

const PROSE = `math-content prose prose-blue dark:prose-invert max-w-none
  prose-headings:scroll-mt-20
  prose-h2:text-lg prose-h2:font-black prose-h2:text-[var(--duo-text)] prose-h2:mt-6 prose-h2:mb-2
  prose-h3:text-base prose-h3:font-bold prose-h3:text-[var(--duo-text)] prose-h3:mt-5 prose-h3:mb-2
  prose-p:text-sm prose-p:text-[var(--duo-text-secondary)] prose-p:leading-relaxed prose-p:mb-2
  prose-li:text-sm prose-li:text-[var(--duo-text-secondary)]
  prose-strong:text-[var(--duo-text)] prose-strong:font-bold
  prose-code:text-[var(--info)] prose-code:bg-[var(--info-bg)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
  prose-blockquote:border-l-[var(--primary)] prose-blockquote:bg-[var(--primary-bg)]/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
  prose-hr:border-[var(--border-subtle)] prose-hr:my-4`;

function renderKaTeX(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("code.katex-inline").forEach((el) => {
    if (el.querySelector(".katex")) return;
    try {
      katex.render(el.textContent || "", el, { throwOnError: false, displayMode: false });
    } catch {
      el.classList.add("text-[var(--danger)]");
    }
  });
  container.querySelectorAll<HTMLElement>("div.katex-block").forEach((el) => {
    if (el.querySelector(".katex")) return;
    try {
      katex.render(el.getAttribute("data-formula") || "", el, { throwOnError: false, displayMode: true });
    } catch {
      const formula = el.getAttribute("data-formula") || "";
      el.innerHTML = `<code class="text-[var(--danger)] text-sm">${formula}</code>`;
    }
  });
}

function useKaTeXRef(deps: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) renderKaTeX(ref.current);
  }, [deps]);
  return ref;
}

/* ── Konsep Tab ─────────────────────────────────────────────────── */

function KonsepTab({ content }: { content: string }) {
  const ref = useKaTeXRef(content);
  const html = normalizeAndRenderMarkdown(content);

  return (
    <motion.div
      key="konsep"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
    >
      <div
        ref={ref}
        className={`${PROSE} border-l-4 border-blue-400 dark:border-blue-600 pl-5 py-1`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.div>
  );
}

/* ── Topik Utama Tab (Kuliah) ──────────────────────────────────── */

function TopikUtamaTab({ content }: { content: string }) {
  const ref = useKaTeXRef(content);
  const html = normalizeAndRenderMarkdown(content);

  return (
    <motion.div
      key="topikutama"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
    >
      <div
        ref={ref}
        className={`${PROSE} border-l-4 border-violet-400 dark:border-violet-600 pl-5 py-1`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.div>
  );
}

/* ── Rumus Tab — Expandable Cards ───────────────────────────────── */

interface FormulaItem {
  desc: string;
  formulas: string[];
}

function parseFormulaLines(content: string): FormulaItem[] {
  const lines = content.split("\n").filter((l) => l.trim());
  return lines.map((line) => {
    const clean = line.replace(/^-\s*/, "").trim();
    const formulaMatches = [...clean.matchAll(/\$([^$]+)\$/g)];
    const formulas = formulaMatches.map((m) => m[1]);
    let desc = clean;
    for (const m of formulaMatches) {
      desc = desc.replace(m[0], "");
    }
    desc = desc.replace(/[:：]\s*$/, "").replace(/,\s*$/, "").trim();
    return { desc, formulas };
  });
}

function RumusTab({ content, slug }: { content: string; slug?: string }) {
  const items = parseFormulaLines(content);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div
      key="rumus"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      {items.map((item, i) => (
        <FormulaCard
          key={i}
          item={item}
          index={i}
          isExpanded={expanded === i}
          onToggle={() => setExpanded(expanded === i ? null : i)}
        />
      ))}
      {slug && (
        <Link
          href={`/topic/${slug}`}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline mt-4 pt-3 border-t border-[var(--border)]"
        >
          Coba Latihan
          <ArrowRight size={14} />
        </Link>
      )}
    </motion.div>
  );
}

function FormulaCard({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: FormulaItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const detailRef = useKaTeXRef(isExpanded ? item.formulas.join(",") : "");
  const [copied, setCopied] = useState(false);

  const allFormulas = item.formulas.join(", ");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(allFormulas).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [allFormulas]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
      layout
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggle}
        className={`w-full text-left bg-white dark:bg-[var(--duo-card)] border-2 rounded-2xl p-4 transition-all ${
          isExpanded
            ? "border-emerald-400 dark:border-emerald-600 shadow-md"
            : "border-emerald-200/70 dark:border-emerald-800/70 hover:border-emerald-300 dark:hover:border-emerald-700"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {item.desc && (
              <p className="text-sm font-bold text-[var(--duo-text)] mb-1">{item.desc}</p>
            )}
            {!isExpanded && item.formulas.length > 0 && (
              <PreviewFormula formula={item.formulas[0]} />
            )}
            {item.formulas.length > 1 && !isExpanded && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                +{item.formulas.length - 1} rumus lainnya
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-1"
          >
            <ChevronDown size={16} className="text-[var(--duo-text-muted)]" />
          </motion.div>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 px-1 space-y-2">
              {item.formulas.map((f, fi) => (
                <ExpandedFormula key={fi} formula={f} index={fi} />
              ))}
              {item.formulas.length > 0 && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                  >
                    {copied ? <><Check size={10} /> Tersalin</> : <><Copy size={10} /> Salin Semua</>}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PreviewFormula({ formula }: { formula: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      try {
        katex.render(formula, ref.current, { throwOnError: false, displayMode: false });
      } catch {
        ref.current.textContent = formula;
      }
    }
  }, [formula]);
  return <div ref={ref} className="text-sm text-emerald-700 dark:text-emerald-300 overflow-x-auto" />;
}

function ExpandedFormula({ formula, index }: { formula: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      try {
        katex.render(formula, ref.current, { throwOnError: false, displayMode: true });
      } catch {
        ref.current.textContent = formula;
      }
    }
  }, [formula]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 overflow-x-auto"
    >
      <div ref={ref} className="text-center" />
    </motion.div>
  );
}

/* ── Contoh Tab — Sentence Accordion ────────────────────────────── */

function splitSentences(text: string): string[] {
  // Split by period followed by space or end, but keep the period with the sentence
  const raw = text.split(/(?<=\.)\s+/).filter((s) => s.trim());
  if (raw.length <= 1) {
    // Fallback: split by comma-separated math operations
    return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  }
  return raw;
}

function ContohTab({ content }: { content: string }) {
  const sentences = splitSentences(content);
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <motion.div
      key="contoh"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
      className="space-y-2"
    >
      {sentences.map((sentence, i) => (
        <ContohStep
          key={i}
          sentence={sentence}
          index={i}
          total={sentences.length}
          isExpanded={expanded === i}
          isLast={i === sentences.length - 1}
          onToggle={() => setExpanded(expanded === i ? null : i)}
        />
      ))}
    </motion.div>
  );
}

function ContohStep({
  sentence,
  index,
  total,
  isExpanded,
  isLast,
  onToggle,
}: {
  sentence: string;
  index: number;
  total: number;
  isExpanded: boolean;
  isLast: boolean;
  onToggle: () => void;
}) {
  const ref = useKaTeXRef(isExpanded ? sentence : "");

  // Truncated preview (first ~50 chars)
  const preview = sentence.length > 60 ? sentence.slice(0, 60) + "..." : sentence;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      layout
    >
      <button
        onClick={onToggle}
        className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
          isExpanded
            ? isLast
              ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
              : "bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700"
            : "bg-white dark:bg-[var(--duo-card)] border-amber-200/70 dark:border-amber-800/70 hover:border-amber-300 dark:hover:border-amber-700"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Step number */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              isLast
                ? "bg-emerald-500 text-white"
                : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
            }`}
          >
            {isLast ? <Check size={14} /> : index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Preview text — always visible */}
            <p className={`text-sm font-bold ${isExpanded ? "text-[var(--duo-text)]" : "text-[var(--duo-text-muted)]"} truncate`}>
              {isExpanded ? "Langkah " + (index + 1) : preview}
            </p>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div ref={ref} className={`${PROSE} mt-2 text-sm`} dangerouslySetInnerHTML={{ __html: normalizeAndRenderMarkdown(sentence) }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-1"
          >
            <ChevronDown size={14} className="text-[var(--duo-text-muted)]" />
          </motion.div>
        </div>
      </button>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

export default function TopicContent({ content, slug }: TopicContentProps) {
  const sections = parseSections(content);
  const availableTabs = TABS.filter((t) => sections.some((s) => s.type === t.id));

  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (availableTabs.length > 0) return availableTabs[0].id;
    return "konsep";
  });

  const activeSection = sections.find((s) => s.type === activeTab);

  if (availableTabs.length === 0) {
    return <FallbackContent content={content} />;
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-5 relative overflow-x-auto">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? `${tab.activeBg} ${tab.activeText} ring-1 ${tab.ring}`
                : "text-[var(--duo-text-muted)] hover:text-[var(--duo-text)] hover:bg-[var(--duo-card-alt)]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeSection && activeTab === "konsep" && (
          <KonsepTab key="konsep" content={activeSection.content} />
        )}
        {activeSection && activeTab === "topikUtama" && (
          <TopikUtamaTab key="topikutama" content={activeSection.content} />
        )}
        {activeSection && activeTab === "rumusKunci" && (
          <RumusTab key="rumus" content={activeSection.content} />
        )}
        {activeSection && activeTab === "contoh" && (
          <ContohTab key="contoh" content={activeSection.content} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Fallback (no section markers) ──────────────────────────────── */

function FallbackContent({ content }: { content: string }) {
  const ref = useKaTeXRef(content);
  const html = normalizeAndRenderMarkdown(content);

  return (
    <div
      ref={ref}
      className={PROSE}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
