"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { UserProfile } from "@/lib/gamification";

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  const d = new Date(label + "T00:00:00");
  return (
    <div className="bg-white dark:bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl p-3 shadow-lg">
      <p className="text-[10px] font-bold text-[var(--fg-muted)]">
        {d.getDate()} {MONTH_SHORT[d.getMonth()]}
      </p>
      <p className="text-sm font-black text-[var(--duo-xp)]">{payload[0].value} XP</p>
    </div>
  );
}

function MonthlyProgressChart({ profile }: { profile: UserProfile }) {
  const { data, totalXp, activeDays } = useMemo(() => {
    const log = profile.dailyXpLog || {};
    const today = new Date();
    const days: { date: string; xp: number; label: string }[] = [];
    let total = 0;
    let active = 0;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      const key = toLocalDateStr(d);
      const xp = log[key] || 0;
      total += xp;
      if (xp > 0) active++;
      days.push({
        date: key,
        xp,
        label: `${d.getDate()}/${d.getMonth() + 1}`,
      });
    }

    return { data: days, totalXp: total, activeDays: active };
  }, [profile.dailyXpLog]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary-bg)] flex items-center justify-center">
            <BarChart3 size={16} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--fg)]">XP Bulanan</h3>
            <p className="text-[10px] text-[var(--fg-muted)]">30 hari terakhir</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-gradient-xp">{totalXp}</p>
          <p className="text-[10px] font-bold text-[var(--fg-muted)]">{activeDays}/30 hari aktif</p>
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "var(--fg-muted)" }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "var(--fg-muted)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "var(--primary)", stroke: "white", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {totalXp === 0 && (
        <div className="flex items-center justify-center gap-2 mt-2 py-2 rounded-xl bg-[var(--border-subtle)]">
          <TrendingUp size={12} className="text-[var(--fg-muted)]" />
          <p className="text-[10px] font-bold text-[var(--fg-muted)]">Mulai belajar untuk isi grafik ini!</p>
        </div>
      )}
    </motion.div>
  );
}

export default MonthlyProgressChart;
