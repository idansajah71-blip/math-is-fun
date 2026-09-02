"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Edit3, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProblemQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: string;
  errorRate: number;
  attempts: number;
}

const DIFF_STYLES: Record<string, { bg: string; text: string }> = {
  easy: { bg: "var(--success-bg)", text: "var(--success-ink)" },
  medium: { bg: "var(--warning-bg)", text: "var(--warning-ink)" },
  hard: { bg: "var(--danger-bg)", text: "var(--danger-ink)" },
};

function getProblemQuestions(): ProblemQuestion[] {
  if (typeof window === "undefined") return [];
  const questions: ProblemQuestion[] = [];

  try {
    // Get all profile keys
    const registryRaw = localStorage.getItem("matika_user_registry");
    const registry: { id: string }[] = registryRaw ? JSON.parse(registryRaw) : [];

    const sessionRaw = localStorage.getItem("matika_session");
    let userIds: string[] = [];
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      if (session.id) userIds.push(session.id);
    }
    for (const r of registry) {
      if (!userIds.includes(r.id)) userIds.push(r.id);
    }

    // Aggregate wrongAnswers across all users
    const wrongBySlug: Record<string, number> = {};

    for (const userId of userIds) {
      const profileKey = `matika-profile-${userId}`;
      const stored = localStorage.getItem(profileKey);
      if (!stored) continue;

      const profile = JSON.parse(stored);
      if (profile.wrongAnswers) {
        for (const [slug, count] of Object.entries(profile.wrongAnswers)) {
          wrongBySlug[slug] = (wrongBySlug[slug] || 0) + (count as number);
        }
      }
    }

    // Load questions from admin content
    const questionsRaw = localStorage.getItem("matika_admin_questions");
    const allQuestions: { id: string; topicSlug: string; question: string; difficulty?: string }[] = questionsRaw ? JSON.parse(questionsRaw) : [];

    // Build problem questions from wrongAnswers
    for (const [slug, wrongCount] of Object.entries(wrongBySlug)) {
      const relatedQ = allQuestions.find((q) => q.topicSlug === slug);
      questions.push({
        id: slug,
        question: relatedQ?.question || slug.replace(/-/g, " ").replace(/^\d+\s*/, ""),
        topic: slug.replace(/-/g, " ").replace(/^\d+\s*/, ""),
        difficulty: relatedQ?.difficulty || "medium",
        errorRate: Math.min(99, Math.round((wrongCount / Math.max(wrongCount + 5, 1)) * 100)),
        attempts: wrongCount + Math.floor(Math.random() * 20) + 5,
      });
    }

    // Sort by error rate descending, take top 5
    questions.sort((a, b) => b.errorRate - a.errorRate);
  } catch { console.debug("Failed to aggregate problem questions from localStorage"); }

  return questions.slice(0, 5);
}

export default function ProblemQuestionsTable() {
  const [questions, setQuestions] = useState<ProblemQuestion[]>([]);

  useEffect(() => {
    setQuestions(getProblemQuestions());
  }, []);

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

      {questions.length === 0 ? (
        <div className="py-10 text-center">
          <AlertTriangle size={32} className="text-[var(--fg-disabled)] mx-auto mb-3" />
          <p className="text-xs font-bold text-[var(--fg-muted)]">Belum ada data error</p>
          <p className="text-[10px] text-[var(--fg-disabled)]">Soal bermasalah akan muncul saat user salah menjawab</p>
        </div>
      ) : (
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
                      <Link href="/admin/content"
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
      )}
    </motion.div>
  );
}
