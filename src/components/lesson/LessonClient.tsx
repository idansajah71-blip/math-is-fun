"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MathContent from "@/components/MathContent";
import HeartBar from "@/components/ui/HeartBar";
import XpPopup from "@/components/ui/XpPopup";
import Confetti from "@/components/ui/Confetti";
import Mascot from "@/components/game/Mascot";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { playCorrectSound, playWrongSound, playLevelUpSound, playCompleteSound } from "@/lib/sounds";
import { completeTopic, saveQuizScore, getProfile } from "@/lib/gamification";
import { quizzes } from "@/lib/quizzes";
import { springBounce, staggerContainer, staggerItem } from "@/lib/animations";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw,
  Home, Star, Zap, Trophy, ChevronRight, BookOpen,
} from "lucide-react";
import Link from "next/link";
import type { Topic } from "@/lib/types";
import MultipleChoice from "@/components/lesson/MultipleChoice";
import FillBlank from "@/components/lesson/FillBlank";
import TrueFalse from "@/components/lesson/TrueFalse";

type LessonStep = "intro" | "content" | "quiz" | "complete";

interface LessonClientProps {
  topic: Topic;
  related: Topic[];
}

export default function LessonClient({ topic, related }: LessonClientProps) {
  const [step, setStep] = useState<LessonStep>("intro");
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  const topicQuizzes = quizzes.filter((q) => q.topicSlug === topic.slug);
  const totalQuestions = Math.min(topicQuizzes.length, 5);
  const questions = topicQuizzes.slice(0, totalQuestions);
  const progress = totalQuestions > 0 ? ((currentQ) / totalQuestions) * 100 : 0;

  const profile = getProfile();
  const isCompleted = profile.completedTopics?.includes(topic.slug);

  const handleCorrect = useCallback(() => {
    playCorrectSound();
    setScore((s) => s + 1);
  }, []);

  const handleWrong = useCallback(() => {
    playWrongSound();
    setBreaking(true);
    setTimeout(() => setBreaking(false), 500);
    setLives((l) => {
      if (l <= 1) {
        setTimeout(() => setStep("complete"), 500);
        return 0;
      }
      return l - 1;
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setStep("complete");
      const pct = Math.round((score / totalQuestions) * 100);
      saveQuizScore(topic.slug, pct, false);
      if (pct >= 80) {
        completeTopic(topic.slug);
        setShowConfetti(true);
        playCompleteSound();
        setXpGained(25);
      } else {
        setXpGained(score * 10);
      }
      setTimeout(() => setShowXp(true), 300);
    }
  }, [currentQ, totalQuestions, score, topic.slug]);

  const restart = () => {
    setStep("intro");
    setLives(5);
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
                  { icon: Zap, label: "XP", value: "+100" },
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
    const quizTypes = ["choice", "fill"];
    const quizType = quizTypes[currentQ % quizTypes.length];

    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <XpPopup amount={score * 10} show={showXp} onComplete={() => setShowXp(false)} />
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
                {quizType === "fill" ? (
                  <FillBlank
                    question={q.question}
                    correctAnswer={q.options[q.correctIndex]}
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
          <Mascot
            mood={lives <= 2 ? "sad" : "thinking"}
            size={70}
            message={lives <= 2 ? "Hati-hati!" : undefined}
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
