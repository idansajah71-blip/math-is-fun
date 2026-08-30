"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, CheckCircle2, XCircle, Zap, Sparkles } from "lucide-react";
import GameHeader from "@/components/game/GameHeader";
import GameResult from "@/components/game/GameResult";
import CooldownOverlay, { setCooldown, clearCooldown } from "@/components/game/CooldownOverlay";
import { playCorrectSound, playWrongSound, playClickSound } from "@/lib/sounds";
import { addXp, isPremiumActive } from "@/lib/gamification";
import { springSnappy, staggerContainer, staggerItem } from "@/lib/animations";
import { getAllFormulaMetas } from "@/lib/formulaRegistry";
import KaTeX from "@/components/ui/KaTeX";

interface FRQuestion {
  formula: string;
  blankedFormula: string;
  blankParts: string[];
  correctAnswer: string;
  options: string[];
  description: string;
}

type GameState = "cooldown" | "playing" | "result";

function blankFormula(formula: string, level: number): { blanked: string; blank: string; parts: string[] } {
  // Split formula into meaningful parts
  const parts = formula.split(/(\s*[\+\-\×\÷\=\(\)\{\}\^\_\s]+|\\frac\{[^}]*\}\{[^}]*\}|\\sqrt\{[^}]*\}|\\[a-zA-Z]+)/);

  if (level === 1) {
    // Blank out one variable or number
    const candidates = parts.filter((p) => p && p.trim() && !p.match(/^[\s\+\-\×\÷\=\(\)\{\}\^_]+$/));
    if (candidates.length === 0) return { blanked: formula, blank: formula, parts };
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    const blanked = formula.replace(target, "____");
    return { blanked, blank: target.trim(), parts };
  }

  if (level === 2) {
    // Blank out two parts
    const candidates = parts.filter((p) => p && p.trim() && !p.match(/^[\s\+\-\×\÷\=\(\)\{\}\^_]+$/));
    if (candidates.length < 2) return { blanked: formula, blank: formula, parts };
    const shuffled = candidates.sort(() => Math.random() - 0.5);
    let blanked = formula;
    for (let i = 0; i < 2 && i < shuffled.length; i++) {
      blanked = blanked.replace(shuffled[i], "____");
    }
    return { blanked, blank: shuffled.slice(0, 2).map((s) => s.trim()).join(" & "), parts };
  }

  // Level 3: blank out the operator or equals
  const operators = parts.filter((p) => p && p.match(/[\+\-\×\÷\=]/));
  if (operators.length > 0) {
    const target = operators[Math.floor(Math.random() * operators.length)];
    const blanked = formula.replace(target, "____");
    return { blanked, blank: target.trim(), parts };
  }
  return { blanked: formula, blank: formula, parts };
}

