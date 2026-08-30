"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, CheckCircle2, XCircle, Zap, Timer } from "lucide-react";
import GameHeader from "@/components/game/GameHeader";
import GameResult from "@/components/game/GameResult";
import CooldownOverlay, { setCooldown, clearCooldown } from "@/components/game/CooldownOverlay";
import { playCorrectSound, playWrongSound, playClickSound } from "@/lib/sounds";
import { addXp, isPremiumActive } from "@/lib/gamification";
import { springSnappy, springBounce, staggerContainer, staggerItem } from "@/lib/animations";
import { getAllFormulaMetas } from "@/lib/formulaRegistry";

interface TFQuestion {
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

type GameState = "cooldown" | "playing" | "result";

function generateQuestion(level: number): TFQuestion {
  const formulas = getAllFormulaMetas();
  const f = formulas[Math.floor(Math.random() * formulas.length)];

  const shouldLie = Math.random() > 0.5;

  if (level === 1) {
    if (shouldLie) {
      const wrongAnswer = f.description.includes("=")
        ? f.description.replace(/= .+/, "= " + (Math.random() * 10 + 1).toFixed(1))
        : f.description + " (salah)";
      return { statement: f.description, isCorrect: false, explanation: `Jawaban benar: ${f.description}` };
    }
    return { statement: f.description, isCorrect: true, explanation: f.description };
  }

  if (level === 2) {
    const vars = f.variables;
    if (vars.length >= 2 && shouldLie) {
      const v1 = vars[0];
      const v2 = vars[1];
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const result = f.compute({ [v1.name]: a, [v2.name]: b } as Record<string, number>);
      const wrongResult = result + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      return {
        statement: `${v1.label}=${a}, ${v2.label}=${b} → hasil = ${wrongResult.toFixed(0)}`,
        isCorrect: false,
        explanation: `Hasil benar: ${result.toFixed(2)}`,
      };
    }
    return { statement: f.description, isCorrect: !shouldLie, explanation: f.description };
  }

  // Level 3: tricky
  if (shouldLie) {
    const modified = f.description
      .replace(/sama dengan/g, "tidak sama dengan")
      .replace(/positif/g, "negatif")
      .replace(/menambah/g, "mengurangi");
    return { statement: modified, isCorrect: false, explanation: f.description };
  }
  return { statement: f.description, isCorrect: true, explanation: f.description };
}

function getLevel(correctCount: number): number {
  if (correctCount >= 15) return 3;
  if (correctCount >= 7) return 2;
  return 1;
}

interface TrueFalseBlitzGameProps {
  onExit: () => void;
}

export default function TrueFalseBlitzGame({ onExit }: TrueFalseBlitzGameProps) {
  const [gameState, setGameState] = useState<GameState>("cooldown");
  const [timer, setTimer] = useState(10);
  const [maxTimer] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [question, setQuestion] = useState<TFQuestion | null>(null);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [level, setLevel] = useState(1);
  const [shake, setShake] = useState(false);
  const answerTimeRef = useRef<number>(Date.now());

  const isPremium = isPremiumActive();

  const startGame = useCallback(() => {
    clearCooldown("true-false-blitz");
    setGameState("playing");
    setTimer(10);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalCount(0);
    setLevel(1);
    setSelected(null);
    setShowResult(false);
    setIsCorrectAnswer(null);
    setQuestion(generateQuestion(1));
    answerTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing" && timer <= 0) {
      setGameState("result");
      setCooldown("true-false-blitz", 30);
      const earnedXp = Math.floor(score * 0.35) + 5;
      addXp(earnedXp);
    }
  }, [timer, gameState, score]);

  useEffect(() => {
    setLevel(getLevel(correctCount));
  }, [correctCount]);

  const handleAnswer = useCallback((answer: boolean) => {
    if (selected !== null || !question || gameState !== "playing") return;
    playClickSound();
    setSelected(answer);
    setShowResult(true);
    setTotalCount((p) => p + 1);

    const timeTaken = (Date.now() - answerTimeRef.current) / 1000;
    const correct = answer === question.isCorrect;
    setIsCorrectAnswer(correct);

    if (correct) {
      playCorrectSound();
      const timeBonus = timeTaken < 2 ? 5 : timeTaken < 4 ? 3 : 0;
      const streakBonus = streak >= 2 ? 5 : 0;
      setScore((s) => s + 10 + timeBonus + streakBonus);
      setStreak((s) => {
        const ns = s + 1;
        setMaxStreak((m) => Math.max(m, ns));
        return ns;
      });
      setCorrectCount((c) => c + 1);
      setTimer((t) => Math.min(15, t + 3));
    } else {
      playWrongSound();
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setStreak(0);
    }

    setTimeout(() => {
      if (timer > 0) {
        setSelected(null);
        setShowResult(false);
        setIsCorrectAnswer(null);
        setQuestion(generateQuestion(getLevel(correctCount)));
        answerTimeRef.current = Date.now();
      }
    }, 600);
  }, [selected, question, gameState, timer, streak, correctCount]);

  const highScore = Number(localStorage.getItem("tf-blitz-highscore") || "0");
  const isNewHighScore = score > highScore && gameState === "result";

