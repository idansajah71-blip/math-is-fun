"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GraduationCap } from "lucide-react";

const LEVELS = [
  { key: "smp", label: "SMP", color: "var(--primary)" },
  { key: "sma", label: "SMA", color: "var(--info)" },
  { key: "kuliah", label: "Universitas", color: "var(--purple)" },
];

interface LevelDistributionDonutProps {
  smpCount: number;
  smaCount: number;
  kuliahCount: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { label: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-[var(--shadow-lg)]">
      <p className="text-xs font-bold text-[var(--fg)]">{payload[0].payload.label}</p>
      <p className="text-xs text-[var(--fg-muted)]">{payload[0].value} user</p>
    </div>
  );
}

export default function LevelDistributionDonut({ smpCount, smaCount, kuliahCount }: LevelDistributionDonutProps) {
  const total = smpCount + smaCount + kuliahCount || 1;

  const data = LEVELS.map((l) => ({
    name: l.key,
    label: l.label,
    value: l.key === "smp" ? smpCount : l.key === "sma" ? smaCount : kuliahCount,
    color: l.color,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--grad-purple)" }}>
          <GraduationCap size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--fg)]">Distribusi Level</h3>
          <p className="text-[10px] text-[var(--fg-muted)]">User berdasarkan jenjang</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-[var(--fg)]">{total}</span>
            <span className="text-[9px] font-bold text-[var(--fg-muted)]">TOTAL</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {LEVELS.map((l, i) => {
            const count = data[i].value;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={l.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-xs font-bold text-[var(--fg)]">{l.label}</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--fg-muted)]">{count}</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: l.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
