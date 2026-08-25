"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getAllTopics } from "@/lib/data";
import { Copy, Check, Search } from "lucide-react";

export default function FormulasPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<"all" | "smp" | "sma" | "kuliah">("all");
  const topics = getAllTopics();

  const filtered = topics.filter((t) => {
    if (activeLevel !== "all" && t.level !== activeLevel) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
    }
    return true;
  });

  const extractFormulas = (content: string): string[] => {
    const formulas: string[] = [];
    const lines = content.split("\n");
    for (const line of lines) {
      const matches = line.match(/\$[^$]+\$/g);
      if (matches) formulas.push(...matches.map((m) => m.replace(/\$/g, "")));
    }
    return [...new Set(formulas)];
  };

  const copyFormula = (f: string) => {
    navigator.clipboard.writeText(f);
    setCopied(f);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8 pb-24 lg:pb-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-[var(--fg)] mb-1">Rumus Sheet</h1>
          <p className="text-sm text-[var(--fg-muted)] mb-6">Koleksi rumus penting dari setiap topik. Klik untuk copy.</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari rumus..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)]" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "smp", "sma", "kuliah"] as const).map((l) => (
                <button key={l} onClick={() => setActiveLevel(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeLevel === l ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] text-gray-600 border border-[var(--border)] hover:bg-[var(--bg)]"
                  }`}>{l === "all" ? "Semua" : l.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((topic) => {
              const formulas = extractFormulas(topic.content);
              if (formulas.length === 0) return null;
              return (
                <div key={topic.id} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${topic.level === "smp" ? "bg-emerald-500" : topic.level === "sma" ? "bg-[var(--primary)]" : "bg-purple-500"}`} />
                    <h3 className="text-sm font-semibold text-[var(--fg)]">{topic.title}</h3>
                    <span className="text-[10px] text-gray-400 ml-auto">{formulas.length} rumus</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formulas.slice(0, 8).map((f, i) => (
                      <button key={i} onClick={() => copyFormula(f)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--bg)] hover:bg-[var(--primary-bg)] rounded-md text-xs font-mono text-[var(--fg-secondary)] hover:text-[var(--primary)] transition-colors group">
                        {copied === f ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} className="opacity-0 group-hover:opacity-100" />}
                        {f.length > 30 ? f.substring(0, 30) + "..." : f}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