function generateOptions(correct: string, allFormulas: ReturnType<typeof getAllFormulaMetas>): string[] {
  const opts = new Set<string>([correct]);
  const allParts: string[] = [];

  allFormulas.forEach((f) => {
    const parts = f.formula.split(/[\s\+\-\×\÷\=\(\)\{\}\^\_]+/).filter((p) => p.trim());
    parts.forEach((p) => allParts.push(p.trim()));
  });

  while (opts.size < 4 && allParts.length > 0) {
    const idx = Math.floor(Math.random() * allParts.length);
    const part = allParts.splice(idx, 1)[0];
    if (part && part !== correct && !opts.has(part)) {
      opts.add(part);
    }
  }

  // Fill remaining with random math symbols
  const extras = ["+", "-", "×", "÷", "=", "^2", "√", "π"];
  let i = 0;
  while (opts.size < 4 && i < extras.length) {
    if (!opts.has(extras[i])) opts.add(extras[i]);
    i++;
  }

  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function getLevel(correctCount: number): number {
  if (correctCount >= 12) return 3;
  if (correctCount >= 5) return 2;
  return 1;
}

interface FormulaRushGameProps {
  onExit: () => void;
}

export default function FormulaRushGame({ onExit }: FormulaRushGameProps) {
  const [gameState, setGameState] = useState<GameState>("cooldown");
  const [timer, setTimer] = useState(15);
  const [maxTimer] = useState(20);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [question, setQuestion] = useState<FRQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [level, setLevel] = useState(1);
  const [shake, setShake] = useState(false);

  const isPremium = isPremiumActive();
  const allFormulas = getAllFormulaMetas();

  const startGame = useCallback(() => {
    clearCooldown("formula-rush");
    setGameState("playing");
    setTimer(15);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalCount(0);
    setLevel(1);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrectAnswer(null);

    // Generate first question
    const f = allFormulas[Math.floor(Math.random() * allFormulas.length)];
    const { blanked, blank } = blankFormula(f.formula, 1);
    const options = generateOptions(blank, allFormulas);
    setQuestion({
      formula: f.formula,
      blankedFormula: blanked,
      blankParts: [blank],
      correctAnswer: blank,
      options,
      description: f.description,
    });
  }, [allFormulas]);

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
      setCooldown("formula-rush", 30);
      const earnedXp = Math.floor(score * 0.6) + 5;
      addXp(earnedXp);
    }
  }, [timer, gameState, score]);

  useEffect(() => {
    setLevel(getLevel(correctCount));
  }, [correctCount]);

  const generateNewQuestion = useCallback((lvl: number) => {
    const f = allFormulas[Math.floor(Math.random() * allFormulas.length)];
    const { blanked, blank } = blankFormula(f.formula, lvl);
    const options = generateOptions(blank, allFormulas);
    setQuestion({
      formula: f.formula,
      blankedFormula: blanked,
      blankParts: [blank],
      correctAnswer: blank,
      options,
      description: f.description,
    });
  }, [allFormulas]);

  const handleAnswer = useCallback((option: string) => {
    if (selectedAnswer !== null || !question || gameState !== "playing") return;
    playClickSound();
    setSelectedAnswer(option);
    setShowResult(true);
    setTotalCount((p) => p + 1);

    const correct = option === question.correctAnswer;
    setIsCorrectAnswer(correct);

    if (correct) {
      playCorrectSound();
      const streakBonus = streak >= 2 ? 5 : 0;
      setScore((s) => s + 15 + streakBonus);
      setStreak((s) => {
        const ns = s + 1;
        setMaxStreak((m) => Math.max(m, ns));
        return ns;
      });
      setCorrectCount((c) => c + 1);
      setTimer((t) => Math.min(20, t + 3));
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
        setIsCorrectAnswer(null);
        generateNewQuestion(getLevel(correctCount));
      }
    }, 700);
  }, [selectedAnswer, question, gameState, timer, streak, correctCount, generateNewQuestion]);

  const highScore = Number(localStorage.getItem("formula-rush-highscore") || "0");
  const isNewHighScore = score > highScore && gameState === "result";

  useEffect(() => {
    if (isNewHighScore) {
      localStorage.setItem("formula-rush-highscore", String(score));
    }
  }, [isNewHighScore, score]);

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const earnedXp = Math.floor(score * 0.6) + 5;

  if (gameState === "cooldown") {
    return (
      <CooldownOverlay
        gameId="formula-rush"
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
        onRetry={() => { setCooldown("formula-rush", 30); setGameState("cooldown"); }}
        gameTitle="Formula Rush"
        gameColor="ring-green-500"
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--bg)] px-4 py-4 ${shake ? "animate-shake" : ""}`}>
      <GameHeader
        title="Formula Rush"
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
            className={`w-3 h-3 rounded-full ${i < level ? "bg-[var(--duo-green)]" : "bg-[var(--border)]"}`}
          />
        ))}
        <span className="text-[10px] text-[var(--fg-muted)] ml-2">
          {level === 1 ? "1 blank" : level === 2 ? "2 blank" : "Operator"}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {question && (
          <motion.div
            key={question.blankedFormula}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={springSnappy}
            className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-3xl p-6 mb-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lightbulb size={16} className="text-[var(--duo-green)]" />
              <span className="text-xs font-bold text-[var(--duo-green)] uppercase">Isi bagian yang kosong</span>
            </div>

            {/* Blanked formula display */}
            <div className="bg-[var(--bg)] rounded-2xl p-4 mb-3">
              <div className="text-xl text-[var(--fg)] flex items-center justify-center flex-wrap gap-1">
                {question.blankedFormula.split("____").map((part, i, arr) => (
                  <span key={i} className="inline-flex items-center">
                    {part.trim() && (
                      <KaTeX formula={part.trim()} displayMode={false} className="text-lg md:text-xl" />
                    )}
                    {i < arr.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block mx-1 px-3 py-1 bg-[var(--duo-green)]/10 border-2 border-dashed border-[var(--duo-green)]/50 rounded-lg text-[var(--duo-green)] text-base"
                      >
                        ?
                      </motion.span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Description hint */}
            <p className="text-xs text-[var(--fg-muted)] italic">{question.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 max-w-md mx-auto"
      >
        {question?.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isOptionCorrect = option === question.correctAnswer;
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
              className={`relative p-4 rounded-2xl border-3 font-mono font-bold text-sm transition-all ${
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
                  <CheckCircle2 size={16} className="text-[var(--duo-green)]" />
                </motion.div>
              )}
              {showWrong && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <XCircle size={16} className="text-[var(--duo-danger)]" />
                </motion.div>
              )}
              <span className="text-sm"><KaTeX formula={option} displayMode={false} /></span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
