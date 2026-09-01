"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, Search, Edit3, Trash2, Eye, EyeOff, Save, X, FileText,
  HelpCircle, ChevronDown, ChevronRight, Download, Upload, Filter,
} from "lucide-react";
import {
  getAllTopics, getAllQuestions, createTopic, updateTopic, deleteTopic,
  createQuestion, updateQuestion, deleteQuestion, getQuestionsByTopic,
  type ManagedTopic, type ManagedQuestion,
} from "@/lib/admin/content";
import { getAdminSession } from "@/lib/adminAuth";
import { logAudit } from "@/lib/admin/audit";
import type { Level } from "@/lib/types";

type Tab = "topics" | "questions";

export default function AdminContentPage() {
  const [tab, setTab] = useState<Tab>("topics");
  const [topics, setTopics] = useState<ManagedTopic[]>([]);
  const [questions, setQuestions] = useState<ManagedQuestion[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [savingTopic, setSavingTopic] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);

  const [topicForm, setTopicForm] = useState({
    slug: "", title: "", level: "smp" as Level, section: "", icon: "📐",
    content: "", description: "", isPublished: true,
  });

  const [questionForm, setQuestionForm] = useState({
    topicSlug: "", question: "", options: ["", "", "", ""], correctIndex: 0,
    explanation: "", difficulty: "medium" as "easy" | "medium" | "hard",
    type: "choice" as "choice" | "fill" | "numberline" | "sorting" | "equation" | "graph" | "geometry" | "venn",
    hints: "", isPublished: true,
  });

  const loadData = useCallback(() => {
    setTopics(getAllTopics());
    setQuestions(getAllQuestions());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function auditLog(action: string, target: string, targetId: string, before?: unknown, after?: unknown) {
    const session = getAdminSession();
    if (session) logAudit(session.email, session.name, action, target, targetId, before, after);
  }

  // ── Topics CRUD ──
  function resetTopicForm() {
    setTopicForm({ slug: "", title: "", level: "smp", section: "", icon: "📐", content: "", description: "", isPublished: true });
    setEditingTopic(null);
    setShowTopicForm(false);
  }

  async function handleSaveTopic() {
    setSavingTopic(true);
    try {
      const session = getAdminSession();
      if (editingTopic) {
        const old = topics.find((t) => t.slug === editingTopic);
        const updated = updateTopic(editingTopic, { ...topicForm, createdBy: session?.email || "admin", updatedAt: "" });
        if (updated) auditLog("update_topic", "topic", editingTopic, old, updated);
      } else {
        const newTopic = createTopic({
          id: `topic-${Date.now()}`,
          ...topicForm,
          createdBy: session?.email || "admin",
        });
        auditLog("create_topic", "topic", newTopic.slug, null, newTopic);
      }
      loadData();
      resetTopicForm();
    } finally {
      setSavingTopic(false);
    }
  }

  function handleEditTopic(slug: string) {
    const t = topics.find((x) => x.slug === slug);
    if (!t) return;
    setTopicForm({
      slug: t.slug, title: t.title, level: t.level, section: t.section,
      icon: t.icon, content: t.content, description: t.description, isPublished: t.isPublished,
    });
    setEditingTopic(slug);
    setShowTopicForm(true);
  }

  function handleDeleteTopic(slug: string) {
    if (!confirm(`Hapus topik "${slug}"? Semua soal terkait juga akan dihapus.`)) return;
    const old = topics.find((t) => t.slug === slug);
    deleteTopic(slug);
    questions.filter((q) => q.topicSlug === slug).forEach((q) => deleteQuestion(q.id));
    auditLog("delete_topic", "topic", slug, old);
    loadData();
  }

  function handleToggleTopicPublish(slug: string) {
    const t = topics.find((x) => x.slug === slug);
    if (!t) return;
    const updated = updateTopic(slug, { isPublished: !t.isPublished });
    auditLog(t.isPublished ? "unpublish_topic" : "publish_topic", "topic", slug, { isPublished: t.isPublished }, updated);
    loadData();
  }

  // ── Questions CRUD ──
  function resetQuestionForm() {
    setQuestionForm({
      topicSlug: "", question: "", options: ["", "", "", ""], correctIndex: 0,
      explanation: "", difficulty: "medium", type: "choice", hints: "", isPublished: true,
    });
    setEditingQuestion(null);
    setShowQuestionForm(false);
  }

  async function handleSaveQuestion() {
    setSavingQuestion(true);
    try {
      const session = getAdminSession();
      const payload: Omit<ManagedQuestion, "updatedAt"> = {
        id: editingQuestion || `q-${Date.now()}`,
        topicSlug: questionForm.topicSlug,
        question: questionForm.question,
        options: questionForm.options.filter(Boolean),
        correctIndex: questionForm.correctIndex,
        explanation: questionForm.explanation,
        difficulty: questionForm.difficulty,
        type: questionForm.type,
        hints: questionForm.hints ? questionForm.hints.split(",").map((h) => h.trim()) : [],
        isPublished: questionForm.isPublished,
        createdBy: session?.email || "admin",
      };

      if (editingQuestion) {
        const old = questions.find((q) => q.id === editingQuestion);
        updateQuestion(editingQuestion, { ...payload, updatedAt: "" });
        auditLog("update_question", "question", editingQuestion, old, payload);
      } else {
        createQuestion(payload);
        auditLog("create_question", "question", payload.id, null, payload);
      }
      loadData();
      resetQuestionForm();
    } finally {
      setSavingQuestion(false);
    }
  }

  function handleEditQuestion(id: string) {
    const q = questions.find((x) => x.id === id);
    if (!q) return;
    setQuestionForm({
      topicSlug: q.topicSlug, question: q.question,
      options: q.options.length >= 4 ? q.options : [...q.options, ...Array(4 - q.options.length).fill("")],
      correctIndex: q.correctIndex, explanation: q.explanation,
      difficulty: q.difficulty || "medium", type: q.type || "choice",
      hints: q.hints?.join(", ") || "", isPublished: q.isPublished,
    });
    setEditingQuestion(id);
    setShowQuestionForm(true);
  }

  function handleDeleteQuestion(id: string) {
    if (!confirm("Hapus soal ini?")) return;
    const old = questions.find((q) => q.id === id);
    deleteQuestion(id);
    auditLog("delete_question", "question", id, old);
    loadData();
  }

  function handleToggleQuestionPublish(id: string) {
    const q = questions.find((x) => x.id === id);
    if (!q) return;
    updateQuestion(id, { isPublished: !q.isPublished });
    loadData();
  }

  // ── Filters ──
  const filteredTopics = topics.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || t.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const filteredQuestions = questions.filter((q) => {
    const matchSearch = !search || q.question.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase());
    const topic = topics.find((t) => t.slug === q.topicSlug);
    const matchLevel = levelFilter === "all" || topic?.level === levelFilter;
    return matchSearch && matchLevel;
  });

  function handleExport() {
    const data = JSON.stringify({ topics, questions }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matika-content-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const sections = [...new Set(topics.map((t) => t.section))];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
            <BookOpen size={24} className="text-blue-500" />
            Content Management
          </h1>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">
            {topics.length} topik, {questions.length} soal
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className="px-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] text-[var(--duo-text)] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {([
          { key: "topics" as Tab, label: "Topik", icon: BookOpen, count: topics.length },
          { key: "questions" as Tab, label: "Soal", icon: HelpCircle, count: questions.length },
        ]).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t.key
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white dark:bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
            }`}>
            <t.icon size={16} /> {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--duo-text-muted)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "topics" ? "Cari topik..." : "Cari soal..."}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex gap-2">
          {(["all", "smp", "sma", "kuliah"] as const).map((l) => (
            <button key={l} onClick={() => setLevelFilter(l)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                levelFilter === l
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
              }`}>
              {l === "all" ? "Semua" : l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── TOPICS TAB ── */}
      {tab === "topics" && (
        <>
          <button onClick={() => { resetTopicForm(); setShowTopicForm(true); }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
            <Plus size={16} /> Tambah Topik
          </button>

          <AnimatePresence>
            {showTopicForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[var(--duo-text)]">{editingTopic ? "Edit Topik" : "Topik Baru"}</h3>
                  <button onClick={resetTopicForm} aria-label="Tutup" className="p-1 text-[var(--duo-text-muted)] hover:text-red-500"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="topic-slug" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Slug *</label>
                    <input id="topic-slug" value={topicForm.slug} onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
                      disabled={!!editingTopic}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] disabled:opacity-50 focus:outline-none focus:border-blue-500"
                      placeholder="nama-topik" />
                  </div>
                  <div>
                    <label htmlFor="topic-title" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Judul *</label>
                    <input id="topic-title" value={topicForm.title} onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-blue-500"
                      placeholder="1. Nama Topik" />
                  </div>
                  <div>
                    <label htmlFor="topic-level" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Level</label>
                    <select id="topic-level" value={topicForm.level} onChange={(e) => setTopicForm({ ...topicForm, level: e.target.value as Level })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-blue-500">
                      <option value="smp">SMP</option>
                      <option value="sma">SMA</option>
                      <option value="kuliah">Kuliah</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="topic-section" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Section</label>
                    <input id="topic-section" value={topicForm.section} onChange={(e) => setTopicForm({ ...topicForm, section: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-blue-500"
                      placeholder="Matematika SMP" />
                  </div>
                  <div>
                    <label htmlFor="topic-icon" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Icon</label>
                    <input id="topic-icon" value={topicForm.icon} onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-blue-500"
                      placeholder="📐" />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <label htmlFor="topic-published" className="flex items-center gap-2 cursor-pointer">
                      <input id="topic-published" type="checkbox" checked={topicForm.isPublished}
                        onChange={(e) => setTopicForm({ ...topicForm, isPublished: e.target.checked })}
                        className="w-4 h-4 rounded" />
                      <span className="text-sm font-bold text-[var(--duo-text)]">Published</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="topic-description" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Deskripsi</label>
                    <textarea id="topic-description" value={topicForm.description} onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-blue-500 h-16 resize-none"
                      placeholder="Deskripsi singkat topik..." />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="topic-content" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Konten (Markdown + LaTeX)</label>
                    <textarea id="topic-content" value={topicForm.content} onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-mono text-[var(--duo-text)] focus:outline-none focus:border-blue-500 h-32 resize-none"
                      placeholder="**Konsep:** ...&#10;**Rumus:** ..." />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={resetTopicForm} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text)] rounded-xl text-sm font-bold">Batal</button>
                  <button onClick={handleSaveTopic} disabled={savingTopic || !topicForm.slug || !topicForm.title}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2">
                    {savingTopic ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Menyimpan...
                      </span>
                    ) : (
                      <><Save size={14} /> {editingTopic ? "Simpan" : "Buat Topik"}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Topics grouped by section */}
          {sections.map((section) => {
            const sectionTopics = filteredTopics.filter((t) => t.section === section);
            if (sectionTopics.length === 0) return null;
            return (
              <div key={section}>
                <h3 className="text-xs font-bold text-[var(--duo-text-muted)] mb-2 uppercase tracking-wide">{section}</h3>
                <div className="space-y-2">
                  {sectionTopics.map((topic, i) => {
                    const qCount = questions.filter((q) => q.topicSlug === topic.slug).length;
                    const isExpanded = expandedTopic === topic.slug;
                    return (
                      <motion.div key={topic.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        className="bg-white dark:bg-[var(--duo-card)] rounded-xl border-2 border-[var(--duo-border)] overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
                          onClick={() => setExpandedTopic(isExpanded ? null : topic.slug)}>
                          <span className="text-lg">{topic.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-[var(--duo-text)] truncate">{topic.title}</p>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                topic.level === "smp" ? "bg-green-100 text-green-600" :
                                topic.level === "sma" ? "bg-blue-100 text-blue-600" :
                                "bg-purple-100 text-purple-600"
                              }`}>{topic.level.toUpperCase()}</span>
                              {topic.isPublished ? (
                                <Eye size={12} className="text-green-500" />
                              ) : (
                                <EyeOff size={12} className="text-gray-400" />
                              )}
                            </div>
                            <p className="text-[10px] text-[var(--duo-text-muted)]">{qCount} soal · {topic.slug}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); handleToggleTopicPublish(topic.slug); }} aria-label="Toggle publikasi"
                              className="p-1.5 text-[var(--duo-text-muted)] hover:text-blue-500 rounded-lg transition-colors">
                              {topic.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleEditTopic(topic.slug); }} aria-label="Edit"
                              className="p-1.5 text-[var(--duo-text-muted)] hover:text-blue-500 rounded-lg transition-colors">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic.slug); }} aria-label="Hapus"
                              className="p-1.5 text-[var(--duo-text-muted)] hover:text-red-500 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                            {isExpanded ? <ChevronDown size={14} className="text-[var(--duo-text-muted)]" /> : <ChevronRight size={14} className="text-[var(--duo-text-muted)]" />}
                          </div>
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                              className="border-t border-[var(--duo-border)] px-4 py-3 bg-gray-50 dark:bg-gray-900/20">
                              <p className="text-xs text-[var(--duo-text)] leading-relaxed whitespace-pre-wrap">
                                {topic.content || "Tidak ada konten"}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* ── QUESTIONS TAB ── */}
      {tab === "questions" && (
        <>
          <button onClick={() => { resetQuestionForm(); setShowQuestionForm(true); }}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
            <Plus size={16} /> Tambah Soal
          </button>

          <AnimatePresence>
            {showQuestionForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[var(--duo-text)]">{editingQuestion ? "Edit Soal" : "Soal Baru"}</h3>
                  <button onClick={resetQuestionForm} aria-label="Tutup" className="p-1 text-[var(--duo-text-muted)] hover:text-red-500"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="question-topic" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Topik *</label>
                    <select id="question-topic" value={questionForm.topicSlug} onChange={(e) => setQuestionForm({ ...questionForm, topicSlug: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500">
                      <option value="">Pilih topik...</option>
                      {topics.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="question-type" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Tipe</label>
                      <select id="question-type" value={questionForm.type} onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value as typeof questionForm.type })}
                        className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500">
                        <option value="choice">Pilihan Ganda</option>
                        <option value="fill">Isian</option>
                        <option value="numberline">Garis Bilangan</option>
                        <option value="sorting">Sorting</option>
                        <option value="equation">Persamaan</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="question-difficulty" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Difficulty</label>
                      <select id="question-difficulty" value={questionForm.difficulty} onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value as typeof questionForm.difficulty })}
                        className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="question-text" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Soal *</label>
                    <textarea id="question-text" value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500 h-20 resize-none"
                      placeholder="Tuliskan soal di sini..." />
                  </div>
                  {questionForm.type === "choice" && (
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-[var(--duo-text-muted)] block">Pilihan Jawaban</label>
                      {questionForm.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="radio" checked={questionForm.correctIndex === idx}
                            onChange={() => setQuestionForm({ ...questionForm, correctIndex: idx })}
                            className="w-4 h-4" />
                          <input value={opt} onChange={(e) => {
                            const newOpts = [...questionForm.options];
                            newOpts[idx] = e.target.value;
                            setQuestionForm({ ...questionForm, options: newOpts });
                          }}
                            className="flex-1 px-4 py-2 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500"
                            placeholder={`Pilihan ${idx + 1}${idx === questionForm.correctIndex ? " (Benar)" : ""}`} />
                        </div>
                      ))}
                      <p className="text-[10px] text-[var(--duo-text-muted)]">Klik radio button untuk pilih jawaban benar</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label htmlFor="question-explanation" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Penjelasan</label>
                    <textarea id="question-explanation" value={questionForm.explanation} onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500 h-16 resize-none"
                      placeholder="Penjelasan jawaban..." />
                  </div>
                  <div>
                    <label htmlFor="question-hints" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Hints (koma)</label>
                    <input id="question-hints" value={questionForm.hints} onChange={(e) => setQuestionForm({ ...questionForm, hints: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500"
                      placeholder="hint1, hint2" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label htmlFor="question-published" className="flex items-center gap-2 cursor-pointer">
                      <input id="question-published" type="checkbox" checked={questionForm.isPublished}
                        onChange={(e) => setQuestionForm({ ...questionForm, isPublished: e.target.checked })}
                        className="w-4 h-4 rounded" />
                      <span className="text-sm font-bold text-[var(--duo-text)]">Published</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={resetQuestionForm} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text)] rounded-xl text-sm font-bold">Batal</button>
                  <button onClick={handleSaveQuestion} disabled={savingQuestion || !questionForm.topicSlug || !questionForm.question}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2">
                    {savingQuestion ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Menyimpan...
                      </span>
                    ) : (
                      <><Save size={14} /> {editingQuestion ? "Simpan" : "Buat Soal"}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Questions List */}
          <div className="space-y-2">
            {filteredQuestions.map((q, i) => {
              const topic = topics.find((t) => t.slug === q.topicSlug);
              return (
                <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="bg-white dark:bg-[var(--duo-card)] rounded-xl border-2 border-[var(--duo-border)] px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
                      q.difficulty === "easy" ? "bg-green-500" : q.difficulty === "hard" ? "bg-red-500" : "bg-blue-500"
                    }`}>
                      {q.type === "choice" ? "PG" : q.type === "fill" ? "IS" : q.type === "numberline" ? "NL" : q.type === "sorting" ? "ST" : "EQ"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--duo-text)] line-clamp-2">{q.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[var(--duo-text-muted)]">{topic?.title || q.topicSlug}</span>
                        {q.isPublished ? (
                          <Eye size={10} className="text-green-500" />
                        ) : (
                          <EyeOff size={10} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleToggleQuestionPublish(q.id)} aria-label="Toggle publikasi"
                        className="p-1.5 text-[var(--duo-text-muted)] hover:text-blue-500 rounded-lg transition-colors">
                        {q.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => handleEditQuestion(q.id)} aria-label="Edit"
                        className="p-1.5 text-[var(--duo-text-muted)] hover:text-blue-500 rounded-lg transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteQuestion(q.id)} aria-label="Hapus"
                        className="p-1.5 text-[var(--duo-text-muted)] hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)]">
                <HelpCircle size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-[var(--duo-text)]">Tidak ada soal</p>
                <p className="text-xs text-[var(--duo-text-muted)]">Klik &quot;Tambah Soal&quot; untuk mulai</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
