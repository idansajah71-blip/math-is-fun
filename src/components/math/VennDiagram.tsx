"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface VennDiagramProps {
  /** Labels for each set */
  setLabels: [string, string];
  /** Total elements in each region: [A only, B only, A∩B, outside] */
  regionValues: [number, number, number, number];
  /** Total universe */
  universe?: number;
  /** Allow clicking regions to highlight */
  interactive?: boolean;
  /** Called when a region is clicked, with region info */
  onRegionClick?: (region: "a" | "b" | "ab" | "none") => void;
  width?: number;
  height?: number;
}

export default function VennDiagram({
  setLabels,
  regionValues,
  universe,
  interactive = false,
  onRegionClick,
  width = 320,
  height = 260,
}: VennDiagramProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const cx = width / 2;
  const cy = height / 2 - 10;
  const r = 70;
  const overlap = 30;

  // Click handler
  const handleClick = useCallback((region: "a" | "b" | "ab" | "none") => {
    if (!interactive) return;
    setSelectedRegion(region === selectedRegion ? null : region);
    onRegionClick?.(region);
  }, [interactive, selectedRegion, onRegionClick]);

  const total = regionValues[0] + regionValues[1] + regionValues[2] + (regionValues[3] || 0);

  // Region paths (clip to create proper Venn intersection)
  const leftCircle = `M ${cx - overlap} ${cy} m ${-r} 0 a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
  const rightCircle = `M ${cx + overlap} ${cy} m ${-r} 0 a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;

  return (
    <div className="space-y-2">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block"
      >
        {/* Universe box */}
        <rect
          x="10" y="10" width={width - 20} height={height - 20}
          rx="12" fill="var(--duo-card)" stroke="var(--duo-border)" strokeWidth="1.5"
        />

        {/* Universe label */}
        {universe !== undefined && (
          <text x={width - 20} y={height - 16} fontSize="10" textAnchor="end" fill="var(--duo-text-muted)" fontWeight="bold">
            U = {universe}
          </text>
        )}

        {/* Left circle (A) */}
        <circle
          cx={cx - overlap} cy={cy} r={r}
          fill={hoveredRegion === "a" || selectedRegion === "a" ? "#58CC0240" : "#58CC0220"}
          stroke="#58CC02"
          strokeWidth="2"
          className={interactive ? "cursor-pointer transition-colors" : ""}
          onClick={() => handleClick("a")}
          onMouseEnter={() => setHoveredRegion("a")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Right circle (B) */}
        <circle
          cx={cx + overlap} cy={cy} r={r}
          fill={hoveredRegion === "b" || selectedRegion === "b" ? "#1CB0F640" : "#1CB0F620"}
          stroke="#1CB0F6"
          strokeWidth="2"
          className={interactive ? "cursor-pointer transition-colors" : ""}
          onClick={() => handleClick("b")}
          onMouseEnter={() => setHoveredRegion("b")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Intersection highlight */}
        <clipPath id="leftClip">
          <circle cx={cx - overlap} cy={cy} r={r} />
        </clipPath>
        <circle
          cx={cx + overlap} cy={cy} r={r}
          fill={hoveredRegion === "ab" || selectedRegion === "ab" ? "#CE82FF60" : "#CE82FF30"}
          clipPath="url(#leftClip)"
          className={interactive ? "cursor-pointer transition-colors" : ""}
          onClick={() => handleClick("ab")}
          onMouseEnter={() => setHoveredRegion("ab")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Labels */}
        <text x={cx - overlap - r / 2} y={cy - r - 8} fontSize="13" textAnchor="middle" fill="#58CC02" fontWeight="800">
          {setLabels[0]}
        </text>
        <text x={cx + overlap + r / 2} y={cy - r - 8} fontSize="13" textAnchor="middle" fill="#1CB0F6" fontWeight="800">
          {setLabels[1]}
        </text>

        {/* Values in regions */}
        {/* A only */}
        <text x={cx - overlap - r / 2.5} y={cy + 4} fontSize="16" textAnchor="middle" fill="#58CC02" fontWeight="800">
          {regionValues[0]}
        </text>
        {/* B only */}
        <text x={cx + overlap + r / 2.5} y={cy + 4} fontSize="16" textAnchor="middle" fill="#1CB0F6" fontWeight="800">
          {regionValues[1]}
        </text>
        {/* A∩B */}
        <text x={cx} y={cy + 4} fontSize="16" textAnchor="middle" fill="#CE82FF" fontWeight="800">
          {regionValues[2]}
        </text>
        {/* Outside */}
        {regionValues[3] > 0 && (
          <text x={cx + r + overlap + 20} y={cy + r - 10} fontSize="12" textAnchor="middle" fill="var(--duo-text-muted)" fontWeight="bold">
            {regionValues[3]}
          </text>
        )}
      </svg>

      {/* Tooltip */}
      {hoveredRegion && interactive && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-block px-3 py-1 bg-[var(--duo-card)] rounded-full border border-[var(--duo-border)] text-xs font-bold text-[var(--duo-text)]">
            {hoveredRegion === "a" && `Hanya ${setLabels[0]}: ${regionValues[0]}`}
            {hoveredRegion === "b" && `Hanya ${setLabels[1]}: ${regionValues[1]}`}
            {hoveredRegion === "ab" && `Irisan: ${regionValues[2]}`}
          </span>
        </motion.div>
      )}
    </div>
  );
}
