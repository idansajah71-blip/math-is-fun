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

const NODE_W = 140;
const NODE_H = 56;
const COL_GAP = 60;
const ROW_GAP = 16;
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
          height={Math.min(svgHeight * zoom + 40, 600)}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "top left",
          }}
        >
          {/* Column headers */}
          {(["smp", "sma", "kuliah"] as const).map((level, colIdx) => {
            const cfg = LEVEL_CONFIG[level];
            const x = PADDING + colIdx * COL_WIDTH + NODE_W / 2;
            return (
              <text key={level} x={x} y={20} textAnchor="middle" fill={cfg.color} fontSize={11} fontWeight={800}>
                {cfg.label}
              </text>
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
            return (
              <line
                key={`edge-${node.slug}`}
                x1={pos.x + NODE_W / 2}
                y1={pos.y + NODE_H}
                x2={nextPos.x + NODE_W / 2}
                y2={nextPos.y}
                stroke="var(--duo-border)"
                strokeWidth={2}
                strokeDasharray={node.status === "locked" ? "4 4" : "none"}
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
            return (
              <line
                key={`cross-${level}`}
                x1={from.x + NODE_W}
                y1={from.y + NODE_H / 2}
                x2={to.x}
                y2={to.y + NODE_H / 2}
                stroke="var(--duo-border)"
                strokeWidth={2}
                strokeDasharray="6 4"
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
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={12}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={2}
                  opacity={node.status === "locked" ? 0.5 : 1}
                />
                {/* Mastery glow for mastered topics */}
                {node.status === "mastered" && (
                  <rect
                    x={pos.x - 2}
                    y={pos.y - 2}
                    width={NODE_W + 4}
                    height={NODE_H + 4}
                    rx={14}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    opacity={0.5}
                  />
                )}
                {/* Short title */}
                <text
                  x={pos.x + NODE_W / 2}
                  y={pos.y + NODE_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={colors.text}
                  fontSize={11}
                  fontWeight={700}
                  style={{ pointerEvents: "none" }}
                >
                  {node.shortTitle}
                </text>
                {/* Mastery bar */}
                {node.masteryPct > 0 && (
                  <>
                    <rect
                      x={pos.x + 8}
                      y={pos.y + NODE_H - 10}
                      width={NODE_W - 16}
                      height={4}
                      rx={2}
                      fill="rgba(255,255,255,0.2)"
                    />
                    <rect
                      x={pos.x + 8}
                      y={pos.y + NODE_H - 10}
                      width={(NODE_W - 16) * (node.masteryPct / 100)}
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
