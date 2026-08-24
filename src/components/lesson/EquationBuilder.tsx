"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EquationStep {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface EquationBuilderProps {
  steps: EquationStep[];
  onComplete: (allCorrect: boolean) => void;
}

export default function EquationBuilder({ steps, onComplete }: EquationBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(steps.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const step = steps[currentStep];
  const allAnswered = answers.every((a) => a !== null);

  function handleSelect(optionIndex: number) {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentStep] = optionIndex;
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 400);
  }

  function handleSubmit() {
    if (!allAnswered || submitted) return;
    setSubmitted(true);

    const allCorrect = answers.every((a, i) => a === steps[i].correctIndex);
    setTimeout(() => {
      setShowResult(true);
      onComplete(allCorrect);
    }, 500);
  }

  function handleReset() {
    setCurrentStep(0);
    setAnswers(new Array(steps.length).fill(null));
    setSubmitted(false);
    setShowResult(false);
  }

  return (
    <div className="space-y-5">
      {/* Step indicators */}
      <div className="flex gap-1.5 justify-center">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStep
                ? "w-8 bg-[var(--duo-green)]"
                : answers[i] !== null
                ? submitted
                  ? answers[i] === steps[i].correctIndex
                    ? "w-3 bg-[var(--duo-green)]"
                    : "w-3 bg-red-400"
                  : "w-3 bg-[var(--duo-green)]/50"
                : "w-3 bg-[var(--duo-border)]"
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          {/* Step number */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--duo-green)] text-white text-xs font-black flex items-center justify-center">
              {currentStep + 1}
            </span>
            <p className="text-sm font-bold text-[var(--duo-text)]">{step.prompt}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2">
            {step.options.map((opt, i) => {
              const isSelected = answers[currentStep] === i;
              const isCorrectOption = submitted && i === step.correctIndex;
              const isWrong = submitted && isSelected && i !== step.correctIndex;

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={submitted}
                  whileHover={!submitted ? { scale: 1.02 } : {}}
                  whileTap={!submitted ? { scale: 0.98 } : {}}
                  className={`p-3 rounded-xl text-sm font-bold border-2 transition-all text-left ${
                    isCorrectOption
                      ? "border-[var(--duo-green)] bg-[var(--duo-green-bg)] text-[var(--duo-green)]"
                      : isWrong
                      ? "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-500"
                      : isSelected
                      ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10 text-[var(--duo-green)]"
                      : "border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] hover:border-[var(--duo-green)]/40"
                  }`}
                >
                  <span className="font-mono">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation after submit */}
          {submitted && step.explanation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-[var(--duo-text-muted)] bg-[var(--duo-card)] p-3 rounded-xl"
            >
              {step.explanation}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-2">
        {currentStep > 0 && !submitted && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2.5 rounded-xl border-2 border-[var(--duo-border)] text-[var(--duo-text-muted)] font-bold text-sm hover:bg-[var(--duo-card)] transition-colors"
          >
            ← Kembali
          </button>
        )}

        {allAnswered && !submitted ? (
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-[var(--duo-green)] text-white font-bold text-sm shadow-[0_3px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Cek Semua Langkah
          </button>
        ) : submitted && showResult ? (
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl border-2 border-[var(--duo-green)] text-[var(--duo-green)] font-bold text-sm hover:bg-[var(--duo-green-bg)] transition-colors"
          >
            Coba Lagi
          </button>
        ) : null}
      </div>

      {/* Progress text */}
      <p className="text-center text-xs text-[var(--duo-text-muted)]">
        Langkah {currentStep + 1} dari {steps.length}
      </p>
    </div>
  );
}
