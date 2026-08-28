"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRoomQuestions } from "@/lib/rooms";
import type { Room } from "@/lib/rooms";
import type { QuizQuestion } from "@/lib/types";
import { Check, X, Trophy, Clock, Zap } from "lucide-react";

interface Props {
  room: Room;
  userId: string;
  userName: string;
  onComplete: (score: number, timeSpent: number) => void;
}

export default function RoomChallenge({ room, userId, userName, onComplete }: Props) {
  const questions = useMemo(() => getRoomQuestions(room), [room.code, room.config.type, room.config.topics.join(","), room.config.difficulty, room.config.questionsCount]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, done]);

  const q: QuizQuestion | undefined = questions[current];
  const total = questions.length;
  const progress = total > 0 ? ((current + (answered ? 1 : 0)) / total) * 100 : 0;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);

    if (idx === q?.correctIndex) {
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);
    }
  }

  function handleNext() {
    if (current + 1 >= total) {
      const finalScore = scoreRef.current;
      const finalTime = Math.floor((Date.now() - startTime) / 1000);
      setDone(true);
      onComplete(finalScore, finalTime);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!q) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--duo-text-muted)]">Tidak ada soal tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[var(--duo-green)]" />
          <span className="text-xs font-black text-[var(--duo-text)]">Soal {current + 1}/{total}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs font-bold text-[var(--duo-text)]">
            <Trophy size={12} className="text-yellow-400" /> {displayScore}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-[var(--duo-text-muted)]">
            <Clock size={12} /> {formatTime(elapsed)}
          </span>
        </div>
      </div>

      <div className="h-2 bg-[var(--duo-card)] rounded-full overflow-hidden">
        <motion.div className="h-full bg-[var(--duo-green)] rounded-full"
          initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6 space-y-4">
          {q.topicSlug && (
            <span className="inline-block px-2 py-0.5 bg-[var(--duo-green)]/10 text-[var(--duo-green)] rounded-full text-[9px] font-bold">
              {q.topicSlug}
            </span>
          )}
          <p className="text-sm font-black text-[var(--duo-text)] leading-relaxed">{q.question}</p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-2">
        {q.options?.map((opt, idx) => {
          let style = "bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] text-[var(--duo-text)]";
          if (answered) {
            if (idx === q.correctIndex) {
              style = "bg-green-100 dark:bg-green-900/30 border-2 border-green-400 text-green-700 dark:text-green-300";
            } else if (idx === selected) {
              style = "bg-red-100 dark:bg-red-900/30 border-2 border-red-400 text-red-700 dark:text-red-300";
            } else {
              style = "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400";
            }
          }

          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={answered}
              className={`p-4 rounded-xl text-left text-sm font-bold transition-all flex items-center gap-3 ${style}`}>
              <span className="w-7 h-7 rounded-lg bg-[var(--duo-bg)] flex items-center justify-center text-[10px] font-black shrink-0">
                {answered && idx === q.correctIndex ? <Check size={14} className="text-green-500" /> :
                  answered && idx === selected ? <X size={14} className="text-red-500" /> :
                    String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={handleNext}
            className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-black hover:brightness-110 transition-all">
            {current + 1 >= total ? "Selesai" : "Soal Berikutnya"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
