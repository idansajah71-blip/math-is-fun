"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { getAllTopics } from "@/lib/data";
import { Search, ChevronLeft, X, ArrowRight } from "lucide-react";
import KaTeX from "@/components/ui/KaTeX";
import FormulaDetailCard from "@/components/formulas/FormulaDetailCard";

/* ── Helpers ── */

function extractFormulas(content: string): { desc: string; formula: string }[] {
  const items: { desc: string; formula: string }[] = [];
  const seen = new Set<string>();

  const rumusMatch = content.split(/\*\*(?:Konsep|Rumus Kunci[^*]*|Topik Utama|Contoh):?\*\*/i);
  const rumusSection = rumusMatch.length > 2 ? rumusMatch[2] || "" : content;

  const lines = rumusSection.split("\n");
  for (const line of lines) {
    const clean = line.replace(/^-\s*/, "").trim();
    if (!clean) continue;

    const formulaMatches = [...clean.matchAll(/\$([^$]+)\$/g)];
    for (const m of formulaMatches) {
      const formula = m[1];
      if (seen.has(formula)) continue;
      seen.add(formula);

      let desc = clean;
      for (const fm of formulaMatches) {
        desc = desc.replace(fm[0], "");
      }
      desc = desc.replace(/[:：]\s*$/, "").replace(/,\s*$/, "").trim();

      items.push({ desc, formula });
    }
  }

  for (let i = 1; i < rumusMatch.length; i += 2) {
    const section = rumusMatch[i + 1] || "";
    const matches = [...section.matchAll(/\$([^$]+)\$/g)];
    for (const m of matches) {
      if (!seen.has(m[1])) {
        seen.add(m[1]);
        items.push({ desc: "", formula: m[1] });
      }
    }
  }

  return items;
}

function getLevelColor(level: string) {
  if (level === "smp") return { bg: "bg-emerald-500", light: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" };
  if (level === "sma") return { bg: "bg-blue-500", light: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" };
  return { bg: "bg-violet-500", light: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800" };
}

/* ── Page ── */

export default function FormulasPage() {
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<"all" | "smp" | "sma" | "kuliah">("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
  const topics = getAllTopics();

  const filtered = topics.filter((t) => {
    if (activeLevel !== "all" && t.level !== activeLevel) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);
  const topicFormulas = selectedTopic ? extractFormulas(selectedTopic.content) : [];

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setSelectedFormula(null);
  };

  const handleSelectFormula = (formula: string) => {
    setSelectedFormula((prev) => (prev === formula ? null : formula));
  };

  const handleBackToTopics = () => {
    setSelectedTopicId(null);
    setSelectedFormula(null);
  };

  const handleBackToFormulas = () => {
    setSelectedFormula(null);
  };

  /* ── Determine current view state ── */
  const viewState = selectedFormula ? "formula" : selectedTopicId ? "formulas" : "topics";

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen">
      {/* ══════ Top Bar ══════ */}
      <header className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            {viewState === "formula" ? (
              <button
                onClick={handleBackToFormulas}
                className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--primary)] transition-all shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
            ) : viewState === "formulas" ? (
              <button
                onClick={handleBackToTopics}
                className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--primary)] transition-all shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
            ) : null}
            <div className="min-w-0">
              <h1 className="text-lg font-black text-[var(--fg)] leading-tight truncate">
                {viewState === "formula"
                  ? "Rumus"
                  : viewState === "formulas"
                  ? selectedTopic?.title || "Rumus"
                  : "Rumus Lab"}
              </h1>
              <p className="text-xs text-[var(--fg-muted)] truncate">
                {viewState === "formula"
                  ? selectedTopic?.title
                  : viewState === "formulas"
                  ? `${topicFormulas.length} rumus tersedia`
                  : "Pilih topik untuk mulai belajar"}
              </p>
            </div>
          </div>

          {/* Right: search */}
          {viewState === "topics" && (
            <div className="relative w-72 shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-disabled)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari topik rumus..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
              />
            </div>
          )}
        </div>

        {/* ══════ Filter pills ══════ */}
        {viewState === "topics" && (
          <div className="max-w-[1400px] mx-auto px-6 pb-4 flex gap-2">
            {(["all", "smp", "sma", "kuliah"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setActiveLevel(l)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeLevel === l
                    ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                    : "bg-[var(--surface)] text-[var(--fg-muted)] border border-[var(--border)] hover:bg-[var(--surface-sunken)]"
                }`}
              >
                {l === "all" ? "Semua" : l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ══════ Content Area ══════ */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* ── State 1: Topic Browser ── */}
          {viewState === "topics" && (
            <motion.div
              key="topics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm text-[var(--fg-muted)]">Tidak ada topik ditemukan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((topic, i) => {
                    const formulas = extractFormulas(topic.content);
                    if (formulas.length === 0) return null;
                    const lc = getLevelColor(topic.level);

                    return (
                      <motion.button
                        key={topic.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                        onClick={() => handleSelectTopic(topic.id)}
                        className="group text-left rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all overflow-hidden"
                      >
                        {/* KaTeX preview */}
                        <div className="h-24 flex items-center justify-center px-4 py-3 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-sunken)] border-b border-[var(--border-subtle)]">
                          <KaTeX formula={formulas[0].formula} className="text-base text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors" />
                        </div>

                        {/* Info */}
                        <div className="px-4 py-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${lc.light} ${lc.text} ${lc.border} border`}>
                              {topic.level}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-[var(--fg)] leading-tight line-clamp-2 mb-1.5 group-hover:text-[var(--primary)] transition-colors">
                            {topic.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[var(--fg-muted)]">{formulas.length} rumus</span>
                            <ArrowRight size={14} className="text-[var(--fg-disabled)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── State 2: Formula Grid (topic selected) ── */}
          {viewState === "formulas" && (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2 ${getLevelColor(selectedTopic?.level || "smp").light} ${getLevelColor(selectedTopic?.level || "smp").text} ${getLevelColor(selectedTopic?.level || "smp").border} border`}>
                  {selectedTopic?.level}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topicFormulas.map((f, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.04, 0.3) }}
                    onClick={() => handleSelectFormula(f.formula)}
                    className="group text-left p-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <KaTeX formula={f.formula} className="text-base" />
                      <ArrowRight size={14} className="text-[var(--fg-disabled)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                    </div>
                    {f.desc && (
                      <p className="text-xs text-[var(--fg-muted)] line-clamp-2 leading-relaxed">{f.desc}</p>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── State 3: Formula Workspace (full width) ── */}
          {viewState === "formula" && (
            <motion.div
              key={selectedFormula}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto"
            >
              <FormulaDetailCard
                formula={selectedFormula!}
                desc={topicFormulas.find((f) => f.formula === selectedFormula)?.desc ?? ""}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </main>
    </div>
  );
}
