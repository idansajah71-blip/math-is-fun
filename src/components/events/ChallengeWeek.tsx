"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";
import type { EventData } from "@/lib/events";
import { getEventQuestions } from "@/lib/events";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import type { QuizQuestion } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface ChallengeWeekProps {
  event: EventData;
  onComplete: (score: number, isWin: boolean) => void;
}

const QUESTIONS_PER_DAY = 3;
const TOTAL_DAYS = 7;
const STORAGE_KEY = "matika_challenge_week";

interface DayState {
  completed: boolean;
  score: number;
}

function loadState(): Record<number, DayState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveState(state: Record<number, DayState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function ChallengeWeek({ event, onComplete }: ChallengeWeekProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [dayStates, setDayStates] = useState<Record<number, DayState>>({});
  const [dayComplete, setDayComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const totalScoreRef = useRef(0);

  useEffect(() => {
    setQuestions(getEventQuestions(event));
    const saved = loadState();
    setDayStates(saved);
    const total = Object.values(saved).reduce((sum, d) => sum + d.score, 0);
    totalScoreRef.current = total;
    setTotalScore(total);
    const nextDay = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).find((d) => !saved[d]?.completed) || TOTAL_DAYS;
    setCurrentDay(nextDay);
  }, [event]);

  const dayQuestions = questions.slice(
    (currentDay - 1) * QUESTIONS_PER_DAY,
    currentDay * QUESTIONS_PER_DAY
  );
  const currentQuestion = dayQuestions[currentQIdx];

  const handleAnswer = (i: number) => {
    if (selected !== null || dayComplete || !currentQuestion) return;
    setSelected(i);
    setShowResult(true);

    const isCorrect = i === currentQuestion.correctIndex;
    if (isCorrect) {
      playCorrectSound();
      setScore((s) => s + 1);
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      setSelected(null);
      setShowResult(false);
      if (currentQIdx + 1 >= QUESTIONS_PER_DAY) {
        const dayScore = score + (isCorrect ? 1 : 0);
        const newStates = { ...dayStates, [currentDay]: { completed: true, score: dayScore } };
        setDayStates(newStates);
        saveState(newStates);
        const newTotal = totalScoreRef.current + dayScore;
        totalScoreRef.current = newTotal;
        setTotalScore(newTotal);
        playCompleteSound();
        setDayComplete(true);

        if (currentDay >= TOTAL_DAYS) {
          setTimeout(() => {
            setAllComplete(true);
            onComplete(newTotal, true);
          }, 1200);
        }
      } else {
        setCurrentQIdx((p) => p + 1);
      }
    }, 1200);
  };

  const handleNextDay = () => {
    setDayComplete(false);
    setScore(0);
    setCurrentQIdx(0);
    setCurrentDay((d) => Math.min(d + 1, TOTAL_DAYS));
  };

  if (allComplete) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Calendar size={64} className="text-[var(--duo-green)] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Challenge Week Selesai!</h2>
          <p className="text-sm text-[var(--duo-text-muted)]">Total skor: {totalScoreRef.current}/{TOTAL_DAYS * QUESTIONS_PER_DAY}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Day Indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
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

      {/* Total Score */}
      <div className="text-center mb-4">
        <span className="text-xs font-bold text-[var(--duo-text-muted)]">
          Hari {currentDay}/{TOTAL_DAYS} | Soal {currentQIdx + 1}/{QUESTIONS_PER_DAY} | Skor: {totalScoreRef.current}
        </span>
      </div>

      {/* Day Complete */}
      <AnimatePresence>
        {dayComplete && currentDay < TOTAL_DAYS && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-green)] p-6 mb-4 text-center"
          >
            <CheckCircle2 size={48} className="text-[var(--duo-green)] mx-auto mb-3" />
            <h3 className="text-lg font-black text-[var(--duo-text)]">Hari {currentDay} Selesai!</h3>
            <p className="text-sm text-[var(--duo-text-muted)] mb-4">
              Skor hari ini: {score}/{QUESTIONS_PER_DAY}
            </p>
            <motion.button
              onClick={handleNextDay}
              className="px-6 py-3 bg-[var(--duo-green)] text-white rounded-xl font-bold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lanjut ke Hari {currentDay + 1}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      {currentQuestion && !dayComplete && (
        <>
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
              let style =
                "bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] hover:border-[var(--duo-green)]/50 hover:shadow-md cursor-pointer";
              if (showResult) {
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
                  disabled={selected !== null}
                  className={`w-full p-4 rounded-xl text-left transition-all ${style}`}
                  whileHover={selected === null ? { scale: 1.02, y: -1 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${
                        showResult && i === currentQuestion.correctIndex
                          ? "bg-[var(--duo-green)] text-white"
                          : showResult && i === selected
                          ? "bg-[var(--duo-red)] text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)]"
                      }`}
                    >
                      {showResult && i === currentQuestion.correctIndex ? (
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

          {/* Explanation */}
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
                <p
                  className={`text-sm font-bold ${
                    selected === currentQuestion.correctIndex ? "text-[var(--duo-green)]" : "text-[var(--duo-red)]"
                  }`}
                >
                  {selected === currentQuestion.correctIndex ? "Benar!" : "Salah!"}
                </p>
                <p className="text-xs text-[var(--duo-text-muted)] mt-1">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
