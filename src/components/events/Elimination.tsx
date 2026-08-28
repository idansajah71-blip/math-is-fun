"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Skull, CheckCircle2, XCircle } from "lucide-react";
import type { EventData } from "@/lib/events";
import { getEventQuestions } from "@/lib/events";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import type { QuizQuestion } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface EliminationProps {
  event: EventData;
  onComplete: (score: number, isWin: boolean) => void;
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

export default function Elimination({ event, onComplete }: EliminationProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(event.lives || 3);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [gameOver, setGameOver] = useState<"victory" | "defeat" | null>(null);
  const [eliminated, setEliminated] = useState<Record<number, number[]>>({});
  const scoreRef = useRef(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const qs = getEventQuestions(event).map((q) => ensureOptions(q, 6));
    setQuestions(qs);
  }, [event]);

  const advanceQuestion = useCallback(() => {
    setSelected(null);
    setShowResult(false);
    if (currentIdx + 1 >= questions.length) {
      playCompleteSound();
      setGameOver("victory");
      onComplete(scoreRef.current, true);
    } else {
      setCurrentIdx((p) => p + 1);
    }
  }, [currentIdx, questions.length, onComplete]);

  const handleAnswer = (i: number) => {
    if (selected !== null || gameOver || !questions[currentIdx]) return;
    const currentEliminated = eliminated[currentIdx] || [];
    if (currentEliminated.includes(i)) return;

    setSelected(i);
    setShowResult(true);

    if (i === questions[currentIdx].correctIndex) {
      playCorrectSound();
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);
      setTimeout(() => advanceQuestion(), 1500);
    } else {
      setShaking(true);
      playWrongSound();
      setTimeout(() => setShaking(false), 400);

      const newEliminated = [...currentEliminated, i];
      setEliminated((prev) => ({
        ...prev,
        [currentIdx]: newEliminated,
      }));

      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => {
          setGameOver("defeat");
          onComplete(scoreRef.current, false);
        }, 1200);
        return;
      }

      const currentQ = questions[currentIdx];
      const remainingOpts = currentQ.options
        .map((_, idx) => idx)
        .filter((idx) => !newEliminated.includes(idx));

      if (remainingOpts.length === 1 && remainingOpts[0] === currentQ.correctIndex) {
        scoreRef.current += 1;
        setDisplayScore(scoreRef.current);
        setEliminated((prev) => ({
          ...prev,
          [currentIdx]: newEliminated,
        }));
        setTimeout(() => advanceQuestion(), 1500);
      } else {
        setTimeout(() => advanceQuestion(), 1500);
      }
    }
  };

  const currentQuestion = questions[currentIdx];
  const currentEliminated = eliminated[currentIdx] || [];
  const remainingOptions = currentQuestion
    ? currentQuestion.options.filter((_, i) => !currentEliminated.includes(i)).length
    : 0;

  if (!currentQuestion && !gameOver) {
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

  return (
    <div className={shaking ? "animate-shake" : ""}>
      {/* Status */}
      <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: event.lives || 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Heart
                  size={20}
                  className={i < lives ? "text-[var(--duo-red)] fill-[var(--duo-red)]" : "text-gray-300"}
                />
              </motion.div>
            ))}
          </div>
          <span className="text-xs font-bold text-[var(--duo-text-muted)]">
            Soal {currentIdx + 1}/{questions.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--duo-text)]">Opsi tersisa: {remainingOptions}</span>
          <span className="text-xs font-bold text-[var(--duo-text)]">Skor: {displayScore}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--duo-text)] text-center">{currentQuestion.question}</h2>
      </div>

      {/* Options */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 mb-4"
      >
        {currentQuestion.options.map((opt, i) => {
          const isEliminated = currentEliminated.includes(i);
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
              disabled={selected !== null || isEliminated}
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

      {/* Result */}
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
              {selected === currentQuestion.correctIndex
                ? "Benar!"
                : `Salah! Sisa nyawa: ${lives}`}
            </p>
            <p className="text-xs text-[var(--duo-text-muted)] mt-1">{currentQuestion.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
