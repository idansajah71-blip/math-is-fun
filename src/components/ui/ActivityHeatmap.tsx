"use client";

import { useMemo, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface ActivityHeatmapProps {
  dailyXpHistory: Record<string, number>;
  totalDays?: number;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getIntensityClass(xp: number): string {
  if (xp === 0) return "bg-[var(--border)]";
  if (xp < 30) return "bg-[#1B4620] dark:bg-[#0E2611]";
  if (xp < 80) return "bg-[#256B2E] dark:bg-[#1B4620]";
  if (xp < 150) return "bg-[#2FA83D] dark:bg-[#256B2E]";
  return "bg-[var(--primary)]";
}

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function calcLongestStreak(dailyXpHistory: Record<string, number>): number {
  const dates = Object.keys(dailyXpHistory)
    .filter((d) => dailyXpHistory[d] > 0)
    .sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00");
    const curr = new Date(dates[i] + "T00:00:00");
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export default function ActivityHeatmap({ dailyXpHistory, totalDays = 91 }: ActivityHeatmapProps) {
  const { weeks, monthLabels, totalXp, activeDays, longestStreak, todayStr } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDate(today);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (totalDays - 1));

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks: { date: Date; xp: number }[][] = [];
    let currentWeek: { date: Date; xp: number }[] = [];
    let totalXp = 0;
    let activeDays = 0;

    const cursor = new Date(startDate);
    while (cursor <= today || currentWeek.length > 0) {
      const dateStr = formatDate(cursor);
      const xp = dailyXpHistory[dateStr] || 0;

      currentWeek.push({ date: new Date(cursor), xp });
      totalXp += xp;
      if (xp > 0) activeDays++;

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      cursor.setDate(cursor.getDate() + 1);

      if (cursor > today && currentWeek.length === 0) break;
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        const lastDate = currentWeek[currentWeek.length - 1].date;
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentWeek.push({ date: nextDate, xp: 0 });
      }
      weeks.push(currentWeek);
    }

    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.date.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ label: MONTH_LABELS[month], weekIndex: i });
          lastMonth = month;
        }
      }
    });

    const longestStreak = calcLongestStreak(dailyXpHistory);

    return { weeks, monthLabels, totalXp, activeDays, longestStreak, todayStr };
  }, [dailyXpHistory, totalDays]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToToday = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollLeft = el.scrollWidth;
      });
    }
  }, []);

  // Scroll to today on mount and when data changes
  useEffect(() => {
    scrollToToday();
  }, [weeks, scrollToToday]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--fg)]">Jejak Belajar</h3>
          <p className="text-xs text-[var(--fg-muted)]">
            Udah {activeDays} hari nunjukin progress, total {totalXp} XP terkumpul 🔥
          </p>
        </div>
        <div className="flex items-center gap-3">
          {longestStreak > 0 && (
            <span className="text-[10px] font-bold text-[var(--duo-orange)] bg-[var(--duo-orange)]/10 px-2 py-1 rounded-lg">
              🔥 {longestStreak} hari berturut
            </span>
          )}
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--fg-muted)]">
            <span>Kurang</span>
            <div className="w-3 h-3 rounded-sm bg-[#1B4620] dark:bg-[#0E2611]" />
            <div className="w-3 h-3 rounded-sm bg-[#256B2E] dark:bg-[#1B4620]" />
            <div className="w-3 h-3 rounded-sm bg-[#2FA83D] dark:bg-[#256B2E]" />
            <div className="w-3 h-3 rounded-sm bg-[var(--primary)]" />
            <span>Lebih</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div ref={scrollRef} className="overflow-x-auto pb-1">
        <div className="inline-flex gap-[5px] min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-[5px] mr-1.5">
            {DAY_LABELS.map((label, i) => (
              <div key={label} className="h-4 flex items-center text-[9px] text-[var(--fg-muted)] font-medium">
                {i % 2 === 1 ? label : ""}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-col gap-[5px]">
            {/* Month labels row */}
            <div className="flex gap-[5px] mb-0.5" style={{ height: 12 }}>
              {monthLabels.map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  className="text-[9px] text-[var(--fg-muted)] font-medium absolute"
                  style={{ left: m.weekIndex * 19 }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid rows */}
            <div className="flex gap-[5px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[5px]">
                  {week.map((day, di) => {
                    const isFuture = day.date > new Date();
                    const isToday = formatDate(day.date) === todayStr;
                    return (
                      <motion.div
                        key={di}
                        className={`w-4 h-4 rounded-[4px] transition-colors ${
                          isFuture
                            ? "bg-transparent"
                            : isToday
                            ? `${getIntensityClass(day.xp)} ring-2 ring-[var(--primary)] ring-offset-1 ring-offset-[var(--surface)]`
                            : getIntensityClass(day.xp)
                        }`}
                        whileHover={!isFuture ? { scale: 1.3, zIndex: 10 } : undefined}
                        title={
                          isFuture
                            ? ""
                            : `${day.date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}: ${day.xp} XP`
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
