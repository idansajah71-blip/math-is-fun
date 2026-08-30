"use client";

import type { FormulaVisual as VisualType } from "@/lib/types";

interface Props {
  visual: VisualType;
  values: Record<string, number>;
}

export default function FormulaVisual({ visual, values }: Props) {
  const v = values;

  switch (visual) {
    case "right-triangle":
      return <RightTriangle a={v.a ?? 3} b={v.b ?? 4} />;
    case "triangle":
      return <Triangle alas={v.alas ?? 10} tinggi={v.tinggi ?? 8} />;
    case "rectangle":
      return <Rectangle p={v.p ?? 12} l={v.l ?? 5} />;
    case "square":
      return <Square s={v.s ?? 7} />;
    case "trapezoid":
      return <Trapezoid a={v.a ?? 8} b={v.b ?? 12} t={v.t ?? 6} />;
    case "rhombus":
      return <Rhombus d1={v.d_1 ?? 10} d2={v.d_2 ?? 8} />;
    case "circle":
      return <Circle r={v.r ?? 7} />;
    case "sector":
      return <Sector r={v.r ?? 14} theta={v.theta ?? 90} />;
    case "angle":
      return <Angle theta={v.theta ?? 90} />;
    case "exponent":
      return <Exponent a={v.a ?? 2} m={v.m ?? 3} n={v.n ?? 4} />;
    case "cylinder":
      return <Cylinder r={v.r ?? 5} t={v.t ?? 10} />;
    case "cone":
      return <Cone r={v.r ?? 5} t={v.t ?? 12} />;
    case "sphere":
      return <Sphere r={v.r ?? 7} />;
    case "pyramid":
      return <Pyramid s={v.s ?? 6} t={v.t ?? 10} />;
    case "prism":
      return <Prism p={v.p ?? 8} l={v.l ?? 5} t={v.t ?? 10} />;
    case "parallelogram":
      return <Parallelogram a={v.a ?? 10} t={v.t ?? 6} />;
    case "number-line":
      return <NumberLine min={v.min ?? -5} max={v.max ?? 5} value={v.value ?? 2} />;
    case "pie-chart":
      return <PieChart a={v.a ?? 3} b={v.b ?? 1} />;
    case "venn":
      return <Venn a={v.a ?? 5} b={v.b ?? 3} ab={v.ab ?? 2} total={v.total ?? 10} />;
    case "vector-2d":
      return <Vector2D x={v.x ?? 3} y={v.y ?? 4} />;
    case "unit-circle":
      return <UnitCircle angle={v.angle ?? 45} />;
    case "function-graph":
      return <FunctionGraph type={v.type ?? 1} a={v.a ?? 1} b={v.b ?? 0} c={v.c ?? 0} />;
    case "coordinate-plane":
      return <CoordinatePlane x1={v.x1 ?? 1} y1={v.y1 ?? 2} x2={v.x2 ?? 4} y2={v.y2 ?? 5} />;
    case "matrix-grid":
      return <MatrixGrid values={[v.a ?? 1, v.b ?? 0, v.c ?? 0, v.d ?? 1]} />;
    case "sequence":
      return <Sequence a={v.a ?? 1} b={v.b ?? 2} n={v.n ?? 5} />;
    case "curve":
      return <Curve type={v.type ?? 1} />;
    case "area-under-curve":
      return <AreaUnderCurve a={v.a ?? 0} b={v.b ?? 3} />;
    case "histogram":
      return <Histogram a={v.a ?? 3} b={v.b ?? 7} c={v.c ?? 5} d={v.d ?? 8} />;
    case "normal-curve":
      return <NormalCurve mu={v.mu ?? 0} sigma={v.sigma ?? 1} />;
    case "gradient-3d":
      return <Gradient3D />;
    case "cube-3d":
      return <Cube3D s={v.s ?? 5} />;
    case "box-3d":
      return <Box3D p={v.p ?? 8} l={v.l ?? 5} t={v.t ?? 6} />;
    case "transformation":
      return <Transformation k={v.k ?? 2} />;
    case "tree-diagram":
      return <TreeDiagram />;
    default:
      return null;
  }
}

/* ── SVG Helpers ── */

function SvgRoot({ children, w = 160, h = 140 }: { children: React.ReactNode; w?: number; h?: number }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full max-w-[180px] max-h-[160px]" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Label({ x, y, text, anchor = "middle", size = 10 }: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end"; size?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="fill-[var(--fg-muted)]" style={{ fontSize: `${size}px`, fontWeight: 700 }}>
      {text}
    </text>
  );
}

/* ── Shapes (Original) ── */

