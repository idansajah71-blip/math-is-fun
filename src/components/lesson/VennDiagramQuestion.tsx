"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface VennRegion {
  label: string;
  value: number;
  /** Position as percentage from left/top of container */
  x: number;
  y: number;
}

interface VennDiagramQuestionProps {
  question: string;
  regions: VennRegion[];
  correctAnswer: number;
  /** Which region the user needs to fill */
  targetRegion: number;
  explanation: string;
  onCorrect: () => void;
  onWrong: () => void;
}

export default function VennDiagramQuestion({
  question,
  regions,
  correctAnswer,
  targetRegion,
  explanation,
  onCorrect,
  onWrong,
}: VennDiagramQuestionProps) {
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit() {
    if (answered || input.trim() === "") return;
    setAnswered(true);
    const userAnswer = parseInt(input.replace(/[^\d-]/g, ""), 10);
    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    if (correct) onCorrect();
    else onWrong();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-[var(--duo-text)] text-center">{question}</p>

      {/* Venn Diagram SVG */}
      <div className="relative mx-auto" style={{ width: 280, height: 200 }}>
        <svg viewBox="0 0 280 200" className="w-full h-full">
          {/* Left circle */}
          <circle cx="105" cy="100" r="70" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="2" />
          {/* Right circle */}
          <circle cx="175" cy="100" r="70" fill="rgba(168,85,247,0.15)" stroke="#A855F7" strokeWidth="2" />

          {/* Region labels */}
          <text x="60" y="105" textAnchor="middle" className="text-[11px] font-bold fill-blue-600">
            {regions[0]?.label || "A"}
          </text>
          <text x="140" y="75" textAnchor="middle" className="text-[10px] font-bold fill-emerald-600">
            {regions[1]?.label || "A∩B"}
          </text>
          <text x="220" y="105" textAnchor="middle" className="text-[11px] font-bold fill-purple-600">
            {regions[2]?.label || "B"}
          </text>

          {/* Region values */}
          <text x="60" y="120" textAnchor="middle" className="text-sm font-black fill-blue-800">
            {regions[0]?.value}
          </text>
          <text x="140" y="90" textAnchor="middle" className="text-sm font-black fill-emerald-800">
            {regions[1]?.value}
          </text>
          <text x="220" y="120" textAnchor="middle" className="text-sm font-black fill-purple-800">
            {regions[2]?.value}
          </text>

          {/* Target region highlight */}
          {targetRegion === 3 && (
            <text x="140" y="180" textAnchor="middle" className="text-xs font-bold fill-gray-500">
              Universitas: {regions[3]?.value ?? "?"}
            </text>
          )}
        </svg>

        {/* Input overlay on target region */}
        {!answered && (
          <div
            className="absolute"
            style={{
              left: targetRegion === 0 ? "15%" : targetRegion === 1 ? "42%" : targetRegion === 2 ? "70%" : "35%",
              top: targetRegion === 3 ? "78%" : "40%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="?"
              className="w-14 h-10 text-center text-lg font-black rounded-lg border-2 border-dashed border-[var(--primary)] bg-white/90 dark:bg-[var(--duo-card)]/90 text-[var(--duo-text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Result */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-sm font-bold ${
            isCorrect
              ? "bg-[var(--duo-green-bg)] text-[var(--duo-green)] border-2 border-[var(--duo-green)]/30"
              : "bg-red-50 dark:bg-red-950/30 text-red-500 border-2 border-red-300 dark:border-red-700"
          }`}
        >
          <div className="flex items-start gap-2">
            {isCorrect ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <XCircle size={16} className="mt-0.5 shrink-0" />}
            <div>
              <p>{isCorrect ? "Benar!" : `Salah! Jawaban: ${correctAnswer}`}</p>
              <p className="text-xs opacity-75 mt-1">{explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={input.trim() === ""}
          className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Konfirmasi
        </button>
      )}
    </div>
  );
}
