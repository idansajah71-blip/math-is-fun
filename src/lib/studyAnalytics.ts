"use client";

import { getProfile } from "./gamification";

export interface HourlyData {
  hour: number;
  count: number;
  label: string;
}

export interface WeeklyData {
  day: string;
  count: number;
}

export interface StudyRecommendation {
  type: "best_hour" | "best_day" | "consistency" | "variety";
  title: string;
  description: string;
  icon: string;
}

const DAY_NAMES = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export function getHourlyActivity(): HourlyData[] {
  const profile = getProfile();
  const activity = profile.hourlyActivity || {};

  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: activity[String(i)] || 0,
    label: HOUR_LABELS[i],
  }));
}

export function getWeeklyPattern(): WeeklyData[] {
  const profile = getProfile();
  const history = profile.dailyXpHistory || {};

  return DAY_NAMES.map((day, dayIdx) => {
    let count = 0;
    // Check last 4 weeks of data
    for (let w = 0; w < 4; w++) {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() + 1 + dayIdx - w * 7); // Monday-first
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (history[key] && history[key] > 0) count++;
    }
    return { day, count };
  });
}

export function getBestStudyHours(): { hour: number; count: number }[] {
  const activity = getHourlyActivity();
  return activity
    .filter((h) => h.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export function getBestStudyDays(): string[] {
  const pattern = getWeeklyPattern();
  const maxCount = Math.max(...pattern.map((d) => d.count));
  return pattern.filter((d) => d.count === maxCount && d.count > 0).map((d) => d.day);
}

export function getTotalSessions(): number {
  const profile = getProfile();
  const activity = profile.hourlyActivity || {};
  return Object.values(activity).reduce((a, b) => a + b, 0);
}

export function getStudyRecommendations(): StudyRecommendation[] {
  const recs: StudyRecommendation[] = [];
  const bestHours = getBestStudyHours();
  const bestDays = getBestStudyDays();
  const totalSessions = getTotalSessions();
  const profile = getProfile();

  if (bestHours.length > 0) {
    const topHour = bestHours[0];
    recs.push({
      type: "best_hour",
      title: "Jam Produktif",
      description: `Kamu paling aktif jam ${topHour.hour}:00. Manfaatkan jam ini untuk belajar hal sulit.`,
      icon: "Clock",
    });
  }

  if (bestDays.length > 0) {
    recs.push({
      type: "best_day",
      title: "Hari Rajin",
      description: `Hari ${bestDays.join(", ")} adalah hari paling rajinmu. Pertahankan!`,
      icon: "Calendar",
    });
  }

  if (totalSessions < 10) {
    recs.push({
      type: "consistency",
      title: "Lebih Konsisten",
      description: "Coba belajar minimal 1 kali sehari untuk membangun kebiasaan.",
      icon: "Flame",
    });
  }

  const uniqueHours = Object.keys(profile.hourlyActivity || {}).length;
  if (uniqueHours < 5 && totalSessions > 10) {
    recs.push({
      type: "variety",
      title: "Variasi Waktu",
      description: "Coba belajar di jam yang berbeda untuk menemukan waktu terbaikmu.",
      icon: "Sparkles",
    });
  }

  return recs;
}