function RightTriangle({ a, b }: { a: number; b: number }) {
  const w = 140, h = 120, pad = 25;
  const ax = pad, ay = h - pad;
  const bx = w - pad, by = h - pad;
  const cx = pad, cy = pad;
  return (
    <SvgRoot w={w} h={h}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <line x1={ax} y1={ay} x2={ax} y2={ay - 15} stroke="var(--primary)" strokeWidth="1" strokeDasharray="3,2" />
      <line x1={ax} y1={ay - 15} x2={ax + 15} y2={ay - 15} stroke="var(--primary)" strokeWidth="1" strokeDasharray="3,2" />
      <line x1={ax + 15} y1={ay - 15} x2={ax + 15} y2={ay} stroke="var(--primary)" strokeWidth="1" strokeDasharray="3,2" />
      <Label x={(ax + bx) / 2} y={ay + 15} text={`a = ${a}`} />
      <Label x={ax - 10} y={(ay + cy) / 2} text={`b = ${b}`} />
      <Label x={(bx + cx) / 2 + 10} y={(by + cy) / 2} text="c" />
    </SvgRoot>
  );
}

function Triangle({ alas, tinggi }: { alas: number; tinggi: number }) {
  const w = 140, h = 120, pad = 20;
  const bl = pad + 10, br = w - pad - 10, by = h - pad;
  const tx = (bl + br) / 2, ty = pad + 10;
  return (
    <SvgRoot w={w} h={h}>
      <polygon points={`${bl},${by} ${br},${by} ${tx},${ty}`} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <line x1={tx} y1={ty} x2={tx} y2={by} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <Label x={(bl + br) / 2} y={by + 15} text={`alas = ${alas}`} />
      <Label x={tx + 12} y={(ty + by) / 2} text={`t = ${tinggi}`} />
    </SvgRoot>
  );
}

function Rectangle({ p, l }: { p: number; l: number }) {
  const w = 140, h = 100, pad = 20;
  const rw = w - pad * 2, rh = h - pad * 2;
  return (
    <SvgRoot w={w} h={h}>
      <rect x={pad} y={pad} width={rw} height={rh} fill="none" stroke="var(--primary)" strokeWidth="2" rx="2" />
      <Label x={w / 2} y={h - 5} text={`p = ${p}`} />
      <Label x={w - 5} y={h / 2 + 4} text={`l = ${l}`} anchor="end" />
    </SvgRoot>
  );
}

function Square({ s }: { s: number }) {
  const w = 120, h = 120, pad = 20;
  const side = w - pad * 2;
  return (
    <SvgRoot w={w} h={h}>
      <rect x={pad} y={pad} width={side} height={side} fill="none" stroke="var(--primary)" strokeWidth="2" rx="2" />
      <Label x={w / 2} y={h - 5} text={`s = ${s}`} />
    </SvgRoot>
  );
}

function Trapezoid({ a, b, t }: { a: number; b: number; t: number }) {
  const w = 140, h = 110, pad = 20;
  const mid = w / 2;
  const topW = (a / Math.max(a, b)) * (w - pad * 2) * 0.6;
  const botW = (b / Math.max(a, b)) * (w - pad * 2);
  const y1 = pad + 10, y2 = h - pad - 5;
  return (
    <SvgRoot w={w} h={h}>
      <polygon
        points={`${mid - topW / 2},${y1} ${mid + topW / 2},${y1} ${mid + botW / 2},${y2} ${mid - botW / 2},${y2}`}
        fill="none" stroke="var(--primary)" strokeWidth="2"
      />
      <line x1={mid - botW / 2} y1={y2} x2={mid - botW / 2} y2={y1} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <Label x={mid} y={y1 - 5} text={`a = ${a}`} />
      <Label x={mid} y={y2 + 14} text={`b = ${b}`} />
      <Label x={mid - botW / 2 - 10} y={(y1 + y2) / 2 + 4} text={`t = ${t}`} anchor="end" />
    </SvgRoot>
  );
}

function Rhombus({ d1, d2 }: { d1: number; d2: number }) {
  const w = 140, h = 120, cx = 70, cy = 60;
  const hw = d1 / 2, hh = d2 / 2;
  const scale = Math.min(50 / hw, 50 / hh);
  const px = hw * scale, py = hh * scale;
  return (
    <SvgRoot w={w} h={h}>
      <polygon points={`${cx},${cy - py} ${cx + px},${cy} ${cx},${cy + py} ${cx - px},${cy}`} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx - px} y1={cy} x2={cx + px} y2={cy} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <line x1={cx} y1={cy - py} x2={cx} y2={cy + py} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <Label x={cx} y={cy + py + 15} text={`d₂ = ${d2}`} />
      <Label x={cx + px + 8} y={cy - 5} text={`d₁ = ${d1}`} />
    </SvgRoot>
  );
}

function Circle({ r }: { r: number }) {
  const w = 140, h = 140, cx = 70, cy = 70, cr = 45;
  return (
    <SvgRoot w={w} h={h}>
      <circle cx={cx} cy={cy} r={cr} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx} y1={cy} x2={cx + cr} y2={cy} stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="2.5" fill="var(--primary)" />
      <Label x={cx + cr / 2} y={cy - 8} text={`r = ${r}`} />
    </SvgRoot>
  );
}

