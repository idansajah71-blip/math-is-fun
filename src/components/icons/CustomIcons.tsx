"use client";

import React from "react";
import { motion } from "framer-motion";

export type IconColor = string | { from: string; to: string };

export interface SvgIconProps extends Omit<React.SVGProps<SVGSVGElement>, "color"> {
  size?: number;
  color?: IconColor;
  strokeWidth?: number;
  animated?: boolean;
}

const gradientDef = (id: string, from: string, to: string) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  </defs>
);

const useColor = (id: string, color: IconColor, defaultFrom: string, defaultTo: string) => {
  if (typeof color === "string") {
    return { fill: color, defs: null };
  }
  const from = color?.from || defaultFrom;
  const to = color?.to || defaultTo;
  return { fill: `url(#${id})`, defs: gradientDef(id, from, to) };
};

export function NumbersIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("numbers", color || { from: "#58CC02", to: "#1CB0F6" }, "#58CC02", "#1CB0F6");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill}>
        <text x="10" y="28" fontSize="18" fontWeight="900" fontFamily="Nunito, sans-serif">123</text>
      </Comp>
      <circle cx="36" cy="14" r="4" fill={fill} opacity="0.6" />
    </svg>
  );
}

export function ChartIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("chart", color || { from: "#1CB0F6", to: "#CE82FF" }, "#1CB0F6", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 36 L10 22" />
        <path d="M18 36 L18 14" />
        <path d="M26 36 L26 28" />
        <path d="M34 36 L34 18" />
        <path d="M8 38 L40 38" strokeLinecap="round" />
      </Comp>
      <Comp fill={fill}>
        <circle cx="10" cy="22" r="3" />
        <circle cx="18" cy="14" r="3" />
        <circle cx="26" cy="28" r="3" />
        <circle cx="34" cy="18" r="3" />
      </Comp>
    </svg>
  );
}

export function AlgebraIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("algebra", color || { from: "#CE82FF", to: "#FF86D0" }, "#CE82FF", "#FF86D0");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill}>
        <text x="12" y="30" fontSize="18" fontWeight="900" fontFamily="Nunito, sans-serif">x²</text>
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round">
        <path d="M30 14 L40 30" />
        <path d="M40 14 L30 30" />
      </Comp>
      <circle cx="12" cy="14" r="3" fill={fill} opacity="0.7" />
    </svg>
  );
}

export function ScaleIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("scale", color || { from: "#1CB0F6", to: "#58CC02" }, "#1CB0F6", "#58CC02");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M24 8 L24 38" />
        <path d="M24 8 L10 18 L38 18 Z" />
        <path d="M10 18 L6 28 L14 28 Z" />
        <path d="M38 18 L34 28 L42 28 Z" />
        <path d="M18 40 L30 40" strokeLinecap="round" />
      </Comp>
      <Comp fill={fill}>
        <circle cx="24" cy="8" r="3" />
      </Comp>
    </svg>
  );
}

export function TriangleIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("triangle", color || { from: "#FF9600", to: "#FF4B4B" }, "#FF9600", "#FF4B4B");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="24,10 10,38 38,38" fill={fill} fillOpacity="0.25" />
        <circle cx="24" cy="30" r="3" fill={fill} />
        <text x="22" y="28" fontSize="10" fontWeight="800" fontFamily="Nunito, sans-serif" fill={fill}>r</text>
      </Comp>
      <path d="M14 36 L20 36 L20 30" stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function RulerIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("ruler", color || { from: "#CE82FF", to: "#1CB0F6" }, "#CE82FF", "#1CB0F6");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp>
        <rect x="8" y="14" width="32" height="20" rx="4" fill={fill} fillOpacity="0.25" stroke={fill} strokeWidth={strokeWidth} />
        {[13, 18, 23, 28, 33].map((x, i) => (
          <line key={i} x1={x} y1="14" x2={x} y2={i % 2 === 0 ? 22 : 18} stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" />
        ))}
      </Comp>
      <circle cx="38" cy="34" r="3" fill={fill} opacity="0.7" />
    </svg>
  );
}

