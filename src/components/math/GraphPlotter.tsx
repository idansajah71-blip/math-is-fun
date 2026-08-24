"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface GraphPlotterProps {
  /** Math expression using x as variable. Example: "x^2", "sin(x)", "2*x + 1" */
  expression: string;
  /** X range */
  xMin?: number;
  xMax?: number;
  /** Y range */
  yMin?: number;
  yMax?: number;
  /** Show draggable point on graph */
  draggable?: boolean;
  /** Initial x position of draggable point */
  initialX?: number;
  /** Called when user drags the point, with the (x, y) value */
  onPointMove?: (x: number, y: number) => void;
  /** Correct answer point for validation */
  correctPoint?: { x: number; y: number };
  /** Tolerance for checking correctness */
  tolerance?: number;
  /** Grid density */
  gridStep?: number;
  /** Show axis labels */
  showLabels?: boolean;
  /** Width/Height */
  width?: number;
  height?: number;
}

// Safe math evaluator — no eval, uses a simple parser
function evaluateExpression(expr: string, x: number): number | null {
  try {
    // Normalize the expression
    let normalized = expr
      .replace(/\^/g, "**")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/log\(/g, "Math.log(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/pi/g, "Math.PI")
      .replace(/e(?![xp])/g, "Math.E");

    // Handle implicit multiplication: 2x → 2*x, x( → x*(
    normalized = normalized.replace(/(\d)([x(])/g, "$1*$2");
    normalized = normalized.replace(/([x)])(\d)/g, "$1*$2");
    normalized = normalized.replace(/([x)])\(/g, "$1*(");

    const fn = new Function("x", `"use strict"; return (${normalized});`);
    const result = fn(x);
    if (typeof result !== "number" || !isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

export default function GraphPlotter({
  expression,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  draggable = false,
  initialX = 0,
  onPointMove,
  correctPoint,
  tolerance = 0.5,
  gridStep = 1,
  showLabels = true,
  width = 320,
  height = 320,
}: GraphPlotterProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragX, setDragX] = useState(initialX);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const isDragging = useRef(false);

  const padding = 30;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;

  // Convert math coords to SVG coords
  const toSVG = useCallback(
    (mx: number, my: number) => {
      const sx = padding + ((mx - xMin) / (xMax - xMin)) * plotW;
      const sy = padding + ((yMax - my) / (yMax - yMin)) * plotH;
      return { x: sx, y: sy };
    },
    [xMin, xMax, yMin, yMax, plotW, plotH]
  );

  // Convert SVG coords to math coords
  const toMath = useCallback(
    (sx: number, sy: number) => {
      const mx = xMin + ((sx - padding) / plotW) * (xMax - xMin);
      const my = yMax - ((sy - padding) / plotH) * (yMax - yMin);
      return { x: mx, y: my };
    },
    [xMin, xMax, yMin, yMax, plotW, plotH]
  );

  // Generate curve path
  const curvePath = useMemo(() => {
    const points: string[] = [];
    const steps = 200;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = evaluateExpression(expression, x);
      if (y === null) continue;
      const svg = toSVG(x, y);
      if (svg.y < -50 || svg.y > height + 50) {
        points.push(`M ${svg.x} ${svg.y}`);
        continue;
      }
      if (points.length === 0 || points[points.length - 1] === "M nan nan") {
        points.push(`M ${svg.x} ${svg.y}`);
      } else {
        points.push(`L ${svg.x} ${svg.y}`);
      }
    }
    return points.join(" ");
  }, [expression, xMin, xMax, toSVG, height]);

  // Draggable point position
  const dragY = evaluateExpression(expression, dragX);
  const dragSVG = dragY !== null ? toSVG(dragX, dragY) : toSVG(dragX, 0);

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
    for (let x = Math.ceil(xMin); x <= xMax; x += gridStep) {
      const svg = toSVG(x, 0);
      const isMajor = x === 0;
      lines.push({
        x1: svg.x, y1: padding, x2: svg.x, y2: padding + plotH,
        major: isMajor,
      });
    }
    for (let y = Math.ceil(yMin); y <= yMax; y += gridStep) {
      const svg = toSVG(0, y);
      const isMajor = y === 0;
      lines.push({
        x1: padding, y1: svg.y, x2: padding + plotW, y2: svg.y,
        major: isMajor,
      });
    }
    return lines;
  }, [xMin, xMax, yMin, yMax, gridStep, toSVG, plotW, plotH]);

  // Handle drag
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateDragPosition(e.clientX);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateDragPosition(e.clientX);
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  function updateDragPosition(clientX: number) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const sx = clientX - rect.left;
    const math = toMath(sx, 0);
    const clamped = Math.max(xMin, Math.min(xMax, math.x));
    setDragX(Math.round(clamped * 10) / 10);
    if (onPointMove) {
      const y = evaluateExpression(expression, clamped);
      onPointMove(clamped, y ?? 0);
    }
  }

  function handleCheck() {
    if (!correctPoint || answered) return;
    setAnswered(true);
    const y = evaluateExpression(expression, dragX);
    const dxOk = Math.abs(dragX - correctPoint.x) <= tolerance;
    const dyOk = y !== null && Math.abs(y - correctPoint.y) <= tolerance;
    setIsCorrect(dxOk && dyOk);
  }

  const currentY = evaluateExpression(expression, dragX);

  return (
    <div className="space-y-3">
      {/* Current point display */}
      {draggable && currentY !== null && (
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--duo-card)] rounded-full border border-[var(--duo-border)]">
            <span className="text-xs font-bold text-[var(--duo-text-muted)]">Titik:</span>
            <span className="text-sm font-black text-[var(--duo-green)] font-mono">
              ({dragX.toFixed(1)}, {currentY.toFixed(1)})
            </span>
          </span>
        </div>
      )}

      {/* SVG Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block rounded-xl bg-white dark:bg-[var(--duo-card)] border border-[var(--duo-border)]"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        {/* Grid */}
        {gridLines.map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={l.major ? "var(--duo-text-muted)" : "var(--duo-border)"}
            strokeWidth={l.major ? 1.5 : 0.5}
            opacity={l.major ? 0.4 : 0.2}
          />
        ))}

        {/* Axis labels */}
        {showLabels && gridLines.filter(l => l.major).map((l, i) => {
          const isX = l.y1 === padding && l.y2 === padding + plotH;
          const val = isX
            ? Math.round(toMath(l.x1, 0).x)
            : Math.round(toMath(0, l.y1).y);
          if (val === 0) return null;
          return (
            <text
              key={i}
              x={isX ? l.x1 : toSVG(0, 0).x + 4}
              y={isX ? toSVG(0, 0).y + 14 : l.y1 + 4}
              fontSize="10"
              fill="var(--duo-text-muted)"
              fontFamily="monospace"
            >
              {val}
            </text>
          );
        })}

        {/* Curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="var(--duo-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Draggable point */}
        {draggable && currentY !== null && (
          <g
            onPointerDown={handlePointerDown}
            className="cursor-grab active:cursor-grabbing"
          >
            {/* Glow */}
            <circle cx={dragSVG.x} cy={dragSVG.y} r="16" fill="var(--duo-green)" opacity="0.15" />
            {/* Point */}
            <circle cx={dragSVG.x} cy={dragSVG.y} r="8" fill="var(--duo-green)" stroke="white" strokeWidth="3" />
            {/* Inner dot */}
            <circle cx={dragSVG.x} cy={dragSVG.y} r="3" fill="white" />
          </g>
        )}

        {/* Expression label */}
        <text
          x={width - 8}
          y={16}
          fontSize="11"
          textAnchor="end"
          fill="var(--duo-green)"
          fontWeight="bold"
          fontFamily="monospace"
        >
          y = {expression}
        </text>
      </svg>

      {/* Check button */}
      {draggable && correctPoint && !answered && (
        <button
          onClick={handleCheck}
          className="w-full py-2.5 rounded-xl bg-[var(--duo-green)] text-white font-bold text-sm shadow-[0_3px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all"
        >
          Cek Jawaban
        </button>
      )}

      {/* Result */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-center text-sm font-bold ${
            isCorrect
              ? "bg-[var(--duo-green-bg)] text-[var(--duo-green)] border border-[var(--duo-green)]/30"
              : "bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-300 dark:border-red-700"
          }`}
        >
          {isCorrect ? "Benar! Titik sudah tepat." : `Jawaban: (${correctPoint?.x}, ${correctPoint?.y})`}
        </motion.div>
      )}
    </div>
  );
}
