"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FeatureGuard from "@/components/admin/FeatureGuard";
import QuizBuilder from "@/components/quizEditor/QuizBuilder";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserQuizzes,
  getQuizByCode,
  deleteQuiz,
  incrementPlayCount,
  type UserQuiz,
} from "@/lib/quizEditor";
import { addXp, saveProfile, getProfile } from "@/lib/gamification";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import {
  PencilLine, Copy, Trash2, Share2, Play, Search, BookOpen,
  CheckCircle2, XCircle, X, Clock, Trophy, Zap, ChevronRight,
  Plus,
} from "lucide-react";

type View = "list" | "create" | "play" | "result";

export default function QuizEditorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [view, setView] = useState<View>("list");
  const [myQuizzes, setMyQuizzes] = useState<UserQuiz[]>([]);
  const [codeSearch, setCodeSearch] = useState("");
  const [foundQuiz, setFoundQuiz] = useState<UserQuiz | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<UserQuiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    setMyQuizzes(getUserQuizzes(user.id));
  }, [user, authLoading]);

  const searchByCode = () => {
    if (!codeSearch.trim()) return;
    const quiz = getQuizByCode(codeSearch.trim());
    setFoundQuiz(quiz || null);
  };

  const startQuiz = (quiz: UserQuiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    incrementPlayCount(quiz.id);
    setView("play");
  };

  const handleAnswer = (i: number) => {
    if (selected !== null || !activeQuiz) return;
    setSelected(i);
    setShowResult(true);
    const correct = i === activeQuiz.questions[currentQ].correctIndex;
    setAnswers([...answers, correct]);
    if (correct) {
      setScore((s) => s + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQ + 1 >= activeQuiz.questions.length) {
      const pct = Math.round((score / activeQuiz.questions.length) * 100);
      if (pct >= 80) playCompleteSound();
      const p = addXp(score * 5);
      saveProfile(p);
      setView("result");
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = (id: string) => {
    deleteQuiz(id);
    setMyQuizzes(getUserQuizzes(user!.id));
    setDeleteConfirm(null);
  };

  const handleCreated = (quiz: UserQuiz) => {
    setMyQuizzes(getUserQuizzes(user!.id));
    setView("list");
  };

  return (
    <FeatureGuard flag="quiz-editor">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
          {/* Header */}
          <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
            <div className="max-w-3xl mx-auto px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <PencilLine size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-[var(--duo-text)]">Quiz Editor</h1>
                    <p className="text-xs text-[var(--duo-text-muted)]">Buat quiz sendiri dari bank soal</p>
                  </div>
                </div>
                {view === "list" && (
                  <button
                    onClick={() => setView("create")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--duo-green)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                  >
                    <Plus size={14} /> Buat Quiz
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-8 py-6">
            {/* List View */}
            {view === "list" && (
              <div className="space-y-6">
                {/* Search by code */}
                <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4">
                  <p className="text-xs font-bold text-[var(--duo-text-muted)] mb-2">Cari Quiz dengan Kode</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeSearch}
                      onChange={(e) => setCodeSearch(e.target.value.toUpperCase())}
                      placeholder="Masukkan kode 6 huruf..."
                      maxLength={6}
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[var(--duo-border)] bg-gray-50 dark:bg-gray-800 text-sm font-mono font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)] uppercase"
                    />
                    <button
                      onClick={searchByCode}
                      className="px-4 py-2.5 bg-[var(--duo-green)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                    >
                      Cari
                    </button>
                  </div>
                  {foundQuiz && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm font-bold text-[var(--duo-text)]">{foundQuiz.title}</p>
                      <p className="text-[10px] text-[var(--duo-text-muted)]">{foundQuiz.questions.length} soal • oleh {foundQuiz.createdByName}</p>
                      <button
                        onClick={() => startQuiz(foundQuiz)}
                        className="mt-2 px-4 py-1.5 bg-[var(--duo-green)] text-white text-xs font-bold rounded-lg"
                      >
                        Mainkan
                      </button>
                    </motion.div>
                  )}
                  {codeSearch.length === 6 && !foundQuiz && (
                    <p className="mt-2 text-xs text-red-500">Quiz tidak ditemukan.</p>
                  )}
                </div>

                {/* My Quizzes */}
                <div>
                  <h2 className="text-xs font-extrabold text-[var(--duo-text-muted)] uppercase tracking-widest mb-3">
                    Quiz Buatanmu ({myQuizzes.length})
                  </h2>
                  {myQuizzes.length === 0 ? (
                    <div className="text-center py-8 text-sm text-[var(--duo-text-muted)]">
                      Belum ada quiz. Klik &quot;Buat Quiz&quot; untuk mulai.
                    </div>
                  ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
                      {myQuizzes.map((quiz) => (
                        <motion.div
                          key={quiz.id}
                          variants={staggerItem}
                          className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-black text-[var(--duo-text)]">{quiz.title}</h3>
                              <p className="text-[10px] text-[var(--duo-text-muted)] mt-0.5">{quiz.description || "Tanpa deskripsi"}</p>
                              <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-[var(--duo-text-muted)]">
                                <span>{quiz.questions.length} soal</span>
                                <span>•</span>
                                <span>{quiz.playCount} dimainkan</span>
                                <span>•</span>
                                <span className="font-mono">{quiz.shareCode}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => startQuiz(quiz)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--duo-green)] text-white text-[10px] font-bold rounded-lg"
                            >
                              <Play size={10} fill="currentColor" /> Mainkan
                            </button>
                            <button
                              onClick={() => copyCode(quiz.shareCode)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)] text-[10px] font-bold rounded-lg"
                            >
                              <Copy size={10} /> {copiedCode === quiz.shareCode ? "Tersalin!" : "Salin Kode"}
                            </button>
                            {deleteConfirm === quiz.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(quiz.id)} className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg">Hapus</button>
                                <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-[10px] font-bold rounded-lg">Batal</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(quiz.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-red-500 text-[10px] font-bold rounded-lg"
                              >
                                <Trash2 size={10} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Create View */}
            {view === "create" && user && (
              <div>
                <button onClick={() => setView("list")} className="text-xs font-bold text-[var(--duo-green)] hover:underline mb-4">
                  ← Kembali
                </button>
                <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6">
                  <QuizBuilder userId={user.id} userName={user.name} onCreated={handleCreated} />
                </div>
              </div>
            )}

            {/* Play View */}
            {view === "play" && activeQuiz && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[var(--duo-text-muted)]">
                    Soal {currentQ + 1}/{activeQuiz.questions.length}
                  </span>
                  <span className="text-xs font-bold text-[var(--duo-xp)]">Skor: {score}</span>
                </div>

                <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6 mb-4">
                  <p className="text-base font-bold text-[var(--duo-text)] leading-relaxed">
                    {activeQuiz.questions[currentQ].question}
                  </p>
                </div>

                <div className="space-y-3">
                  {activeQuiz.questions[currentQ].options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === activeQuiz.questions[currentQ].correctIndex;
                    const showCorrect = showResult && isCorrect;
                    const showWrong = showResult && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                          showCorrect
                            ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                            : showWrong
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : isSelected
                            ? "border-[var(--duo-info)] bg-[var(--duo-info)]/10"
                            : "border-[var(--duo-border)] hover:border-[var(--duo-info)]/50 text-[var(--duo-text)]"
                        }`}
                      >
                        <span className="mr-2 text-[var(--duo-text-muted)]">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {showResult && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={nextQuestion}
                    className="w-full mt-4 py-3 bg-[var(--duo-green)] text-white font-bold rounded-xl hover:opacity-90 transition"
                  >
                    {currentQ + 1 >= activeQuiz.questions.length ? "Lihat Hasil" : "Soal Berikutnya"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Result View */}
            {view === "result" && activeQuiz && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-8">
                  {score / activeQuiz.questions.length >= 0.8 ? (
                    <CheckCircle2 size={64} className="text-[var(--duo-green)] mx-auto mb-4" />
                  ) : (
                    <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                  )}
                  <h2 className="text-xl font-black text-[var(--duo-text)] mb-2">{activeQuiz.title}</h2>
                  <p className="text-3xl font-black text-[var(--duo-xp)] mb-2">
                    {score}/{activeQuiz.questions.length}
                  </p>
                  <p className="text-sm text-[var(--duo-text-muted)] mb-4">
                    +{score * 5} XP
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => startQuiz(activeQuiz)}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text)] font-bold text-sm rounded-xl"
                    >
                      Ulangi
                    </button>
                    <button
                      onClick={() => { setView("list"); setActiveQuiz(null); }}
                      className="px-6 py-3 bg-[var(--duo-green)] text-white font-bold text-sm rounded-xl"
                    >
                      Kembali
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </FeatureGuard>
  );
}