export function CoinIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("coin", color || { from: "#FFD900", to: "#FF9600" }, "#FFD900", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp>
        <circle cx="24" cy="26" r="13" fill={fill} opacity="0.3" />
        <circle cx="24" cy="24" r="13" fill={fill} fillOpacity="0.8" stroke={color ? (typeof color === "string" ? color : color.from) : "#FF9600"} strokeWidth={strokeWidth} />
        <circle cx="24" cy="24" r="10" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <text x="24" y="29" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="Nunito, sans-serif" fill="#8B6914">$</text>
      </Comp>
    </svg>
  );
}

export function LinkIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("link", color || { from: "#58CC02", to: "#1CB0F6" }, "#58CC02", "#1CB0F6");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M10 24 C10 20 12 18 16 18 L22 18" />
        <path d="M38 24 C38 28 36 30 32 30 L26 30" />
        <path d="M16 30 L10 30 L10 24" />
        <path d="M32 18 L38 18 L38 24" />
        <rect x="18" y="14" width="12" height="20" rx="3" transform="rotate(30 24 24)" strokeWidth={strokeWidth + 0.5} />
      </Comp>
    </svg>
  );
}

export function GraphIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("graph", color || { from: "#FF4B4B", to: "#FF9600" }, "#FF4B4B", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M10 38 L38 38" />
        <path d="M10 38 L10 10" />
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M12 34 Q18 20 24 28 Q30 36 36 14" />
      </Comp>
      <Comp fill={fill}>
        <circle cx="12" cy="34" r="2.5" />
        <circle cx="24" cy="28" r="2.5" />
        <circle cx="36" cy="14" r="2.5" />
      </Comp>
    </svg>
  );
}

export function FormulaIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("formula", color || { from: "#CE82FF", to: "#58CC02" }, "#CE82FF", "#58CC02");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill}>
        <text x="10" y="22" fontSize="13" fontWeight="900" fontFamily="Nunito, sans-serif">E=</text>
        <text x="24" y="24" fontSize="14" fontWeight="900" fontFamily="Nunito, sans-serif">mc</text>
        <text x="36" y="18" fontSize="9" fontWeight="900" fontFamily="Nunito, sans-serif">2</text>
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round">
        <path d="M8 32 L40 32" />
        <path d="M8 32 L14 38" />
        <path d="M40 32 L34 26" />
      </Comp>
      <circle cx="40" cy="10" r="3" fill={fill} opacity="0.6" />
    </svg>
  );
}

export function GeometryIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("geometry", color || { from: "#1CB0F6", to: "#FF86D0" }, "#1CB0F6", "#FF86D0");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="14,14 24,10 34,14 34,28 24,32 14,28" fill={fill} fillOpacity="0.2" />
        <circle cx="24" cy="22" r="4" fill="none" strokeWidth={strokeWidth - 0.5} />
        <line x1="24" y1="22" x2="28" y2="22" strokeWidth={strokeWidth - 0.5} />
      </Comp>
      <Comp fill={fill}>
        <circle cx="14" cy="14" r="2" />
        <circle cx="34" cy="14" r="2" />
        <circle cx="14" cy="28" r="2" />
      </Comp>
    </svg>
  );
}

export function StatIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("stat", color || { from: "#58CC02", to: "#FFD900" }, "#58CC02", "#FFD900");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M10 36 C14 36 16 28 20 28 C24 28 26 34 30 32 C34 30 36 20 40 20" />
        <path d="M10 36 L40 36" />
      </Comp>
      <Comp fill={fill}>
        <circle cx="10" cy="36" r="2.5" />
        <circle cx="20" cy="28" r="2.5" />
        <circle cx="30" cy="32" r="2.5" />
        <circle cx="40" cy="20" r="2.5" />
      </Comp>
      <path d="M34 10 L38 14" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M38 10 L38 14 L34 14" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function MatrixIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("matrix", color || { from: "#FF86D0", to: "#CE82FF" }, "#FF86D0", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" fill="none">
        <path d="M12 10 L8 10 L8 38 L12 38" />
        <path d="M36 10 L40 10 L40 38 L36 38" />
      </Comp>
      <Comp fill={fill}>
        <text x="15" y="20" fontSize="10" fontWeight="800" fontFamily="Nunito, sans-serif">a₁₁</text>
        <text x="27" y="20" fontSize="10" fontWeight="800" fontFamily="Nunito, sans-serif">a₁₂</text>
        <text x="15" y="32" fontSize="10" fontWeight="800" fontFamily="Nunito, sans-serif">a₂₁</text>
        <text x="27" y="32" fontSize="10" fontWeight="800" fontFamily="Nunito, sans-serif">a₂₂</text>
      </Comp>
    </svg>
  );
}

