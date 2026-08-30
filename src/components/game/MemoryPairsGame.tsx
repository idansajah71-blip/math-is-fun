"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import GameHeader from "@/components/game/GameHeader";
import GameResult from "@/components/game/GameResult";
import CooldownOverlay, { setCooldown, clearCooldown } from "@/components/game/CooldownOverlay";
import { playCorrectSound, playWrongSound, playClickSound } from "@/lib/sounds";
import { addXp, isPremiumActive } from "@/lib/gamification";
import { springSnappy, springBounce, staggerContainer, staggerItem } from "@/lib/animations";
import { getAllFormulaMetas } from "@/lib/formulaRegistry";
import KaTeX from "@/components/ui/KaTeX";

interface CardData {
  id: number;
  pairId: number;
  content: string;
  type: "formula" | "name" | "description";
  matched: boolean;
  flipped: boolean;
}

type GameState = "cooldown" | "playing" | "result";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePairs(level: number, count: number): CardData[] {
  const formulas = shuffleArray(getAllFormulaMetas()).slice(0, count);
  const cards: CardData[] = [];

  formulas.forEach((f, i) => {
    if (level === 1) {
      cards.push({ id: i * 2, pairId: i, content: f.formula, type: "formula", matched: false, flipped: false });
      cards.push({ id: i * 2 + 1, pairId: i, content: f.outputLabel || "Rumus", type: "name", matched: false, flipped: false });
    } else if (level === 2) {
      const desc = f.description.length > 60 ? f.description.substring(0, 60) + "..." : f.description;
      cards.push({ id: i * 2, pairId: i, content: f.formula, type: "formula", matched: false, flipped: false });
      cards.push({ id: i * 2 + 1, pairId: i, content: desc, type: "description", matched: false, flipped: false });
    } else {
      const desc = f.description.length > 50 ? f.description.substring(0, 50) + "..." : f.description;
      cards.push({ id: i * 2, pairId: i, content: desc, type: "description", matched: false, flipped: false });
      cards.push({ id: i * 2 + 1, pairId: i, content: f.outputLabel || "Rumus", type: "name", matched: false, flipped: false });
    }
  });

  return shuffleArray(cards);
}

function getLevel(matchCount: number): number {
  if (matchCount >= 16) return 3;
  if (matchCount >= 8) return 2;
  return 1;
}

interface MemoryPairsGameProps {
  onExit: () => void;
}

