"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Skull, Trophy, Swords, Frown, Annoyed, Angry,
  Clock, Zap, CheckCircle2, XCircle, HelpCircle, Calendar, Tag,
} from "lucide-react";
import type { EventData } from "@/lib/events";
import { getEventQuestions, getEventModeConfig } from "@/lib/events";
import type { EventModeConfig } from "@/lib/events";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import type { QuizQuestion } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface EventPlayProps {
  event: EventData;
  userId: string;
  onComplete: (score: number, isWin: boolean) => void;
}

const BOSS_HP_DAMAGE: [number, number] = [15, 25];

function getBossExpression(hp: number): React.ReactNode {
  if (hp > 70) return <Annoyed size={28} className="text-orange-400" />;
  if (hp > 30) return <Frown size={28} className="text-yellow-400" />;
  return <Angry size={28} className="text-red-500" />;
}

function getBossName(hp: number): string {
  if (hp > 70) return "Boss Kuat";
  if (hp > 30) return "Boss Mulai Lemah";
  return "Boss Marah!";
}

function ensureOptions(question: QuizQuestion, minOptions: number): QuizQuestion {
  if (question.options.length >= minOptions) return question;
  const opts = [...question.options];
  let idx = opts.length;
  while (opts.length < minOptions) {
    opts.push(`Opsi ${idx + 1}`);
    idx++;
  }
  return { ...question, options: opts, correctIndex: question.correctIndex };
}

interface DayState {
  completed: boolean;
  score: number;
}

function loadDayState(userId: string): Record<number, DayState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(`matika_challenge_week_${userId}`) || "{}");
  } catch {
    return {};
  }
}

function saveDayState(userId: string, state: Record<number, DayState>) {
  localStorage.setItem(`matika_challenge_week_${userId}`, JSON.stringify(state));
}

