"use client";

export function playCorrectSound() {
  if (typeof window === "undefined") return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(523, ctx.currentTime);
  osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

export function playWrongSound() {
  if (typeof window === "undefined") return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

export function playLevelUpSound() {
  if (typeof window === "undefined") return;
  const ctx = new AudioContext();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.3);
  });
}

export function playCompleteSound() {
  if (typeof window === "undefined") return;
  const ctx = new AudioContext();
  const notes = [392, 440, 523, 659, 784];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.4);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.4);
  });
}