export function CircleIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("circle", color || { from: "#FF4B4B", to: "#FFD900" }, "#FF4B4B", "#FFD900");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth}>
        <circle cx="24" cy="24" r="12" fill={fill} fillOpacity="0.25" />
        <circle cx="24" cy="24" r="6" fill={fill} fillOpacity="0.5" />
        <circle cx="24" cy="24" r="2" fill={fill} />
        <line x1="24" y1="24" x2="36" y2="24" strokeWidth={strokeWidth - 0.5} strokeLinecap="round" strokeDasharray="3,3" />
      </Comp>
      <text x="28" y="22" fontSize="8" fontWeight="800" fontFamily="Nunito, sans-serif" fill={fill}>r</text>
    </svg>
  );
}

export function ProbabilityIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("probability", color || { from: "#CE82FF", to: "#1CB0F6" }, "#CE82FF", "#1CB0F6");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill} fillOpacity="0.85">
        <circle cx="18" cy="26" r="9" />
        <circle cx="30" cy="26" r="9" opacity="0.7" />
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth} fill="none">
        <circle cx="18" cy="26" r="9" />
        <circle cx="30" cy="26" r="9" />
      </Comp>
      <text x="14" y="20" fontSize="8" fontWeight="900" fontFamily="Nunito, sans-serif" fill="#fff">A</text>
      <text x="33" y="20" fontSize="8" fontWeight="900" fontFamily="Nunito, sans-serif" fill="#fff">B</text>
    </svg>
  );
}

export function FunctionIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("function", color || { from: "#58CC02", to: "#CE82FF" }, "#58CC02", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill}>
        <text x="10" y="30" fontSize="16" fontWeight="900" fontFamily="Nunito, sans-serif">f(x)</text>
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" fill="none">
        <path d="M8 38 L40 38" />
        <path d="M8 38 L12 30 L16 34 L20 22 L24 28 L28 16 L32 24 L36 14 L40 20" />
      </Comp>
    </svg>
  );
}

export function VectorIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("vector", color || { from: "#FF9600", to: "#CE82FF" }, "#FF9600", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.2">
        <defs>
          <marker id="arrowHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={typeof fill === "string" ? fill : "#FF9600"} />
          </marker>
        </defs>
        <path d="M12 36 L36 14" markerEnd="url(#arrowHead)" />
      </Comp>
      <Comp fill={fill}>
        <circle cx="12" cy="36" r="3" />
        <text x="16" y="28" fontSize="11" fontWeight="800" fontFamily="Nunito, sans-serif">v⃗</text>
      </Comp>
    </svg>
  );
}

export function DerivativeIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("deriv", color || { from: "#1CB0F6", to: "#FF4B4B" }, "#1CB0F6", "#FF4B4B");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <g fill={fill}>
        <text x="12" y="22" fontSize="12" fontWeight="900" fontFamily="Nunito, sans-serif">d</text>
        <text x="20" y="20" fontSize="8" fontWeight="800" fontFamily="Nunito, sans-serif">y</text>
        <line x1="11" y1="26" x2="27" y2="26" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" />
        <text x="17" y="36" fontSize="9" fontWeight="800" fontFamily="Nunito, sans-serif">dx</text>
      </g>
      <path d="M32 36 C34 28 36 28 40 20" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function IntegralIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("integral", color || { from: "#58CC02", to: "#1CB0F6" }, "#58CC02", "#1CB0F6");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <g stroke={fill} strokeWidth={strokeWidth + 1} strokeLinecap="round" fill="none">
        <path d="M14 10 C12 14 12 22 14 26 C16 30 16 36 14 40" />
      </g>
      <g fill={fill}>
        <text x="19" y="16" fontSize="9" fontWeight="800" fontFamily="Nunito, sans-serif">b</text>
        <text x="19" y="38" fontSize="9" fontWeight="800" fontFamily="Nunito, sans-serif">a</text>
        <text x="24" y="30" fontSize="12" fontWeight="800" fontFamily="Nunito, sans-serif">dx</text>
      </g>
    </svg>
  );
}

