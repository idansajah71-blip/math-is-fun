"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface GeometryShape {
  type: "triangle" | "circle" | "rectangle" | "angle";
  points?: { x: number; y: number }[];
  radius?: number;
  center?: { x: number; y: number };
  color?: string;
  label?: string;
  showMeasurements?: boolean;
}

interface GeometryCanvasProps {
  shapes: GeometryShape[];
  /** Let user drag vertices */
  interactive?: boolean;
  /** Show grid */
  showGrid?: boolean;
  /** Show axis */
  showAxis?: boolean;
  /** Width/Height */
  width?: number;
  height?: number;
  /** Question text */
  question?: string;
}

export default function GeometryCanvas({
  shapes,
  interactive = false,
  showGrid = true,
  showAxis = true,
  width = 340,
  height = 300,
  question,
}: GeometryCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragIdx, setDragIdx] = useState<{ shape: number; point: number } | null>(null);
  const [shapeStates, setShapeStates] = useState(shapes);

  const padding = 20;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;
  const cx = width / 2;
  const cy = height / 2;

  const toSVG = useCallback(
    (mx: number, my: number) => ({
      x: cx + mx * (plotW / 20),
      y: cy - my * (plotH / 20),
    }),
    [cx, cy, plotW, plotH]
  );

  const toMath = useCallback(
    (sx: number, sy: number) => ({
      x: (sx - cx) / (plotW / 20),
      y: (cy - sy) / (plotH / 20),
    }),
    [cx, cy, plotW, plotH]
  );

  // Grid
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
    for (let i = -10; i <= 10; i++) {
      const sv = toSVG(i, 0);
      lines.push({ x1: sv.x, y1: padding, x2: sv.x, y2: padding + plotH, major: i === 0 });
      const sh = toSVG(0, i);
      lines.push({ x1: padding, y1: sh.y, x2: padding + plotW, y2: sh.y, major: i === 0 });
    }
    return lines;
  }, [toSVG, plotW, plotH]);

  // Distance helper
  function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
  }

  // Drag handlers
  const handlePointerDown = useCallback((shapeIdx: number, pointIdx: number, e: React.PointerEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragIdx({ shape: shapeIdx, point: pointIdx });
  }, [interactive]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragIdx || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const math = toMath(e.clientX - rect.left, e.clientY - rect.top);
    const snapped = { x: Math.round(math.x * 2) / 2, y: Math.round(math.y * 2) / 2 };

    setShapeStates((prev) => {
      const next = [...prev];
      const shape = { ...next[dragIdx.shape] };
      if (shape.points) {
        const pts = [...shape.points];
        pts[dragIdx.point] = snapped;
        shape.points = pts;
      }
      if (shape.type === "circle" && dragIdx.point === 0 && shape.center) {
        shape.center = snapped;
      }
      next[dragIdx.shape] = shape;
      return next;
    });
  }, [dragIdx, toMath]);

  const handlePointerUp = useCallback(() => {
    setDragIdx(null);
  }, []);

  // Render shapes
  function renderShape(shape: GeometryShape, idx: number) {
    const color = shape.color || "var(--duo-green)";

    if (shape.type === "triangle" && shape.points && shape.points.length >= 3) {
      const pts = shape.points.map((p) => toSVG(p.x, p.y));
      const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

      // Measurements
      const sides = [
        dist(shape.points[0], shape.points[1]),
        dist(shape.points[1], shape.points[2]),
        dist(shape.points[2], shape.points[0]),
      ];

      return (
        <g key={idx}>
          <path d={pathD} fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
          {shape.points.map((p, pi) => {
            const sv = toSVG(p.x, p.y);
            return (
              <g key={pi}>
                <circle cx={sv.x} cy={sv.y} r="6" fill="white" stroke={color} strokeWidth="2" />
                {interactive && (
                  <circle
                    cx={sv.x} cy={sv.y} r="12"
                    fill="transparent"
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => handlePointerDown(idx, pi, e)}
                  />
                )}
                <text x={sv.x} y={sv.y + 3.5} fontSize="8" textAnchor="middle" fill={color} fontWeight="bold">
                  {String.fromCharCode(65 + pi)}
                </text>
              </g>
            );
          })}
          {shape.showMeasurements && sides.map((s, si) => {
            const mid = {
              x: (shape.points![(si + 1) % 3].x + shape.points![((si + 2) % 3)].x) / 2,
              y: (shape.points![(si + 1) % 3].y + shape.points![((si + 2) % 3)].y) / 2,
            };
            const sv = toSVG(mid.x, mid.y);
            return (
              <text key={si} x={sv.x} y={sv.y - 6} fontSize="9" textAnchor="middle" fill="var(--duo-text-muted)" fontWeight="bold">
                {s.toFixed(1)}
              </text>
            );
          })}
          {shape.label && (
            <text x={cx} y={height - 8} fontSize="10" textAnchor="middle" fill={color} fontWeight="bold">
              {shape.label}
            </text>
          )}
        </g>
      );
    }

    if (shape.type === "circle" && shape.center && shape.radius) {
      const sv = toSVG(shape.center.x, shape.center.y);
      const rSvg = shape.radius * (plotW / 20);
      return (
        <g key={idx}>
          <circle cx={sv.x} cy={sv.y} r={rSvg} fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
          {interactive && (
            <circle
              cx={sv.x} cy={sv.y} r="12"
              fill="transparent"
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(idx, 0, e)}
            />
          )}
          {shape.showMeasurements && (
            <>
              <text x={sv.x} y={sv.y - rSvg - 6} fontSize="9" textAnchor="middle" fill="var(--duo-text-muted)" fontWeight="bold">
                r = {shape.radius.toFixed(1)}
              </text>
              <line x1={sv.x} y1={sv.y} x2={sv.x + rSvg} y2={sv.y} stroke={color} strokeWidth="1" strokeDasharray="4 2" />
            </>
          )}
        </g>
      );
    }

    if (shape.type === "rectangle" && shape.points && shape.points.length >= 2) {
      const [tl, br] = shape.points;
      const svg1 = toSVG(tl.x, tl.y);
      const svg2 = toSVG(br.x, br.y);
      const w = svg2.x - svg1.x;
      const h = svg2.y - svg1.y;
      return (
        <g key={idx}>
          <rect x={svg1.x} y={svg1.y} width={w} height={h} fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
          {shape.showMeasurements && (
            <>
              <text x={(svg1.x + svg2.x) / 2} y={svg1.y - 6} fontSize="9" textAnchor="middle" fill="var(--duo-text-muted)" fontWeight="bold">
                {Math.abs(tl.x - br.x).toFixed(1)}
              </text>
              <text x={svg1.x - 12} y={(svg1.y + svg2.y) / 2 + 3} fontSize="9" textAnchor="middle" fill="var(--duo-text-muted)" fontWeight="bold">
                {Math.abs(tl.y - br.y).toFixed(1)}
              </text>
            </>
          )}
        </g>
      );
    }

    if (shape.type === "angle" && shape.points && shape.points.length >= 3) {
      const [vertex, p1, p2] = shape.points;
      const sv0 = toSVG(vertex.x, vertex.y);
      const sv1 = toSVG(p1.x, p1.y);
      const sv2 = toSVG(p2.x, p2.y);

      // Calculate angle
      const a1 = Math.atan2(-(p1.y - vertex.y), p1.x - vertex.x);
      const a2 = Math.atan2(-(p2.y - vertex.y), p2.x - vertex.x);
      let angle = Math.abs(a1 - a2) * (180 / Math.PI);
      if (angle > 180) angle = 360 - angle;

      const r = 25;
      const startA = Math.min(a1, a2);
      const endA = Math.max(a1, a2);
      const arcPath = `M ${sv0.x + r * Math.cos(-startA)} ${sv0.y + r * Math.sin(-startA)} A ${r} ${r} 0 0 0 ${sv0.x + r * Math.cos(-endA)} ${sv0.y + r * Math.sin(-endA)}`;

      return (
        <g key={idx}>
          <line x1={sv0.x} y1={sv0.y} x2={sv1.x} y2={sv1.y} stroke={color} strokeWidth="2" />
          <line x1={sv0.x} y1={sv0.y} x2={sv2.x} y2={sv2.y} stroke={color} strokeWidth="2" />
          <path d={arcPath} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          {shape.showMeasurements && (
            <text
              x={sv0.x + 30 * Math.cos(-(startA + endA) / 2)}
              y={sv0.y + 30 * Math.sin(-(startA + endA) / 2)}
              fontSize="10" textAnchor="middle" fill={color} fontWeight="bold"
            >
              {angle.toFixed(0)}°
            </text>
          )}
          <circle cx={sv0.x} cy={sv0.y} r="4" fill={color} />
        </g>
      );
    }

    return null;
  }

  return (
    <div className="space-y-3">
      {question && (
        <p className="text-sm font-bold text-[var(--duo-text)] text-center">{question}</p>
      )}

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
        {showGrid && gridLines.map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={l.major ? "var(--duo-text-muted)" : "var(--duo-border)"}
            strokeWidth={l.major ? 1.2 : 0.4}
            opacity={l.major ? 0.3 : 0.15}
          />
        ))}

        {/* Axis */}
        {showAxis && (
          <>
            <line x1={padding} y1={cy} x2={width - padding} y2={cy} stroke="var(--duo-text-muted)" strokeWidth="1" opacity="0.5" />
            <line x1={cx} y1={padding} x2={cx} y2={height - padding} stroke="var(--duo-text-muted)" strokeWidth="1" opacity="0.5" />
          </>
        )}

        {/* Shapes */}
        {shapeStates.map((s, i) => renderShape(s, i))}
      </svg>
    </div>
  );
}
