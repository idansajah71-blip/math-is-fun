"use client";

import { useMemo } from "react";
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
  if (xp < 30) return "bg-[var(--primary)] opacity-30";
  if (xp < 80) return "bg-[var(--primary)] opacity-50";
  if (xp < 150) return "bg-[var(--primary)] opacity-75";
  return "bg-[var(--primary)]";
}

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function ActivityHeatmap({ dailyXpHistory, totalDays = 91 }: ActivityHeatmapProps) {
  const { weeks, monthLabels, totalXp, activeDays } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (totalDays - 1));

    // Adjust start to Sunday (beginning of week)
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

    // Calculate month label positions
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

    return { weeks, monthLabels, totalXp, activeDays };
  }, [dailyXpHistory, totalDays]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--fg)]">Aktivitas Belajar</h3>
          <p className="text-xs text-[var(--fg-muted)]">
            {activeDays} hari aktif · {totalXp} XP total
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--fg-muted)]">
          <span>Kurang</span>
          {[0, 20, 60, 120].map((threshold) => (
            <div
              key={threshold}
              className={`w-3 h-3 rounded-sm ${getIntensityClass(threshold + 1)}`}
            />
          ))}
          <span>Lebih</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex gap-0.5 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1.5">
            {DAY_LABELS.map((label, i) => (
              <div key={label} className="h-3 flex items-center text-[9px] text-[var(--fg-muted)] font-medium">
                {i % 2 === 1 ? label : ""}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-col gap-0.5">
            {/* Month labels row */}
            <div className="flex gap-0.5 mb-0.5" style={{ height: 12 }}>
              {monthLabels.map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  className="text-[9px] text-[var(--fg-muted)] font-medium absolute"
                  style={{
                    left: m.weekIndex * 14,
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid rows */}
            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day, di) => {
                    const isFuture = day.date > new Date();
                    return (
                      <motion.div
                        key={di}
                        className={`w-3 h-3 rounded-sm transition-colors ${
                          isFuture ? "bg-transparent" : getIntensityClass(day.xp)
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
