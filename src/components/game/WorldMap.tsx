"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Lock, Crown, BookOpen, Zap, X, Star,
  Play, RotateCcw, Target, GraduationCap, FlaskConical,
  Calculator, ChevronRight,
} from "lucide-react";
import { renderIcon } from "@/lib/iconMap";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export interface WorldMapNode {
  slug: string;
  title: string;
  icon: string;
  level: "smp" | "sma" | "kuliah";
  status: "locked" | "available" | "completed" | "legendary";
  section: string;
  description?: string;
}

interface WorldMapProps {
  nodes: WorldMapNode[];
}

/* ─────────────────────────────────────────
   LEVEL CONFIG
───────────────────────────────────────── */
const LEVEL_CFG = {
  smp: {
    label: "SMP",
    Icon: Calculator,
    accent: "#58CC02",
    dark:   "#3a8a01",
    glow:   "rgba(88,204,2,0.25)",
  },
  sma: {
    label: "SMA",
    Icon: GraduationCap,
    accent: "#1CB0F6",
    dark:   "#1278ab",
    glow:   "rgba(28,176,246,0.25)",
  },
  kuliah: {
    label: "Universitas",
    Icon: FlaskConical,
    accent: "#CE82FF",
    dark:   "#9b3dea",
    glow:   "rgba(206,130,255,0.25)",
  },
} as const;

/* ─────────────────────────────────────────
   SECTION PILL  (pertahankan — gambar 2)
───────────────────────────────────────── */
function SectionPill({
  label, unitNumber, level, total, completed,
}: {
  label: string; unitNumber: number;
  level: "smp" | "sma" | "kuliah"; total: number; completed: number;
}) {
  const cfg = LEVEL_CFG[level];
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative overflow-hidden rounded-2xl mb-4 px-5 py-4 flex items-center gap-4"
      style={{
        background: `linear-gradient(135deg, ${cfg.accent}dd 0%, ${cfg.dark}dd 100%)`,
        boxShadow: `0 4px 0 ${cfg.dark}, 0 8px 24px ${cfg.glow}`,
      }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)" }}
      >
        <cfg.Icon size={20} className="text-white" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.16em] mb-0.5">
          BAGIAN {unitNumber} · {cfg.label}
        </p>
        <h3 className="text-[15px] font-black text-white leading-tight truncate">{label}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            />
          </div>
          <span className="text-[10px] font-black text-white/80 shrink-0">{completed}/{total}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   NODE CARD (horizontal, seperti gambar 1)