export function LimitIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("limit", color || { from: "#FF9600", to: "#FF4B4B" }, "#FF9600", "#FF4B4B");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <g fill={fill}>
        <text x="10" y="24" fontSize="12" fontWeight="900" fontFamily="Nunito, sans-serif">lim</text>
        <text x="10" y="34" fontSize="8" fontWeight="800" fontFamily="Nunito, sans-serif">x→∞</text>
        <text x="28" y="24" fontSize="12" fontWeight="800" fontFamily="Nunito, sans-serif">f(x)</text>
      </g>
      <path d="M10 40 L40 40" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M40 40 L35 35" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M40 40 L35 40 L40 35" stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SparklesIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("spark", color || { from: "#FFD900", to: "#FF86D0" }, "#FFD900", "#FF86D0");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <Comp fill={fill}>
        <path d="M24 6 L27 20 L41 24 L27 28 L24 42 L21 28 L7 24 L21 20 Z" />
        <path d="M38 10 L39 16 L45 17 L39 18 L38 24 L37 18 L31 17 L37 16 Z" opacity="0.7" />
        <path d="M10 30 L11 34 L15 35 L11 36 L10 40 L9 36 L5 35 L9 34 Z" opacity="0.6" />
      </Comp>
    </svg>
  );
}

export function TrophyIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("trophy", color || { from: "#FFD900", to: "#FF9600" }, "#FFD900", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8 L32 8 L32 20 C32 28 28 32 24 32 C20 32 16 28 16 20 Z" fill={fill} fillOpacity="0.3" />
        <path d="M16 10 L8 10 L8 18 C8 22 12 24 16 22" fill={fill} fillOpacity="0.2" />
        <path d="M32 10 L40 10 L40 18 C40 22 36 24 32 22" fill={fill} fillOpacity="0.2" />
        <path d="M20 32 L20 36 L16 36 L16 40 L32 40 L32 36 L28 36 L28 32" fill={fill} fillOpacity="0.4" />
      </Comp>
      <Comp fill={fill}>
        <circle cx="24" cy="20" r="3" />
        <path d="M11 14 L11 16 L13 16" stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" fill="none" />
        <path d="M37 14 L37 16 L35 16" stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" fill="none" />
      </Comp>
    </svg>
  );
}

export function CrownIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("crown", color || { from: "#FFD900", to: "#CE82FF" }, "#FFD900", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill} fillOpacity="0.35" stroke={fill} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
        <polygon points="10,32 14,14 20,26 24,10 28,26 34,14 38,32" />
        <rect x="10" y="32" width="28" height="5" rx="2" />
      </Comp>
      <Comp fill="#FF4B4B">
        <circle cx="14" cy="14" r="2" />
      </Comp>
      <Comp fill="#1CB0F6">
        <circle cx="24" cy="10" r="2.5" />
      </Comp>
      <Comp fill="#58CC02">
        <circle cx="34" cy="14" r="2" />
      </Comp>
    </svg>
  );
}

export function HeartIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("heart", color || { from: "#FF4B4B", to: "#FF86D0" }, "#FF4B4B", "#FF86D0");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <Comp fill={fill} fillOpacity="0.2">
        <path d="M24 42 C24 42 6 30 6 18 C6 12 10 8 15 8 C19 8 22 10 24 13 C26 10 29 8 33 8 C38 8 42 12 42 18 C42 30 24 42 24 42 Z" />
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.9">
        <path d="M24 40 C24 40 8 28 8 17 C8 12 11 9 15 9 C18 9 21 11 24 14 C27 11 30 9 33 9 C37 9 40 12 40 17 C40 28 24 40 24 40 Z" />
      </Comp>
      <ellipse cx="17" cy="16" rx="2.5" ry="3" fill="#fff" opacity="0.5" />
    </svg>
  );
}

export function ZapIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("zap", color || { from: "#FFD900", to: "#FF9600" }, "#FFD900", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.85">
        <polygon points="26,6 12,26 22,26 20,42 36,20 26,20" />
      </Comp>
    </svg>
  );
}