function Sector({ r, theta }: { r: number; theta: number }) {
  const w = 160, h = 140, cx = 80, cy = 75, cr = 50;
  const rad = (theta * Math.PI) / 180;
  const ex = cx + cr * Math.cos(-rad / 2);
  const ey = cy + cr * Math.sin(-rad / 2);
  const sx = cx + cr * Math.cos(rad / 2);
  const sy = cy + cr * Math.sin(rad / 2);
  const large = theta > 180 ? 1 : 0;
  const midX = cx + cr * 0.6 * Math.cos(0);
  const midY = cy + cr * 0.6 * Math.sin(0);
  return (
    <SvgRoot w={w} h={h}>
      <path d={`M${cx},${cy} L${sx},${sy} A${cr},${cr} 0 ${large} 0 ${ex},${ey} Z`} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="2.5" fill="var(--primary)" />
      <Label x={midX} y={midY} text={`${theta}°`} />
      <Label x={cx + cr / 2 + 5} y={cy - 5} text={`r = ${r}`} />
    </SvgRoot>
  );
}

function Angle({ theta }: { theta: number }) {
  const w = 140, h = 100, cx = 30, cy = 75, len = 80;
  const rad = (theta * Math.PI) / 180;
  const ex = cx + len, ey = cy;
  const tx = cx + len * Math.cos(rad), ty = cy - len * Math.sin(rad);
  const arcR = 25;
  const arcEx = cx + arcR, arcEy = cy;
  const arcTx = cx + arcR * Math.cos(rad), arcTy = cy - arcR * Math.sin(rad);
  const large = theta > 180 ? 1 : 0;
  return (
    <SvgRoot w={w} h={h}>
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="var(--primary)" strokeWidth="2" />
      <path d={`M${arcEx},${arcEy} A${arcR},${arcR} 0 ${large} 0 ${arcTx},${arcTy}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <Label x={cx + 35} y={cy - 15} text={`${theta}°`} />
    </SvgRoot>
  );
}

function Exponent({ a, m, n }: { a: number; m: number; n: number }) {
  const w = 160, h = 80;
  return (
    <SvgRoot w={w} h={h}>
      <text x="10" y="35" className="fill-[var(--fg)]" style={{ fontSize: "14px", fontWeight: 700 }}>
        {a}^{m} × {a}^{n} = {a}^{m + n}
      </text>
      <text x="10" y="55" className="fill-[var(--fg-muted)]" style={{ fontSize: "11px" }}>
        = {Math.pow(a, m)} × {Math.pow(a, n)} = {Math.pow(a, m + n)}
      </text>
    </SvgRoot>
  );
}

function Cylinder({ r, t }: { r: number; t: number }) {
  const w = 140, h = 140, cx = 70, ry = 15, topY = 25, botY = 115;
  return (
    <SvgRoot w={w} h={h}>
      <ellipse cx={cx} cy={topY} rx={35} ry={ry} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={cx - 35} y1={topY} x2={cx - 35} y2={botY} stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx + 35} y1={topY} x2={cx + 35} y2={botY} stroke="var(--primary)" strokeWidth="2" />
      <path d={`M${cx - 35},${botY} A35,${ry} 0 0 0 ${cx + 35},${botY}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <path d={`M${cx - 35},${botY} A35,${ry} 0 0 1 ${cx + 35},${botY}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4,3" />
      <Label x={cx} y={topY - 5} text={`r = ${r}`} />
      <Label x={cx + 42} y={(topY + botY) / 2 + 4} text={`t = ${t}`} />
    </SvgRoot>
  );
}

function Cone({ r, t }: { r: number; t: number }) {
  const w = 140, h = 140, cx = 70, tipY = 20, botY = 115, ry = 15;
  return (
    <SvgRoot w={w} h={h}>
      <line x1={cx} y1={tipY} x2={cx - 35} y2={botY} stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx} y1={tipY} x2={cx + 35} y2={botY} stroke="var(--primary)" strokeWidth="2" />
      <path d={`M${cx - 35},${botY} A35,${ry} 0 0 0 ${cx + 35},${botY}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <path d={`M${cx - 35},${botY} A35,${ry} 0 0 1 ${cx + 35},${botY}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4,3" />
      <circle cx={cx} cy={tipY} r="2.5" fill="var(--primary)" />
      <Label x={cx} y={tipY - 5} text="titik" />
      <Label x={cx} y={botY + 15} text={`r = ${r}`} />
      <Label x={cx + 42} y={(tipY + botY) / 2} text={`t = ${t}`} />
    </SvgRoot>
  );
}

function Sphere({ r }: { r: number }) {
  const w = 140, h = 140, cx = 70, cy = 70, cr = 45;
  return (
    <SvgRoot w={w} h={h}>
      <circle cx={cx} cy={cy} r={cr} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <ellipse cx={cx} cy={cy} rx={cr} ry={cr * 0.3} fill="none" stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <line x1={cx} y1={cy} x2={cx + cr} y2={cy} stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="2.5" fill="var(--primary)" />
      <Label x={cx + cr / 2} y={cy - 8} text={`r = ${r}`} />
    </SvgRoot>
  );
}

function Pyramid({ s, t }: { s: number; t: number }) {
  const w = 140, h = 140, tipY = 15, botY = 115;
  return (
    <SvgRoot w={w} h={h}>
      <polygon points={`${w / 2},${tipY} ${25},${botY} ${w - 25},${botY}`} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <line x1={w / 2} y1={tipY} x2={w / 2} y2={botY} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <polygon points={`${25},${botY} ${55},${botY - 20} ${w - 25},${botY} ${w - 55},${botY - 20}`} fill="none" stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <Label x={w / 2} y={tipY - 5} text="t" />
      <Label x={w / 2} y={botY + 14} text={`s = ${s}`} />
      <Label x={w / 2 + 8} y={(tipY + botY) / 2} text={`t = ${t}`} />
    </SvgRoot>
  );
}

function Prism({ p, l, t }: { p: number; l: number; t: number }) {
  const w = 140, h = 130;
  return (
    <SvgRoot w={w} h={h}>
      <polygon points="25,95 55,95 40,65" fill="none" stroke="var(--primary)" strokeWidth="2" />
      <polygon points="85,95 115,95 100,65" fill="none" stroke="var(--primary)" strokeWidth="2" />
      <line x1={25} y1={95} x2={85} y2={95} stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={55} y1={95} x2={115} y2={95} stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={40} y1={65} x2={100} y2={65} stroke="var(--primary)" strokeWidth="1.5" />
      <Label x={55} y={108} text={`p = ${p}`} />
      <Label x={110} y={80} text={`l = ${l}`} />
      <Label x={70} y={55} text={`t = ${t}`} />
    </SvgRoot>
  );
}

function Parallelogram({ a, t }: { a: number; t: number }) {
  const w = 150, h = 100, pad = 20;
  const rw = w - pad * 2 - 25, rh = h - pad * 2;
  return (
    <SvgRoot w={w} h={h}>
      <polygon
        points={`${pad + 25},${pad} ${pad + 25 + rw},${pad} ${pad + rw},${pad + rh} ${pad},${pad + rh}`}
        fill="none" stroke="var(--primary)" strokeWidth="2"
      />
      <line x1={pad + 25} y1={pad} x2={pad + 25} y2={pad + rh} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4,3" />
      <Label x={w / 2} y={h - 5} text={`a = ${a}`} />
      <Label x={pad + 18} y={(pad + pad + rh) / 2 + 4} text={`t = ${t}`} anchor="end" />
    </SvgRoot>
  );
}

/* ── New Visual Components ── */

function NumberLine({ min, max, value }: { min: number; max: number; value: number }) {
  const w = 200, h = 60, pad = 20;
  const lineY = 30;
  const lineLen = w - pad * 2;
  const range = max - min || 1;
  const valX = pad + ((value - min) / range) * lineLen;
  const ticks: { x: number; label: string }[] = [];
  for (let i = min; i <= max; i++) {
    ticks.push({ x: pad + ((i - min) / range) * lineLen, label: String(i) });
  }
  return (
    <SvgRoot w={w} h={h}>
      <line x1={pad} y1={lineY} x2={w - pad} y2={lineY} stroke="var(--fg-muted)" strokeWidth="2" />
      <polygon points={`${w - pad},${lineY} ${w - pad - 6},${lineY - 4} ${w - pad - 6},${lineY + 4}`} fill="var(--fg-muted)" />
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={t.x} y1={lineY - 5} x2={t.x} y2={lineY + 5} stroke="var(--fg-muted)" strokeWidth="1.5" />
          <Label x={t.x} y={lineY + 18} text={t.label} size={9} />
        </g>
      ))}
      <circle cx={valX} cy={lineY} r="5" fill="var(--primary)" />
      <Label x={valX} y={lineY - 12} text={`${value}`} size={10} />
    </SvgRoot>
  );
}

function PieChart({ a, b }: { a: number; b: number }) {
  const w = 140, h = 140, cx = 70, cy = 70, cr = 50;
  const total = a + b || 1;
  const colors = ["var(--primary)", "var(--accent)"];
  const slices = [a, b];
  let cumAngle = -Math.PI / 2;
  const paths = slices.map((val, i) => {
    const angle = (val / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const x1 = cx + cr * Math.cos(startAngle);
    const y1 = cy + cr * Math.sin(startAngle);
    const x2 = cx + cr * Math.cos(endAngle);
    const y2 = cy + cr * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const midAngle = startAngle + angle / 2;
    const labelR = cr * 0.65;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);
    const pct = Math.round((val / total) * 100);
    return { d: `M${cx},${cy} L${x1},${y1} A${cr},${cr} 0 ${large} 1 ${x2},${y2} Z`, color: colors[i], lx, ly, pct };
  });
  return (
    <SvgRoot w={w} h={h}>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill={p.color} opacity="0.8" stroke="var(--bg)" strokeWidth="1.5" />
          <Label x={p.lx} y={p.ly + 3} text={`${p.pct}%`} size={9} />
        </g>
      ))}
    </SvgRoot>
  );
}

function Venn({ a, b, ab, total }: { a: number; b: number; ab: number; total: number }) {
  const w = 160, h = 100, cy = 50, r = 35;
  const cx1 = 60, cx2 = 100;
  const onlyA = a - ab;
  const onlyB = b - ab;
  return (
    <SvgRoot w={w} h={h}>
      <circle cx={cx1} cy={cy} r={r} fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx={cx2} cy={cy} r={r} fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="1.5" />
      <Label x={cx1 - 15} y={cy + 3} text={`A\\n${onlyA}`} size={9} />
      <Label x={(cx1 + cx2) / 2} y={cy + 3} text={`${ab}`} size={9} />
      <Label x={cx2 + 15} y={cy + 3} text={`B\\n${onlyB}`} size={9} />
      <Label x={w / 2} y={h - 5} text={`U = ${total}`} size={8} />
    </SvgRoot>
  );
}

function Vector2D({ x, y }: { x: number; y: number }) {
  const w = 160, h = 160, ox = 80, oy = 80;
  const scale = 15;
  const vx = x * scale, vy = y * scale;
  const tipX = ox + vx, tipY = oy - vy;
  const arrowLen = 8;
  const angle = Math.atan2(-vy, vx);
  const a1x = tipX - arrowLen * Math.cos(angle - 0.4);
  const a1y = tipY - arrowLen * Math.sin(angle - 0.4);
  const a2x = tipX - arrowLen * Math.cos(angle + 0.4);
  const a2y = tipY - arrowLen * Math.sin(angle + 0.4);
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="var(--fg-muted)" strokeWidth="1" />
      <line x1={ox} y1={10} x2={ox} y2={h - 10} stroke="var(--fg-muted)" strokeWidth="1" />
      <polygon points={`${w - 10},${oy} ${w - 16},${oy - 3} ${w - 16},${oy + 3}`} fill="var(--fg-muted)" />
      <polygon points={`${ox},${10} ${ox - 3},${16} ${ox + 3},${16}`} fill="var(--fg-muted)" />
      <line x1={ox} y1={oy} x2={tipX} y2={tipY} stroke="var(--primary)" strokeWidth="2.5" />
      <polygon points={`${tipX},${tipY} ${a1x},${a1y} ${a2x},${a2y}`} fill="var(--primary)" />
      <Label x={tipX + 8} y={tipY - 5} text={`(${x},${y})`} size={9} />
      <Label x={w - 5} y={oy + 14} text="x" size={8} />
      <Label x={ox - 10} y={14} text="y" size={8} />
    </SvgRoot>
  );
}

function UnitCircle({ angle }: { angle: number }) {
  const w = 160, h = 160, cx = 80, cy = 80, r = 55;
  const rad = (angle * Math.PI) / 180;
  const px = cx + r * Math.cos(rad);
  const py = cy - r * Math.sin(rad);
  const cosX = cx + r * Math.cos(rad);
  const sinY = cy - r * Math.sin(rad);
  const arcR = 20;
  const arcEndX = cx + arcR * Math.cos(rad);
  const arcEndY = cy - arcR * Math.sin(rad);
  const large = angle > 180 ? 1 : 0;
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={cy} x2={w - 10} y2={cy} stroke="var(--fg-muted)" strokeWidth="1" />
      <line x1={cx} y1={10} x2={cx} y2={h - 10} stroke="var(--fg-muted)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx} y1={cy} x2={cosX} y2={cy} stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,2" />
      <line x1={cosX} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
      <circle cx={px} cy={py} r="3" fill="var(--primary)" />
      <path d={`M${cx + arcR},${cy} A${arcR},${arcR} 0 ${large} 0 ${arcEndX},${arcEndY}`} fill="none" stroke="var(--primary)" strokeWidth="1" />
      <Label x={cx + arcR + 10} y={cy - 8} text={`${angle}°`} size={8} />
      <Label x={(cx + cosX) / 2} y={cy + 12} text="cos" size={8} />
      <Label x={px + 6} y={(cy + py) / 2} text="sin" size={8} />
    </SvgRoot>
  );
}

function FunctionGraph({ type, a, b, c }: { type: number; a: number; b: number; c: number }) {
  const w = 180, h = 140, ox = 90, oy = 70;
  const scaleX = 18, scaleY = 18;
  const points: string[] = [];
  for (let px = -4; px <= 4; px += 0.2) {
    let py: number;
    if (type === 1) {
      py = a * px + b;
    } else if (type === 2) {
      py = a * px * px + b * px + c;
    } else {
      py = a / (px || 0.01) + b;
    }
    const sx = ox + px * scaleX;
    const sy = oy - py * scaleY;
    if (sy > 5 && sy < h - 5) {
      points.push(`${sx},${sy}`);
    }
  }
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="var(--fg-muted)" strokeWidth="1" />
      <line x1={ox} y1={10} x2={ox} y2={h - 10} stroke="var(--fg-muted)" strokeWidth="1" />
      <polygon points={`${w - 10},${oy} ${w - 16},${oy - 3} ${w - 16},${oy + 3}`} fill="var(--fg-muted)" />
      <polygon points={`${ox},${10} ${ox - 3},${16} ${ox + 3},${16}`} fill="var(--fg-muted)" />
      {points.length > 1 && (
        <polyline points={points.join(" ")} fill="none" stroke="var(--primary)" strokeWidth="2" />
      )}
      <Label x={w - 5} y={oy + 14} text="x" size={8} />
      <Label x={ox - 10} y={14} text="y" size={8} />
    </SvgRoot>
  );
}

function CoordinatePlane({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const w = 160, h = 160, ox = 80, oy = 80;
  const scale = 18;
  const points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="var(--fg-muted)" strokeWidth="1" />
      <line x1={ox} y1={10} x2={ox} y2={h - 10} stroke="var(--fg-muted)" strokeWidth="1" />
      <polygon points={`${w - 10},${oy} ${w - 16},${oy - 3} ${w - 16},${oy + 3}`} fill="var(--fg-muted)" />
      <polygon points={`${ox},${10} ${ox - 3},${16} ${ox + 3},${16}`} fill="var(--fg-muted)" />
      {points.map((p, i) => {
        const sx = ox + p.x * scale;
        const sy = oy - p.y * scale;
        return (
          <g key={i}>
            <circle cx={sx} cy={sy} r="4" fill="var(--primary)" />
            <Label x={sx + 8} y={sy - 5} text={`(${p.x},${p.y})`} size={8} />
          </g>
        );
      })}
    </SvgRoot>
  );
}

function MatrixGrid({ values }: { values: number[] }) {
  const w = 120, h = 100;
  const cellW = 35, cellH = 30;
  const startX = (w - cellW * 2) / 2, startY = (h - cellH * 2) / 2;
  return (
    <SvgRoot w={w} h={h}>
      <line x1={startX - 5} y1={startY - 5} x2={startX - 5} y2={startY + cellH * 2 + 5} stroke="var(--primary)" strokeWidth="2" />
      <line x1={startX + cellW * 2 + 5} y1={startY - 5} x2={startX + cellW * 2 + 5} y2={startY + cellH * 2 + 5} stroke="var(--primary)" strokeWidth="2" />
      {values.slice(0, 4).map((v, i) => {
        const row = Math.floor(i / 2), col = i % 2;
        const cx = startX + col * cellW + cellW / 2;
        const cy = startY + row * cellH + cellH / 2 + 4;
        return <Label key={i} x={cx} y={cy} text={String(v)} size={12} />;
      })}
    </SvgRoot>
  );
}

function Sequence({ a, b, n }: { a: number; b: number; n: number }) {
  const w = 180, h = 60;
  const count = Math.min(Math.max(Math.floor(n), 1), 8);
  const itemW = Math.min(30, (w - 20) / count);
  const startX = (w - itemW * count) / 2;
  const items: number[] = [];
  for (let i = 0; i < count; i++) items.push(a + i * b);
  return (
    <SvgRoot w={w} h={h}>
      {items.map((val, i) => {
        const x = startX + i * itemW;
        return (
          <g key={i}>
            <rect x={x + 1} y={10} width={itemW - 2} height={30} rx="3" fill="var(--primary)" fillOpacity={0.15 + i * 0.15} stroke="var(--primary)" strokeWidth="1" />
            <Label x={x + itemW / 2} y={30} text={String(val)} size={10} />
            <Label x={x + itemW / 2} y={52} text={`n=${i + 1}`} size={7} />
          </g>
        );
      })}
    </SvgRoot>
  );
}

function Curve({ type }: { type: number }) {
  const w = 180, h = 140, ox = 40, oy = 100;
  const scaleX = 20, scaleY = 15;
  const points: string[] = [];
  for (let px = 0.5; px <= 7; px += 0.1) {
    let py: number;
    if (type === 1) py = Math.log(px);
    else if (type === 2) py = Math.exp(px - 3.5);
    else if (type === 3) py = Math.sin(px);
    else py = 1 / px;
    const sx = ox + px * scaleX;
    const sy = oy - py * scaleY;
    if (sy > 5 && sy < h - 5) points.push(`${sx},${sy}`);
  }
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="var(--fg-muted)" strokeWidth="1" />
      <line x1={ox} y1={10} x2={ox} y2={h - 10} stroke="var(--fg-muted)" strokeWidth="1" />
      {points.length > 1 && (
        <polyline points={points.join(" ")} fill="none" stroke="var(--primary)" strokeWidth="2" />
      )}
    </SvgRoot>
  );
}

function AreaUnderCurve({ a, b }: { a: number; b: number }) {
  const w = 180, h = 140, ox = 30, oy = 110;
  const scaleX = 20, scaleY = 12;
  const curvePoints: string[] = [];
  const areaPoints: string[] = [];
  for (let px = 0.2; px <= 7; px += 0.1) {
    const py = Math.sqrt(px);
    const sx = ox + px * scaleX;
    const sy = oy - py * scaleY;
    if (sy > 5 && sy < h - 5) curvePoints.push(`${sx},${sy}`);
    if (px >= a && px <= b) areaPoints.push(`${sx},${sy}`);
  }
  if (areaPoints.length > 0) {
    const lastB = ox + b * scaleX;
    const firstA = ox + a * scaleX;
    areaPoints.push(`${lastB},${oy}`);
    areaPoints.push(`${firstA},${oy}`);
  }
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="var(--fg-muted)" strokeWidth="1" />
      <line x1={ox} y1={10} x2={ox} y2={h - 10} stroke="var(--fg-muted)" strokeWidth="1" />
      {areaPoints.length > 2 && (
        <polygon points={areaPoints.join(" ")} fill="var(--primary)" fillOpacity="0.2" />
      )}
      {curvePoints.length > 1 && (
        <polyline points={curvePoints.join(" ")} fill="none" stroke="var(--primary)" strokeWidth="2" />
      )}
      <Label x={ox + a * scaleX} y={oy + 14} text={`a=${a}`} size={8} />
      <Label x={ox + b * scaleX} y={oy + 14} text={`b=${b}`} size={8} />
    </SvgRoot>
  );
}

function Histogram({ a, b, c, d }: { a: number; b: number; c: number; d: number }) {
  const w = 180, h = 120, pad = 15;
  const bars = [a, b, c, d];
  const barW = (w - pad * 2) / bars.length - 3;
  const maxVal = Math.max(...bars, 1);
  const barH = h - pad * 2;
  return (
    <SvgRoot w={w} h={h}>
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--fg-muted)" strokeWidth="1.5" />
      {bars.map((val, i) => {
        const bh = (val / maxVal) * barH;
        const x = pad + i * (barW + 3);
        const y = h - pad - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx="2" fill="var(--primary)" fillOpacity={0.6 + i * 0.08} />
            <Label x={x + barW / 2} y={y - 5} text={String(val)} size={8} />
          </g>
        );
      })}
    </SvgRoot>
  );
}

function NormalCurve({ mu, sigma }: { mu: number; sigma: number }) {
  const w = 180, h = 120, pad = 15;
  const ox = w / 2, oy = h - pad;
  const sig = sigma || 1;
  const points: string[] = [];
  for (let x = -4; x <= 4; x += 0.1) {
    const val = Math.exp(-0.5 * x * x) / (sig * Math.sqrt(2 * Math.PI));
    const sx = ox + x * 25;
    const sy = oy - val * 300;
    if (sy > 5) points.push(`${sx},${sy}`);
  }
  const meanX = ox + mu * 25;
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="var(--fg-muted)" strokeWidth="1" />
      {points.length > 1 && (
        <polyline points={points.join(" ")} fill="none" stroke="var(--primary)" strokeWidth="2" />
      )}
      <line x1={meanX} y1={oy} x2={meanX} y2={pad + 10} stroke="var(--accent)" strokeWidth="1" strokeDasharray="4,3" />
      <Label x={meanX} y={oy + 14} text={`μ=${mu}`} size={8} />
      <Label x={meanX + 5} y={pad + 8} text={`σ=${sigma}`} size={8} />
    </SvgRoot>
  );
}

function Gradient3D() {
  const w = 160, h = 120;
  return (
    <SvgRoot w={w} h={h}>
      <g transform="translate(80,90)">
        <line x1={-50} y1={0} x2={50} y2={0} stroke="var(--fg-muted)" strokeWidth="1" />
        <polygon points="50,0 44,-3 44,3" fill="var(--fg-muted)" />
        <line x1={0} y1={0} x2={0} y2={-70} stroke="var(--fg-muted)" strokeWidth="1" />
        <polygon points="0,-70 -3,-64 3,-64" fill="var(--fg-muted)" />
        <path d="M-40,-10 Q-20,-50 0,-30 Q20,-10 40,-40" fill="none" stroke="var(--primary)" strokeWidth="2" />
        <path d="M-40,10 Q-20,-30 0,-10 Q20,10 40,-20" fill="none" stroke="var(--primary)" strokeWidth="1.5" opacity="0.5" />
        <line x1={0} y1={-30} x2={15} y2={-45} stroke="#f59e0b" strokeWidth="2" />
        <polygon points="15,-45 11,-39 18,-41" fill="#f59e0b" />
        <Label x={20} y={-48} text="∇f" size={10} />
      </g>
      <Label x={w - 8} y={100} text="x" size={8} />
      <Label x={8} y={18} text="z" size={8} />
    </SvgRoot>
  );
}

function Cube3D({ s }: { s: number }) {
  const w = 140, h = 130, cx = 70, cy = 65;
  const o = 20;
  const size = 40;
  return (
    <SvgRoot w={w} h={h}>
      <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <polygon points={`${cx - size / 2 + o},${cy - size / 2 - o} ${cx + size / 2 + o},${cy - size / 2 - o} ${cx + size / 2},${cy - size / 2}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={cx + size / 2} y1={cy - size / 2} x2={cx + size / 2 + o} y2={cy - size / 2 - o} stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx - size / 2} y1={cy - size / 2} x2={cx - size / 2 + o} y2={cy - size / 2 - o} stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1={cx + size / 2 + o} y1={cy - size / 2 - o} x2={cx + size / 2 + o} y2={cy + size / 2 - o} stroke="var(--primary)" strokeWidth="1.5" />
      <Label x={cx} y={cy + size / 2 + 14} text={`s = ${s}`} />
    </SvgRoot>
  );
}

function Box3D({ p, l, t }: { p: number; l: number; t: number }) {
  const w = 140, h = 120, cx = 70, cy = 60;
  const bw = 50, bh = 35, d = 18;
  return (
    <SvgRoot w={w} h={h}>
      <rect x={cx - bw / 2} y={cy - bh / 2} width={bw} height={bh} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <polygon points={`${cx - bw / 2},${cy - bh / 2} ${cx - bw / 2 + d},${cy - bh / 2 - d} ${cx + bw / 2 + d},${cy - bh / 2 - d} ${cx + bw / 2},${cy - bh / 2}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={cx + bw / 2} y1={cy - bh / 2} x2={cx + bw / 2 + d} y2={cy - bh / 2 - d} stroke="var(--primary)" strokeWidth="2" />
      <line x1={cx - bw / 2} y1={cy - bh / 2} x2={cx - bw / 2 + d} y2={cy - bh / 2 - d} stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1={cx + bw / 2 + d} y1={cy - bh / 2 - d} x2={cx + bw / 2 + d} y2={cy + bh / 2 - d} stroke="var(--primary)" strokeWidth="1.5" />
      <Label x={cx} y={cy + bh / 2 + 14} text={`p = ${p}, l = ${l}, t = ${t}`} size={8} />
    </SvgRoot>
  );
}

function Transformation({ k }: { k: number }) {
  const w = 160, h = 160, ox = 80, oy = 80;
  const scale = 18;
  const tri = [{ x: 1, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 1 }];
  const triS = tri.map(p => ({ x: ox + p.x * k * scale, y: oy - p.y * k * scale }));
  const triO = tri.map(p => ({ x: ox + p.x * scale, y: oy - p.y * scale }));
  return (
    <SvgRoot w={w} h={h}>
      <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke="var(--fg-muted)" strokeWidth="1" />
      <line x1={ox} y1={10} x2={ox} y2={h - 10} stroke="var(--fg-muted)" strokeWidth="1" />
      <polygon points={triO.map(p => `${p.x},${p.y}`).join(" ")} fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="1.5" />
      <polygon points={triS.map(p => `${p.x},${p.y}`).join(" ")} fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4,3" />
      <Label x={w - 5} y={oy + 14} text="x" size={8} />
      <Label x={ox - 10} y={14} text="y" size={8} />
      <Label x={w / 2} y={h - 5} text={`k = ${k}`} size={9} />
    </SvgRoot>
  );
}

function TreeDiagram() {
  const w = 180, h = 110;
  const rootX = 30, rootY = 20;
  const midX = 100, midY = 55;
  const leafY = 95;
  return (
    <SvgRoot w={w} h={h}>
      <circle cx={rootX} cy={rootY} r="8" fill="var(--primary)" fillOpacity="0.3" stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={rootX} y1={rootY + 8} x2={midX - 25} y2={leafY - 8} stroke="var(--primary)" strokeWidth="1.5" />
      <line x1={rootX} y1={rootY + 8} x2={midX + 25} y2={leafY - 8} stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx={midX - 25} cy={leafY} r="6" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
      <circle cx={midX + 25} cy={leafY} r="6" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
      <Label x={rootX} y={rootY - 10} text="S" size={8} />
      <Label x={midX - 25} y={leafY + 14} text="A" size={8} />
      <Label x={midX + 25} y={leafY + 14} text="B" size={8} />
      <Label x={(rootX + midX - 25) / 2 - 5} y={(rootY + leafY) / 2} text="P(A)" size={7} />
      <Label x={(rootX + midX + 25) / 2 + 5} y={(rootY + leafY) / 2} text="P(B)" size={7} />
    </SvgRoot>
  );
}
