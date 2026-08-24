"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface NumberLineDragProps {
  min: number;
  max: number;
  correctValue: number;
  tolerance?: number;
  step?: number;
  label?: string;
  onCorrect: () => void;
  onWrong: () => void;
}

export default function NumberLineDrag({
  min,
  max,
  correctValue,
  tolerance = 0.5,
  step = 1,
  label = "Geser ke jawaban yang benar",
  onCorrect,
  onWrong,
}: NumberLineDragProps) {
  const [position, setPosition] = useState<number>((min + max) / 2);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const range = max - min;
  const pct = ((position - min) / range) * 100;

  // Tick marks
  const ticks: number[] = [];
  for (let v = min; v <= max; v += step) {
    ticks.push(v);
  }

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  function updatePosition(clientX: number) {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const rawPct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + rawPct * range;

    // Snap to step
    const snapped = Math.round(rawValue / step) * step;
    setPosition(Math.max(min, Math.min(max, snapped)));
  }

  function handleSubmit() {
    if (answered) return;
    setAnswered(true);
    const correct = Math.abs(position - correctValue) <= tolerance;
    setIsCorrect(correct);
    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-[var(--duo-text)] text-center">{label}</p>

      {/* Current value display */}
      <div className="text-center">
        <motion.span
          key={position}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-2xl font-black text-[var(--duo-green)]"
        >
          {position}
        </motion.span>
      </div>

      {/* Number line */}
      <div className="relative px-4 py-6 select-none touch-none">
        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-2 bg-[var(--duo-border)] rounded-full cursor-pointer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Filled portion */}
          <div
            className="absolute h-full bg-[var(--duo-green)] rounded-full transition-colors"
            style={{ width: `${pct}%` }}
          />

          {/* Tick marks */}
          {ticks.map((tick) => {
            const tickPct = ((tick - min) / range) * 100;
            return (
              <div
                key={tick}
                className="absolute flex flex-col items-center"
                style={{ left: `${tickPct}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-0.5 h-3 bg-[var(--duo-border)]" />
                <span className="text-[10px] font-bold text-[var(--duo-text-muted)] mt-1">
                  {tick}
                </span>
              </div>
            );
          })}

          {/* Draggable handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--duo-green)] border-4 border-white shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center"
            style={{ left: `${pct}%` }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 1.25 }}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </motion.div>
        </div>
      </div>

      {/* Submit */}
      {!answered ? (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all"
        >
          Cek Jawaban
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center font-bold ${
            isCorrect
              ? "bg-[var(--duo-green-bg)] text-[var(--duo-green)] border-2 border-[var(--duo-green)]/30"
              : "bg-red-50 dark:bg-red-950/30 text-red-500 border-2 border-red-300 dark:border-red-700"
          }`}
        >
          {isCorrect ? (
            <span>Benar! 🎯</span>
          ) : (
            <span>Jawaban yang benar: {correctValue}</span>
          )}
        </motion.div>
      )}
    </div>
  );
}
