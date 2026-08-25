"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Tag } from "lucide-react";
import type { EventData } from "@/lib/events";
import { getEventQuestions, updateParticipant, calculateRewards } from "@/lib/events";
import { getProfile, addXp, saveProfile } from "@/lib/gamification";
import { useAuth } from "@/contexts/AuthContext";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import type { QuizQuestion } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface TriviaNightProps {
  event: EventData;
  onComplete: (score: number, xp: number, gems: number, badge: string | null) => void;
}

export default function TriviaNight({ event, onComplete }: TriviaNightProps) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setQuestions(getEventQuestions(event));
  }, [event]);

  const handleComplete = useCallback(
    (finalScore: number) => {
      const rewards = calculateRewards(event, finalScore, questions.length, 0);
      const profile = getProfile();
      const p = addXp(rewards.xp);
      p.gems += rewards.gems;
      saveProfile(p);
      updateParticipant(event.id, user?.id || "", {
        status: "completed",
        score: finalScore,
        xpEarned: rewards.xp,
        gemsEarned: rewards.gems,
        badgeEarned: rewards.badge,
        completedAt: new Date().toISOString(),
      });
      onComplete(finalScore, rewards.xp, rewards.gems, rewards.badge);
    },
    [event, questions.length, user?.id, onComplete]
  );

  const handleAnswer = (i: number) => {
    if (selected !== null || finished || !questions[currentIdx]) return;
    setSelected(i);
    setShowResult(true);

    if (i === questions[currentIdx].correctIndex) {
      playCorrectSound();
      setScore((s) => s + 1);
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      setSelected(null);
      setShowResult(false);
      if (currentIdx + 1 >= questions.length) {
        playCompleteSound();
        setFinished(true);
        handleComplete(score + (i === questions[currentIdx].correctIndex ? 1 : 0));
      } else {
        setCurrentIdx((p) => p + 1);
      }
    }, 1500);
  };

  const currentQuestion = questions[currentIdx];

  if (!currentQuestion && !finished) {
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
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--duo-text-muted)]">
            Soal {currentIdx + 1}/{questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[var(--duo-green)]" />
          <span className="text-xs font-bold text-[var(--duo-text)]">{score} benar</span>
        </div>
      </div>

      {/* Topic Tag */}
      {currentQuestion.topicSlug && (
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--duo-info)]/10 text-[var(--duo-info)] text-[10px] font-bold rounded-full">
            <Tag size={10} />
            {currentQuestion.topicSlug.replace(/-/g, " ")}
          </span>
        </div>
      )}

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
    </div>
  );
}
