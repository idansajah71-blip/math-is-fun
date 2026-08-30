"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, XCircle, Timer } from "lucide-react";
import GameHeader from "@/components/game/GameHeader";
import GameResult from "@/components/game/GameResult";
import CooldownOverlay, { setCooldown, clearCooldown } from "@/components/game/CooldownOverlay";
import { playCorrectSound, playWrongSound, playClickSound } from "@/lib/sounds";
import { addXp, isPremiumActive } from "@/lib/gamification";
import { springSnappy, staggerContainer, staggerItem } from "@/lib/animations";
import { getAllFormulaMetas } from "@/lib/formulaRegistry";

interface Problem {
  question: string;
  answer: number;
  options: number[];
}

type GameState = "cooldown" | "playing" | "result";

function generateProblem(level: number): Problem {
  const formulas = getAllFormulaMetas();
  const ops = level >= 3 ? ["+", "-", "×", "÷"] : level >= 2 ? ["+", "-", "×"] : ["+", "-"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a: number, b: number, answer: number;

  if (level >= 4 && Math.random() > 0.5) {
    const f = formulas[Math.floor(Math.random() * formulas.length)];
    const vars = f.variables;
    const v1 = vars[0];
    const v2 = vars.length > 1 ? vars[1] : vars[0];
    a = Math.floor(Math.random() * (v1.max - v1.min + 1)) + v1.min;
    b = Math.floor(Math.random() * (v2.max - v2.min + 1)) + v2.min;
    if (b === 0 && op === "÷") b = 1;
    answer = f.compute({ [v1.name]: a, [v2.name]: b } as Record<string, number>);
    if (!isFinite(answer) || isNaN(answer)) {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a + b;
    }
    const displayA = a;
    const displayB = b;
    const options = generateOptions(answer);
    return { question: `${displayA} ${op} ${displayB} = ?`, answer, options };
  }

  const maxVal = level >= 3 ? 50 : level >= 2 ? 20 : 12;
  a = Math.floor(Math.random() * maxVal) + 1;
  b = Math.floor(Math.random() * maxVal) + 1;

  switch (op) {
    case "+": answer = a + b; break;
    case "-": answer = a - b; break;
    case "×": answer = a * b; break;
    case "÷": answer = a / b; a = answer * b; break;
    default: answer = a + b;
  }

  const options = generateOptions(answer);
  return { question: `${a} ${op} ${b} = ?`, answer, options };
}

function generateOptions(correct: number): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const sign = Math.random() > 0.5 ? 1 : -1;
    const wrong = correct + sign * offset;
    if (wrong !== correct && !isNaN(wrong) && isFinite(wrong)) {
      opts.add(wrong);
    }
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function getLevel(score: number): number {
  if (score >= 200) return 5;
  if (score >= 120) return 4;
  if (score >= 60) return 3;
  if (score >= 25) return 2;
  return 1;
}

interface SpeedMathGameProps {
  onExit: () => void;
}

export default function SpeedMathGame({ onExit }: SpeedMathGameProps) {
  const [gameState, setGameState] = useState<GameState>("cooldown");
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [level, setLevel] = useState(1);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerTimeRef = useRef<number>(Date.now());

  const isPremium = isPremiumActive();

  const startGame = useCallback(() => {
    clearCooldown("speed-math");
    setGameState("playing");
    setTimer(60);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalCount(0);
    setLevel(1);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setProblem(generateProblem(1));
    answerTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0.1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing" && timer <= 0) {
      setGameState("result");
      setCooldown("speed-math", 30);
      const earnedXp = Math.floor(score * 0.5) + 5;
      addXp(earnedXp);
    }
  }, [timer, gameState, score]);

  useEffect(() => {
    setLevel(getLevel(score));
  }, [score]);

  const handleAnswer = (option: number) => {
    if (selectedAnswer !== null || !problem || gameState !== "playing") return;
    playClickSound();
    setSelectedAnswer(option);
    setShowResult(true);
    setTotalCount((p) => p + 1);

    const timeTaken = (Date.now() - answerTimeRef.current) / 1000;
    const correct = option === problem.answer;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      const timeBonus = timeTaken < 2 ? 5 : timeTaken < 4 ? 3 : 0;
      const streakBonus = streak >= 2 ? 5 : 0;
      setScore((s) => s + 10 + timeBonus + streakBonus);
      setStreak((s) => {
        const newStreak = s + 1;
        setMaxStreak((m) => Math.max(m, newStreak));
        return newStreak;
      });
      setCorrectCount((c) => c + 1);
      setTimer((t) => Math.min(60, t + 2));
    } else {
      playWrongSound();
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setStreak(0);
      setTimer((t) => Math.max(0, t - 3));
    }

    setTimeout(() => {
      if (timer > 0) {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(null);
        setProblem(generateProblem(getLevel(score)));
        answerTimeRef.current = Date.now();
      }
    }, 600);
  };

  const highScore = Number(localStorage.getItem("speed-math-highscore") || "0");
  const isNewHighScore = score > highScore && gameState === "result";

  useEffect(() => {
    if (isNewHighScore) {
      localStorage.setItem("speed-math-highscore", String(score));
    }
  }, [isNewHighScore, score]);

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const earnedXp = Math.floor(score * 0.5) + 5;

  if (gameState === "cooldown") {
    return (
      <CooldownOverlay
        gameId="speed-math"
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
        onRetry={() => { setCooldown("speed-math", 30); setGameState("cooldown"); }}
        gameTitle="Speed Math"
        gameColor="ring-orange-500"
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--bg)] px-4 py-4 ${shake ? "animate-shake" : ""}`}>
      <GameHeader
        title="Speed Math"
        timer={timer}
        maxTimer={60}
        score={score}
        streak={streak}
        onBack="/games"
      />

      {/* Level indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs font-bold text-[var(--fg-muted)]">Level</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i < level ? 1.2 : 0.8, opacity: i < level ? 1 : 0.3 }}
            className={`w-3 h-3 rounded-full ${i < level ? "bg-[var(--duo-orange)]" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>

      {/* Problem */}
      <AnimatePresence mode="wait">
        {problem && (
          <motion.div
            key={problem.question}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={springSnappy}
            className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-3xl p-6 mb-6 text-center"
          >
            <p className="text-xs text-[var(--fg-muted)] font-bold mb-2 flex items-center justify-center gap-1">
              <Zap size={12} className="text-[var(--duo-xp)]" /> Selesaikan!</p>
            <motion.p
              key={problem.question}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={springSnappy}
              className="text-3xl font-black text-[var(--fg)]"
            >
              {problem.question}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        {problem?.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isOptionCorrect = option === problem.answer;
          const showCorrect = showResult && isOptionCorrect;
          const showWrong = showResult && isSelected && !isOptionCorrect;

          return (
            <motion.button
              key={option}
              variants={staggerItem}
              whileHover={selectedAnswer === null ? { scale: 1.05, y: -4 } : {}}
              whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`relative p-5 rounded-2xl border-3 font-black text-xl transition-all ${
                showCorrect
                  ? "bg-[var(--duo-green)]/10 border-[var(--duo-green)] text-[var(--duo-green)]"
                  : showWrong
                  ? "bg-[var(--duo-danger)]/10 border-[var(--duo-danger)] text-[var(--duo-danger)]"
                  : isSelected
                  ? "bg-[var(--duo-green)]/10 border-[var(--duo-green)]"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--fg)] hover:border-[var(--duo-green)]/50"
              }`}
            >
              {showCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <CheckCircle2 size={18} className="text-[var(--duo-green)]" />
                </motion.div>
              )}
              {showWrong && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <XCircle size={18} className="text-[var(--duo-danger)]" />
                </motion.div>
              )}
              {option}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
