"use client";

export default function ProgressRing({
  progress, size = 80, strokeWidth = 6, color = "#1a73e8", children,
}: {
  progress: number; size?: number; strokeWidth?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = r * 2 * Math.PI;
  const offset = c - (progress / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
