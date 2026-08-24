"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MathContent from "@/components/MathContent";
import HeartBar from "@/components/ui/HeartBar";
import XpPopup from "@/components/ui/XpPopup";
import Confetti from "@/components/ui/Confetti";
import QuizMascot from "@/components/game/QuizMascot";
import NumberLineDrag from "@/components/lesson/NumberLineDrag";
import SortingQuestion from "@/components/lesson/SortingQuestion";
import EquationBuilder from "@/components/lesson/EquationBuilder";
import HintButton from "@/components/lesson/HintButton";
import MistakeReview from "@/components/lesson/MistakeReview";
import type { MistakeItem } from "@/components/lesson/MistakeReview";
import GraphPlotter from "@/components/math/GraphPlotter";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import { completeTopic, saveQuizScore, getProfile, trackWrongAnswer, useHeart, refillHearts, consumeDoubleXp, addXp } from "@/lib/gamification";
import { quizzes } from "@/lib/quizzes";
import {
  ArrowLeft, ArrowRight, CheckCircle2, RotateCcw,
  Home, Star, Zap, Trophy, BookOpen,
} from "lucide-react";
import Link from "next/link";
import type { Topic } from "@/lib/types";
import MultipleChoice from "@/components/lesson/MultipleChoice";
import FillBlank from "@/components/lesson/FillBlank";
import TrueFalse from "@/components/lesson/TrueFalse";

type LessonStep = "intro" | "content" | "quiz" | "complete";

interface LessonClientProps {
  topic: Topic;
  related?: Topic[];
}

