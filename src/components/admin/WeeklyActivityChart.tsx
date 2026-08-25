"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Activity } from "lucide-react";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-[var(--shadow-lg)]">
      <p className="text-xs font-bold text-[var(--fg)]">{label}</p>
      <p className="text-xs text-[var(--primary)]">{payload[0].value} quiz diselesaikan</p>
    </div>
  );
}

interface WeeklyActivityChartProps {
  data: number[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const chartData = DAYS.map((day, i) => ({
    name: day,
    value: data[i] || 0,
  }));

  const maxVal = Math.max(...data, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--grad-primary)" }}>
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--fg)]">Aktivitas Mingguan</h3>
            <p className="text-[10px] text-[var(--fg-muted)]">Quiz diselesaikan per hari</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[var(--primary)]">{data.reduce((a, b) => a + b, 0)} total</span>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="25%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--fg-muted)", fontSize: 11, fontWeight: 700 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--fg-disabled)", fontSize: 10 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.value === maxVal ? "var(--primary)" : "var(--primary-light)"}
                  opacity={entry.value === maxVal ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
