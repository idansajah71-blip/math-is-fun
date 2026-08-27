"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Zap, Gem, Clock } from "lucide-react";
import { getVisibleEvents } from "@/lib/admin/events";
import type { EventData } from "@/app/admin/events/page";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const events = useMemo(() => getVisibleEvents(), []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = toLocalDateStr(new Date());

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function getEventsForDate(dateStr: string): EventData[] {
    return events.filter((evt) => evt.startDate <= dateStr && evt.endDate >= dateStr);
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-[var(--surface)] rounded-[24px] border-2 border-[var(--border)] p-5 mb-7"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[var(--duo-purple)]/15 flex items-center justify-center">
          <Calendar size={16} className="text-[var(--duo-purple)]" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--fg)]">Event Mendatang</h3>
          <p className="text-[10px] text-[var(--fg-muted)]">Jadwal event yang bisa kamu ikuti</p>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="w-8 h-8 rounded-lg bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border)] transition-colors">
          <ChevronLeft size={14} className="text-[var(--fg-muted)]" />
        </button>
        <span className="text-xs font-black text-[var(--fg)]">{MONTHS[month]} {year}</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="w-8 h-8 rounded-lg bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border)] transition-colors">
          <ChevronRight size={14} className="text-[var(--fg-muted)]" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold text-[var(--fg-muted)] py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = getEventsForDate(dateStr);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasEvents = dayEvents.length > 0;
          const hasActive = dayEvents.some((e) => e.status === "active" || e.status === "scheduled");

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all ${
                isSelected
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : isToday
                  ? "bg-[var(--primary-bg)] text-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                  : hasEvents
                  ? "bg-[var(--duo-purple)]/10 text-[var(--fg)]"
                  : "text-[var(--fg-muted)] hover:bg-[var(--border-subtle)]"
              }`}
            >
              {day}
              {hasActive && (
                <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-white" : "bg-[var(--duo-purple)]"
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date events */}
      <AnimatePresence>
        {selectedDate && selectedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            <p className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            {selectedEvents.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--border-subtle)]/50 border border-[var(--border)]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[var(--fg)] truncate">{evt.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--duo-xp)]">
                      <Zap size={9} /> +{evt.rewards.xp} XP
                    </span>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--duo-info)]">
                      <Gem size={9} /> +{evt.rewards.gems}
                    </span>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--fg-muted)]">
                      <Clock size={9} /> {evt.startTime}-{evt.endTime}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                  evt.status === "active"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  {evt.status === "active" ? "AKTIF" : "TERJADWAL"}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
        {selectedDate && selectedEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center py-4"
          >
            <p className="text-xs text-[var(--fg-muted)]">Tidak ada event di tanggal ini</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EventCalendar;