export default function EventPlay({ event, userId, onComplete }: EventPlayProps) {
  const config: EventModeConfig = getEventModeConfig(event);
  const scoreRef = useRef(0);
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const [bossHp, setBossHp] = useState(100);
  const [lastDamage, setLastDamage] = useState(0);
  const [lives, setLives] = useState(event.lives || 3);
  const [shaking, setShaking] = useState(false);
  const [gameOver, setGameOver] = useState<"victory" | "defeat" | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);

  const [revealed, setRevealed] = useState(false);

  const [eliminated, setEliminated] = useState<Record<number, number[]>>({});

  const [currentDay, setCurrentDay] = useState(1);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [dayScore, setDayScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [dayStates, setDayStates] = useState<Record<number, DayState>>({});
  const [dayComplete, setDayComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const dayScoreRef = useRef(0);

  const maxLives = event.lives || 3;
  const totalQuestions = event.questionsCount || 10;
  const questionsPerDay = config.questionsPerDay || 3;
  const totalDays = config.totalDays || 7;

  useEffect(() => {
    let qs = getEventQuestions(event);

    if (config.hasElimination) {
      qs = qs.map((q) => ensureOptions(q, 6));
    }

    if (config.hasDailyProgression) {
      const saved = loadDayState(userId);
      setDayStates(saved);
      const total = Object.values(saved).reduce((sum, d) => sum + d.score, 0);
      setTotalScore(total);
      const nextDay = Array.from({ length: totalDays }, (_, i) => i + 1).find((d) => !saved[d]?.completed) || totalDays;
      setCurrentDay(nextDay);
    }

    setQuestions(qs);
  }, [event, userId, config.hasDailyProgression, config.hasElimination, totalDays]);

  useEffect(() => {
    if (!config.hasTimer || finished || questions.length === 0) return;
    const timeLimit = Math.min(Math.max(event.questionsCount * 10, 60), 300);
    setTimer(timeLimit);
  }, [config.hasTimer, finished, questions.length, event.questionsCount]);

  useEffect(() => {
    if (!config.hasTimer || finished || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.hasTimer, finished, questions.length]);

  useEffect(() => {
    if (config.hasTimer && timer === 0 && !finished && questions.length > 0) {
      finishGame(true);
    }
  }, [timer, finished, questions.length, config.hasTimer]);

  const finishGame = useCallback((isAlwaysWin: boolean) => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (config.hasTimer) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (timer === 0) setShowTimeUp(true);
    }
    playCompleteSound();
    setGameOver(isAlwaysWin ? "victory" : bossHp <= 0 ? "victory" : "defeat");
    setFinalScore(scoreRef.current);
    setTimeout(() => {
      onComplete(scoreRef.current, isAlwaysWin || bossHp <= 0);
    }, config.hasTimer ? (timer === 0 ? 2000 : 1500) : 2500);
  }, [config.hasTimer, timer, bossHp, onComplete]);

  const advanceQuestion = useCallback(() => {
    setSelected(null);
    setShowResult(false);
    setRevealed(false);
    setCurrentIdx((p) => p + 1);
  }, []);

  const dayQuestions = config.hasDailyProgression
    ? questions.slice((currentDay - 1) * questionsPerDay, currentDay * questionsPerDay)
    : questions;

  const activeQuestions = config.hasDailyProgression ? dayQuestions : questions;
  const currentQuestion = activeQuestions[config.hasDailyProgression ? currentQIdx : currentIdx];

  const handleAnswer = useCallback((i: number) => {
    if (selected !== null || gameOver || finished || !currentQuestion) return;
    if (config.hasReveal && !revealed) return;

    if (config.hasElimination) {
      const currentEliminated = eliminated[config.hasDailyProgression ? currentQIdx : currentIdx] || [];
      if (currentEliminated.includes(i)) return;
    }

    setSelected(i);
    setShowResult(true);

    const isCorrect = i === currentQuestion.correctIndex;

    if (isCorrect) {
      playCorrectSound();
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);

      if (config.hasBossHp) {
        const damage = Math.floor(Math.random() * (BOSS_HP_DAMAGE[1] - BOSS_HP_DAMAGE[0] + 1)) + BOSS_HP_DAMAGE[0];
        const newHp = Math.max(0, bossHp - damage);
        setBossHp(newHp);
        setLastDamage(damage);
        if (newHp <= 0) {
          setTimeout(() => finishGame(true), 1200);
          return;
        }
      }
    } else {
      playWrongSound();

      if (config.hasBossHp || config.hasLives) {
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setTimeout(() => finishGame(false), 1200);
          return;
        }
      }

      if (config.hasElimination) {
        const qIdx = config.hasDailyProgression ? currentQIdx : currentIdx;
        const currentEliminated = eliminated[qIdx] || [];
        const newEliminated = [...currentEliminated, i];
        setEliminated((prev) => ({ ...prev, [qIdx]: newEliminated }));

        const currentQ = activeQuestions[qIdx];
        if (currentQ) {
          const remainingOpts = currentQ.options
            .map((_, idx) => idx)
            .filter((idx) => !newEliminated.includes(idx));
          if (remainingOpts.length === 1 && remainingOpts[0] === currentQ.correctIndex) {
            scoreRef.current += 1;
            setDisplayScore(scoreRef.current);
          }
        }
      }
    }

    const delay = config.hasTimer ? 800 : 1500;

    setTimeout(() => {
      if (config.hasDailyProgression) {
        setSelected(null);
        setShowResult(false);

        if (currentQIdx + 1 >= questionsPerDay) {
          const daySc = dayScoreRef.current + (isCorrect ? 1 : 0);
          const newStates = { ...dayStates, [currentDay]: { completed: true, score: daySc } };
          setDayStates(newStates);
          saveDayState(userId, newStates);
          const newTotal = totalScore + daySc;
          setTotalScore(newTotal);
          dayScoreRef.current = 0;
          setDayScore(0);
          playCompleteSound();
          setDayComplete(true);

          if (currentDay >= totalDays) {
            setTimeout(() => {
              setAllComplete(true);
              onComplete(newTotal, true);
            }, 1200);
          }
        } else {
          if (isCorrect) dayScoreRef.current += 1;
          setDayScore(dayScoreRef.current);
          setCurrentQIdx((p) => p + 1);
        }
      } else {
        if (config.hasBossHp || config.hasLives || config.hasElimination) {
          const qIdx = currentIdx;
          if (qIdx + 1 >= activeQuestions.length) {
            finishGame(config.isAlwaysWin);
          } else {
            advanceQuestion();
          }
        } else {
          if (currentIdx + 1 >= activeQuestions.length) {
            finishGame(config.isAlwaysWin);
          } else {
            advanceQuestion();
          }
        }
      }
    }, delay);
  }, [selected, gameOver, finished, currentQuestion, currentIdx, currentQIdx, config, bossHp, lives, eliminated, activeQuestions, dayStates, currentDay, totalScore, userId, questionsPerDay, totalDays, finishGame, advanceQuestion, onComplete]);

  useEffect(() => {
    if (!config.hasBossHp) return;
    if (!currentQuestion && !gameOver && questions.length > 0) {
      finishGame(bossHp <= 0);
    }
  }, [currentQuestion, gameOver, questions.length, config.hasBossHp, bossHp, finishGame]);

  useEffect(() => {
    if (!config.hasLives && !config.hasBossHp) return;
    if (!currentQuestion && !gameOver && activeQuestions.length > 0) {
      finishGame(config.isAlwaysWin);
    }
  }, [currentQuestion, gameOver, activeQuestions.length, config.hasLives, config.hasBossHp, config.isAlwaysWin, finishGame]);

  if (allComplete) {
    return (
      <div className="text-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
          <Calendar size={64} className="text-[var(--duo-green)] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Challenge Week Selesai!</h2>
          <p className="text-sm text-[var(--duo-text-muted)]">Total skor: {totalScore}/{totalDays * questionsPerDay}</p>
        </motion.div>
      </div>
    );
  }

  if (config.hasDailyProgression && dayComplete && currentDay < totalDays) {
    return (
      <div className="text-center py-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-green)] p-6 text-center">
          <CheckCircle2 size={48} className="text-[var(--duo-green)] mx-auto mb-3" />
          <h3 className="text-lg font-black text-[var(--duo-text)]">Hari {currentDay} Selesai!</h3>
          <p className="text-sm text-[var(--duo-text-muted)] mb-4">Skor hari ini: {dayScore}/{questionsPerDay}</p>
          <motion.button
            onClick={() => {
              setDayComplete(false);
              dayScoreRef.current = 0;
              setDayScore(0);
              setCurrentQIdx(0);
              setCurrentDay((d) => Math.min(d + 1, totalDays));
            }}
            className="px-6 py-3 bg-[var(--duo-green)] text-white rounded-xl font-bold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Lanjut ke Hari {currentDay + 1}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if ((!currentQuestion && !gameOver) || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[var(--duo-green)] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const progress = activeQuestions.length > 0
    ? ((config.hasDailyProgression ? currentQIdx : currentIdx) + (showResult ? 1 : 0)) / activeQuestions.length * 100
    : 0;

  const currentEliminated = config.hasElimination
    ? eliminated[config.hasDailyProgression ? currentQIdx : currentIdx] || []
    : [];
  const remainingOptions = currentQuestion
    ? currentQuestion.options.filter((_, i) => !currentEliminated.includes(i)).length
    : 0;

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isUrgent = config.hasTimer && timer < 30 && timer > 0;

  return (
    <div className={shaking ? "animate-shake" : ""}>
      {/* Timer */}
      {config.hasTimer && (
        <motion.div
          className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 mb-4 ${
            isUrgent
              ? "bg-[var(--duo-red)]/10 border-[var(--duo-red)]"
              : "bg-white dark:bg-[var(--duo-card)] border-[var(--duo-border)]"
          }`}
          animate={isUrgent ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
        >
          <Clock size={20} className={isUrgent ? "text-[var(--duo-red)]" : "text-[var(--duo-orange)]"} />
          <span className={`text-2xl font-black tabular-nums ${isUrgent ? "text-[var(--duo-red)]" : "text-[var(--duo-text)]"}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          {isUrgent && (
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-xs font-bold text-[var(--duo-red)]">
              CEPAT!
            </motion.span>
          )}
        </motion.div>
      )}

      {/* Boss HP Bar */}
      {config.hasBossHp && (
        <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getBossExpression(bossHp)}</span>
              <span className="text-sm font-bold text-[var(--duo-text)]">{getBossName(bossHp)}</span>
            </div>
            <span className="text-xs font-bold text-[var(--duo-red)]">{bossHp} HP</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: bossHp > 50 ? "var(--duo-green)" : bossHp > 25 ? "var(--duo-orange)" : "var(--duo-red)" }}
              initial={{ width: "100%" }}
              animate={{ width: `${bossHp}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[var(--duo-text-muted)]">
              Soal {(config.hasDailyProgression ? currentQIdx : currentIdx) + 1}/{activeQuestions.length}
            </span>
            <span className="text-[10px] text-[var(--duo-text-muted)]">Skor: {displayScore}</span>
          </div>
        </div>
      )}

      {/* Day Indicators */}
      {config.hasDailyProgression && (
        <div className="flex items-center justify-center gap-2 mb-4">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
            <motion.div
              key={day}
              initial={{ scale: 0.8 }}
              animate={{ scale: day === currentDay ? 1.1 : 1 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                dayStates[day]?.completed
                  ? "bg-[var(--duo-green)] text-white border-[var(--duo-green)]"
                  : day === currentDay
                    ? "bg-[var(--duo-info)]/10 text-[var(--duo-info)] border-[var(--duo-info)]"
                    : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)] border-gray-200 dark:border-gray-700"
              }`}
            >
              {dayStates[day]?.completed ? <CheckCircle2 size={14} /> : day}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lives + Status */}
      {config.hasLives && !config.hasBossHp && (
        <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1 }}
                  animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Heart size={20} className={i < lives ? "text-[var(--duo-red)] fill-[var(--duo-red)]" : "text-gray-300"} />
                </motion.div>
              ))}
            </div>
            <span className="text-xs font-bold text-[var(--duo-text-muted)]">
              Soal {(config.hasDailyProgression ? currentQIdx : currentIdx) + 1}/{activeQuestions.length}
            </span>
          </div>
          {config.hasElimination ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--duo-text)]">Opsi tersisa: {remainingOptions}</span>
              <span className="text-xs font-bold text-[var(--duo-text)]">Skor: {displayScore}</span>
            </div>
          ) : config.hasDailyProgression ? (
            <div className="text-center">
              <span className="text-xs font-bold text-[var(--duo-text-muted)]">
                Hari {currentDay}/{totalDays} | Soal {currentQIdx + 1}/{questionsPerDay} | Skor: {totalScore}
              </span>
            </div>
          ) : (
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-[var(--duo-green)] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>
          )}
        </div>
      )}

      {/* Boss Lives (shown separately) */}
      {config.hasLives && config.hasBossHp && (
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: maxLives }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart size={24} className={i < lives ? "text-[var(--duo-red)] fill-[var(--duo-red)]" : "text-gray-300"} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Timer-only score */}
      {config.hasTimer && !config.hasBossHp && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap size={16} className="text-[var(--duo-orange)]" />
          <span className="text-sm font-bold text-[var(--duo-text)]">{displayScore} jawaban benar</span>
          <span className="text-xs text-[var(--duo-text-muted)]">/ {(config.hasDailyProgression ? currentQIdx : currentIdx)} dijawab</span>
        </div>
      )}

      {/* Simple progress (no lives, no timer, no boss) */}
      {!config.hasLives && !config.hasTimer && !config.hasBossHp && !config.hasDailyProgression && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[var(--duo-text-muted)]">
            Soal {currentIdx + 1}/{activeQuestions.length}
          </span>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[var(--duo-green)]" />
            <span className="text-xs font-bold text-[var(--duo-text)]">{displayScore} benar</span>
          </div>
        </div>
      )}

      {/* Mystery Reveal */}
      {config.hasReveal && !revealed && (
        <motion.div
          key="mystery"
          initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: -180 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-gradient-to-br from-[var(--duo-green)]/20 to-[var(--duo-info)]/20 rounded-2xl border-2 border-[var(--duo-green)]/30 p-8 mb-4 cursor-pointer"
          onClick={() => setRevealed(true)}
        >
          <div className="text-center">
            <HelpCircle size={48} className="text-[var(--duo-green)] mx-auto mb-3" />
            <h3 className="text-xl font-black text-[var(--duo-text)]">???</h3>
            <p className="text-xs text-[var(--duo-text-muted)] mt-2">Klik untuk mengungkap soal</p>
          </div>
        </motion.div>
      )}

      {/* Topic Tag (Trivia Night style) */}
      {!config.hasReveal && currentQuestion?.topicSlug && (
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--duo-info)]/10 text-[var(--duo-info)] text-[10px] font-bold rounded-full">
            <Tag size={10} />
            {currentQuestion.topicSlug.replace(/-/g, " ")}
          </span>
        </div>
      )}

      {/* Question Card */}
      {(!config.hasReveal || revealed) && (
        <AnimatePresence mode="wait">
          <motion.div
            key={config.hasReveal ? `q-${currentIdx}` : undefined}
            initial={config.hasReveal ? { scale: 0.8, opacity: 0, rotateY: -180 } : undefined}
            animate={config.hasReveal ? { scale: 1, opacity: 1, rotateY: 0 } : undefined}
            exit={config.hasReveal ? { scale: 0.8, opacity: 0, rotateY: 180 } : undefined}
            transition={config.hasReveal ? { type: "spring", stiffness: 300, damping: 20 } : undefined}
          >
            <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 mb-4">
              <h2 className="text-base font-bold text-[var(--duo-text)] text-center">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-3 mb-4"
            >
              {currentQuestion.options.map((opt, i) => {
                const isEliminated = config.hasElimination && currentEliminated.includes(i);
                let style =
                  "bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] hover:border-[var(--duo-green)]/50 hover:shadow-md cursor-pointer";

                if (isEliminated) {
                  style = "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-40 line-through";
                } else if (showResult) {
                  if (i === currentQuestion.correctIndex) {
                    style = "bg-[var(--duo-green)]/10 border-2 border-[var(--duo-green)]";
                  } else if (i === selected) {
                    style = "bg-[var(--duo-red)]/10 border-2 border-[var(--duo-red)]";
                  } else {
                    style = "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    variants={staggerItem}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null || isEliminated || finished}
                    className={`w-full p-4 rounded-xl text-left transition-all ${style}`}
                    whileHover={selected === null && !isEliminated ? { scale: 1.02, y: -1 } : {}}
                    whileTap={selected === null && !isEliminated ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${
                          isEliminated
                            ? "bg-gray-300 dark:bg-gray-600 text-gray-500"
                            : showResult && i === currentQuestion.correctIndex
                              ? "bg-[var(--duo-green)] text-white"
                              : showResult && i === selected
                                ? "bg-[var(--duo-red)] text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)]"
                        }`}
                      >
                        {isEliminated ? (
                          <Skull size={14} />
                        ) : showResult && i === currentQuestion.correctIndex ? (
                          <CheckCircle2 size={16} />
                        ) : showResult && i === selected ? (
                          <XCircle size={16} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span className="text-sm font-bold text-[var(--duo-text)]">{opt}</span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Result Panel */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-2xl ${
                    selected === currentQuestion.correctIndex
                      ? "bg-[var(--duo-green)]/10 border border-[var(--duo-green)]/30"
                      : "bg-[var(--duo-red)]/10 border border-[var(--duo-red)]/30"
                  }`}
                >
                  <p className={`text-sm font-bold ${selected === currentQuestion.correctIndex ? "text-[var(--duo-green)]" : "text-[var(--duo-red)]"}`}>
                    {config.hasBossHp ? (
                      selected === currentQuestion.correctIndex
                        ? <span className="flex items-center gap-1"><Swords size={14} /> Boss terkena serangan! -{lastDamage} HP</span>
                        : <span className="flex items-center gap-1"><Skull size={14} className="text-red-500" /> Boss menyerang! Kehilangan 1 nyawa!</span>
                    ) : config.hasLives ? (
                      selected === currentQuestion.correctIndex
                        ? "Benar!"
                        : `Salah! Sisa nyawa: ${lives}`
                    ) : (
                      selected === currentQuestion.correctIndex ? "Benar!" : "Salah!"
                    )}
                  </p>
                  <p className="text-xs text-[var(--duo-text-muted)] mt-1">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-3xl p-8 mx-4 text-center max-w-sm w-full"
            >
              {gameOver === "victory" ? (
                <>
                  <Trophy size={64} className="text-[var(--duo-green)] mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Kemenangan!</h2>
                  <p className="text-sm text-[var(--duo-text-muted)]">
                    {config.hasBossHp ? "Boss berhasil dikalahkan!" : "Semua soal selesai!"} Skor: {finalScore}
                  </p>
                </>
              ) : (
                <>
                  <Skull size={64} className="text-[var(--duo-red)] mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Kalah!</h2>
                  <p className="text-sm text-[var(--duo-text-muted)]">
                    {config.hasTimer ? "Waktu habis!" : "Nyawa habis!"} Skor: {finalScore}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Up Overlay */}
      <AnimatePresence>
        {showTimeUp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-3xl p-8 mx-4 text-center max-w-sm w-full"
            >
              <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
                <Clock size={64} className="text-[var(--duo-red)] mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Waktu Habis!</h2>
              <p className="text-sm text-[var(--duo-text-muted)]">Skor akhir: {displayScore}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
