"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Skull, Trophy, Swords, Frown, Annoyed, Angry } from "lucide-react";
import type { EventData } from "@/lib/events";
import { getEventQuestions } from "@/lib/events";
import { playCorrectSound, playWrongSound, playCompleteSound } from "@/lib/sounds";
import type { QuizQuestion } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface BossBattleProps {
  event: EventData;
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

export default function BossBattle({ event, onComplete }: BossBattleProps) {
  const scoreRef = useRef(0);
  const completedRef = useRef(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [lives, setLives] = useState(event.lives || 3);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [gameOver, setGameOver] = useState<"victory" | "defeat" | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [lastDamage, setLastDamage] = useState(0);

  useEffect(() => {
    setQuestions(getEventQuestions(event));
  }, [event]);

  const currentQuestion = questions[currentIdx];

  const finishGame = (victory: boolean, score: number) => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFinalScore(score);
    playCompleteSound();
    setGameOver(victory ? "victory" : "defeat");
    setTimeout(() => {
      onComplete(score, victory);
    }, 2500);
  };

  const handleAnswer = (i: number) => {
    if (selected !== null || !currentQuestion || gameOver) return;
    setSelected(i);
    setShowResult(true);

    if (i === currentQuestion.correctIndex) {
      playCorrectSound();
      const damage =
        Math.floor(Math.random() * (BOSS_HP_DAMAGE[1] - BOSS_HP_DAMAGE[0] + 1)) +
        BOSS_HP_DAMAGE[0];
      const newHp = Math.max(0, bossHp - damage);
      setBossHp(newHp);
      setLastDamage(damage);
      scoreRef.current++;
      setDisplayScore(scoreRef.current);

      if (newHp <= 0) {
        setTimeout(() => finishGame(true, scoreRef.current), 1200);
        return;
      }
    } else {
      setShaking(true);
      playWrongSound();
      setTimeout(() => setShaking(false), 400);
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => finishGame(false, scoreRef.current), 1200);
        return;
      }
    }

    setTimeout(() => {
      setSelected(null);
      setShowResult(false);
      setCurrentIdx((p) => p + 1);
    }, 1500);
  };

  const handleQuestionExhausted = () => {
    if (completedRef.current || gameOver) return;
    finishGame(bossHp <= 0, scoreRef.current);
  };

  if (!currentQuestion && !gameOver) {
    handleQuestionExhausted();
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
      {/* Boss HP Bar */}
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
            style={{
              background:
                bossHp > 50 ? "var(--duo-green)" : bossHp > 25 ? "var(--duo-orange)" : "var(--duo-red)",
            }}
            initial={{ width: "100%" }}
            animate={{ width: `${bossHp}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--duo-text-muted)]">
            Soal {currentIdx + 1}/{questions.length}
          </span>
          <span className="text-[10px] text-[var(--duo-text-muted)]">Skor: {displayScore}</span>
        </div>
      </div>

      {/* Lives */}
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: event.lives || 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1 }}
            animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Heart
              size={24}
              className={
                i < lives ? "text-[var(--duo-red)] fill-[var(--duo-red)]" : "text-gray-300"
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Question */}
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
              style =
                "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50";
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
                  {String.fromCharCode(65 + i)}
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
                selected === currentQuestion.correctIndex
                  ? "text-[var(--duo-green)]"
                  : "text-[var(--duo-red)]"
              }`}
            >
              {selected === currentQuestion.correctIndex
                ? <span className="flex items-center gap-1"><Swords size={14} className="text-[var(--duo-green)]" /> Boss terkena serangan! -{lastDamage} HP</span>
                : <span className="flex items-center gap-1"><Skull size={14} className="text-red-500" /> Boss menyerang! Kehilangan 1 nyawa!</span>}
            </p>
            <p className="text-xs text-[var(--duo-text-muted)] mt-1">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameOver && (
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
              {gameOver === "victory" ? (
                <>
                  <Trophy size={64} className="text-[var(--duo-green)] mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Kemenangan!</h2>
                  <p className="text-sm text-[var(--duo-text-muted)]">
                    Boss berhasil dikalahkan! Skor: {finalScore}
                  </p>
                </>
              ) : (
                <>
                  <Skull size={64} className="text-[var(--duo-red)] mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-[var(--duo-text)] mb-2">Kalah!</h2>
                  <p className="text-sm text-[var(--duo-text-muted)]">
                    Nyawa habis! Skor: {finalScore}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
