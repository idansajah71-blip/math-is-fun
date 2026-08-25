"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Edit3, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProblemQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  errorRate: number;
  attempts: number;
}

const DIFF_STYLES: Record<string, { bg: string; text: string }> = {
  easy: { bg: "var(--success-bg)", text: "var(--success-ink)" },
  medium: { bg: "var(--warning-bg)", text: "var(--warning-ink)" },
  hard: { bg: "var(--danger-bg)", text: "var(--danger-ink)" },
};

interface ProblemQuestionsTableProps {
  questions?: ProblemQuestion[];
}

const DEMO_QUESTIONS: ProblemQuestion[] = [
  { id: "q1", question: "Sederhanakan 3/4 + 2/5", topic: "Bilangan", difficulty: "easy", errorRate: 67, attempts: 145 },
  { id: "q2", question: "Tentukan akar-akar dari x² - 5x + 6 = 0", topic: "Persamaan Kuadrat", difficulty: "medium", errorRate: 54, attempts: 98 },
  { id: "q3", question: "Hitung turunan f(x) = 3x³ - 2x² + x", topic: "Kalkulus", difficulty: "hard", errorRate: 72, attempts: 67 },
  { id: "q4", question: "Jika sin θ = 3/5, tentukan cos θ", topic: "Trigonometri", difficulty: "medium", errorRate: 48, attempts: 112 },
  { id: "q5", question: "Tentukan determinan matriks 3×3", topic: "Aljabar Linear", difficulty: "hard", errorRate: 61, attempts: 54 },
];

export default function ProblemQuestionsTable({ questions = DEMO_QUESTIONS }: ProblemQuestionsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--grad-fire)" }}>
            <AlertTriangle size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--fg)]">Soal Bermasalah</h3>
            <p className="text-[10px] text-[var(--fg-muted)]">Error rate tertinggi</p>
          </div>
        </div>
        <Link href="/admin/content" className="text-[10px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline">
          Lihat semua <ArrowRight size={10} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-left pb-2 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wide">Soal</th>
              <th className="text-left pb-2 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wide">Topik</th>
              <th className="text-left pb-2 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wide">Diff</th>
              <th className="text-right pb-2 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wide">% Salah</th>
              <th className="text-right pb-2 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wide">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => {
              const diffStyle = DIFF_STYLES[q.difficulty] || DIFF_STYLES.medium;
              return (
                <motion.tr
                  key={q.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.04 }}
                  className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--surface-sunken)] transition-colors"
                >
                  <td className="py-2.5 pr-3">
                    <p className="text-xs font-bold text-[var(--fg)] truncate max-w-[200px]">{q.question}</p>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-[10px] font-bold text-[var(--fg-muted)]">{q.topic}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase" style={{ background: diffStyle.bg, color: diffStyle.text }}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${q.errorRate}%`,
                            background: q.errorRate > 60 ? "var(--danger)" : q.errorRate > 40 ? "var(--warning)" : "var(--primary)",
                          }}
                        />
                      </div>
                      <span className="text-xs font-black text-[var(--fg)] w-8 text-right">{q.errorRate}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <Link href={`/admin/content`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-bg)] hover:bg-[var(--primary)] hover:text-white transition-colors">
                      <Edit3 size={10} /> Edit
                    </Link>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