export function FlameIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("flame", color || { from: "#FF9600", to: "#FF4B4B" }, "#FF9600", "#FF4B4B");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill} fillOpacity="0.85">
        <path d="M24 6 C24 14 16 18 16 26 C16 32 19 40 24 40 C29 40 32 32 32 26 C32 22 30 18 28 14 C30 18 32 12 30 8 C28 6 26 8 24 10 C24 8 24 6 24 6 Z" />
      </Comp>
      <path d="M24 18 C22 22 20 24 20 28 C20 32 22 34 24 34 C26 34 28 32 28 28 C28 26 27 24 26 22" fill="#FFD900" opacity="0.7" />
      <path d="M24 24 C23 26 22 27 22 29 C22 31 23 32 24 32" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export function GiftIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("gift", color || { from: "#FF86D0", to: "#CE82FF" }, "#FF86D0", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.3">
        <rect x="8" y="20" width="32" height="22" rx="3" />
        <rect x="8" y="20" width="32" height="6" fill={fill} fillOpacity="0.5" />
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" fill="none">
        <path d="M24 20 L24 42" />
        <path d="M24 20 C18 12 12 16 16 8 C20 10 24 14 24 20 C24 14 28 10 32 8 C36 16 30 12 24 20 Z" fill={fill} fillOpacity="0.7" />
      </Comp>
      <circle cx="16" cy="12" r="2" fill={fill} opacity="0.6" />
      <circle cx="32" cy="12" r="2" fill={fill} opacity="0.6" />
    </svg>
  );
}

export function BookIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("book", color || { from: "#58CC02", to: "#1CB0F6" }, "#58CC02", "#1CB0F6");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.3">
        <path d="M10 10 L24 10 L24 40 L10 40 C10 36 12 32 16 32 C10 32 10 28 10 24 C10 20 12 16 16 16 C12 16 10 14 10 10 Z" />
        <path d="M38 10 L24 10 L24 40 L38 40 C38 36 36 32 32 32 C38 32 38 28 38 24 C38 20 36 16 32 16 C36 16 38 14 38 10 Z" />
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" fill="none" opacity="0.5">
        <line x1="14" y1="16" x2="22" y2="16" />
        <line x1="14" y1="20" x2="22" y2="20" />
        <line x1="26" y1="16" x2="34" y2="16" />
        <line x1="26" y1="20" x2="34" y2="20" />
      </Comp>
    </svg>
  );
}

export function BrainIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("brain", color || { from: "#CE82FF", to: "#FF86D0" }, "#CE82FF", "#FF86D0");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.7">
        <path d="M18 14 C10 14 6 18 6 26 C6 32 10 38 16 38 L18 38 L18 36 C14 34 12 30 12 26 C12 20 14 18 18 18 Z" />
        <path d="M30 14 C38 14 42 18 42 26 C42 32 38 38 32 38 L30 38 L30 36 C34 34 36 30 36 26 C36 20 34 18 30 18 Z" />
        <path d="M18 14 C18 10 20 8 24 8 C28 8 30 10 30 14" fill="none" />
        <path d="M18 38 C18 40 20 42 24 42 C28 42 30 40 30 38" fill="none" />
        <line x1="24" y1="14" x2="24" y2="38" opacity="0.4" />
      </Comp>
    </svg>
  );
}

export function RocketIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("rocket", color || { from: "#1CB0F6", to: "#CE82FF" }, "#1CB0F6", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill} fillOpacity="0.85">
        <path d="M24 6 L30 22 L24 42 L18 22 Z" />
        <circle cx="24" cy="22" r="4" fill="#fff" opacity="0.5" />
      </Comp>
      <Comp fill={fill} fillOpacity="0.6">
        <path d="M18 28 L10 34 L14 26 Z" />
        <path d="M30 28 L38 34 L34 26 Z" />
      </Comp>
      <Comp fill="#FFD900" opacity="0.9">
        <path d="M20 40 L24 50 L28 40 Z" />
      </Comp>
      <Comp fill="#FF4B4B" opacity="0.7">
        <path d="M22 42 L24 48 L26 42 Z" />
      </Comp>
    </svg>
  );
}

