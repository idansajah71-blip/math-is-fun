"use client";

import { getProfile, saveProfile, addXp, isPremiumActive } from "./gamification";

export interface PomodoroSettings {
  workMin: number;
  breakMin: number;
  longBreakMin: number;
  sessionsBeforeLong: number;
}

export type PomodoroMode = "work" | "break" | "longBreak" | "idle";

export function getPomodoroSettings(): PomodoroSettings {
  const profile = getProfile();
  return profile.pomodoroSettings || { workMin: 25, breakMin: 5, longBreakMin: 15, sessionsBeforeLong: 4 };
}

export function savePomodoroSettings(settings: PomodoroSettings) {
  const profile = getProfile();
  profile.pomodoroSettings = settings;
  saveProfile(profile);
}

export function getPomodoroSessions(): number {
  const profile = getProfile();
  return profile.pomodoroSessions || 0;
}

export function completePomodoroSession(): { xpEarned: number; sessions: number; isLongBreak: boolean } {
  const profile = getProfile();
  const settings = getPomodoroSettings();
  const sessions = (profile.pomodoroSessions || 0) + 1;
  profile.pomodoroSessions = sessions;

  let xpEarned = 15;
  if (isPremiumActive()) xpEarned = Math.round(xpEarned * 1.5);

  // Bonus every 4 sessions
  if (sessions % settings.sessionsBeforeLong === 0) {
    xpEarned += 25;
  }

  saveProfile(profile);
  addXp(xpEarned);

  const isLongBreak = sessions % settings.sessionsBeforeLong === 0;

  return { xpEarned, sessions, isLongBreak };
}
