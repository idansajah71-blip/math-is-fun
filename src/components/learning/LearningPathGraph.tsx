"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { buildPathData, LEVEL_CONFIG, type PathNode } from "@/lib/learningPath";
import { getTopicStatus } from "@/lib/data";
import { getMastery, getMasteryLevel } from "@/lib/mastery";
import { getAllTopics } from "@/lib/data";
import type { UserProfile } from "@/lib/gamification";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface LearningPathGraphProps {
  profile: UserProfile;
}

const NODE_W = 200;
const NODE_H = 64;
const ROW_GAP = 28;
const SIDE_OFFSET = 60;
const SPINE_X = 320;
const PADDING_TOP = 50;
const PADDING_SIDE = 40;

const STATUS_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  locked: { fill: "#1E2330", stroke: "#2D3548", text: "#6B7280" },
  available: { fill: "#1E3A5F", stroke: "#3B82F6", text: "#DBEAFE" },
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
      const effectiveStatus = masteryPct >= 90 ? "mastered" : status;
      return { ...n, status: effectiveStatus, masteryPct };
    });
  }, [nodes, statusMap]);

  // Zigzag positioning: alternating left/right per row
  const getNodePos = useCallback((node: PathNode) => {
    const isLeft = node.row % 2 === 0;
    const x = isLeft
      ? PADDING_SIDE
      : SPINE_X + SIDE_OFFSET;
    const y = PADDING_TOP + node.row * (NODE_H + ROW_GAP);
    return { x, y, isLeft };
  }, []);

  const svgWidth = SPINE_X + SIDE_OFFSET + NODE_W + PADDING_SIDE;
  const maxRow = nodes.length > 0 ? Math.max(...nodes.map((n) => n.row)) : 0;
  const svgHeight = PADDING_TOP + (maxRow + 1) * (NODE_H + ROW_GAP) + 20;

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

  // Group nodes by level for section rendering
  const levels = ["smp", "sma", "kuliah"] as const;
  const levelGroups = levels.map((level) => ({
    level,
    nodes: nodesWithStatus.filter((n) => n.level === level),
  })).filter((g) => g.nodes.length > 0);

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
          </defs>

          {/* Central spine line */}
          {levelGroups.map((group) => {
            const firstNode = group.nodes[0];
            const lastNode = group.nodes[group.nodes.length - 1];
            const firstPos = getNodePos(firstNode);
            const lastPos = getNodePos(lastNode);
            const cfg = LEVEL_CONFIG[group.level];
            const startY = firstPos.y + NODE_H / 2;
            const endY = lastPos.y + NODE_H / 2;
            return (
              <line
                key={`spine-${group.level}`}
                x1={SPINE_X}
                y1={startY}
                x2={SPINE_X}
                y2={endY}
                stroke={cfg.color}
                strokeWidth={2}
                opacity={0.25}
                strokeDasharray="6 4"
              />
            );
          })}

          {/* Horizontal connectors from nodes to spine */}
          {nodesWithStatus.map((node) => {
            const pos = getNodePos(node);
            const cfg = LEVEL_CONFIG[node.level];
            const nodeCenterY = pos.y + NODE_H / 2;
            const connectorColor = node.status === "locked" ? "#4B5563" : cfg.color;
            const connectorOpacity = node.status === "locked" ? 0.3 : 0.5;

            if (pos.isLeft) {
              // Left node: connector from right edge to spine
              const x1 = pos.x + NODE_W;
              const x2 = SPINE_X;
              return (
                <line
                  key={`conn-${node.slug}`}
                  x1={x1}
                  y1={nodeCenterY}
                  x2={x2}
                  y2={nodeCenterY}
                  stroke={connectorColor}
                  strokeWidth={2}
                  strokeDasharray={node.status === "locked" ? "4 4" : "none"}
                  opacity={connectorOpacity}
                />
              );
            } else {
              // Right node: connector from spine to left edge, stop before node
              const x1 = SPINE_X;
              const x2 = pos.x - 8;
              return (
                <line
                  key={`conn-${node.slug}`}
                  x1={x1}
                  y1={nodeCenterY}
                  x2={x2}
                  y2={nodeCenterY}
                  stroke={connectorColor}
                  strokeWidth={2}
                  strokeDasharray={node.status === "locked" ? "4 4" : "none"}
                  opacity={connectorOpacity}
                />
              );
            }
          })}

          {/* Spine dots at connector junctions */}
          {nodesWithStatus.map((node) => {
            const pos = getNodePos(node);
            const cfg = LEVEL_CONFIG[node.level];
            const nodeCenterY = pos.y + NODE_H / 2;
            return (
              <circle
                key={`dot-${node.slug}`}
                cx={SPINE_X}
                cy={nodeCenterY}
                r={4}
                fill={node.status === "locked" ? "#4B5563" : cfg.color}
                opacity={node.status === "locked" ? 0.4 : 0.7}
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
                {/* Shadow */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  fill="transparent"
                  filter="url(#nodeShadow)"
                  opacity={0.3}
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
                {/* Mastery glow */}
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
                {/* Title */}
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