export function TargetIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("target", color || { from: "#FF4B4B", to: "#FF9600" }, "#FF4B4B", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth}>
        <circle cx="24" cy="26" r="15" fill={fill} fillOpacity="0.2" />
        <circle cx="24" cy="26" r="10" fill={fill} fillOpacity="0.4" />
        <circle cx="24" cy="26" r="5" fill={fill} fillOpacity="0.7" />
      </Comp>
      <path d="M10 10 L18 18" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 14 L14 14 L14 8" stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function StarIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("star", color || { from: "#FFD900", to: "#FF9600" }, "#FFD900", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill} fillOpacity="0.85" stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinejoin="round">
        <polygon points="24,8 29,19 41,20 32,28 35,40 24,34 13,40 16,28 7,20 19,19" />
      </Comp>
      <circle cx="20" cy="18" r="2" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export function CalendarIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("cal", color || { from: "#1CB0F6", to: "#58CC02" }, "#1CB0F6", "#58CC02");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.25">
        <rect x="10" y="14" width="28" height="26" rx="4" />
        <path d="M10 20 L38 20" />
        <path d="M16 10 L16 18" />
        <path d="M32 10 L32 18" />
      </Comp>
      <Comp fill={fill}>
        <rect x="14" y="24" width="5" height="5" rx="1.5" />
        <rect x="22" y="24" width="5" height="5" rx="1.5" opacity="0.6" />
        <rect x="30" y="24" width="5" height="5" rx="1.5" opacity="0.4" />
        <rect x="14" y="32" width="5" height="5" rx="1.5" opacity="0.6" />
        <rect x="22" y="32" width="5" height="5" rx="1.5" opacity="0.4" />
        <rect x="30" y="32" width="5" height="5" rx="1.5" opacity="0.3" />
      </Comp>
    </svg>
  );
}

export function GemIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("gem", color || { from: "#1CB0F6", to: "#CE82FF" }, "#1CB0F6", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinejoin="round" fill={fill} fillOpacity="0.8">
        <polygon points="24,8 36,16 32,36 16,36 12,16" />
      </Comp>
      <Comp stroke="#fff" strokeWidth="1" strokeLinejoin="round" fill="none" opacity="0.6">
        <polyline points="12,16 24,20 36,16" />
        <polyline points="16,36 20,26 16,16" />
        <polyline points="32,36 28,26 32,16" />
        <polyline points="20,26 24,20 28,26" />
        <line x1="24" y1="20" x2="24" y2="36" />
      </Comp>
      <Comp fill="#fff" opacity="0.4">
        <polygon points="18,17 22,17 22,22 18,19" />
      </Comp>
    </svg>
  );
}

export function MedalIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("medal", color || { from: "#FFD900", to: "#FF9600" }, "#FFD900", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" fill="none">
        <path d="M16 8 L12 20 L24 24" fill={fill} fillOpacity="0.3" />
        <path d="M32 8 L36 20 L24 24" fill={fill} fillOpacity="0.3" />
      </Comp>
      <Comp fill={fill} fillOpacity="0.85" stroke={fill} strokeWidth={strokeWidth}>
        <circle cx="24" cy="32" r="12" />
        <circle cx="24" cy="32" r="8" fill={fill} fillOpacity="0.4" />
      </Comp>
      <Comp fill="#8B6914">
        <text x="24" y="36" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="Nunito, sans-serif">1</text>
      </Comp>
    </svg>
  );
}

export function CheckIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("check", color || { from: "#58CC02", to: "#1CB0F6" }, "#58CC02", "#1CB0F6");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <circle cx="24" cy="24" r="16" fill={fill} fillOpacity="0.2" />
      <circle cx="24" cy="24" r="16" fill={fill} fillOpacity="0.85" />
      <path d="M15 25 L21 31 L33 17" stroke="#fff" strokeWidth={strokeWidth + 1} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 25 L21 30" stroke="#fff" strokeWidth={strokeWidth - 0.5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
    </svg>
  );
}

export function XIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("xicon", color || { from: "#FF4B4B", to: "#FF86D0" }, "#FF4B4B", "#FF86D0");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <circle cx="24" cy="24" r="16" fill={fill} fillOpacity="0.2" />
      <circle cx="24" cy="24" r="16" fill={fill} fillOpacity="0.85" />
      <path d="M17 17 L31 31" stroke="#fff" strokeWidth={strokeWidth + 1} strokeLinecap="round" />
      <path d="M31 17 L17 31" stroke="#fff" strokeWidth={strokeWidth + 1} strokeLinecap="round" />
    </svg>
  );
}

