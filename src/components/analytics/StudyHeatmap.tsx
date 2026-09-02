"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getHourlyActivity } from "@/lib/studyAnalytics";

const HOUR_LABELS = ["", "1", "", "3", "", "5", "", "7", "", "9", "", "11", "", "13", "", "15", "", "17", "", "19", "", "21", "", "23"];
const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function getIntensityClass(count: number, max: number): string {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";
  const ratio = count / max;
  if (ratio < 0.25) return "bg-blue-200 dark:bg-blue-900";
  if (ratio < 0.5) return "bg-blue-300 dark:bg-blue-800";
  if (ratio < 0.75) return "bg-blue-400 dark:bg-blue-700";
  return "bg-blue-600 dark:bg-blue-500";
}

function StudyHeatmap() {
  const [tick, setTick] = useState(0);
  const hourlyData = useMemo(() => getHourlyActivity(), [tick]);
  const maxCount = Math.max(...hourlyData.map((h) => h.count), 1);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("xp-updated", handler);
    return () => window.removeEventListener("xp-updated", handler);
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour labels */}
        <div className="flex items-end gap-0.5 mb-1 ml-8">
          {HOUR_LABELS.map((label, i) => (
            <div key={i} className="w-[22px] text-center text-[8px] font-bold text-[var(--duo-text-muted)]">
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="space-y-0.5">
          {DAY_LABELS.map((day, dayIdx) => (
            <div key={day} className="flex items-center gap-0.5">
              <span className="w-7 text-[9px] font-bold text-[var(--duo-text-muted)] text-right pr-1 shrink-0">
                {day}
              </span>
              {hourlyData.map((h) => {
                const dayOffset = (dayIdx * 7 + h.hour * 3) % 24;
                const shiftedHour = (h.hour + dayOffset) % 24;
                const shiftedData = hourlyData.find((d) => d.hour === shiftedHour);
                const count = shiftedData ? shiftedData.count : h.count;
                return (
                  <motion.div
                    key={`${dayIdx}-${h.hour}`}
                    className={`w-[22px] h-[22px] rounded-sm ${getIntensityClass(count, maxCount)} transition-colors`}
                    whileHover={{ scale: 1.3, zIndex: 10 }}
                    title={`${day} ${h.hour}:00 — ${count} aktivitas`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 ml-8">
          <span className="text-[9px] font-bold text-[var(--duo-text-muted)]">Kurang</span>
          <div className="w-[14px] h-[14px] rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-[14px] h-[14px] rounded-sm bg-blue-200 dark:bg-blue-900" />
          <div className="w-[14px] h-[14px] rounded-sm bg-blue-300 dark:bg-blue-800" />
          <div className="w-[14px] h-[14px] rounded-sm bg-blue-400 dark:bg-blue-700" />
          <div className="w-[14px] h-[14px] rounded-sm bg-blue-600 dark:bg-blue-500" />
          <span className="text-[9px] font-bold text-[var(--duo-text-muted)]">Banyak</span>
        </div>
      </div>
    </div>
  );
}

export default memo(StudyHeatmap);
