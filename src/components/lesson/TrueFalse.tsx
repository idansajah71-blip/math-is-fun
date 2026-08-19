"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { playCorrectSound, playWrongSound, playClickSound } from "@/lib/sounds";

interface TrueFalseProps {
  question: string;
  isCorrect: boolean;
  explanation: string;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
}

export default function TrueFalse({
  question,
  isCorrect,
  explanation,
  onCorrect,
  onWrong,
  onNext,
}: TrueFalseProps) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleAnswer = (answer: boolean) => {
    if (selected !== null) return;
    playClickSound();
    setSelected(answer);
    setShowResult(true);

    if (answer === isCorrect) {
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
          <div className="w-8 h-8 bg-[var(--duo-orange)]/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-black text-[var(--duo-orange)]">!</span>
          </div>
          <span className="text-xs font-bold text-[var(--duo-orange)] uppercase">Benar atau Salah?</span>
        </div>
        <h2 className="text-lg font-bold text-[var(--duo-text)]">{question}</h2>
      </div>

      {/* True/False Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* TRUE */}
        <motion.button
          onClick={() => handleAnswer(true)}
          disabled={selected !== null}
          className={`relative p-6 rounded-[24px] border-3 text-center transition-all ${
            showResult && isCorrect === true
              ? "bg-[var(--duo-green-bg)] border-[var(--duo-green)] shadow-lg"
              : showResult && selected === true && !isCorrect
              ? "bg-red-50 dark:bg-red-950/30 border-[var(--duo-danger)]"
              : selected === true
              ? "bg-[var(--duo-green-bg)] border-[var(--duo-green)]"
              : "bg-white dark:bg-[var(--duo-card)] border-[var(--duo-border)] hover:border-[var(--duo-green)]/50"
          }`}
          whileHover={selected === null ? { scale: 1.03, y: -4 } : {}}
          whileTap={selected === null ? { scale: 0.97 } : {}}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: showResult && isCorrect ? "var(--duo-green)" : showResult && selected === true && !isCorrect ? "var(--duo-danger)" : "var(--duo-green-bg)",
            }}
          >
            {showResult && isCorrect ? (
              <CheckCircle2 size={28} className="text-white" />
            ) : showResult && selected === true && !isCorrect ? (
              <XCircle size={28} className="text-white" />
            ) : (
              <ThumbsUp size={28} className="text-[var(--duo-green)]" />
            )}
          </motion.div>
          <span className="text-lg font-black text-[var(--duo-text)]">Benar</span>
        </motion.button>

        {/* FALSE */}
        <motion.button
          onClick={() => handleAnswer(false)}
          disabled={selected !== null}
          className={`relative p-6 rounded-[24px] border-3 text-center transition-all ${
            showResult && isCorrect === false
              ? "bg-[var(--duo-green-bg)] border-[var(--duo-green)] shadow-lg"
              : showResult && selected === false && isCorrect
              ? "bg-red-50 dark:bg-red-950/30 border-[var(--duo-danger)]"
              : selected === false
              ? "bg-[var(--duo-green-bg)] border-[var(--duo-green)]"
              : "bg-white dark:bg-[var(--duo-card)] border-[var(--duo-border)] hover:border-[var(--duo-danger)]/50"
          }`}
          whileHover={selected === null ? { scale: 1.03, y: -4 } : {}}
          whileTap={selected === null ? { scale: 0.97 } : {}}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: showResult && !isCorrect ? "var(--duo-green)" : showResult && selected === false && isCorrect ? "var(--duo-danger)" : "bg-red-50 dark:bg-red-950/30",
            }}
          >
            {showResult && !isCorrect ? (
              <CheckCircle2 size={28} className="text-white" />
            ) : showResult && selected === false && isCorrect ? (
              <XCircle size={28} className="text-white" />
            ) : (
              <ThumbsDown size={28} className="text-[var(--duo-danger)]" />
            )}
          </motion.div>
          <span className="text-lg font-black text-[var(--duo-text)]">Salah</span>
        </motion.button>
      </div>

      {/* Result */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`p-4 rounded-2xl mb-4 flex items-start gap-3 ${
            (selected === true) === isCorrect
              ? "bg-[var(--duo-green-bg)] border border-[var(--duo-green)]/30"
              : "bg-red-50 dark:bg-red-950/30 border border-[var(--duo-danger)]/30"
          }`}>
            {(selected === true) === isCorrect ? (
              <CheckCircle2 size={20} className="text-[var(--duo-green)] mt-0.5 shrink-0" />
            ) : (
              <XCircle size={20} className="text-[var(--duo-danger)] mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-bold mb-1 ${
                (selected === true) === isCorrect ? "text-[var(--duo-green)]" : "text-[var(--duo-danger)]"
              }`}>
                {(selected === true) === isCorrect ? "Benar! +10 XP" : "Salah!"}
              </p>
              <p className="text-xs text-[var(--duo-text-muted)]">{explanation}</p>
            </div>
          </div>

          <AnimatedButton onClick={onNext} fullWidth size="lg" iconRight={<ChevronRight size={18} />}>
            {(selected === true) === isCorrect ? "Lanjut" : "Mengerti"}
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  );
}
