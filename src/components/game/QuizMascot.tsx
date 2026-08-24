"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "@/components/game/Mascot";

type MascotMood = "happy" | "thinking" | "celebrate" | "sad" | "idle" | "wink";

interface QuizMascotProps {
  /** Number of consecutive correct answers */
  combo: number;
  /** Hearts remaining */
  hearts: number;
  /** Max hearts */
  maxHearts: number;
  /** Whether the last answer was correct */
  lastAnswerCorrect: boolean | null;
  /** Whether quiz is complete */
  isComplete: boolean;
  /** Score percentage */
  score: number;
}

const COMBO_MESSAGES = [
  "", // 0
  "Bagus!", // 1
  "Keren!", // 2
  "Luar biasa!", // 3
  "On fire! 🔥", // 4
  "LEGENDA! ⭐", // 5+
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
  const [message, setMessage] = useState<string>("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isComplete) {
      if (score >= 80) {
        setMood("celebrate");
        setMessage("Hebat! Kamu luar biasa!");
      } else if (score >= 50) {
        setMood("happy");
        setMessage("Cukup bagus! Terus tingkatkan ya.");
      } else {
        setMood("sad");
        setMessage("Yuk belajar lagi nanti. Semangat!");
      }
      setKey((k) => k + 1);
      return;
    }

    if (lastAnswerCorrect === null) {
      // Initial state
      setMood("thinking");
      setMessage("Siap mengerjakan?");
      return;
    }

    if (lastAnswerCorrect) {
      if (combo >= 5) {
        setMood("celebrate");
        setMessage(COMBO_MESSAGES[5]);
      } else if (combo >= 3) {
        setMood("wink");
        setMessage(COMBO_MESSAGES[Math.min(combo, 4)]);
      } else if (combo >= 1) {
        setMood("happy");
        setMessage(COMBO_MESSAGES[Math.min(combo, 4)]);
      } else {
        setMood("happy");
        setMessage("Benar! 👍");
      }
    } else {
      setMood("sad");
      setMessage(pickRandom(WRONG_MESSAGES));
    }

    // Low hearts warning
    if (hearts <= 1 && hearts > 0) {
      setMood("sad");
      setMessage(pickRandom(LOW_HEART_MESSAGES));
    }

    setKey((k) => k + 1);
  }, [combo, hearts, lastAnswerCorrect, isComplete, score]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Mascot mood={mood} size={70} message={message} />
        </motion.div>
      </AnimatePresence>

      {/* Combo indicator */}
      {combo >= 2 && !isComplete && (
        <motion.div
          key={`combo-${combo}`}
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="absolute -top-2 -right-2 bg-[var(--duo-orange)] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg"
        >
          {combo}x 🔥
        </motion.div>
      )}
    </div>
  );
}