export function HandClickIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("hand", color || { from: "#1CB0F6", to: "#CE82FF" }, "#1CB0F6", "#CE82FF");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <g stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.85">
        <path d="M30 14 L30 28" />
        <path d="M22 10 C22 10 18 10 18 14 L18 30" />
        <path d="M14 16 C14 16 10 16 10 20 L10 32 C10 36 12 40 16 40 L28 40 C32 38 36 34 36 30 L36 16 C36 14 34 12 32 12" />
        <path d="M26 12 C26 10 24 10 24 12 L24 28" />
      </g>
      <circle cx="38" cy="10" r="4" fill={fill} opacity="0.5" />
      <path d="M35 7 L41 13 M41 7 L35 13" stroke="#fff" strokeWidth={strokeWidth - 0.5} strokeLinecap="round" />
    </svg>
  );
}

export function PartyIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("party", color || { from: "#FF86D0", to: "#CE82FF" }, "#FF86D0", "#CE82FF");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp fill={fill} fillOpacity="0.85">
        <polygon points="24,8 14,30 34,30" />
        <polygon points="16,30 14,38 34,38 32,30" fill={fill} fillOpacity="0.6" />
      </Comp>
      <Comp fill="#FFD900" opacity="0.9">
        <circle cx="20" cy="18" r="1.5" />
        <circle cx="28" cy="20" r="2" />
        <circle cx="24" cy="25" r="1.5" />
        <circle cx="18" cy="24" r="1" />
        <circle cx="30" cy="26" r="1" />
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" fill="none">
        <path d="M10 10 C12 12 10 16 12 18" />
        <path d="M38 10 C36 12 38 16 36 18" />
        <path d="M24 4 C25 7 23 10 24 12" />
      </Comp>
      <Comp fill="#FFD900" opacity="0.8">
        <path d="M10 10 L12 14 L10 12 L14 10 Z" />
        <path d="M38 8 L36 12 L38 10 L34 8 Z" />
      </Comp>
    </svg>
  );
}

export function CoffeeIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("coffee", color || { from: "#FF9600", to: "#8B6914" }, "#FF9600", "#8B6914");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 20 L14 36 C14 40 20 42 24 42 C28 42 34 40 34 36 L34 20 Z" fill={fill} fillOpacity="0.4" />
        <path d="M34 24 L40 24 L40 32 C40 36 34 38 34 34" fill={fill} fillOpacity="0.3" />
      </Comp>
      <Comp stroke={fill} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" fill="none" opacity="0.7">
        <path d="M18 14 C18 10 22 10 22 14 C22 12 20 12 20 10" />
        <path d="M26 14 C26 10 30 10 30 14 C30 12 28 12 28 10" />
      </Comp>
    </svg>
  );
}

export function DiceIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("dice", color || { from: "#CE82FF", to: "#58CC02" }, "#CE82FF", "#58CC02");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.25">
        <polygon points="10,16 24,10 38,16 38,34 24,40 10,34" />
        <polygon points="10,16 24,22 38,16" fill={fill} fillOpacity="0.4" />
      </Comp>
      <Comp fill={fill}>
        <circle cx="16" cy="18" r="2" />
        <circle cx="24" cy="14" r="2" />
        <circle cx="32" cy="18" r="2" />
        <circle cx="20" cy="28" r="2" />
        <circle cx="28" cy="28" r="2" />
        <circle cx="24" cy="34" r="2" />
        <circle cx="18" cy="34" r="1.5" />
        <circle cx="30" cy="34" r="1.5" />
      </Comp>
    </svg>
  );
}

export function GamepadIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("gamepad", color || { from: "#1CB0F6", to: "#FF4B4B" }, "#1CB0F6", "#FF4B4B");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.25">
        <path d="M10 24 C10 18 16 14 24 14 C32 14 38 18 38 24 L38 30 C38 36 32 38 24 38 C16 38 10 36 10 30 Z" />
      </Comp>
      <Comp fill={fill} fillOpacity="0.85">
        <circle cx="18" cy="26" r="2" />
        <circle cx="14" cy="26" r="2" />
        <circle cx="16" cy="24" r="2" />
        <circle cx="16" cy="28" r="2" />
        <circle cx="32" cy="24" r="2" />
        <circle cx="36" cy="26" r="2" />
        <circle cx="34" cy="28" r="2" />
        <rect x="22" y="30" width="4" height="3" rx="1" opacity="0.6" />
      </Comp>
    </svg>
  );
}