export default function LessonClient({ topic }: LessonClientProps) {
  const [step, setStep] = useState<LessonStep>("intro");
  const profile = getProfile();
  const [lives, setLives] = useState(profile.hearts);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);

  const topicQuizzes = quizzes.filter((q) => q.topicSlug === topic.slug);
  const totalQuestions = Math.min(topicQuizzes.length, 5);
  const questions = topicQuizzes.slice(0, totalQuestions);
  const progress = totalQuestions > 0 ? ((currentQ) / totalQuestions) * 100 : 0;

  const isCompleted = profile.completedTopics?.includes(topic.slug);

  // Keyboard shortcuts: 1-4 for MC options, Enter/Space for next
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (step !== "quiz") return;
      const q = questions[currentQ];
      if (!q) return;

      // Number keys 1-4 for MC
      if (["1", "2", "3", "4"].includes(e.key) && (!q.type || q.type === "choice")) {
        const idx = parseInt(e.key) - 1;
        if (idx < q.options.length) {
          // Simulate click on MC option
          const btn = document.querySelector(`[data-mc-option="${idx}"]`) as HTMLButtonElement;
          btn?.click();
        }
      }

      // Enter/Space to advance after answering
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNextQuestion();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step, currentQ, questions]);

  const handleCorrect = useCallback(() => {
    playCorrectSound();
    setScore((s) => s + 1);
    setCombo((c) => c + 1);
    setLastAnswerCorrect(true);
  }, []);

  const handleWrong = useCallback(() => {
    playWrongSound();
    trackWrongAnswer(topic.slug);
    setBreaking(true);
    setTimeout(() => setBreaking(false), 500);
    setCombo(0);
    setLastAnswerCorrect(false);

    // Track mistake for review
    const q = questions[currentQ];
    if (q) {
      setMistakes((prev) => [
        ...prev,
        {
          question: q.question,
          userAnswer: "Jawaban salah",
          correctAnswer: q.options[q.correctIndex] || "",
          explanation: q.explanation,
        },
      ]);
    }

    const heartUsed = useHeart();
    setLives((l) => {
      if (l <= 1) {
        setTimeout(() => setStep("complete"), 500);
        return 0;
      }
      return l - 1;
    });
  }, [topic.slug]);

  const handleNextQuestion = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setStep("complete");
      const pct = Math.round((score / totalQuestions) * 100);
      saveQuizScore(topic.slug, pct, false);
      if (pct >= 80) {
        const reward = completeTopic(topic.slug);
        const isDoubleXp = consumeDoubleXp();
        if (isDoubleXp) {
          addXp(reward.xp);
        }
        setShowConfetti(true);
        playCompleteSound();
        setXpGained(isDoubleXp ? reward.xp * 2 : reward.xp);
      } else {
        setXpGained(0);
      }
      setTimeout(() => setShowXp(true), 300);
    }
  }, [currentQ, totalQuestions, score, topic.slug]);

  const restart = () => {
    setStep("intro");
    const p = getProfile();
    setLives(p.hearts);
    setScore(0);
    setCurrentQ(0);
  };

  const levelLabel = { smp: "SMP", sma: "SMA", kuliah: "Universitas" }[topic.level];
  const levelColor = { smp: "bg-emerald-500", sma: "bg-[var(--duo-info)]", kuliah: "bg-[var(--duo-purple)]" }[topic.level];

  // ===== INTRO SCREEN =====
  if (step === "intro") {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] flex items-center justify-center p-6 pb-24 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-8 text-center">
              {/* Topic Icon */}
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[var(--duo-green-bg)] flex items-center justify-center text-5xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {topic.icon}
              </motion.div>

              {/* Level Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${levelColor}`}>
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                {levelLabel}
              </div>

              <h1 className="text-2xl font-black text-[var(--duo-text)] mb-2">{topic.title}</h1>
              <p className="text-sm text-[var(--duo-text-muted)] mb-6">{topic.description}</p>

              {/* Lesson Info */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: BookOpen, label: "Materi", value: "1" },
                  { icon: CheckCircle2, label: "Soal", value: `${totalQuestions}` },
                  { icon: Zap, label: "XP", value: isCompleted ? "Selesai" : "+25" },
                ].map((info) => (
                  <div key={info.label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <info.icon size={16} className="text-[var(--duo-green)] mx-auto mb-1" />
                    <p className="text-lg font-black text-[var(--duo-text)]">{info.value}</p>
                    <p className="text-[10px] text-[var(--duo-text-muted)]">{info.label}</p>
                  </div>
                ))}
              </div>

              <AnimatedButton
                onClick={() => setStep("content")}
                fullWidth
                size="lg"
                glow
              >
                Mulai Belajar
              </AnimatedButton>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ===== CONTENT SCREEN =====
  if (step === "content") {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] p-6 pb-24">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link href={`/topic/${topic.slug}`}>
                <motion.button
                  className="flex items-center gap-2 text-sm font-bold text-[var(--duo-text-muted)] hover:text-[var(--duo-text)]"
                  whileHover={{ x: -4 }}
                >
                  <ArrowLeft size={18} />
                  Kembali
                </motion.button>
              </Link>
              <HeartBar lives={lives} breaking={breaking} />
            </div>

            {/* Progress */}
            <div className="h-3 bg-[var(--duo-border)] rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-[var(--duo-green)] rounded-full progress-glow"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-8 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[var(--duo-green-bg)] rounded-lg flex items-center justify-center">
                  <BookOpen size={16} className="text-[var(--duo-green)]" />
                </div>
                <span className="text-xs font-bold text-[var(--duo-green)] uppercase">Materi</span>
              </div>
              <MathContent content={topic.content} />
            </motion.div>

            <AnimatedButton
              onClick={() => setStep("quiz")}
              fullWidth
              size="lg"
              glow
              iconRight={<ArrowRight size={18} />}
            >
              Mulai Quiz ({totalQuestions} soal)
            </AnimatedButton>
          </div>
        </main>
      </div>
    );
  }

  // ===== QUIZ SCREEN =====
  if (step === "quiz" && questions.length > 0) {
    const q = questions[currentQ];
    const quizTypes = ["choice", "fill", "truefalse"];
    const quizType = quizTypes[currentQ % quizTypes.length];

    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

        <main className="flex-1 ml-[260px] p-6 pb-24">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                onClick={() => setStep("content")}
                className="flex items-center gap-2 text-sm font-bold text-[var(--duo-text-muted)]"
                whileHover={{ x: -4 }}
              >
                <ArrowLeft size={18} />
                Keluar
              </motion.button>
              <HeartBar lives={lives} breaking={breaking} />
              <span className="text-sm font-bold text-[var(--duo-text-muted)]">
                {currentQ + 1}/{totalQuestions}
              </span>
            </div>

            {/* Progress */}
            <div className="h-3 bg-[var(--duo-border)] rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-[var(--duo-green)] rounded-full progress-glow"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Hint button — above every question */}
                {q.hints && q.hints.length > 0 && (
                  <div className="mb-4">
                    <HintButton hints={q.hints} />
                  </div>
                )}

                {q.type === "graph" && q.graph ? (
                  <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] p-6 border-2 border-[var(--duo-border)] shadow-lg">
                    <h3 className="text-lg font-black text-[var(--duo-text)] mb-4 text-center">{q.question}</h3>
                    <GraphPlotter
                      expression={q.graph.expression}
                      xMin={q.graph.xMin}
                      xMax={q.graph.xMax}
                      yMin={q.graph.yMin}
                      yMax={q.graph.yMax}
                      draggable
                      correctPoint={q.graph.correctPoint}
                    />
                    <button onClick={handleNextQuestion} className="w-full mt-4 py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all">
                      Lanjut →
                    </button>
                  </div>
                ) : q.type === "numberline" && q.numberLine ? (
                  <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] p-6 border-2 border-[var(--duo-border)] shadow-lg">
                    <h3 className="text-lg font-black text-[var(--duo-text)] mb-4 text-center">{q.question}</h3>
                    <NumberLineDrag
                      min={q.numberLine.min}
                      max={q.numberLine.max}
                      correctValue={q.numberLine.correctValue}
                      step={q.numberLine.step}
                      tolerance={q.numberLine.tolerance}
                      onCorrect={handleCorrect}
                      onWrong={handleWrong}
                    />
                    <button onClick={handleNextQuestion} className="w-full mt-4 py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all">
                      Lanjut →
                    </button>
                  </div>
                ) : q.type === "sorting" && q.sorting ? (
                  <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] p-6 border-2 border-[var(--duo-border)] shadow-lg">
                    <h3 className="text-lg font-black text-[var(--duo-text)] mb-4 text-center">{q.question}</h3>
                    <SortingQuestion
                      items={q.sorting.items}
                      correctOrder={q.sorting.correctOrder}
                      label={q.sorting.label}
                      onCorrect={handleCorrect}
                      onWrong={handleWrong}
                    />
                    <button onClick={handleNextQuestion} className="w-full mt-4 py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all">
                      Lanjut →
                    </button>
                  </div>
                ) : q.type === "equation" && q.equation ? (
                  <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] p-6 border-2 border-[var(--duo-border)] shadow-lg">
                    <h3 className="text-lg font-black text-[var(--duo-text)] mb-4 text-center">{q.question}</h3>
                    <EquationBuilder
                      steps={q.equation.steps}
                      onComplete={(ok) => ok ? handleCorrect() : handleWrong()}
                    />
                    <button onClick={handleNextQuestion} className="w-full mt-4 py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all">
                      Lanjut →
                    </button>
                  </div>
                ) : quizType === "fill" ? (
                  <FillBlank
                    question={q.question}
                    correctAnswer={
                      q.alternatives && q.alternatives.length > 0
                        ? [q.options[q.correctIndex], ...q.alternatives]
                        : q.options[q.correctIndex]
                    }
                    explanation={q.explanation}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                    onNext={handleNextQuestion}
                  />
                ) : quizType === "truefalse" ? (
                  <TrueFalse
                    question={q.question}
                    isCorrect={q.correctIndex === 0}
                    explanation={q.explanation}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                    onNext={handleNextQuestion}
                  />
                ) : (
                  <MultipleChoice
                    question={q.question}
                    options={q.options}
                    correctIndex={q.correctIndex}
                    explanation={q.explanation}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                    onNext={handleNextQuestion}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mascot */}
        <div className="fixed bottom-20 right-6 lg:bottom-6 z-40">
          <QuizMascot
            combo={combo}
            hearts={lives}
            maxHearts={profile.maxHearts}
            lastAnswerCorrect={lastAnswerCorrect}
            isComplete={false}
            score={0}
          />
        </div>
      </div>
    );
  }

  // ===== COMPLETE SCREEN =====
  const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />
      <Confetti show={pct >= 80} />
      <XpPopup amount={xpGained} show={showXp} onComplete={() => setShowXp(false)} />

      <main className="flex-1 ml-[260px] flex items-center justify-center p-6 pb-24 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-8 text-center">
            {/* Mascot */}
            <div className="mb-4">
              <QuizMascot
                combo={0}
                hearts={lives}
                maxHearts={profile.maxHearts}
                lastAnswerCorrect={null}
                isComplete={true}
                score={pct}
              />
            </div>

            {/* Trophy */}
            <motion.div
              className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                pct >= 80 ? "bg-[var(--duo-xp)]" : "bg-gray-100 dark:bg-gray-800"
              }`}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {pct >= 80 ? (
                <Trophy size={48} className="text-[#8B6914]" />
              ) : (
                <Star size={48} className="text-gray-400" />
              )}
            </motion.div>

            <h1 className="text-2xl font-black text-[var(--duo-text)] mb-2">
              {pct >= 80 ? "Luar Biasa!" : pct >= 50 ? "Bagus!" : "Terus Belajar!"}
            </h1>
            <p className="text-sm text-[var(--duo-text-muted)] mb-6">
              {pct >= 80 ? "Kamu menyelesaikan lesson dengan sempurna!" : "Coba lagi untuk dapat XP lebih banyak!"}
            </p>

            {/* Score Ring */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--duo-border)" strokeWidth="6" />
                <motion.circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={pct >= 80 ? "var(--duo-green)" : pct >= 50 ? "var(--duo-info)" : "var(--duo-danger)"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={351.86}
                  initial={{ strokeDashoffset: 351.86 }}
                  animate={{ strokeDashoffset: 351.86 - (pct / 100) * 351.86 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[var(--duo-text)]">{pct}%</span>
                <span className="text-xs text-[var(--duo-text-muted)]">{score}/{totalQuestions}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Benar", value: score, color: "text-[var(--duo-green)]", bg: "bg-[var(--duo-green-bg)]" },
                { label: "Salah", value: totalQuestions - score, color: "text-[var(--duo-danger)]", bg: "bg-red-50 dark:bg-red-950/30" },
                { label: "XP", value: xpGained, color: "text-[var(--duo-xp)]", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
              ].map((stat) => (
                <div key={stat.label} className={`p-3 rounded-xl ${stat.bg}`}>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-[var(--duo-text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Mistake Review */}
            {mistakes.length > 0 && (
              <div className="mb-6 text-left">
                <MistakeReview
                  mistakes={mistakes}
                  onRetry={restart}
                  onDone={() => {}}
                />
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {pct < 80 && (
                <AnimatedButton onClick={restart} fullWidth variant="outline" icon={<RotateCcw size={16} />}>
                  Coba Lagi
                </AnimatedButton>
              )}
              <Link href="/">
                <AnimatedButton fullWidth variant="primary" icon={<Home size={16} />}>
                  Ke Beranda
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