  useEffect(() => {
    if (isNewHighScore) {
      localStorage.setItem("tf-blitz-highscore", String(score));
    }
  }, [isNewHighScore, score]);

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const earnedXp = Math.floor(score * 0.35) + 5;

  if (gameState === "cooldown") {
    return (
      <CooldownOverlay
        gameId="true-false-blitz"
        cooldownSec={30}
        isPremium={isPremium}
        onReady={startGame}
      />
    );
  }

  if (gameState === "result") {
    return (
      <GameResult
        score={score}
        highScore={highScore}
        xpEarned={earnedXp}
        accuracy={accuracy}
        totalQuestions={totalCount}
        streak={maxStreak}
        isNewHighScore={isNewHighScore}
        onRetry={() => { setCooldown("true-false-blitz", 30); setGameState("cooldown"); }}
        gameTitle="True/False Blitz"
        gameColor="ring-cyan-500"
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--bg)] px-4 py-4 ${shake ? "animate-shake" : ""}`}>
      <GameHeader
        title="True/False Blitz"
        timer={timer}
        maxTimer={maxTimer}
        score={score}
        streak={streak}
        onBack="/games"
      />

      {/* Level indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs font-bold text-[var(--fg-muted)]">Level</span>
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i < level ? 1.2 : 0.8, opacity: i < level ? 1 : 0.3 }}
            className={`w-3 h-3 rounded-full ${i < level ? "bg-[var(--duo-info)]" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {question && (
          <motion.div
            key={question.statement}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={springSnappy}
            className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-3xl p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[var(--duo-orange)]/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-black text-[var(--duo-orange)]">!</span>
              </div>
              <span className="text-xs font-bold text-[var(--duo-orange)] uppercase">Benar atau Salah?</span>
            </div>
            <p className="text-base font-bold text-[var(--fg)]">{question.statement}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* True/False buttons */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {/* TRUE */}
        <motion.button
          whileHover={selected === null ? { scale: 1.05, y: -6 } : {}}
          whileTap={selected === null ? { scale: 0.95 } : {}}
          onClick={() => handleAnswer(true)}
          disabled={selected !== null}
          className={`relative p-6 rounded-3xl border-3 text-center transition-all ${
            showResult && question?.isCorrect === true
              ? "bg-[var(--duo-green)]/10 border-[var(--duo-green)] shadow-lg shadow-[var(--duo-green)]/20"
              : showResult && selected === true && !question?.isCorrect
              ? "bg-[var(--duo-danger)]/10 border-[var(--duo-danger)]"
              : selected === true
              ? "bg-[var(--duo-green)]/10 border-[var(--duo-green)]"
              : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--duo-green)]/50"
          }`}
        >
          <motion.div
            className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              showResult && question?.isCorrect === true
                ? "bg-[var(--duo-green)]"
                : "bg-[var(--duo-green)]/10"
            }`}
            animate={showResult && isCorrectAnswer === true && selected === true ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ThumbsUp
              size={28}
              className={
                showResult && question?.isCorrect === true
                  ? "text-white"
                  : "text-[var(--duo-green)]"
              }
            />
          </motion.div>
          <span className="text-lg font-black text-[var(--fg)]">BENAR</span>
          {showResult && isCorrectAnswer === true && selected === true && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3"
            >
              <CheckCircle2 size={20} className="text-[var(--duo-green)]" />
            </motion.div>
          )}
          {showResult && selected === true && !question?.isCorrect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3"
            >
              <XCircle size={20} className="text-[var(--duo-danger)]" />
            </motion.div>
          )}
        </motion.button>

        {/* FALSE */}
        <motion.button
          whileHover={selected === null ? { scale: 1.05, y: -6 } : {}}
          whileTap={selected === null ? { scale: 0.95 } : {}}
          onClick={() => handleAnswer(false)}
          disabled={selected !== null}
          className={`relative p-6 rounded-3xl border-3 text-center transition-all ${
            showResult && question?.isCorrect === false
              ? "bg-[var(--duo-green)]/10 border-[var(--duo-green)] shadow-lg shadow-[var(--duo-green)]/20"
              : showResult && selected === false && question?.isCorrect === true
              ? "bg-[var(--duo-danger)]/10 border-[var(--duo-danger)]"
              : selected === false
              ? "bg-[var(--duo-green)]/10 border-[var(--duo-green)]"
              : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--duo-danger)]/50"
          }`}
        >
          <motion.div
            className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              showResult && question?.isCorrect === false
                ? "bg-[var(--duo-green)]"
                : "bg-[var(--duo-danger)]/10"
            }`}
            animate={showResult && isCorrectAnswer === true && selected === false ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ThumbsDown
              size={28}
              className={
                showResult && question?.isCorrect === false
                  ? "text-white"
                  : "text-[var(--duo-danger)]"
              }
            />
          </motion.div>
          <span className="text-lg font-black text-[var(--fg)]">SALAH</span>
          {showResult && isCorrectAnswer === true && selected === false && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3"
            >
              <CheckCircle2 size={20} className="text-[var(--duo-green)]" />
            </motion.div>
          )}
          {showResult && selected === false && question?.isCorrect === true && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3"
            >
              <XCircle size={20} className="text-[var(--duo-danger)]" />
            </motion.div>
          )}
        </motion.button>
      </div>
    </div>
  );
}
