"use client";

import { FlameIcon } from "@/components/icons/CustomIcons";

interface StreakHeatmapProps {
  weeklyXp?: number[];
  streakDays?: boolean[];
  className?: string;
}

const WEEKDAYS = ["S", "S", "R", "K", "J", "S", "M"];
const WEEKS = 5;

function intensityForXp(xp: number): 0 | 1 | 2 | 3 | 4 {
  if (xp <= 0) return 0;
  if (xp < 25) return 1;
  if (xp < 80) return 2;
  if (xp < 180) return 3;
  return 4;
}

export default function StreakHeatmap({
  weeklyXp = [],
  streakDays,
  className = "",
}: StreakHeatmapProps) {
  const totalCells = WEEKS * 7;

  const cells: { xp: number; intensity: number; done: boolean; dayLabel: string }[] = [];
  for (let i = 0; i < totalCells; i++) {
    const weekdayIdx = i % 7;
    const xp = weeklyXp[i] ?? (i < totalCells - 14 ? Math.round(Math.random() * 250) : 0);
    const intensity = intensityForXp(xp);
    const done = streakDays ? !!streakDays[i] : xp > 0;
    cells.push({
      xp,
      intensity,
      done,
      dayLabel: WEEKDAYS[weekdayIdx],
    });
  }

  const totalActive = cells.filter((c) => c.done).length;
  const pct = Math.round((totalActive / cells.length) * 100);
  const bestStreak = (() => {
    let best = 0;
    let cur = 0;
    for (const c of cells) {
      if (c.done) {
        cur++;
        best = Math.max(best, cur);
      } else cur = 0;
    }
    return best;
  })();

  return (
    <div
      className={`relative rounded-[24px] border-2 border-[var(--border)] bg-white dark:bg-[var(--surface)] shadow-[var(--shadow-md)] overflow-hidden animate-fade-in ${className}`}
    >
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-rose-950/20 p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-md">
              <FlameIcon size={18} color="#FFFFFF" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--fg)] leading-tight">Konsistensi Belajar</h3>
              <p className="text-[10px] font-bold text-[var(--fg-muted)]">{WEEKS} minggu terakhir</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-lg font-black text-orange-600 leading-none">{bestStreak}</p>
              <p className="text-[9px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">Streak</p>
            </div>
            <div>
              <p className="text-lg font-black text-[var(--primary)] leading-none">{pct}%</p>
              <p className="text-[9px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">Aktif</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {WEEKDAYS.map((d, i) => (
            <div
              key={i}
              className="text-[9px] font-black text-[var(--fg-muted)] text-center uppercase"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((c, i) => (
            <div
              key={i}
              className={`heatmap-cell heatmap-${c.intensity} relative aspect-square rounded-[6px] shadow-sm transition-transform duration-150 hover:scale-[1.3] hover:-translate-y-[3px] hover:z-10 cursor-default`}
              title={`${c.dayLabel}: ${c.xp} XP`}
            >
              {c.xp >= 220 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/80" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-[var(--fg-muted)] uppercase tracking-wider mr-1">Kurang</span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div key={lvl} className={`heatmap-cell heatmap-${lvl} w-4 h-4 rounded-[5px]`} />
            ))}
            <span className="text-[9px] font-bold text-[var(--fg-muted)] uppercase tracking-wider ml-1">Banyak</span>
          </div>
          <p className="text-[9px] font-bold text-[var(--fg-muted)]">
            {totalActive} hari aktif · {cells.reduce((s, c) => s + c.xp, 0)} XP total
          </p>
        </div>
      </div>
    </div>
  );
}
