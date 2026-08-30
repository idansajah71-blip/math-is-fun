"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPomodoroSettings,
  savePomodoroSettings,
  completePomodoroSession,
  type PomodoroMode,
  type PomodoroSettings,
} from "@/lib/pomodoro";
import { playCompleteSound, playCorrectSound } from "@/lib/sounds";
import { Timer, Play, Pause, RotateCcw, Settings, X, CheckCircle2 } from "lucide-react";
import { springBounce } from "@/lib/animations";

export default function PomodoroTimer() {
  const [mode, setMode] = useState<PomodoroMode>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionsInRow, setSessionsInRow] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [lastXp, setLastXp] = useState(0);
  const [settings, setSettings] = useState<PomodoroSettings>({ workMin: 25, breakMin: 5, longBreakMin: 15, sessionsBeforeLong: 4 });
  const [minimized, setMinimized] = useState(false);
  const [pausedMode, setPausedMode] = useState<PomodoroMode>("idle");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSettings(getPomodoroSettings());
  }, []);

  useEffect(() => {
    return () => {
      if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
    };
  }, []);

  const handleTimerCompleteRef = useRef<() => void>(() => {});

  // Timer logic
  useEffect(() => {
    if (mode === "idle" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => handleTimerCompleteRef.current(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, timeLeft > 0]);

  const handleTimerComplete = useCallback(() => {
    if (mode === "work") {
      const result = completePomodoroSession();
      setLastXp(result.xpEarned);
      setSessionsInRow(result.sessions);
      setShowComplete(true);
      playCompleteSound();

      completeTimeoutRef.current = setTimeout(() => {
        setShowComplete(false);
        if (result.isLongBreak) {
          startBreak(settings.longBreakMin);
        } else {
          startBreak(settings.breakMin);
        }
      }, 2000);
    } else {
      // Break finished, back to work
      setMode("idle");
      playCorrectSound();
    }
  }, [mode, settings]);

  handleTimerCompleteRef.current = handleTimerComplete;

  const startWork = () => {
    const secs = settings.workMin * 60;
    setTimeLeft(secs);
    setTotalTime(secs);
    setMode("work");
    setMinimized(false);
  };

  const startBreak = (minutes: number) => {
    const secs = minutes * 60;
    setTimeLeft(secs);
    setTotalTime(secs);
    setMode("break");
  };

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPausedMode(mode);
    setMode("idle");
  };

  const resume = () => {
    if (timeLeft > 0 && pausedMode !== "idle") setMode(pausedMode);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMode("idle");
    setTimeLeft(0);
    setTotalTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isRunning = mode === "work" || mode === "break";
  const isWork = mode === "work";

  if (minimized && isRunning) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <button
          onClick={() => setMinimized(false)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center border-2 ${
            isWork
              ? "bg-blue-500 border-blue-400 text-white"
              : "bg-[var(--duo-green)] border-[var(--duo-green)]/80 text-white"
          }`}
        >
          <span className="text-xs font-black">{formatTime(timeLeft)}</span>
        </button>
      </motion.div>
    );
  }

  if (!isRunning && mode === "idle" && timeLeft === 0 && !showComplete) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <button
          onClick={startWork}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center border-2 border-blue-400"
          title="Mulai Pomodoro"
        >
          <Timer size={22} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springBounce}
      className="fixed bottom-20 right-4 z-50 w-64"
      drag
      dragMomentum={false}
    >
      <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`px-4 py-2 flex items-center justify-between ${
          isWork ? "bg-blue-500/10" : mode === "break" ? "bg-[var(--duo-green)]/10" : "bg-gray-100 dark:bg-gray-800"
        }`}>
          <span className={`text-xs font-black ${
            isWork ? "text-blue-500" : mode === "break" ? "text-[var(--duo-green)]" : "text-[var(--duo-text-muted)]"
          }`}>
            {isWork ? "🧠 Fokus" : mode === "break" ? "☕ Istirahat" : "Pomodoro"}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowSettings(true)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <Settings size={12} className="text-[var(--duo-text-muted)]" />
            </button>
            {isRunning && (
              <button onClick={() => setMinimized(true)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                <X size={12} className="text-[var(--duo-text-muted)]" />
              </button>
            )}
          </div>
        </div>

        {/* Timer circle */}
        <div className="px-4 py-4 flex flex-col items-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--duo-border)" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={isWork ? "#3B82F6" : "#10B981"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[var(--duo-text)]">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            {isRunning ? (
              <button
                onClick={pause}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  isWork ? "bg-blue-500 hover:bg-blue-600" : "bg-[var(--duo-green)] hover:opacity-90"
                }`}
              >
                <Pause size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={startWork}
                  className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                >
                  <Play size={16} fill="currentColor" />
                </button>
                {timeLeft > 0 && (
                  <button
                    onClick={resume}
                    className="w-10 h-10 rounded-full bg-[var(--duo-green)] hover:opacity-90 text-white flex items-center justify-center"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                )}
              </>
            )}
            <button
              onClick={reset}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <RotateCcw size={14} className="text-[var(--duo-text-muted)]" />
            </button>
          </div>

          {/* Sessions count */}
          <p className="text-[10px] font-bold text-[var(--duo-text-muted)] mt-3">
            Sesi selesai: {sessionsInRow}
          </p>
        </div>

        {/* Complete overlay */}
        <AnimatePresence>
          {showComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 dark:bg-[var(--duo-card)]/90 flex flex-col items-center justify-center"
            >
              <CheckCircle2 size={40} className="text-[var(--duo-green)] mb-2" />
              <p className="text-sm font-black text-[var(--duo-text)]">Sesi Selesai!</p>
              <p className="text-xs font-bold text-[var(--duo-xp)]">+{lastXp} XP</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 dark:bg-[var(--duo-card)]/95 p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-[var(--duo-text)]">Pengaturan</span>
                <button onClick={() => setShowSettings(false)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <label className="text-[10px] font-bold text-[var(--duo-text-muted)]">Fokus (menit)</label>
                  <input
                    type="number"
                    min={15}
                    max={60}
                    value={settings.workMin}
                    onChange={(e) => setSettings({ ...settings, workMin: Math.max(15, Math.min(60, Number(e.target.value) || 25)) })}
                    className="w-full mt-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--duo-border)] bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[var(--duo-text-muted)]">Istirahat (menit)</label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={settings.breakMin}
                    onChange={(e) => setSettings({ ...settings, breakMin: Math.max(3, Math.min(15, Number(e.target.value) || 5)) })}
                    className="w-full mt-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--duo-border)] bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[var(--duo-text-muted)]">Istirahat Panjang (menit)</label>
                  <input
                    type="number"
                    min={10}
                    max={30}
                    value={settings.longBreakMin}
                    onChange={(e) => setSettings({ ...settings, longBreakMin: Math.max(10, Math.min(30, Number(e.target.value) || 15)) })}
                    className="w-full mt-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--duo-border)] bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
              <button
                onClick={() => { savePomodoroSettings(settings); setShowSettings(false); }}
                className="w-full py-2 bg-[var(--duo-green)] text-white text-xs font-bold rounded-lg"
              >
                Simpan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
