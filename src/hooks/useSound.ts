"use client";

import { useState, useCallback } from "react";

type SoundType = "click" | "correct" | "wrong" | "levelup" | "reward" | "complete";

const frequencies: Record<SoundType, number[]> = {
  click: [800],
  correct: [523, 659, 784],
  wrong: [200, 150],
  levelup: [523, 659, 784, 1047],
  reward: [440, 554, 659, 880],
  complete: [392, 440, 523, 659, 784],
};

const waveTypes: Record<SoundType, OscillatorType> = {
  click: "sine",
  correct: "sine",
  wrong: "sawtooth",
  levelup: "sine",
  reward: "triangle",
  complete: "triangle",
};

export function useSound() {
  const [muted, setMuted] = useState(false);

  const play = useCallback(
    (type: SoundType) => {
      if (muted || typeof window === "undefined") return;

      try {
        const ctx = new AudioContext();
        const notes = frequencies[type];
        const wave = waveTypes[type];

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = wave;
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.3);
        });
      } catch {
        // AudioContext not available
      }
    },
    [muted]
  );

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return { play, muted, toggleMute };
}
