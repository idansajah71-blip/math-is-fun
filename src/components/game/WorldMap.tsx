"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { CheckCircle2, Lock, Crown, ChevronRight, BookOpen, Zap, X, Star } from "lucide-react";
import { renderIcon } from "@/lib/iconMap";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";

interface WorldMapNode {
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
  completedSlugs?: string[];
  currentSlug?: string;
}

const levelConfig = {
  smp: {
    ring: "var(--primary)",
    bg: "var(--primary-bg)",
    glow: "var(--primary-bg)",
    label: "SMP",
    gradient: "from-[var(--primary)] to-[var(--primary-light)]",
  },
  sma: {
    ring: "var(--info)",
    bg: "var(--info-bg)",
    glow: "var(--info-bg)",
    label: "SMA",
    gradient: "from-[var(--info)] to-[#4DC9FF]",
  },
  kuliah: {
    ring: "var(--purple)",
    bg: "var(--purple-bg)",
    glow: "var(--purple-bg)",
    label: "Universitas",
    gradient: "from-[var(--purple)] to-[#E0B0FF]",
  },
};

function NodeDetailModal({
  node,
  onClose,
  levelConfig: lc,
}: {
  node: WorldMapNode;
  onClose: () => void;
  levelConfig: typeof levelConfig.smp;
}) {
  const isLocked = node.status === "locked";
  const isCompleted = node.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white dark:bg-[var(--surface)] rounded-t-3xl sm:rounded-[28px] border-2 border-[var(--border)] w-full sm:max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative p-6 pb-8 bg-gradient-to-br ${lc.gradient} text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={16} />
          </button>

          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center"
            animate={node.status === "available" ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {renderIcon(node.icon, 36, "text-white")}
          </motion.div>

          <h2 className="text-xl font-black text-center">{node.title}</h2>
          <p className="text-white/70 text-xs text-center mt-1">{node.section}</p>

          {/* Status Badge */}
          <div className="flex justify-center mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isCompleted
                ? "bg-white/20 text-white"
                : isLocked
                ? "bg-white/10 text-white/60"
                : "bg-white text-[var(--primary)]"
            }`}>
              {isCompleted && <CheckCircle2 size={12} />}
              {isLocked && <Lock size={12} />}
              {!isCompleted && !isLocked && <Zap size={12} />}
              {isCompleted ? "Selesai" : isLocked ? "Terkunci" : "Tersedia"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: BookOpen, label: "Level", value: lc.label },
              { icon: Zap, label: "Reward", value: "+100 XP" },
              { icon: Star, label: "Status", value: isCompleted ? "Selesai" : isLocked ? "Terkunci" : "Baru" },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <item.icon size={16} className="mx-auto mb-1 text-[var(--fg-muted)]" />
                <p className="text-xs font-black text-[var(--fg)]">{item.value}</p>
                <p className="text-[9px] text-[var(--fg-muted)]">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {node.description && (
            <p className="text-sm text-[var(--fg-secondary)] mb-6 leading-relaxed">
              {node.description}
            </p>
          )}

          {/* Locked Reason */}
          {isLocked && (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-[var(--border-subtle)] mb-6">
              <div className="flex items-start gap-2">
                <Lock size={14} className="text-[var(--fg-muted)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[var(--fg)] mb-1">Kenapa terkunci?</p>
                  <p className="text-[11px] text-[var(--fg-muted)]">
                    Selesaikan materi sebelumnya terlebih dahulu untuk membuka level ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {isCompleted ? (
            <div className="flex gap-3">
              <Link href={`/topic/${node.slug}`} className="flex-1">
                <AnimatedButton fullWidth variant="outline" size="lg" icon={<BookOpen size={16} />}>
                  Ulangi
                </AnimatedButton>
              </Link>
            </div>
          ) : isLocked ? (
            <AnimatedButton fullWidth variant="ghost" size="lg" disabled icon={<Lock size={16} />}>
              Selesaikan Materi Sebelumnya
            </AnimatedButton>
          ) : (
            <Link href={`/topic/${node.slug}`}>
              <AnimatedButton fullWidth variant="primary" size="lg" glow icon={<ChevronRight size={16} />}>
                Mulai Belajar
              </AnimatedButton>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function WorldMapNodeItem({
  node,
  index,
  isZigzag,
  onSelect,
}: {
  node: WorldMapNode;
  index: number;
  isZigzag: boolean;
  onSelect: (node: WorldMapNode) => void;
}) {
  const lc = levelConfig[node.level];
  const isLeft = isZigzag ? index % 2 === 0 : true;

  const statusStyles = {
    locked: "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60",
    available: "bg-white dark:bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-lg cursor-pointer",
    completed: "bg-[var(--primary-bg)] border-[var(--primary)]/30 cursor-pointer",
    legendary: "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-[var(--accent-xp)]/40 cursor-pointer",
  };

  return (
    <div className={`relative flex ${isLeft ? "justify-start" : "justify-end"} w-full`}>
      {/* Connection dot on center line */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className="w-3 h-3 rounded-full border-2 border-white dark:border-[var(--surface)]"
          style={{
            backgroundColor: node.status === "completed" ? "var(--primary)" : node.status === "locked" ? "var(--border)" : lc.ring,
          }}
        />
      </div>

      <div
        className={`relative z-10 w-full sm:w-[calc(50%-32px)] ${isLeft ? "sm:mr-auto sm:pr-4" : "sm:ml-auto sm:pl-4"}`}
      >
        <motion.div
          variants={staggerItem}
          className={`relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${statusStyles[node.status]}`}
          whileHover={node.status !== "locked" ? { scale: 1.02, y: -2 } : {}}
          whileTap={node.status !== "locked" ? { scale: 0.98 } : {}}
          onClick={() => onSelect(node)}
        >
          {/* Node Circle */}
          <motion.div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 border-[3px] relative"
            style={{
              backgroundColor: node.status === "locked" ? "var(--border-subtle)" : lc.bg,
              borderColor: node.status === "locked" ? "var(--border)" : lc.ring,
            }}
            animate={
              node.status === "available"
                ? { y: [0, -3, 0] }
                : node.status === "legendary"
                ? { scale: [1, 1.05, 1] }
                : {}
            }
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {renderIcon(node.icon, 20, node.status === "locked" ? "text-[var(--fg-disabled)]" : "text-[var(--fg)]")}

            {node.status === "locked" && (
              <div className="absolute inset-0 rounded-full bg-[var(--border)]/60 flex items-center justify-center">
                <Lock size={14} className="text-[var(--fg-muted)]" />
              </div>
            )}

            {node.status === "completed" && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center border-2 border-white dark:border-[var(--surface)]">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            )}

            {node.status === "legendary" && (
              <div className="absolute -top-2 -right-1">
                <Crown size={14} className="text-[var(--accent-xp)]" fill="currentColor" />
              </div>
            )}
          </motion.div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[var(--fg)] truncate">{node.title}</h3>
            <p className="text-[10px] text-[var(--fg-muted)] uppercase font-semibold">
              {node.section}
            </p>
          </div>

          {/* Arrow */}
          {node.status !== "locked" && (
            <ChevronRight size={16} className="text-[var(--fg-muted)] shrink-0" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function WorldMap({ nodes }: WorldMapProps) {
  const [selectedNode, setSelectedNode] = useState<WorldMapNode | null>(null);

  const sections: { name: string; level: "smp" | "sma" | "kuliah"; items: WorldMapNode[] }[] = [];
  let currentSection = "";

  for (const node of nodes) {
    if (node.section !== currentSection) {
      currentSection = node.section;
      sections.push({ name: node.section, level: node.level, items: [node] });
    } else {
      sections[sections.length - 1].items.push(node);
    }
  }

  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 sm:-translate-x-1/2">
        <div className="w-full h-full bg-gradient-to-b from-[var(--primary)]/20 via-[var(--info)]/20 to-[var(--purple)]/20 rounded-full" />
      </div>

      {sections.map((section) => {
        const lc = levelConfig[section.level];
        return (
          <div key={section.name} className="mb-10 sm:mb-12">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-5 sm:mb-6 pl-10 sm:pl-0"
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${lc.gradient}`}
                style={{ boxShadow: `0 4px 15px ${lc.glow}` }}
              >
                {section.name}
              </div>
            </motion.div>

            {/* Nodes */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3 sm:space-y-4 pl-10 sm:pl-0"
            >
              {section.items.map((node, idx) => (
                <WorldMapNodeItem
                  key={node.slug}
                  node={node}
                  index={idx}
                  isZigzag={true}
                  onSelect={setSelectedNode}
                />
              ))}
            </motion.div>
          </div>
        );
      })}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <NodeDetailModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            levelConfig={levelConfig[selectedNode.level]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
