"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MathContent from "@/components/MathContent";
import HeartBar from "@/components/ui/HeartBar";
import XpPopup from "@/components/ui/XpPopup";
import Confetti from "@/components/ui/Confetti";
import LevelUpModal from "@/components/ui/LevelUpModal";
import BadgeUnlockModal from "@/components/ui/BadgeUnlockModal";
import QuizMascot from "@/components/game/QuizMascot";
import Mascot from "@/components/game/Mascot";
import NumberLineDrag from "@/components/lesson/NumberLineDrag";
import SortingQuestion from "@/components/lesson/SortingQuestion";
import EquationBuilder from "@/components/lesson/EquationBuilder";
import HintButton from "@/components/lesson/HintButton";
import MistakeReview from "@/components/lesson/MistakeReview";
import type { MistakeItem } from "@/components/lesson/MistakeReview";
import GraphPlotter from "@/components/math/GraphPlotter";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { playCorrectSound, playWrongSound, playCompleteSound, playLevelUpSound } from "@/lib/sounds";
import {
  completeTopic, saveQuizScore, getProfile, trackWrongAnswer, useHeart,
  consumeDoubleXp, addXp, BADGES, LEVEL_NAMES, recordReview,
} from "@/lib/gamification";
import { getAllQuizzes } from "@/lib/data";
import {
  ArrowLeft, ArrowRight, CheckCircle2, RotateCcw,
  Home, Star, Zap, Trophy, BookOpen, Flame, Target,
  Sparkles, Crown, Gem, Rocket, Brain, XCircle,
} from "lucide-react";
import Link from "next/link";
import type { Topic } from "@/lib/types";
import MultipleChoice from "@/components/lesson/MultipleChoice";
import FillBlank from "@/components/lesson/FillBlank";
import TrueFalse from "@/components/lesson/TrueFalse";
import { springGentle, springBounce, popIn, correctFlash, wrongShake } from "@/lib/animations";
import { renderIcon, InlineIcon } from "@/lib/iconMap";

type LessonStep = "intro" | "content" | "quiz" | "complete";

interface LessonClientProps {
  topic: Topic;
  related?: Topic[];
}

interface ComboToast {
  id: number;
  value: number;
}

