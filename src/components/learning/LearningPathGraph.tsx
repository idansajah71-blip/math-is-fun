"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { buildPathData, LEVEL_CONFIG, type PathNode } from "@/lib/learningPath";
import { getTopicStatus } from "@/lib/data";
import { getMastery } from "@/lib/mastery";
import { getMasteryLevel } from "@/lib/mastery";
import { getAllTopics } from "@/lib/data";
import type { UserProfile } from "@/lib/gamification";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface LearningPathGraphProps {
  profile: UserProfile;
}

const NODE_W = 200;
const NODE_H = 64;
const COL_GAP = 80;
const ROW_GAP = 28;
const COL_WIDTH = NODE_W + COL_GAP;
const PADDING = 40;

const STATUS_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  locked: { fill: "#374151", stroke: "#4B5563", text: "#9CA3AF" },
  available: { fill: "#1E40AF", stroke: "#3B82F6", text: "#DBEAFE" },
  completed: { fill: "#065F46", stroke: "#10B981", text: "#D1FAE5" },
  mastered: { fill: "#92400E", stroke: "#F59E0B", text: "#FEF3C7" },
};

export default function LearningPathGraph({ profile }: LearningPathGraphProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const allTopics = useMemo(() => getAllTopics(), []);
  const statusMap = useMemo(() => getTopicStatus(allTopics, profile.completedTopics || []), [allTopics, profile]);
  const { nodes } = useMemo(() => buildPathData(allTopics), [allTopics]);

  const nodesWithStatus = useMemo(() => {
    return nodes.map((n) => {
      const status = statusMap.get(n.slug) || "locked";
      const masteryPct = getMastery(n.slug);
      const masteryInfo = getMasteryLevel(masteryPct);
      const effectiveStatus = masteryPct >= 90 ? "mastered" : status;
      return { ...n, status: effectiveStatus, masteryPct };
    });
  }, [nodes, statusMap]);

  // Calculate SVG dimensions
  const maxRow = nodes.length > 0 ? Math.max(...nodes.map((n) => n.row)) : 0;
  const svgWidth = PADDING * 2 + COL_WIDTH * 3 - COL_GAP;
  const svgHeight = PADDING * 2 + (maxRow + 1) * (NODE_H + ROW_GAP);

  const getNodePos = (node: PathNode) => ({
    x: PADDING + node.col * COL_WIDTH,
    y: PADDING + node.row * (NODE_H + ROW_GAP),
  });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.3), 2));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ ...pan });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPan({ x: panStart.x + dx, y: panStart.y + dy });
  }, [dragging, dragStart, panStart]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const totalTopics = nodesWithStatus.length;
  const completedCount = nodesWithStatus.filter((n) => n.status === "completed" || n.status === "mastered").length;
  const masteredCount = nodesWithStatus.filter((n) => n.status === "mastered").length;

  return (
    <div className="w-full">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Selesai: {completedCount}/{totalTopics}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500" />
            <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">Master: {masteredCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} className="p-1.5 rounded-lg bg-white dark:bg-[var(--duo-card)] border border-[var(--duo-border)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <ZoomIn size={14} className="text-[var(--duo-text-muted)]" />
          </button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))} className="p-1.5 rounded-lg bg-white dark:bg-[var(--duo-card)] border border-[var(--duo-border)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <ZoomOut size={14} className="text-[var(--duo-text-muted)]" />
          </button>
          <button onClick={resetView} className="p-1.5 rounded-lg bg-white dark:bg-[var(--duo-card)] border border-[var(--duo-border)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RotateCcw size={14} className="text-[var(--duo-text-muted)]" />
          </button>
        </div>
      </div>

      {/* SVG Graph */}
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-[var(--duo-border)] bg-white dark:bg-[var(--duo-card)]"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height={svgHeight * zoom + 40}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "top left",
          }}
        >
          <defs>
            <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
            </filter>
            <filter id="nodeShadowHover" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>
          {/* Column headers */}
          {(["smp", "sma", "kuliah"] as const).map((level, colIdx) => {
            const cfg = LEVEL_CONFIG[level];
            const x = PADDING + colIdx * COL_WIDTH + NODE_W / 2;
            return (
              <g key={level}>
                <rect
                  x={x - 60}
                  y={6}
                  width={120}
                  height={24}
                  rx={12}
                  fill={cfg.color}
                  opacity={0.15}
                />
                <text x={x} y={22} textAnchor="middle" fill={cfg.color} fontSize={11} fontWeight={800}>
                  {cfg.label}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {nodesWithStatus.map((node) => {
            const pos = getNodePos(node);
            const nextInCol = nodesWithStatus.find(
              (n) => n.col === node.col && n.row === node.row + 1
            );
            if (!nextInCol) return null;
            const nextPos = getNodePos(nextInCol);
            const x1 = pos.x + NODE_W * 0.4;
            const y1 = pos.y + NODE_H;
            const x2 = nextPos.x + NODE_W * 0.4;
            const y2 = nextPos.y;
            const midY = (y1 + y2) / 2;
            const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
            return (
              <path
                key={`edge-${node.slug}`}
                d={d}
                fill="none"
                stroke={node.status === "locked" ? "#4B5563" : LEVEL_CONFIG[node.level].color}
                strokeWidth={2}
                strokeDasharray={node.status === "locked" ? "6 4" : "none"}
                opacity={node.status === "locked" ? 0.4 : 0.6}
              />
            );
          })}

          {/* Cross-level edges */}
          {(["smp", "sma"] as const).map((level) => {
            const levelNodes = nodesWithStatus.filter((n) => n.level === level);
            const nextLevel = level === "smp" ? "sma" : "kuliah";
            const nextLevelNodes = nodesWithStatus.filter((n) => n.level === nextLevel);
            if (levelNodes.length === 0 || nextLevelNodes.length === 0) return null;
            const lastNode = levelNodes[levelNodes.length - 1];
            const firstNode = nextLevelNodes[0];
            const from = getNodePos(lastNode);
            const to = getNodePos(firstNode);
            const x1 = from.x + NODE_W;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x + 40;
            const y2 = to.y + NODE_H / 2;
            const cpX = (x1 + x2) / 2;
            const d = `M ${x1} ${y1} C ${cpX} ${y1}, ${cpX} ${y2}, ${x2} ${y2}`;
            return (
              <path
                key={`cross-${level}`}
                d={d}
                fill="none"
                stroke={LEVEL_CONFIG[nextLevel].color}
                strokeWidth={2}
                strokeDasharray="8 4"
                opacity={0.5}
              />
            );
          })}

          {/* Nodes */}
          {nodesWithStatus.map((node) => {
            const pos = getNodePos(node);
            const colors = STATUS_COLORS[node.status];
            const isClickable = node.status !== "locked";

            return (
              <g
                key={node.slug}
                onClick={() => isClickable && router.push(`/topic/${node.slug}`)}
                style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
                className="group"
              >
                {/* Shadow layer */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  fill="transparent"
                  filter="url(#nodeShadow)"
                  opacity={node.status === "locked" ? 0.2 : 0.5}
                />
                {/* Main node */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={2}
                  opacity={node.status === "locked" ? 0.5 : 1}
                  className="transition-all duration-200"
                />
                {/* Hover overlay */}
                {isClickable && (
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx={14}
                    fill="white"
                    opacity={0}
                    className="group-hover:opacity-10 transition-opacity duration-200"
                    style={{ pointerEvents: "none" }}
                  />
                )}
                {/* Mastery glow for mastered topics */}
                {node.status === "mastered" && (
                  <rect
                    x={pos.x - 3}
                    y={pos.y - 3}
                    width={NODE_W + 6}
                    height={NODE_H + 6}
                    rx={17}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    opacity={0.4}
                  />
                )}
                {/* Short title */}
                <text
                  x={pos.x + NODE_W / 2}
                  y={pos.y + NODE_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={colors.text}
                  fontSize={12}
                  fontWeight={700}
                  style={{ pointerEvents: "none" }}
                >
                  {node.shortTitle}
                </text>
                {/* Mastery bar */}
                {node.masteryPct > 0 && (
                  <>
                    <rect
                      x={pos.x + 12}
                      y={pos.y + NODE_H - 12}
                      width={NODE_W - 24}
                      height={4}
                      rx={2}
                      fill="rgba(255,255,255,0.2)"
                    />
                    <rect
                      x={pos.x + 12}
                      y={pos.y + NODE_H - 12}
                      width={(NODE_W - 24) * (node.masteryPct / 100)}
                      height={4}
                      rx={2}
                      fill={getMasteryLevel(node.masteryPct).color}
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