───────────────────────────────────────── */
function NodeCard({
  node, globalIndex, side, accent, onSelect,
}: {
  node: WorldMapNode;
  globalIndex: number;
  side: "left" | "right";
  accent: string;
  onSelect: (n: WorldMapNode) => void;
}) {
  const isLocked    = node.status === "locked";
  const isAvailable = node.status === "available";
  const isDone      = node.status === "completed" || node.status === "legendary";

  return (
    <motion.button
      onClick={() => !isLocked && onSelect(node)}
      disabled={isLocked}
      initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
      whileHover={!isLocked ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isLocked ? { scale: 0.97 } : {}}
      className="relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left w-full"
      style={{
        background: isAvailable
          ? `linear-gradient(135deg, ${accent}28 0%, ${accent}10 100%)`
          : "rgba(255,255,255,0.05)",
        border: isAvailable
          ? `1.5px solid ${accent}70`
          : isDone
          ? "1.5px solid rgba(255,184,0,0.3)"
          : "1.5px solid rgba(255,255,255,0.08)",
        boxShadow: isAvailable
          ? `0 0 16px ${accent}30`
          : "none",
        opacity: isLocked ? 0.45 : 1,
        cursor: isLocked ? "default" : "pointer",
      }}
    >
      {/* pulse glow outline on available */}
      {isAvailable && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${accent}` }}
          animate={{ opacity: [0.7, 0.1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: isLocked
            ? "rgba(255,255,255,0.06)"
            : isDone
            ? "linear-gradient(135deg,#FFE04B,#FFB800)"
            : `${accent}22`,
          border: isLocked
            ? "1.5px solid rgba(255,255,255,0.1)"
            : isDone
            ? "1.5px solid #CC8800"
            : `1.5px solid ${accent}60`,
        }}
      >
        {isLocked
          ? <Lock size={14} style={{ color: "rgba(255,255,255,0.25)" }} strokeWidth={2.5} />
          : <span style={{ color: isDone ? "#7A4500" : accent }}>
              {renderIcon(node.icon, 16, undefined, 2.2)}
            </span>
        }
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-black leading-snug truncate"
          style={{ color: isLocked ? "rgba(255,255,255,0.22)" : isAvailable ? "#fff" : "rgba(255,255,255,0.65)" }}>
          {globalIndex + 1}. {node.title}
        </p>
        <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5"
          style={{ color: isLocked ? "rgba(255,255,255,0.12)" : `${accent}99` }}>
          {node.section}
        </p>
      </div>

      {/* right icon */}
      {!isLocked && (
        <div className="shrink-0">
          {isDone
            ? <CheckCircle2 size={15} style={{ color: "#FFB800" }} strokeWidth={2.5} />
            : <ChevronRight size={15} style={{ color: accent }} strokeWidth={2.5} />
          }
        </div>
      )}

      {node.status === "legendary" && (
        <Crown size={13} className="absolute -top-2 -right-2" color="#FFB800" fill="#FFB800" />
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   NODE DETAIL MODAL
───────────────────────────────────────── */
function NodeModal({ node, onClose }: { node: WorldMapNode; onClose: () => void }) {
  const cfg     = LEVEL_CFG[node.level];
  const isLocked = node.status === "locked";
  const isDone   = node.status === "completed" || node.status === "legendary";
  const isAvail  = node.status === "available";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        className="relative w-full sm:max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden border-2 border-[var(--border)] shadow-2xl"
        style={{ background: "var(--surface,#1A1D27)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div
          className="relative px-6 pt-7 pb-10 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${cfg.accent}cc, ${cfg.dark}cc)` }}
        >
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center z-10">
            <X size={15} className="text-white" />
          </button>
          <div className="w-[68px] h-[68px] mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}>
            {isLocked
              ? <Lock size={28} className="text-white/60" strokeWidth={2.5} />
              : <span className="text-white">{renderIcon(node.icon, 30, undefined, 2)}</span>
            }
          </div>
          <h2 className="text-xl font-black text-white text-center leading-tight">{node.title}</h2>
          <p className="text-white/60 text-xs text-center mt-0.5">{node.section} · {cfg.label}</p>
          <div className="flex justify-center mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
              isDone ? "bg-white/25 text-white" : isLocked ? "bg-black/20 text-white/50" : "bg-white"
            }`} style={isAvail ? { color: cfg.accent } : undefined}>
              {isDone && <CheckCircle2 size={11} strokeWidth={3} />}
              {isLocked && <Lock size={11} strokeWidth={3} />}
              {isAvail && <Zap size={11} strokeWidth={3} />}
              {isDone ? "Selesai" : isLocked ? "Terkunci" : "Siap Dimulai"}
            </span>
          </div>
        </div>
        {/* body */}
        <div className="px-6 pt-6 pb-9">
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { icon: BookOpen, label: "Level",  val: cfg.label },
              { icon: Zap,      label: "Reward", val: "+100 XP" },
              { icon: isDone ? Star : isLocked ? Lock : Target, label: "Status",
                val: isDone ? "Selesai" : isLocked ? "Terkunci" : "Baru" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10">
                <s.icon size={16} className="mb-1.5 text-white/40" />
                <p className="text-[12px] font-black text-white/80">{s.val}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
          {isLocked && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-5">
              <Lock size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[12px] text-amber-300 font-semibold leading-relaxed">
                Selesaikan materi sebelumnya dulu untuk membuka topik ini.
              </p>
            </div>
          )}
          {isDone ? (
            <Link href={`/topic/${node.slug}`} className="block">
              <AnimatedButton fullWidth variant="outline" size="lg" icon={<RotateCcw size={16} />}>Ulangi Materi</AnimatedButton>
            </Link>
          ) : isLocked ? (
            <AnimatedButton fullWidth variant="ghost" size="lg" disabled icon={<Lock size={16} />}>Belum Tersedia</AnimatedButton>
          ) : (
            <Link href={`/topic/${node.slug}`} className="block">
              <AnimatedButton fullWidth variant="primary" size="lg" glow icon={<Play size={16} fill="currentColor" />}>Mulai Sekarang</AnimatedButton>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN WORLD MAP
───────────────────────────────────────── */
export default function WorldMap({ nodes }: WorldMapProps) {
  const [selected, setSelected] = useState<WorldMapNode | null>(null);

  const sections = useMemo(() => {
    const out: { name: string; level: "smp" | "sma" | "kuliah"; items: WorldMapNode[] }[] = [];
    for (const node of nodes) {
      const last = out[out.length - 1];
      if (!last || last.name !== node.section) {
        out.push({ name: node.section, level: node.level, items: [node] });
      } else {
        last.items.push(node);
      }
    }
    return out;
  }, [nodes]);

  return (
    <div className="w-full">
      {sections.map((sec, sIdx) => {
        const cfg = LEVEL_CFG[sec.level];
        const completedCount = sec.items.filter(
          (n) => n.status === "completed" || n.status === "legendary"
        ).length;

        /*
         * Layout constants (matches the reference image):
         *
         *  |<──── CARD (≈45%) ────>|  CENTER  |<──── CARD (≈45%) ────>|
         *
         *  - Vertical spine runs through CENTER (50%)
         *  - Horizontal lines connect card to spine at node y
         *  - Cards alternate left / right
         *  - ROW_H = vertical gap between node centers
         */
        const ROW_H       = 96;   // px per node row
        const CARD_PCT    = 48;   // card takes 48% of width on each side (matches CSS right:52%/left:52%)
        const totalH      = ROW_H * sec.items.length;

        return (
          <div key={`${sec.name}-${sIdx}`} className="mb-10">
            {/* ── Section pill (gambar 2 — pertahankan) ── */}
            <SectionPill
              label={sec.name}
              unitNumber={sIdx + 1}
              level={sec.level}
              total={sec.items.length}
              completed={completedCount}
            />

            {/* ── Snake map ── */}
            <div className="relative w-full" style={{ minHeight: totalH }}>

              {/* SVG connector lines — drawn behind cards */}
              <svg
                className="absolute inset-0 w-full pointer-events-none"
                height={totalH}
                preserveAspectRatio="none"
                aria-hidden
              >
                {sec.items.map((node, i) => {
                  /*
                   * Each node has:
                   *   cy  = vertical center of that row
                   *   side = left (even) or right (odd)
                   *   hx  = the x where the horizontal line meets the spine (50%)
                   *   nx  = the x where the horizontal line meets the card edge
                   *         left card  → right edge  ≈ CARD_PCT %
                   *         right card → left edge   ≈ (100 - CARD_PCT) %
                   *   Offset: connectors stop ~35px before card edge to avoid lock icon
                   */
                  if (i === 0) return null; // no line before first node
                  const prevSide = (i - 1) % 2 === 0 ? "left" : "right";
                  const curSide  = i % 2 === 0 ? "left" : "right";
                  const y1 = ROW_H * (i - 1) + ROW_H / 2;   // prev node cy
                  const y2 = ROW_H * i + ROW_H / 2;          // curr node cy

                  // horizontal from prev card edge to spine (endpoint at card edge)
                  const x1 = prevSide === "left" ? `${CARD_PCT}%` : `${100 - CARD_PCT}%`;
                  // horizontal from spine to current card edge (endpoint at card edge)
                  const x2 = curSide  === "left" ? `${CARD_PCT}%` : `${100 - CARD_PCT}%`;

                  return (
                    <g key={node.slug}>
                      {/* horizontal → spine from previous node */}
                      <line
                        x1={x1} y1={y1}
                        x2="50%" y2={y1}
                        stroke={cfg.accent} strokeWidth={1.5}
                        strokeDasharray="5 4" opacity={0.45}
                        strokeLinecap="round"
                      />
                      {/* vertical spine segment */}
                      <line
                        x1="50%" y1={y1}
                        x2="50%" y2={y2}
                        stroke={cfg.accent} strokeWidth={1.5}
                        strokeDasharray="5 4" opacity={0.45}
                        strokeLinecap="round"
                      />
                      {/* horizontal spine → current node */}
                      <line
                        x1="50%" y1={y2}
                        x2={x2}  y2={y2}
                        stroke={cfg.accent} strokeWidth={1.5}
                        strokeDasharray="5 4" opacity={0.45}
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Node cards */}
              {sec.items.map((node, i) => {
                const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
                const topPx = ROW_H * i + ROW_H / 2;  // vertical center of this row

                return (
                  <div
                    key={node.slug}
                    className="absolute"
                    style={{
                      top:    topPx,
                      left:   side === "left"  ? 0 : "52%",
                      right:  side === "right" ? 0 : "52%",
                      transform: "translateY(-50%)",
                      /* cards take up ~46% of width on each side,
                         leaving 4% on each side of center as gap */
                    }}
                  >
                    <NodeCard
                      node={node}
                      globalIndex={i}
                      side={side}
                      accent={cfg.accent}
                      onSelect={setSelected}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {nodes.length === 0 && (
        <div className="text-center py-14">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--border-subtle)] flex items-center justify-center">
            <BookOpen size={24} className="text-[var(--fg-muted)]" />
          </div>
          <p className="text-sm font-bold text-[var(--fg-muted)]">Belum ada materi tersedia.</p>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <NodeModal node={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