export default function MemoryPairsGame({ onExit }: MemoryPairsGameProps) {
  const [gameState, setGameState] = useState<GameState>("cooldown");
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [shake, setShake] = useState(false);
  const [matchedPair, setMatchedPair] = useState<number | null>(null);

  const isPremium = isPremiumActive();

  const startGame = useCallback(() => {
    clearCooldown("memory-pairs");
    setGameState("playing");
    setTimer(60);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMatchCount(0);
    setTotalMoves(0);
    setLevel(1);
    setFlippedIds([]);
    setMatchedPair(null);
    setCards(generatePairs(1, 8));
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
      setCooldown("memory-pairs", 30);
      const earnedXp = Math.floor(score * 0.4) + 5;
      addXp(earnedXp);
    }
  }, [timer, gameState, score]);

  useEffect(() => {
    const newLevel = getLevel(matchCount);
    if (newLevel > level) {
      setLevel(newLevel);
      // Generate new cards with harder difficulty
      setCards(generatePairs(newLevel, 8));
      setFlippedIds([]);
      setMatchedPair(null);
    }
  }, [matchCount, level]);

  const handleCardClick = useCallback((cardId: number) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.matched || flippedIds.includes(cardId)) return;

    playClickSound();
    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setTotalMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first && second && first.pairId === second.pairId) {
        // Match!
        playCorrectSound();
        setMatchedPair(first.pairId);
        setScore((s) => s + 10);
        setStreak((s) => {
          const ns = s + 1;
          setMaxStreak((m) => Math.max(m, ns));
          return ns;
        });
        setTimer((t) => Math.min(60, t + 3));

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === first.pairId ? { ...c, matched: true } : c))
          );
          setMatchCount((m) => m + 1);
          setMatchedPair(null);
          setFlippedIds([]);
        }, 800);
      } else {
        // No match
        playWrongSound();
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setStreak(0);
        setTimer((t) => Math.max(0, t - 2));
        setTimeout(() => setFlippedIds([]), 700);
      }
    }
  }, [flippedIds, cards]);

  // Check win condition (all 8 pairs matched)
  useEffect(() => {
    if (matchCount >= 8 && gameState === "playing") {
      // Generate new grid
      setTimeout(() => {
        setCards(generatePairs(level, 8));
        setMatchCount(0);
        setFlippedIds([]);
        setMatchedPair(null);
        // Time bonus
        setTimer((t) => Math.min(60, t + 5));
      }, 1000);
    }
  }, [matchCount, gameState, level]);

  const highScore = typeof window !== "undefined"
    ? Number(localStorage.getItem("memory-pairs-highscore") || "0")
    : 0;
  const isNewHighScore = score > highScore && gameState === "result";

  useEffect(() => {
    if (isNewHighScore) {
      localStorage.setItem("memory-pairs-highscore", String(score));
    }
  }, [isNewHighScore, score]);

  const earnedXp = Math.floor(score * 0.4) + 5;

  if (gameState === "cooldown") {
    return (
      <CooldownOverlay
        gameId="memory-pairs"
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
        totalQuestions={totalMoves}
        streak={maxStreak}
        isNewHighScore={isNewHighScore}
        onRetry={() => { setCooldown("memory-pairs", 30); setGameState("cooldown"); }}
        gameTitle="Memory Pairs"
        gameColor="ring-purple-500"
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--bg)] px-4 py-4 ${shake ? "animate-shake" : ""}`}>
      <GameHeader
        title="Memory Pairs"
        timer={timer}
        maxTimer={60}
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
            className={`w-3 h-3 rounded-full ${i < level ? "bg-[var(--duo-purple)]" : "bg-[var(--border)]"}`}
          />
        ))}
        <span className="text-[10px] text-[var(--fg-muted)] ml-2">
          {level === 1 ? "Formula ↔ Nama" : level === 2 ? "Formula ↔ Deskripsi" : "Deskripsi ↔ Nama"}
        </span>
      </div>

      {/* Match progress */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i < matchCount ? 1.3 : 1 }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i < matchCount ? "bg-[var(--duo-purple)]" : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-4 gap-2.5 max-w-md mx-auto" style={{ perspective: "1000px" }}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIds.includes(card.id) || card.matched;
          const isMatchedPair = matchedPair === card.pairId;

          return (
            <motion.div
              key={`${card.id}-${card.pairId}`}
              initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
              animate={{
                opacity: 1,
                scale: isMatchedPair ? [1, 1.15, 1] : 1,
                rotateY: isFlipped ? 180 : 0,
              }}
              transition={{
                opacity: { delay: idx * 0.03 },
                scale: isMatchedPair ? { duration: 0.4 } : springSnappy,
                rotateY: { duration: 0.4, ease: "easeInOut" },
              }}
              onClick={() => handleCardClick(card.id)}
              className="aspect-square cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card back (hidden state) */}
              <div
                className={`absolute inset-0 rounded-2xl border-3 flex items-center justify-center transition-all ${
                  isMatchedPair
                    ? "bg-[var(--duo-purple)]/10 border-[var(--duo-purple)] shadow-lg shadow-[var(--duo-purple)]/20"
                    : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--duo-purple)]/50"
                }`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                {isMatchedPair ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 size={24} className="text-[var(--duo-purple)]" />
                  </motion.div>
                ) : card.type === "formula" ? (
                  <div className="text-center px-1 overflow-hidden">
                    <div className="text-[9px] font-bold text-[var(--duo-purple)] mb-0.5">Rumus</div>
                    <div className="scale-[0.5] origin-center">
                      <KaTeX formula={card.content} displayMode={false} />
                    </div>
                  </div>
                ) : card.type === "name" ? (
                  <div className="text-center px-1">
                    <div className="text-[9px] font-bold text-[var(--duo-info)] mb-0.5">Nama</div>
                    <p className="text-[10px] font-bold text-[var(--fg)] leading-tight">{card.content}</p>
                  </div>
                ) : (
                  <div className="text-center px-1">
                    <div className="text-[9px] font-bold text-[var(--duo-orange)] mb-0.5">Deskripsi</div>
                    <p className="text-[8px] text-[var(--fg-muted)] leading-tight">{card.content}</p>
                  </div>
                )}
              </div>

              {/* Card front (question mark) */}
              <div
                className={`absolute inset-0 rounded-2xl border-3 flex items-center justify-center bg-gradient-to-br from-[var(--duo-purple)]/20 to-[var(--duo-pink)]/20 border-[var(--duo-purple)]/30`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <Brain size={20} className="text-[var(--duo-purple)] opacity-40" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
