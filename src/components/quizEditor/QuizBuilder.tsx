"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createQuiz, getQuestionsByTopics, type UserQuiz } from "@/lib/quizEditor";
import { getAllTopics } from "@/lib/data";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  Plus, X, Check, Search, Filter, ChevronDown, ChevronUp,
  PencilLine, Copy, Trash2, Share2, Play, BookOpen,
} from "lucide-react";

interface QuizBuilderProps {
  userId: string;
  userName: string;
  onCreated: (quiz: UserQuiz) => void;
}

export default function QuizBuilder({ userId, userName, onCreated }: QuizBuilderProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<"config" | "pick">("config");

  const topics = useMemo(() => getAllTopics(), []);

  const availableQuestions = useMemo(() => {
    return getQuestionsByTopics(selectedTopics, difficulty);
  }, [selectedTopics, difficulty]);

  const filteredQuestions = useMemo(() => {
    if (!search) return availableQuestions;
    const q = search.toLowerCase();
    return availableQuestions.filter(
      (question) =>
        question.question.toLowerCase().includes(q) ||
        question.topicSlug.toLowerCase().includes(q)
    );
  }, [availableQuestions, search]);

  const toggleTopic = (slug: string) => {
    setSelectedTopics((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleQuestion = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = () => {
    if (!title.trim() || selectedIds.size === 0) return;
    const quiz = createQuiz(
      title.trim(),
      description.trim(),
      userId,
      userName,
      selectedTopics,
      difficulty,
      Array.from(selectedIds),
      isPublic
    );
    onCreated(quiz);
  };

  return (
    <div className="space-y-4">
      {step === "config" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="quiz-title" className="text-xs font-bold text-[var(--duo-text-muted)] mb-1 block">Judul Quiz</label>
            <input
              id="quiz-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Quiz Aljabar SMP"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--duo-border)] bg-white dark:bg-[var(--duo-card)] text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]"
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="quiz-description" className="text-xs font-bold text-[var(--duo-text-muted)] mb-1 block">Deskripsi</label>
            <input
              id="quiz-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--duo-border)] bg-white dark:bg-[var(--duo-card)] text-sm text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]"
              maxLength={100}
            />
          </div>

          {/* Topics */}
          <div>
            <label className="text-xs font-bold text-[var(--duo-text-muted)] mb-2 block">Filter Topik (opsional)</label>
            <div className="flex flex-wrap gap-2">
              {topics.slice(0, 15).map((t) => (
                <button
                  key={t.slug}
                  onClick={() => toggleTopic(t.slug)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border-2 transition ${
                    selectedTopics.includes(t.slug)
                      ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                      : "border-[var(--duo-border)] text-[var(--duo-text-muted)]"
                  }`}
                >
                  {t.title.replace(/^\d+\.\s*/, "")}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-bold text-[var(--duo-text-muted)] mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); setSelectedIds(new Set()); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition ${
                    difficulty === d
                      ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                      : "border-[var(--duo-border)] text-[var(--duo-text-muted)]"
                  }`}
                >
                  {d === "easy" ? "Mudah" : d === "medium" ? "Sedang" : "Sulit"}
                </button>
              ))}
            </div>
          </div>

          {/* Public toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-10 h-6 rounded-full transition-colors ${
                isPublic ? "bg-[var(--duo-green)]" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                isPublic ? "translate-x-4" : "translate-x-0.5"
              }`} />
            </button>
            <span className="text-xs font-bold text-[var(--duo-text-muted)]">Publik (bisa dilihat orang lain)</span>
          </div>

          <button
            onClick={() => setStep("pick")}
            disabled={!title.trim()}
            className="w-full py-3 bg-[var(--duo-green)] text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            Pilih Soal ({availableQuestions.length} tersedia)
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <button onClick={() => setStep("config")} className="text-xs font-bold text-[var(--duo-green)] hover:underline">
            ← Kembali ke Pengaturan
          </button>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--duo-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari soal..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[var(--duo-border)] bg-white dark:bg-[var(--duo-card)] text-sm text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]"
            />
          </div>

          <p className="text-xs font-bold text-[var(--duo-text-muted)]">
            {selectedIds.size} soal dipilih dari {filteredQuestions.length} tersedia
          </p>

          {/* Question list */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <motion.div
                key={q.id}
                variants={staggerItem}
                onClick={() => toggleQuestion(q.id)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                  selectedIds.has(q.id)
                    ? "border-[var(--duo-green)] bg-[var(--duo-green)]/5"
                    : "border-[var(--duo-border)] hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedIds.has(q.id) ? "border-[var(--duo-green)] bg-[var(--duo-green)]" : "border-gray-300"
                  }`}>
                    {selectedIds.has(q.id) && <Check size={10} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--duo-text)] line-clamp-2">{q.question}</p>
                    <p className="text-[9px] text-[var(--duo-text-muted)] mt-1">{q.topicSlug} • {q.difficulty || "medium"}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <button
            onClick={handleCreate}
            disabled={selectedIds.size === 0}
            className="w-full py-3 bg-[var(--duo-green)] text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            Buat Quiz ({selectedIds.size} soal)
          </button>
        </motion.div>
      )}
    </div>
  );
}
