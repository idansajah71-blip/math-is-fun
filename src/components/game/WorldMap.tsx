"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, springBounce } from "@/lib/animations";
import { CheckCircle2, Lock, Crown } from "lucide-react";
import Link from "next/link";

interface WorldMapNode {
  slug: string;
  title: string;
  icon: string;
  level: "smp" | "sma" | "kuliah";
  status: "locked" | "available" | "completed" | "legendary";
  section: string;
}

interface WorldMapProps {
  nodes: WorldMapNode[];
}

const levelColors = {
  smp: { ring: "#58CC02", bg: "#E5F8D0", glow: "rgba(88, 204, 2, 0.3)" },
  sma: { ring: "#1CB0F6", bg: "#E3F6FD", glow: "rgba(28, 176, 246, 0.3)" },
  kuliah: { ring: "#CE82FF", bg: "#F3E8FF", glow: "rgba(206, 130, 255, 0.3)" },
};

function WorldMapNodeItem({ node, index }: { node: WorldMapNode; index: number }) {
  const colors = levelColors[node.level];
  const isLeft = index % 2 === 0;

  const inner = (
    <motion.div
      variants={staggerItem}
      className={`relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
        node.status === "locked"
          ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50"
          : node.status === "completed"
          ? "bg-[var(--duo-green-bg)] border-[var(--duo-green)]/30"
          : node.status === "legendary"
          ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-[var(--duo-xp)]/40"
          : "bg-white dark:bg-[var(--duo-card)] border-[var(--duo-border)] hover:border-[var(--duo-green)]/50 hover:shadow-lg"
      }`}
      whileHover={node.status !== "locked" ? { scale: 1.03, y: -2 } : {}}
      whileTap={node.status !== "locked" ? { scale: 0.97 } : {}}
      transition={springBounce}
    >
      {/* Node Circle */}
      <motion.div
        className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-[3px] relative"
        style={{
          backgroundColor: node.status === "locked" ? "#E5E7EB" : colors.bg,
          borderColor: node.status === "locked" ? "#D1D5DB" : colors.ring,
          boxShadow: node.status !== "locked" ? `0 0 20px ${colors.glow}` : "none",
        }}
        animate={
          node.status === "available"
            ? { y: [0, -3, 0] }
            : node.status === "legendary"
            ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }
            : {}
        }
        transition={{
          duration: node.status === "legendary" ? 2 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-2xl">{node.icon}</span>

        {node.status === "locked" && (
          <div className="absolute inset-0 rounded-full bg-gray-200/80 dark:bg-gray-700/80 flex items-center justify-center">
            <Lock size={16} className="text-gray-400" />
          </div>
        )}

        {node.status === "completed" && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--duo-green)] rounded-full flex items-center justify-center border-2 border-white dark:border-[var(--duo-card)]">
            <CheckCircle2 size={12} className="text-white" />
          </div>
        )}

        {node.status === "legendary" && (
          <div className="absolute -top-2 -right-1">
            <Crown size={16} className="text-[var(--duo-xp)]" fill="currentColor" />
          </div>
        )}
      </motion.div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-[var(--duo-text)] truncate">{node.title}</h3>
        <p className="text-[10px] text-[var(--duo-text-muted)] uppercase font-semibold">
          {node.section}
        </p>
      </div>

      {/* Arrow */}
      {node.status !== "locked" && (
        <div className="text-[var(--duo-green)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={`relative flex ${isLeft ? "justify-start" : "justify-end"} w-full`}>
      {/* Connection line to center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--duo-border)] to-transparent" />
      </div>

      <div className={`relative z-10 ${isLeft ? "mr-auto pr-8" : "ml-auto pl-8"}`} style={{ maxWidth: "calc(50% - 40px)" }}>
        {node.status === "locked" ? (
          <div className="block">{inner}</div>
        ) : (
          <Link href={`/topic/${node.slug}`} className="block cursor-pointer">{inner}</Link>
        )}
      </div>
    </div>
  );
}

export default function WorldMap({ nodes }: WorldMapProps) {
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
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
        <div className="w-full h-full bg-gradient-to-b from-[var(--duo-green)]/20 via-[var(--duo-info)]/20 to-[var(--duo-purple)]/20 rounded-full" />
      </div>

      {sections.map((section, sIdx) => (
        <div key={section.name} className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white"
              style={{
                backgroundColor: levelColors[section.level].ring,
                boxShadow: `0 4px 15px ${levelColors[section.level].glow}`,
              }}
            >
              {section.name}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-4"
          >
            {section.items.map((node, idx) => (
              <WorldMapNodeItem key={node.slug} node={node} index={sIdx * 10 + idx} />
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
