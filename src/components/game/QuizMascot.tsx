"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "@/components/game/Mascot";
import { InlineIcon } from "@/lib/iconMap";

type MascotMood = "happy" | "thinking" | "celebrate" | "sad" | "idle" | "wink" | "concentrate" | "sleepy" | "angry" | "proud" | "wave" | "love" | "surprised";

interface QuizMascotProps {
  combo: number;
  hearts: number;
  maxHearts: number;
  lastAnswerCorrect: boolean | null;
  isComplete: boolean;
  score: number;
}

const COMBO_TEXT: (string | ReactNode)[] = [
  "",
  "Bagus!",
  "Keren!",
  "Luar biasa!",
  <span key="onfire" className="flex items-center gap-1">On fire! <InlineIcon emoji="🔥" size={12} /></span>,
  <span key="legenda" className="flex items-center gap-1">LEGENDA! <InlineIcon emoji="⭐" size={12} /></span>,
];

const WRONG_MESSAGES = [
  "Gapapa, coba lagi ya!",
  "Hampir! Perhatiin penjelasannya.",
  "Semangat! Kamu pasti bisa.",
  "Jangan nyerah, pelan-pelan aja.",
];

const LOW_HEART_MESSAGES = [
  "Hati-hati! Sisa satu nyawa lagi!",
  "Nyawa tinggal sedikit, berhati-hatilah!",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function QuizMascot({
  combo,
  hearts,
  maxHearts,
  lastAnswerCorrect,
  isComplete,
  score,
}: QuizMascotProps) {
  const [mood, setMood] = useState<MascotMood>("thinking");
  const [msgKey, setMsgKey] = useState(0);
  const [comboIdx, setComboIdx] = useState(0);
  const [plainMsg, setPlainMsg] = useState<string>("Siap mengerjakan?");

  useEffect(() => {
    if (isComplete) {
      if (score >= 80) {
        setMood("celebrate");
        setPlainMsg("Hebat! Kamu luar biasa!");
      } else if (score >= 50) {
        setMood("happy");
        setPlainMsg("Cukup bagus! Terus tingkatkan ya.");
      } else {
        setMood("sad");
        setPlainMsg("Yuk belajar lagi nanti. Semangat!");
      }
      setMsgKey((k) => k + 1);
      return;
    }

    if (lastAnswerCorrect === null) {
      setMood("thinking");
      setPlainMsg("Siap mengerjakan?");
      setComboIdx(0);
      return;
    }

    if (lastAnswerCorrect) {
      if (combo >= 5) {
        setMood("celebrate");
        setComboIdx(5);
      } else if (combo >= 3) {
        setMood("wink");
        setComboIdx(Math.min(combo, 4));
      } else if (combo >= 1) {
        setMood("happy");
        setComboIdx(Math.min(combo, 3));
      } else {
        setMood("happy");
        setPlainMsg("Benar sekali!");
        setComboIdx(0);
      }
    } else {
      setMood("sad");
      setPlainMsg(pickRandom(WRONG_MESSAGES));
      setComboIdx(0);
    }

    if (hearts <= 1 && hearts > 0) {
      setMood("sad");
      setPlainMsg(pickRandom(LOW_HEART_MESSAGES));
    }

    setMsgKey((k) => k + 1);
  }, [combo, hearts, lastAnswerCorrect, isComplete, score]);

  const finalMessage: ReactNode = comboIdx >= 3 ? COMBO_TEXT[comboIdx] : plainMsg;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={msgKey}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Mascot
            mood={mood}
            size={70}
            message={typeof finalMessage === "string" ? finalMessage : undefined}
          />
          {typeof finalMessage !== "string" && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-center"
            >
              <div className="inline-flex items-center justify-center bg-white dark:bg-[var(--surface)] px-3 py-1.5 rounded-[14px] shadow-md border border-[var(--border)]">
                <span className="text-[11px] font-bold text-[var(--fg)] flex items-center">{finalMessage}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {combo >= 2 && !isComplete && (
        <motion.div
          key={`combo-${combo}`}
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="absolute -top-2 -right-2 bg-[var(--duo-orange)] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1"
        >
          {combo}x <InlineIcon emoji="🔥" size={10} />
        </motion.div>
      )}
    </div>
  );
}
