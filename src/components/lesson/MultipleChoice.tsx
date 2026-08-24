"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { playCorrectSound, playWrongSound, playClickSound } from "@/lib/sounds";

interface MultipleChoiceProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
}

export default function MultipleChoice({
  question,
  options,
  correctIndex,
  explanation,
  onCorrect,
  onWrong,
  onNext,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);

  const shuffled = useMemo(() => {
    const idx = options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return { options: idx.map(i => options[i]), correctIndex: idx.indexOf(correctIndex) };
  }, [question]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    playClickSound();
    setSelected(i);
    setShowResult(true);

    if (i === shuffled.correctIndex) {
      playCorrectSound();
      onCorrect();
    } else {
      setShaking(true);
      playWrongSound();
      setTimeout(() => setShaking(false), 400);
      onWrong();
    }
  };

  return (
    <div className={shaking ? "animate-shake" : ""}>
      {/* Question */}
      <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[var(--duo-info)]/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-black text-[var(--duo-info)]">?</span>
          </div>
          <span className="text-xs font-bold text-[var(--duo-info)] uppercase">Pilih Jawaban</span>
        </div>
        <h2 className="text-lg font-bold text-[var(--duo-text)]">{question}</h2>
      </div>

      {/* Options */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3 mb-6"
      >
        {shuffled.options.map((opt, i) => {
          let style = "bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] hover:border-[var(--duo-green)]/50 hover:shadow-md cursor-pointer";
          if (showResult) {
            if (i === shuffled.correctIndex) {
              style = "bg-[var(--duo-green-bg)] border-2 border-[var(--duo-green)]";
            } else if (i === selected) {
              style = "bg-red-50 dark:bg-red-950/30 border-2 border-[var(--duo-danger)]";
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
              className={`w-full p-4 rounded-2xl text-left transition-all ${style}`}
              whileHover={selected === null ? { scale: 1.02, y: -2 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                  showResult && i === shuffled.correctIndex
                    ? "bg-[var(--duo-green)] text-white"
                    : showResult && i === selected
                    ? "bg-[var(--duo-danger)] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)]"
                }`}>
                  {showResult && i === shuffled.correctIndex ? (
                    <CheckCircle2 size={18} />
                  ) : showResult && i === selected ? (
                    <XCircle size={18} />
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

      {/* Result + Next */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`p-4 rounded-2xl mb-4 flex items-start gap-3 ${
            selected === shuffled.correctIndex
              ? "bg-[var(--duo-green-bg)] border border-[var(--duo-green)]/30"
              : "bg-red-50 dark:bg-red-950/30 border border-[var(--duo-danger)]/30"
          }`}>
            {selected === shuffled.correctIndex ? (
              <CheckCircle2 size={20} className="text-[var(--duo-green)] mt-0.5 shrink-0" />
            ) : (
              <XCircle size={20} className="text-[var(--duo-danger)] mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-bold mb-1 ${
                selected === shuffled.correctIndex ? "text-[var(--duo-green)]" : "text-[var(--duo-danger)]"
              }`}>
                {selected === shuffled.correctIndex ? "Benar! +10 XP" : "Salah!"}
              </p>
              <p className="text-xs text-[var(--duo-text-muted)]">{explanation}</p>
            </div>
          </div>

          <AnimatedButton onClick={onNext} fullWidth size="lg" iconRight={<ChevronRight size={18} />}>
            {selected === shuffled.correctIndex ? "Lanjut" : "Mengerti"}
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  );
}