export function LightbulbIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("bulb", color || { from: "#FFD900", to: "#FF9600" }, "#FFD900", "#FF9600");
  const Comp = animated ? motion.g : "g";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <rect x="4" y="4" width="40" height="40" rx="10" fill={fill} opacity="0.15" />
      <Comp stroke={fill} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={fill} fillOpacity="0.85">
        <path d="M24 8 C16 8 12 14 12 20 C12 26 16 28 18 32 L18 36 L30 36 L30 32 C32 28 36 26 36 20 C36 14 32 8 24 8 Z" />
      </Comp>
      <Comp fill={fill} fillOpacity="0.6">
        <rect x="16" y="36" width="16" height="2" rx="1" />
        <rect x="18" y="39" width="12" height="2" rx="1" />
        <rect x="20" y="42" width="8" height="2" rx="1" />
      </Comp>
      <path d="M22 14 C22 16 26 16 26 18" stroke="#fff" strokeWidth={strokeWidth - 0.5} strokeLinecap="round" fill="none" opacity="0.6" />
      <circle cx="22" cy="22" r="1.5" fill="#fff" opacity="0.7" />
    </svg>
  );
}

export function PlayIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("play", color || { from: "#58CC02", to: "#1CB0F6" }, "#58CC02", "#1CB0F6");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <circle cx="24" cy="24" r="18" fill={fill} fillOpacity="0.2" />
      <circle cx="24" cy="24" r="18" fill={fill} fillOpacity="0.9" />
      <polygon points="20,16 36,24 20,32" fill="#fff" />
      <polygon points="20,16 28,22 20,24" fill="#fff" opacity="0.3" />
    </svg>
  );
}

export function SmileIcon({ size = 24, color, strokeWidth = 2, animated = false, ...props }: SvgIconProps) {
  const { fill, defs } = useColor("smile", color || { from: "#FFD900", to: "#FF9600" }, "#FFD900", "#FF9600");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      {defs}
      <circle cx="24" cy="24" r="16" fill={fill} fillOpacity="0.3" />
      <circle cx="24" cy="24" r="16" fill={fill} fillOpacity="0.85" />
      <circle cx="18" cy="20" r="2" fill="#8B6914" />
      <circle cx="30" cy="20" r="2" fill="#8B6914" />
      <path d="M16 28 C18 34 30 34 32 28" stroke="#8B6914" strokeWidth={strokeWidth + 0.5} strokeLinecap="round" fill="none" />
    </svg>
  );
}

export const EMOJI_TO_CUSTOM: Record<string, React.FC<SvgIconProps>> = {
  "🔢": NumbersIcon,
  "📊": ChartIcon,
  "📈": StatIcon,
  "⚖️": ScaleIcon,
  "📐": TriangleIcon,
  "📏": RulerIcon,
  "💰": CoinIcon,
  "🔗": LinkIcon,
  "📖": BookIcon,
  "📚": BookIcon,
  "🎓": TrophyIcon,
  "🔤": AlgebraIcon,
  "🧭": TargetIcon,
  "💯": TargetIcon,
  "⭐": StarIcon,
  "🌟": SparklesIcon,
  "💫": SparklesIcon,
  "✨": SparklesIcon,
  "🎯": TargetIcon,
  "🏆": TrophyIcon,
  "🥇": MedalIcon,
  "🏅": MedalIcon,
  "👑": CrownIcon,
  "💎": GemIcon,
  "🔥": FlameIcon,
  "⚡": ZapIcon,
  "❤️": HeartIcon,
  "💪": BrainIcon,
  "🎉": PartyIcon,
  "🎊": PartyIcon,
  "🎁": GiftIcon,
  "👆": HandClickIcon,
  "🚀": RocketIcon,
  "🎮": GamepadIcon,
  "💡": LightbulbIcon,
  "🎲": DiceIcon,
  "👍": CheckIcon,
  "☕": CoffeeIcon,
  "✅": CheckIcon,
  "❌": XIcon,
  "🧠": BrainIcon,
  "⏱️": CalendarIcon,
  "📍": TargetIcon,
  "🪙": CoinIcon,
  "📝": FormulaIcon,
  "✍️": FormulaIcon,
  "😊": SmileIcon,
  "😉": SmileIcon,
};

export function renderCustomIcon(name: string, size?: number, className?: string, animated?: boolean) {
  const IconComp = EMOJI_TO_CUSTOM[name] || SparklesIcon;
  return <IconComp size={size} className={className} animated={animated} />;
}
