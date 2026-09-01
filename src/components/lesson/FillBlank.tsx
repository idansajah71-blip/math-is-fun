"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Pencil } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import { isAnswerClose } from "@/lib/answerMatcher";

interface FillBlankProps {
  question: string;
  correctAnswer: string | string[];
  explanation: string;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
}

export default function FillBlank({
  question,
  correctAnswer,
  explanation,
  onCorrect,
  onWrong,
  onNext,
}: FillBlankProps) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;

    const correct = isAnswerClose(answer, correctAnswer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrectSound();
      onCorrect();
    } else {
      setShaking(true);
      playWrongSound();
      setTimeout(() => setShaking(false), 400);
      onWrong();
    }
  };

  // Extract the blank part from question
  const parts = question.split("____");

  return (
    <div className={shaking ? "animate-shake" : ""}>
      {/* Question */}
      <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[var(--duo-purple)]/10 rounded-lg flex items-center justify-center">
            <Pencil size={16} className="text-[var(--duo-purple)]" />
          </div>
          <span className="text-xs font-bold text-[var(--duo-purple)] uppercase">Isi Jawaban</span>
        </div>
        <h2 className="text-lg font-bold text-[var(--duo-text)]">
          {parts.length > 1 ? (
            <>
              {parts[0]}
              <span className="inline-block min-w-[100px] mx-2 px-3 py-1 bg-[var(--duo-info)]/10 border-b-2 border-[var(--duo-info)] text-center text-[var(--duo-info)] font-black">
                {showResult ? (Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer) : "..."}
              </span>
              {parts[1]}
            </>
          ) : (
            question
          )}
        </h2>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 mb-6">
        <label className="text-xs font-bold text-[var(--duo-text-muted)] mb-2 block">Jawaban Kamu</label>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !showResult) {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }
          }}
          disabled={showResult}
          placeholder="Ketik jawaban di sini..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full text-lg font-bold text-[var(--duo-text)] placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none bg-transparent appearance-none"
          style={{ WebkitBoxShadow: "none", caretColor: "var(--duo-info)" }}
          autoFocus
        />
      </div>

      {/* Result */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`p-4 rounded-2xl mb-4 flex items-start gap-3 ${
            isCorrect
              ? "bg-[var(--duo-green-bg)] border border-[var(--duo-green)]/30"
              : "bg-red-50 dark:bg-red-950/30 border border-[var(--duo-danger)]/30"
          }`}>
            {isCorrect ? (
              <CheckCircle2 size={20} className="text-[var(--duo-green)] mt-0.5 shrink-0" />
            ) : (
              <XCircle size={20} className="text-[var(--duo-danger)] mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-bold mb-1 ${isCorrect ? "text-[var(--duo-green)]" : "text-[var(--duo-danger)]"}`}>
                {isCorrect ? "Benar! +10 XP" : `Salah! Jawaban: ${Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer}`}
              </p>
              <p className="text-xs text-[var(--duo-text-muted)]">{explanation}</p>
            </div>
          </div>

          <AnimatedButton onClick={onNext} fullWidth size="lg" iconRight={<ChevronRight size={18} />}>
            {isCorrect ? "Lanjut" : "Mengerti"}
          </AnimatedButton>
        </motion.div>
      )}

      {/* Submit */}
      {!showResult && (
        <AnimatedButton
          onClick={handleSubmit}
          fullWidth
          size="lg"
          disabled={!answer.trim()}
        >
          Cek Jawaban
        </AnimatedButton>
      )}
    </div>
  );
}
