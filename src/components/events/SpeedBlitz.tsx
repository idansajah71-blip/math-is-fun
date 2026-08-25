"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import type { EventData } from "@/lib/events";
import { getEventQuestions } from "@/lib/events";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import type { QuizQuestion } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface SpeedBlitzProps {
  event: EventData;
  onComplete: (score: number, isWin: boolean) => void;
}

export default function SpeedBlitz({ event, onComplete }: SpeedBlitzProps) {
  const scoreRef = useRef(0);
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);

  useEffect(() => {
    const qs = getEventQuestions(event);
    setQuestions(qs);
    const timeLimit = Math.min(Math.max(event.questionsCount * 10, 60), 300);
    setTimer(timeLimit);
  }, [event]);

  useEffect(() => {
    if (finished || questions.length === 0) return;
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
  }, [finished, questions.length]);

  useEffect(() => {
    if (timer === 0 && !finished && questions.length > 0) {
      finishGame();
    }
  }, [timer, finished, questions.length]);

  const finishGame = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    playCompleteSound();
    if (timer === 0) {
      setShowTimeUp(true);
    }
    setTimeout(() => {
      onComplete(scoreRef.current, true);
    }, timer === 0 ? 2000 : 1500);
  };

  const handleAnswer = (i: number) => {
    if (selected !== null || finished || !questions[currentIdx]) return;
    setSelected(i);
    setShowResult(true);

    if (i === questions[currentIdx].correctIndex) {
      playCorrectSound();
      scoreRef.current++;
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      setSelected(null);
      setShowResult(false);
      setCurrentIdx((p) => {
        const next = p + 1;
        if (next >= questions.length) {
          finishGame();
        }
        return next;
      });
    }, 800);
  };

  const currentQuestion = questions[currentIdx];
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isUrgent = timer < 30 && timer > 0;

  if (!currentQuestion && !finished) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[var(--duo-orange)] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Timer */}
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
        <span
          className={`text-2xl font-black tabular-nums ${
            isUrgent ? "text-[var(--duo-red)]" : "text-[var(--duo-text)]"
          }`}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
        {isUrgent && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-xs font-bold text-[var(--duo-red)]"
          >
            CEPAT!
          </motion.span>
        )}
      </motion.div>

      {/* Score */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap size={16} className="text-[var(--duo-orange)]" />
        <span className="text-sm font-bold text-[var(--duo-text)]">{scoreRef.current} jawaban benar</span>
        <span className="text-xs text-[var(--duo-text-muted)]">/ {currentIdx} dijawab</span>
      </div>

      {/* Question */}
      {currentQuestion && (
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
                "bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] hover:border-[var(--duo-orange)]/50 hover:shadow-md cursor-pointer";
              if (showResult) {
                if (i === currentQuestion.correctIndex) {
                  style = "bg-[var(--duo-green)]/10 border-2 border-[var(--duo-green)]";
                } else if (i === selected) {
                  style = "bg-[var(--duo-red)]/10 border-2 border-[var(--duo-red)]";
                } else {
                  style =
                    "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50";
                }
              }
              return (
                <motion.button
                  key={i}
                  variants={staggerItem}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null || finished}
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
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm font-bold text-[var(--duo-text)]">{opt}</span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </>
      )}

      {/* Waktu Habis Overlay */}
      <AnimatePresence>
        {showTimeUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-3xl p-8 mx-4 text-center max-w-sm w-full"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Clock size={64} className="text-[var(--duo-red)] mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Waktu Habis!</h2>
              <p className="text-sm text-[var(--duo-text-muted)]">
                Skor akhir: {scoreRef.current}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