export default function LessonClient({ topic }: LessonClientProps) {
  const [step, setStep] = useState<LessonStep>("intro");
  const profileRef = useRef(getProfile());
  const [lives, setLives] = useState(profileRef.current.hearts);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [comboToasts, setComboToasts] = useState<ComboToast[]>([]);
  const [questionAnimated, setQuestionAnimated] = useState<"correct" | "wrong" | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<typeof BADGES[0] | null>(null);
  const [startTime] = useState(Date.now());
  const [answered, setAnswered] = useState(false);

  const topicQuizzes = getAllQuizzes().filter((q) => q.topicSlug === topic.slug);
  const totalQuestions = Math.min(topicQuizzes.length, 5);
  const questions = topicQuizzes.slice(0, totalQuestions);
  const progress = totalQuestions > 0 ? ((currentQ) / totalQuestions) * 100 : 0;

  const isCompleted = profileRef.current.completedTopics?.includes(topic.slug);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (step !== "quiz" || answered) return;
      const q = questions[currentQ];
      if (!q) return;

      if (["1", "2", "3", "4"].includes(e.key) && (!q.type || q.type === "choice")) {
        const idx = parseInt(e.key) - 1;
        if (idx < q.options.length) {
          const btn = document.querySelector(`[data-mc-option="${idx}"]`) as HTMLButtonElement;
          btn?.click();
        }
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNextQuestion();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step, currentQ, questions, answered]);

  const showComboToast = (comboValue: number) => {
    if (comboValue >= 3 && comboValue % 3 === 0) {
      const id = Date.now();
      setComboToasts((prev) => [...prev, { id, value: comboValue }]);
      setTimeout(() => {
        setComboToasts((prev) => prev.filter((t) => t.id !== id));
      }, 1500);
    }
  };

  const handleCorrect = useCallback(() => {
    playCorrectSound();
    setScore((s) => s + 1);
    setCombo((c) => {
      const newCombo = c + 1;
      setMaxCombo((m) => Math.max(m, newCombo));
      showComboToast(newCombo);
      return newCombo;
    });
    setLastAnswerCorrect(true);
    setQuestionAnimated("correct");
    setAnswered(true);
    setTimeout(() => setQuestionAnimated(null), 600);
  }, []);

  const handleWrong = useCallback(() => {
    playWrongSound();
    trackWrongAnswer(topic.slug);
    setBreaking(true);
    setTimeout(() => setBreaking(false), 500);
    setCombo(0);
    setLastAnswerCorrect(false);
    setQuestionAnimated("wrong");
    setAnswered(true);
    setTimeout(() => setQuestionAnimated(null), 600);

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
        setTimeout(() => finishLesson(), 700);
        return 0;
      }
      return l - 1;
    });
  }, [topic.slug, currentQ]);

  const checkNewBadges = useCallback((oldBadges: string[], newBadges: string[]) => {
    const diff = newBadges.filter((b) => !oldBadges.includes(b));
    if (diff.length > 0) {
      const badgeData = BADGES.find((b) => b.id === diff[diff.length - 1]);
      if (badgeData) {
        setUnlockedBadge(badgeData);
        setTimeout(() => setShowBadgeUnlock(true), 2000);
      }
    }
  }, []);

  const finishLesson = useCallback(() => {
    setStep("complete");
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const oldProfile = getProfile();
    const oldBadges = [...oldProfile.badges];
    const oldLevel = oldProfile.level;

    const studyMinutes = Math.floor((Date.now() - startTime) / 60000);
    const updatedProfile = { ...oldProfile, totalStudyTime: (oldProfile.totalStudyTime || 0) + studyMinutes };
    require("@/lib/gamification").saveProfile(updatedProfile);

    saveQuizScore(topic.slug, pct, true);
    recordReview(topic.slug, pct >= 80 ? 5 : pct >= 60 ? 4 : pct >= 40 ? 3 : pct >= 20 ? 2 : 1);

    let totalXp = 0;
    if (pct >= 80) {
      const reward = completeTopic(topic.slug);
      const isDoubleXp = consumeDoubleXp();
      if (isDoubleXp) {
        addXp(reward.xp);
        totalXp = reward.xp * 2;
      } else {
        totalXp = reward.xp;
      }

      const comboBonus = maxCombo >= 5 ? 20 : maxCombo >= 3 ? 10 : 0;
      if (comboBonus > 0) {
        addXp(comboBonus);
        totalXp += comboBonus;
      }

      setShowConfetti(true);
      playCompleteSound();
    }

    setXpGained(totalXp);
    setTimeout(() => setShowXp(true), 400);

    const newProfile = getProfile();
    checkNewBadges(oldBadges, newProfile.badges);
    if (newProfile.level > oldLevel) {
      setNewLevel(newProfile.level);
      playLevelUpSound();
      setTimeout(() => setShowLevelUp(true), 1200);
    }
  }, [score, totalQuestions, topic.slug, startTime, maxCombo, checkNewBadges]);

  const handleNextQuestion = useCallback(() => {
    setAnswered(false);
    setLastAnswerCorrect(null);
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      finishLesson();
    }
  }, [currentQ, totalQuestions, finishLesson]);

  const restart = () => {
    setStep("intro");
    profileRef.current = getProfile();
    setLives(profileRef.current.hearts);
    setScore(0);
    setCurrentQ(0);
    setCombo(0);
    setMaxCombo(0);
    setMistakes([]);
    setAnswered(false);
  };

  const levelLabel = { smp: "SMP", sma: "SMA", kuliah: "Universitas" }[topic.level];
  const levelColor = {
    smp: "from-emerald-500 to-green-400",
    sma: "from-[var(--duo-info)] to-[#4DC9FF]",
    kuliah: "from-[var(--duo-purple)] to-[var(--duo-pink)]",
  }[topic.level];
  const levelBadgeBg = {
    smp: "bg-emerald-500/15 border-emerald-500/30",
    sma: "bg-[var(--duo-info)]/15 border-[var(--duo-info)]/30",
    kuliah: "bg-[var(--duo-purple)]/15 border-[var(--duo-purple)]/30",
  }[topic.level];
  const levelTextColor = {
    smp: "text-emerald-500",
    sma: "text-[var(--duo-info)]",
    kuliah: "text-[var(--duo-purple)]",
  }[topic.level];

  const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const studyTime = Math.floor((Date.now() - startTime) / 60000);

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <LevelUpModal
        show={showLevelUp}
        level={newLevel}
        oldLevel={newLevel - 1}
        onClose={() => setShowLevelUp(false)}
        rewards={{ xp: 50, gems: 25 }}
      />

      <BadgeUnlockModal
        show={showBadgeUnlock}
        badge={unlockedBadge}
        onClose={() => {
          setShowBadgeUnlock(false);
          setUnlockedBadge(null);
        }}
      />

      {/* ===== INTRO SCREEN ===== */}
      {step === "intro" && (
        <main className="flex-1 ml-[260px] flex items-center justify-center p-6 pb-24 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={springBounce}
            className="max-w-lg w-full"
          >
            <div className="relative bg-white dark:bg-[var(--surface)] rounded-[32px] border-2 border-[var(--border)] p-8 text-center overflow-hidden shadow-2xl">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: `linear-gradient(135deg, var(--duo-green), var(--duo-info))` }} />
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-20 blur-3xl" style={{ background: `linear-gradient(135deg, var(--duo-purple), var(--duo-pink))` }} />

              <div className="relative">
                <motion.div
                  className={`w-28 h-28 mx-auto mb-5 rounded-[28px] bg-gradient-to-br ${levelColor} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                  animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                  <div className="relative text-white">
                    {renderIcon(topic.icon, 52)}
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--duo-xp)] flex items-center justify-center border-2 border-white shadow-lg"
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap size={14} className="text-[#8B6914]" fill="#fff7" />
                  </motion.div>
                </motion.div>

                <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black mb-4 border-2 ${levelBadgeBg} ${levelTextColor}`}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "currentColor" }} />
                  {levelLabel}
                </div>

                <h1 className="text-3xl font-black text-[var(--fg)] mb-2 tracking-tight">{topic.title}</h1>
                <p className="text-sm text-[var(--fg-secondary)] mb-6 leading-relaxed max-w-xs mx-auto">{topic.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-7">
                  {[
                    { icon: BookOpen, label: "Materi", value: "1", color: "from-[var(--primary)] to-[var(--duo-green-light)]" },
                    { icon: Target, label: "Soal", value: `${totalQuestions}`, color: "from-[var(--duo-info)] to-[#4DC9FF]" },
                    { icon: Zap, label: "XP", value: isCompleted ? "✓" : "+25", color: "from-[var(--duo-xp)] to-[var(--duo-orange)]" },
                  ].map((info, i) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className={`relative p-4 rounded-2xl bg-gradient-to-br ${info.color} p-[2px] shadow-lg`}
                    >
                      <div className="bg-white dark:bg-[var(--surface)] rounded-[14px] p-3 w-full h-full">
                        <info.icon size={18} className={`mx-auto mb-1.5 bg-gradient-to-br ${info.color} bg-clip-text text-transparent`} style={{ color: i === 0 ? "var(--primary)" : i === 1 ? "var(--duo-info)" : "var(--duo-xp)" }} />
                        <p className="text-xl font-black text-[var(--fg)]">{info.value}</p>
                        <p className="text-[10px] text-[var(--fg-muted)] font-semibold">{info.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 rounded-2xl bg-[var(--primary-bg)] border-2 border-[var(--primary)]/30 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} className="text-[var(--primary)]" />
                    <span className="text-xs font-black text-[var(--primary)]">Kamu sudah menyelesaikan materi ini!</span>
                  </motion.div>
                )}

                <div className="flex items-center justify-center gap-3 mb-6 text-xs text-[var(--fg-muted)] font-semibold">
                  <span className="flex items-center gap-1"><Flame size={12} className="text-[var(--duo-orange)]" /> {profileRef.current.streak} hari streak</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Gem size={12} className="text-[var(--duo-purple)]" /> {profileRef.current.gems} gems</span>
                </div>

                <AnimatedButton
                  onClick={() => setStep("content")}
                  fullWidth
                  size="xl"
                  glow
                  icon={<Rocket size={20} />}
                >
                  <span className="flex items-center gap-1.5">Mulai Petualangan! <InlineIcon emoji="🚀" size={16} /></span>
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        </main>
      )}

      {/* ===== CONTENT SCREEN ===== */}
      {step === "content" && (
        <main className="flex-1 ml-[260px] p-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 text-sm font-black text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                  whileHover={{ x: -4 }}
                >
                  <ArrowLeft size={18} />
                  Kembali
                </motion.button>
              </Link>
              <HeartBar lives={lives} breaking={breaking} />
            </div>

            <div className="h-3.5 bg-[var(--border)] rounded-full mb-7 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--duo-green-light)] to-[var(--primary)] rounded-full progress-glow shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, type: "spring", stiffness: 80, damping: 20 }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springGentle}
              className="relative bg-white dark:bg-[var(--surface)] rounded-[28px] border-2 border-[var(--border)] p-8 mb-6 overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--duo-info)] to-[var(--duo-purple)]" />
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 blur-2xl" style={{ background: "var(--primary)" }} />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${levelColor} flex items-center justify-center shadow-lg`}>
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <span className={`text-xs font-black uppercase tracking-wider ${levelTextColor}`}>📖 Materi Belajar</span>
                    <h2 className="text-xl font-black text-[var(--fg)]">{topic.title}</h2>
                  </div>
                </div>

                <div className="relative">
                  <MathContent content={topic.content} />
                </div>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-[var(--duo-purple)]/10 to-[var(--duo-pink)]/10 border-2 border-[var(--duo-purple)]/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Brain size={14} className="text-[var(--duo-purple)]" />
                  <span className="text-xs font-black text-[var(--duo-purple)]">TIPS</span>
                </div>
                <p className="text-xs text-[var(--fg-secondary)] font-semibold leading-relaxed">
                  Pahami konsepnya pelan-pelan ya. Boleh baca berulang sampai paham! 💡
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-[var(--duo-xp)]/10 to-[var(--duo-orange)]/10 border-2 border-[var(--duo-xp)]/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-[var(--duo-xp)]" />
                  <span className="text-xs font-black text-gradient-xp">REWARD</span>
                </div>
                <p className="text-xs text-[var(--fg-secondary)] font-semibold leading-relaxed">
                  Jawab benar semua soal = dapatkan <span className="font-black text-gradient-xp">XP +25 & Gems +5!</span>
                </p>
              </motion.div>
            </div>

            <AnimatedButton
              onClick={() => setStep("quiz")}
              fullWidth
              size="xl"
              glow
              iconRight={<ArrowRight size={20} />}
            >
              Lanjut ke Quiz ({totalQuestions} Soal)
            </AnimatedButton>
          </div>
        </main>
      )}

      {/* ===== QUIZ SCREEN ===== */}
      {step === "quiz" && questions.length > 0 && (
        <>
          <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
          <AnimatePresence>
            {comboToasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 40, scale: 0.5 }}
                animate={{ opacity: 1, y: -30, scale: 1 }}
                exit={{ opacity: 0, y: -80, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] pointer-events-none"
              >
                <div className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--duo-orange)] via-[var(--duo-danger)] to-[var(--duo-orange)] text-white shadow-2xl bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]">
                  <div className="flex items-center gap-3">
                    <Flame size={22} fill="#fff6" />
                    <div className="text-center leading-tight">
                      <p className="text-lg font-black tracking-tight">{toast.value}x COMBO!</p>
                      <p className="text-[10px] font-bold opacity-90">+10 XP Bonus 🔥</p>
                    </div>
                    <Sparkles size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <main className="flex-1 ml-[260px] p-6 pb-24">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  onClick={() => setStep("content")}
                  className="flex items-center gap-2 text-sm font-black text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                  whileHover={{ x: -4 }}
                >
                  <ArrowLeft size={18} />
                  Keluar
                </motion.button>

                <div className="flex items-center gap-2">
                  {combo >= 2 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--duo-orange)]/20 to-[var(--duo-danger)]/20 border border-[var(--duo-orange)]/40"
                    >
                      <Flame size={14} className="text-[var(--duo-orange)]" fill="currentColor" fillOpacity={0.3} />
                      <span className="text-xs font-black text-[var(--duo-orange)]">{combo}x</span>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <HeartBar lives={lives} breaking={breaking} />
                  <span className="text-sm font-black text-[var(--fg-muted)] bg-[var(--border-subtle)] px-3 py-1.5 rounded-xl">
                    {currentQ + 1}<span className="text-[var(--fg-disabled)]">/</span>{totalQuestions}
                  </span>
                </div>
              </div>

              <div className="h-3.5 bg-[var(--border)] rounded-full mb-7 overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--duo-green-light)] to-[var(--primary)] rounded-full progress-glow shadow-lg"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    borderColor: questionAnimated === "correct" ? "#22c55e" : questionAnimated === "wrong" ? "#FF4B4B" : "var(--border)",
                  }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={springGentle}
                  className={`relative bg-white dark:bg-[var(--surface)] rounded-[28px] border-2 overflow-hidden shadow-xl ${
                    questionAnimated === "correct" ? "ring-4 ring-green-500/20" : questionAnimated === "wrong" ? "ring-4 ring-red-500/20 animate-shake" : ""
                  }`}
                >
                  {(() => {
                    const q = questions[currentQ];
                    const quizTypes = ["choice", "fill", "truefalse"];
                    const quizType = quizTypes[currentQ % quizTypes.length];

                    return (
                      <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--duo-info)]/20 to-[var(--duo-purple)]/20 border border-[var(--duo-info)]/30 flex items-center justify-center">
                              <Brain size={16} className="text-[var(--duo-info)]" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--fg-muted)]">Soal {currentQ + 1}</span>
                              <p className="text-[10px] font-bold text-[var(--duo-info)] flex items-center gap-1">
                                {q.type === "graph" ? (<><InlineIcon emoji="📍" size={10} /> Graf</>)
                                 : q.type === "numberline" ? (<><InlineIcon emoji="📏" size={10} /> Number Line</>)
                                 : q.type === "sorting" ? (<><InlineIcon emoji="🔢" size={10} /> Sorting</>)
                                 : q.type === "equation" ? (<><InlineIcon emoji="📝" size={10} /> Persamaan</>)
                                 : quizType === "fill" ? (<><InlineIcon emoji="✍️" size={10} /> Isian</>)
                                 : quizType === "truefalse" ? (<><InlineIcon emoji="✅" size={10} /> Benar/Salah</>)
                                 : (<><InlineIcon emoji="🎯" size={10} /> Pilihan Ganda</>)}
                              </p>
                            </div>
                          </div>

                          {q.hints && q.hints.length > 0 && (
                            <div className="shrink-0">
                              <HintButton hints={q.hints} />
                            </div>
                          )}
                        </div>

                        {q.type === "graph" && q.graph ? (
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-[var(--fg)] mb-5 text-center leading-snug">{q.question}</h3>
                            <GraphPlotter
                              expression={q.graph.expression}
                              xMin={q.graph.xMin}
                              xMax={q.graph.xMax}
                              yMin={q.graph.yMin}
                              yMax={q.graph.yMax}
                              draggable
                              correctPoint={q.graph.correctPoint}
                            />
                            <AnimatedButton onClick={handleNextQuestion} fullWidth size="lg" className="mt-5" iconRight={<ArrowRight size={18} />}>
                              {answered ? "Lanjut" : "Konfirmasi"}
                            </AnimatedButton>
                          </div>
                        ) : q.type === "numberline" && q.numberLine ? (
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-[var(--fg)] mb-5 text-center leading-snug">{q.question}</h3>
                            <NumberLineDrag
                              min={q.numberLine.min}
                              max={q.numberLine.max}
                              correctValue={q.numberLine.correctValue}
                              step={q.numberLine.step}
                              tolerance={q.numberLine.tolerance}
                              onCorrect={handleCorrect}
                              onWrong={handleWrong}
                            />
                            <AnimatedButton onClick={handleNextQuestion} fullWidth size="lg" className="mt-5" iconRight={<ArrowRight size={18} />}>
                              Lanjut 
                            </AnimatedButton>
                          </div>
                        ) : q.type === "sorting" && q.sorting ? (
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-[var(--fg)] mb-5 text-center leading-snug">{q.question}</h3>
                            <SortingQuestion
                              items={q.sorting.items}
                              correctOrder={q.sorting.correctOrder}
                              label={q.sorting.label}
                              onCorrect={handleCorrect}
                              onWrong={handleWrong}
                            />
                            <AnimatedButton onClick={handleNextQuestion} fullWidth size="lg" className="mt-5" iconRight={<ArrowRight size={18} />}>
                              Lanjut 
                            </AnimatedButton>
                          </div>
                        ) : q.type === "equation" && q.equation ? (
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-[var(--fg)] mb-5 text-center leading-snug">{q.question}</h3>
                            <EquationBuilder
                              steps={q.equation.steps}
                              onComplete={(ok) => ok ? handleCorrect() : handleWrong()}
                            />
                            <AnimatedButton onClick={handleNextQuestion} fullWidth size="lg" className="mt-5" iconRight={<ArrowRight size={18} />}>
                              Lanjut 
                            </AnimatedButton>
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
                      </div>
                    );
                  })()}

                  <AnimatePresence>
                    {questionAnimated && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none`}
                      >
                        <div className={`px-6 py-4 rounded-3xl flex items-center gap-3 shadow-2xl border-4 ${
                          questionAnimated === "correct"
                            ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white border-white/30"
                            : "bg-gradient-to-br from-red-500 to-rose-600 text-white border-white/30"
                        }`}>
                          {questionAnimated === "correct" ? (
                            <>
                              <motion.div
                                animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                              >
                                <CheckCircle2 size={28} strokeWidth={3} />
                              </motion.div>
                              <div>
                                <p className="text-xl font-black">BENAR!</p>
                                <p className="text-xs font-bold opacity-90">+10 XP 🔥</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={{ scale: [1, 1.3, 1], x: [0, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                              >
                                <XCircle size={28} strokeWidth={3} />
                              </motion.div>
                              <div>
                                <p className="text-xl font-black">SALAH</p>
                                <p className="text-xs font-bold opacity-90 flex items-center gap-1">Ayo coba lagi! <InlineIcon emoji="💪" size={11} /></p>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="fixed bottom-20 right-5 lg:bottom-6 z-40"
          >
            <QuizMascot
              combo={combo}
              hearts={lives}
              maxHearts={profileRef.current.maxHearts}
              lastAnswerCorrect={lastAnswerCorrect}
              isComplete={false}
              score={score}
            />
          </motion.div>
        </>
      )}

      {/* ===== COMPLETE SCREEN ===== */}
      {step === "complete" && (
        <>
          <Confetti show={pct >= 80} duration={5000} particleCount={200} />
          <XpPopup amount={xpGained} show={showXp} onComplete={() => setShowXp(false)} />

          <main className="flex-1 ml-[260px] flex items-center justify-center p-6 pb-24 lg:pb-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={springBounce}
              className="max-w-lg w-full"
            >
              <div className="relative bg-white dark:bg-[var(--surface)] rounded-[32px] border-2 border-[var(--border)] p-8 text-center overflow-hidden shadow-2xl">
                <div className={`absolute -top-28 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl ${
                  pct >= 80 ? "bg-gradient-to-br from-[var(--duo-xp)] to-[var(--primary)]" : pct >= 50 ? "bg-gradient-to-br from-[var(--duo-info)] to-[var(--duo-purple)]" : "bg-gradient-to-br from-[var(--border)] to-[var(--fg-muted)]"
                }`} />

                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4 mx-auto"
                  >
                    <div className="w-24 h-24 mx-auto">
                      <Mascot
                        mood={pct >= 80 ? "celebrate" : pct >= 50 ? "happy" : "thinking"}
                        size={96}
                        level={profileRef.current.level}
                        interactive={false}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 }}
                    className={`w-28 h-28 mx-auto mb-5 rounded-full flex items-center justify-center shadow-2xl relative ${
                      pct >= 80
                        ? "bg-gradient-to-br from-[var(--duo-xp)] via-[var(--duo-orange)] to-[var(--duo-xp)] bg-[length:200%_200%] animate-[shimmer_2s_infinite]"
                        : pct >= 50
                        ? "bg-gradient-to-br from-[var(--duo-info)] to-[#4DC9FF]"
                        : "bg-gradient-to-br from-[var(--border-strong)] to-[var(--border)]"
                    }`}
                  >
                    {pct >= 80 ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        >
                          <Trophy size={52} className="text-[#5C4300]" fill="#FFF3B0" />
                        </motion.div>
                        <motion.div
                          className="absolute -top-2 -right-1"
                          animate={{ y: [0, -4, 0], rotate: [-10, 10, -10] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          <Crown size={22} className="text-[var(--duo-xp)]" fill="currentColor" />
                        </motion.div>
                      </>
                    ) : pct >= 50 ? (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Star size={52} className="text-white" fill="currentColor" fillOpacity={0.4} />
                      </motion.div>
                    ) : (
                      <BookOpen size={48} className="text-white/80" />
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-3xl font-black text-[var(--fg)] mb-2 tracking-tight flex items-center justify-center gap-2">
                      {pct >= 100 ? (<><InlineIcon emoji="🌟" size={28} /> SEMPURNA!</>)
                       : pct >= 80 ? (<><InlineIcon emoji="🏆" size={26} /> Luar Biasa!</>)
                       : pct >= 50 ? (<><InlineIcon emoji="👍" size={24} /> Bagus!</>)
                       : (<><InlineIcon emoji="💪" size={24} /> Ayo Coba Lagi!</>)}
                    </h1>
                    <p className="text-sm text-[var(--fg-secondary)] mb-6 max-w-xs mx-auto leading-relaxed">
                      {pct >= 100
                        ? (<span className="flex items-center justify-center gap-1">Wah kamu menjawab semua soal dengan benar! Hebat banget! <InlineIcon emoji="✨" size={12} /></span>)
                        : pct >= 80
                        ? "Kamu menyelesaikan quiz dengan hasil yang sangat memuaskan!"
                        : pct >= 50
                        ? "Pekerjaan bagus! Masih ada ruang untuk berkembang lho!"
                        : "Jangan menyerah! Coba lagi dan kamu pasti bisa lebih baik!"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                    className="relative w-40 h-40 mx-auto mb-6"
                  >
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={pct >= 80 ? "#58CC02" : pct >= 50 ? "#1CB0F6" : "#FF4B4B"} />
                          <stop offset="100%" stopColor={pct >= 80 ? "#FFD900" : pct >= 50 ? "#CE82FF" : "#FF9600"} />
                        </linearGradient>
                      </defs>
                      <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="10" />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#scoreGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={439.82}
                        initial={{ strokeDashoffset: 439.82 }}
                        animate={{ strokeDashoffset: 439.82 - (pct / 100) * 439.82 }}
                        transition={{ duration: 1.5, delay: 0.5, type: "spring", stiffness: 60, damping: 18 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                        className="text-5xl font-black bg-gradient-to-br from-[var(--fg)] to-[var(--fg-secondary)] bg-clip-text text-transparent"
                      >
                        {pct}%
                      </motion.span>
                      <span className="text-sm font-bold text-[var(--fg-muted)]">{score}/{totalQuestions} Benar</span>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6"
                  >
                    {[
                      { label: "Benar", value: score, icon: CheckCircle2, color: "from-green-500 to-emerald-400", textColor: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
                      { label: "Salah", value: totalQuestions - score, icon: XCircle, color: "from-red-500 to-rose-400", textColor: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
                      { label: "Combo", value: `x${maxCombo}`, icon: Flame, color: "from-orange-500 to-red-400", textColor: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
                      { label: "Waktu", value: `${studyTime || 1}m`, icon: Target, color: "from-blue-500 to-cyan-400", textColor: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        className={`relative p-3 rounded-2xl ${stat.bg} border border-[var(--border-subtle)] overflow-hidden`}
                      >
                        <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} opacity-15`} />
                        <stat.icon size={14} className={`mx-auto mb-1.5 ${stat.textColor}`} />
                        <p className={`text-lg font-black ${stat.textColor}`}>{stat.value}</p>
                        <p className="text-[9px] font-bold text-[var(--fg-muted)]">{stat.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {xpGained > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1 }}
                      className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--duo-xp)]/20 via-[var(--duo-orange)]/20 to-[var(--duo-xp)]/20 border-2 border-[var(--duo-xp)]/40 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%)] bg-[length:200%_200%] animate-[shimmer_2s_infinite]" />
                      <div className="relative flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--duo-xp)] to-[var(--duo-orange)] flex items-center justify-center shadow-lg">
                            <Zap size={18} className="text-[#5C4300]" fill="#fff7" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-[var(--fg-muted)]">XP Didapat</p>
                            <p className="text-xl font-black text-gradient-xp">+{xpGained}</p>
                          </div>
                        </div>
                        <div className="w-px h-10 bg-[var(--duo-xp)]/30" />
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--duo-purple)] to-[var(--duo-pink)] flex items-center justify-center shadow-lg">
                            <Gem size={18} className="text-white" fill="currentColor" fillOpacity={0.3} />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-[var(--fg-muted)]">Gems Bonus</p>
                            <p className="text-xl font-black text-[var(--duo-purple)]">+{pct >= 80 ? 5 : 0}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {mistakes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      className="mb-6 text-left"
                    >
                      <MistakeReview
                        mistakes={mistakes}
                        onRetry={restart}
                        onDone={() => {}}
                      />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="space-y-3"
                  >
                    {pct < 80 && (
                      <AnimatedButton
                        onClick={restart}
                        fullWidth
                        variant="outline"
                        size="lg"
                        icon={<RotateCcw size={16} />}
                      >
                        Coba Lagi — Dapatkan Sempurna!
                      </AnimatedButton>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/practice">
                        <AnimatedButton fullWidth variant="info" size="lg" icon={<Brain size={16} />}>
                          Latihan Lagi
                        </AnimatedButton>
                      </Link>
                      <Link href="/">
                        <AnimatedButton fullWidth variant="primary" size="lg" icon={<Home size={16} />}>
                          Ke Beranda
                        </AnimatedButton>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </main>
        </>
      )}
    </div>
  );
}
