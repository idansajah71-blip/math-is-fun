"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Zap, Gem, Clock } from "lucide-react";
import { getVisibleEvents } from "@/lib/admin/events";
import { getLocalDateStr } from "@/lib/gamification";
import type { EventData } from "@/lib/events";

const MAX_SHOW = 4;

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function EventCalendar() {
  const events = useMemo(() => {
    const now = new Date();
    const today = getLocalDateStr();
    return getVisibleEvents()
      .filter((e) => e.status === "active" || e.startDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, []);

  const hasEvents = events.length > 0;

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
        <div className="flex-1">
          <h3 className="text-sm font-black text-[var(--fg)]">Event Mendatang</h3>
          <p className="text-[10px] text-[var(--fg-muted)]">Jadwal event yang bisa kamu ikuti</p>
        </div>
      </div>

      {!hasEvents ? (
        <div className="text-center py-6">
          <Calendar size={28} className="text-[var(--border)] mx-auto mb-2" />
          <p className="text-xs text-[var(--fg-muted)]">Belum ada event terjadwal, cek lagi nanti ya!</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {events.slice(0, MAX_SHOW).map((evt, i) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--border-subtle)]/50 border border-[var(--border)] hover:border-[var(--duo-purple)]/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-black text-[var(--fg)] truncate">{evt.name}</p>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[7px] font-bold ${
                      evt.status === "active"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {evt.status === "active" ? "AKTIF" : "TERJADWAL"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--fg-muted)]">
                      <Calendar size={9} /> {formatDateShort(evt.startDate)} - {formatDateShort(evt.endDate)}
                    </span>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--fg-muted)]">
                      <Clock size={9} /> {evt.startTime}
                    </span>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--duo-xp)]">
                      <Zap size={9} /> +{evt.rewards.xp}
                    </span>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--duo-info)]">
                      <Gem size={9} /> +{evt.rewards.gems}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[var(--fg-muted)] shrink-0" />
              </motion.div>
            ))}
          </div>

          {events.length > MAX_SHOW && (
            <Link href="/events" className="flex items-center justify-center gap-1 mt-3 py-2 rounded-xl text-[10px] font-bold text-[var(--duo-purple)] hover:bg-[var(--duo-purple)]/10 transition-colors">
              Lihat Semua Event
              <ChevronRight size={12} />
            </Link>
          )}
        </>
      )}
    </motion.div>
  );
}

export default EventCalendar;
