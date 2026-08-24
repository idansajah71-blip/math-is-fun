"use client";

import { motion, type TargetAndTransition, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import {
  SparklesIcon, StarIcon, HeartIcon, PartyIcon, SmileIcon, HandClickIcon, TrophyIcon, ZapIcon, CrownIcon,
} from "@/components/icons/CustomIcons";
import type { SvgIconProps } from "@/components/icons/CustomIcons";

type MascotMood =
  | "happy" | "thinking" | "celebrate" | "sad" | "idle" | "wink" | "love" | "surprised"
  | "concentrate" | "sleepy" | "angry" | "proud" | "wave";

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  message?: string;
  className?: string;
  level?: number;
  interactive?: boolean;
}

interface EyeShape {
  left: "round" | "heart" | "star" | "crescent" | "slantDown" | "slantUp" | "narrow" | "closed" | "dot";
  right: "round" | "heart" | "star" | "crescent" | "slantDown" | "slantUp" | "narrow" | "closed" | "dot";
  pupilScale: number;
  brow?: "none" | "angry" | "focused" | "sad";
}

interface ExpressionDef {
  eyes: EyeShape;
  mouthPath: string;
  mouthScaleY?: number;
  color: string;
  blush: boolean;
  extra?: "zzz" | "wavehand" | "sparkleAura" | "steam";
}

const expressions: Record<MascotMood, ExpressionDef> = {
  idle: {
    eyes: { left: "round", right: "round", pupilScale: 1 },
    mouthPath: "M 92 148 Q 110 158 128 148",
    color: "#3DD34C",
    blush: true,
  },
  happy: {
    eyes: { left: "round", right: "round", pupilScale: 1.05 },
    mouthPath: "M 88 146 Q 110 162 132 146",
    color: "#3DD34C",
    blush: true,
  },
  wink: {
    eyes: { left: "round", right: "closed", pupilScale: 1 },
    mouthPath: "M 90 148 Q 110 160 130 146",
    color: "#CE82FF",
    blush: true,
  },
  thinking: {
    eyes: { left: "crescent", right: "crescent", pupilScale: 0.8 },
    mouthPath: "M 96 152 L 124 152",
    mouthScaleY: 1,
    color: "#1CB0F6",
    blush: false,
  },
  celebrate: {
    eyes: { left: "star", right: "star", pupilScale: 0.6 },
    mouthPath: "M 88 144 Q 110 170 132 144 Q 124 156 110 158 Q 96 156 88 144 Z",
    color: "#FFD900",
    blush: true,
    extra: "sparkleAura",
  },
  sad: {
    eyes: { left: "slantDown", right: "slantDown", pupilScale: 0.95, brow: "sad" },
    mouthPath: "M 92 156 Q 110 146 128 156",
    color: "#FF4B4B",
    blush: false,
  },
  love: {
    eyes: { left: "heart", right: "heart", pupilScale: 0.5 },
    mouthPath: "M 94 148 Q 104 160 110 154 Q 116 160 126 148",
    color: "#FF86D0",
    blush: true,
  },
  surprised: {
    eyes: { left: "round", right: "round", pupilScale: 1.4 },
    mouthPath: "M 100 150 Q 110 162 120 150 Q 110 166 100 150 Z",
    color: "#FF9600",
    blush: true,
  },
  concentrate: {
    eyes: { left: "narrow", right: "narrow", pupilScale: 0.7, brow: "focused" },
    mouthPath: "M 96 154 L 124 152",
    color: "#5B5DEF",
    blush: false,
  },
  sleepy: {
    eyes: { left: "closed", right: "closed", pupilScale: 0 },
    mouthPath: "M 98 152 Q 110 158 122 152",
    color: "#6D7480",
    blush: true,
    extra: "zzz",
  },
  angry: {
    eyes: { left: "slantUp", right: "slantUp", pupilScale: 1.2, brow: "angry" },
    mouthPath: "M 90 156 L 96 150 L 104 154 L 112 150 L 120 154 L 126 150 L 130 156",
    color: "#E03131",
    blush: false,
    extra: "steam",
  },
  proud: {
    eyes: { left: "dot", right: "dot", pupilScale: 0.3 },
    mouthPath: "M 88 146 Q 110 164 132 146 Q 128 152 110 154 Q 92 152 88 146 Z",
    color: "#F59F00",
    blush: true,
    extra: "sparkleAura",
  },
  wave: {
    eyes: { left: "round", right: "wink" as any, pupilScale: 1.05 },
    mouthPath: "M 90 146 Q 110 162 130 148 Q 122 158 110 160 Q 98 158 90 146 Z",
    color: "#20C997",
    blush: true,
    extra: "wavehand",
  },
};

const evolutionStages = [
  { minLevel: 0, cap: null, capColor: "", bodyAccessory: null, glow: "rgba(61, 211, 76, 0.2)" },
  { minLevel: 2, cap: "leaf", capColor: "#3DD34C", bodyAccessory: null, glow: "rgba(61, 211, 76, 0.3)" },
  { minLevel: 4, cap: "graduation", capColor: "#1e3a5f", bodyAccessory: "scarf", glow: "rgba(28, 176, 246, 0.3)" },
  { minLevel: 7, cap: "crown", capColor: "#FFD900", bodyAccessory: "cape", glow: "rgba(255, 217, 0, 0.4)" },
  { minLevel: 10, cap: "legendary", capColor: "#CE82FF", bodyAccessory: "wings", glow: "rgba(206, 130, 255, 0.5)" },
];

function getEvolution(level: number) {
  for (let i = evolutionStages.length - 1; i >= 0; i--) {
    if (level >= evolutionStages[i].minLevel) {
      return { ...evolutionStages[i], size: 1 + level * 0.01 };
    }
  }
  return { ...evolutionStages[0], size: 1 };
}

const moodAnimations: Record<MascotMood, TargetAndTransition> = {
  happy: { y: [0, -6, 0], rotate: [0, -1, 1, 0] },
  thinking: { y: [0, -3, 0], rotate: [0, -3, 0, 3, 0] },
  celebrate: { y: [0, -15, 0, -10, 0], scale: [1, 1.08, 1, 1.04, 1], rotate: [0, -5, 0, 5, 0] },
  sad: { y: [0, 3, 0], rotate: [0, 2, -2, 0] },
  idle: { y: [0, -4, 0], scale: [1, 1.015, 1] },
  wink: { y: [0, -6, 0], rotate: [0, -2, 0] },
  love: { y: [0, -5, 0], scale: [1, 1.03, 1] },
  surprised: { y: [0, -8, 0], scale: [1, 1.05, 1] },
  concentrate: { y: [0, -2, 0], scale: [1, 0.995, 1] },
  sleepy: { y: [0, 2, 0], rotate: [0, 1, -1, 0] },
  angry: { y: [0, -3, 0], rotate: [0, -2, 2, 0], scale: [1, 1.02, 1] },
  proud: { y: [0, -7, 0], scale: [1, 1.03, 1], rotate: [0, 2, -2, 0] },
  wave: { y: [0, -5, 0], rotate: [0, -1, 1, 0] },
};

type ParticleIcon = React.FC<SvgIconProps>;
interface ClickReactionDef {
  mood: MascotMood;
  particles: ParticleIcon[];
  text: string;
}

const clickReactions: ClickReactionDef[] = [
  { mood: "love", particles: [HeartIcon, HeartIcon, SparklesIcon], text: "Aww, kasih sayang!" },
  { mood: "celebrate", particles: [PartyIcon, SparklesIcon, StarIcon, TrophyIcon], text: "Hore! Semangat!" },
  { mood: "happy", particles: [SparklesIcon, SmileIcon, StarIcon], text: "Hehe, aku senang!" },
  { mood: "proud", particles: [StarIcon, ZapIcon, CrownIcon], text: "Kamu hebat banget!" },
  { mood: "wave", particles: [HandClickIcon, SparklesIcon, SmileIcon], text: "Hai hai! Ayo belajar!" },
];

interface FloatingParticle {
  id: number;
  icon: ParticleIcon;
  x: number;
  y: number;
}

function EyeShapeRenderer({
  shape,
  cx,
  cy,
  pupilScale,
  eyeColor = "#FFFFFF",
  pupilColor = "#1a1a2e",
  exprColor,
}: {
  shape: ExpressionDef["eyes"]["left"];
  cx: number;
  cy: number;
  pupilScale: number;
  eyeColor?: string;
  pupilColor?: string;
  exprColor: string;
}) {
  const baseR = 14;

  if (shape === "round") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR} ry={baseR * 0.95} fill={eyeColor} />
        <motion.circle
          cx={cx + 1.5}
          cy={cy + 1}
          r={baseR * 0.55 * pupilScale}
          fill={pupilColor}
          animate={{ x: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx={cx - 4} cy={cy - 5} r={3.5} fill="#FFFFFF" opacity={0.92} />
        <circle cx={cx - 5} cy={cy - 4} r={1.5} fill="#FFFFFF" opacity={0.7} />
      </g>
    );
  }

  if (shape === "heart") {
    const hx = cx, hy = cy, s = 1.25;
    return (
      <g>
        <path
          d={`M ${hx} ${hy + 7 * s}
              C ${hx - 14 * s} ${hy - 3 * s}, ${hx - 9 * s} ${hy - 13 * s}, ${hx} ${hy - 5 * s}
              C ${hx + 9 * s} ${hy - 13 * s}, ${hx + 14 * s} ${hy - 3 * s}, ${hx} ${hy + 7 * s} Z`}
          fill={exprColor}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
        <circle cx={cx - 3} cy={cy - 5} r={2} fill="#FFFFFF" opacity={0.85} />
      </g>
    );
  }

  if (shape === "star") {
    const s = 1.05;
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 15 * s : 7 * s;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
    }
    return (
      <g>
        <polygon points={pts.join(" ")} fill={exprColor} stroke="#FFFFFF" strokeWidth={1.2} />
        <circle cx={cx - 2.5} cy={cy - 3.5} r={2} fill="#FFFFFF" opacity={0.85} />
      </g>
    );
  }

  if (shape === "crescent") {
    return (
      <g>
        <path
          d={`M ${cx - 12} ${cy} Q ${cx} ${cy - 14} ${cx + 12} ${cy} Q ${cx} ${cy - 4} ${cx - 12} ${cy} Z`}
          fill={eyeColor}
        />
        <circle cx={cx + 3} cy={cy - 5} r={4 * pupilScale} fill={pupilColor} />
        <circle cx={cx + 1} cy={cy - 7} r={1.8} fill="#FFFFFF" opacity={0.7} />
      </g>
    );
  }

  if (shape === "slantDown") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR * 0.95} ry={baseR * 0.85} fill={eyeColor} />
        <circle cx={cx} cy={cy + 2} r={baseR * 0.52 * pupilScale} fill={pupilColor} />
        <path d={`M ${cx - 15} ${cy - 12} L ${cx + 13} ${cy - 5}`} stroke={exprColor} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx - 4} cy={cy - 3} r={2.5} fill="#FFFFFF" opacity={0.85} />
      </g>
    );
  }

  if (shape === "slantUp") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR * 0.95} ry={baseR * 0.85} fill={eyeColor} />
        <circle cx={cx} cy={cy - 1} r={baseR * 0.55 * pupilScale} fill={pupilColor} />
        <path d={`M ${cx - 15} ${cy + 10} L ${cx + 13} ${cy + 3}`} stroke={exprColor} strokeWidth={3.2} strokeLinecap="round" />
        <circle cx={cx - 3} cy={cy - 4} r={2.5} fill="#FFFFFF" opacity={0.85} />
      </g>
    );
  }

  if (shape === "narrow") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR * 1.05} ry={baseR * 0.55} fill={eyeColor} />
        <circle cx={cx} cy={cy} r={baseR * 0.42 * pupilScale} fill={pupilColor} />
        <path d={`M ${cx - 14} ${cy - 10} L ${cx + 12} ${cy - 8}`} stroke="#333" strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
        <circle cx={cx - 3} cy={cy - 1.5} r={1.5} fill="#FFFFFF" opacity={0.7} />
      </g>
    );
  }

  if (shape === "closed") {
    return (
      <g>
        <path
          d={`M ${cx - 13} ${cy + 1} Q ${cx} ${cy + 8} ${cx + 13} ${cy + 1}`}
          fill="none"
          stroke={pupilColor}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (shape === "dot") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR * 0.9} ry={baseR * 0.85} fill={eyeColor} />
        <circle cx={cx} cy={cy + 1} r={baseR * 0.82 * pupilScale} fill={pupilColor} />
        <motion.circle cx={cx - 7} cy={cy - 6} r={2} fill={exprColor}>
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" repeatCount="indefinite" />
        </motion.circle>
        <motion.circle cx={cx + 7} cy={cy + 5} r={1.5} fill={exprColor}>
          <animate attributeName="opacity" values="1;0.2;1" dur="1.1s" repeatCount="indefinite" />
        </motion.circle>
        <circle cx={cx - 3} cy={cy - 3} r={2} fill="#FFFFFF" opacity={0.85} />
      </g>
    );
  }

  return null;
}

function EyeBrowRenderer({ type, cx, cy, color }: { type: NonNullable<EyeShape["brow"]>; cx: number; cy: number; color: string }) {
  if (type === "angry") {
    return <path d={`M ${cx - 16} ${cy + 12} L ${cx + 12} ${cy + 4}`} stroke={color} strokeWidth={3.5} strokeLinecap="round" />;
  }
  if (type === "focused") {
    return <path d={`M ${cx - 14} ${cy - 9} L ${cx + 10} ${cy - 10}`} stroke="#1a1a2e" strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />;
  }
  if (type === "sad") {
    return <path d={`M ${cx - 14} ${cy - 7} L ${cx + 12} ${cy - 13}`} stroke="#555" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />;
  }
  return null;
}

export default function Mascot({
  mood = "happy",
  size = 120,
  message,
  className = "",
  level = 0,
  interactive = true,
}: MascotProps) {
  const [displayMood, setDisplayMood] = useState<MascotMood>(mood);
  const [clickReaction, setClickReaction] = useState<ClickReactionDef | null>(null);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [pulseScale, setPulseScale] = useState(1);
  const [blinkScale, setBlinkScale] = useState(1);

  useEffect(() => {
    if (!clickReaction) {
      setDisplayMood(mood);
    }
  }, [mood, clickReaction]);

  useEffect(() => {
    const doBlink = () => {
      setBlinkScale(0.05);
      setTimeout(() => setBlinkScale(1), 140);
    };
    const scheduleNext = () => {
      const t = 2800 + Math.random() * 3200;
      return setTimeout(() => {
        doBlink();
        id.current = scheduleNext();
      }, t);
    };
    const id = { current: scheduleNext() } as { current: ReturnType<typeof setTimeout> };
    return () => clearTimeout(id.current);
  }, []);

  const expr = expressions[displayMood];
  const evo = getEvolution(level);
  const effectiveSize = size * evo.size;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;

      const reaction = clickReactions[Math.floor(Math.random() * clickReactions.length)];
      setClickReaction(reaction);
      setDisplayMood(reaction.mood);
      setPulseScale(1.1);
      setTimeout(() => setPulseScale(1), 200);

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      const count = 3 + Math.floor(Math.random() * 3);
      const newParticles: FloatingParticle[] = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i + Math.random() * 1000,
        icon: reaction.particles[i % reaction.particles.length],
        x: localX + (Math.random() - 0.5) * 70,
        y: localY + Math.random() * 25,
      }));
      setFloatingParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setFloatingParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
      }, 1600);

      setTimeout(() => {
        setClickReaction(null);
        setDisplayMood(mood);
      }, 2600);
    },
    [interactive, mood]
  );

  const displayedMessage = clickReaction?.text || message;
  const gradId = `bodyGrad-${displayMood}-${level}`;
  const shineId = `shineGrad-${displayMood}-${level}`;
  const glowId = `glow-${level}`;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <motion.div
          onClick={handleClick}
          animate={{
            ...moodAnimations[displayMood],
            scale: pulseScale,
          }}
          transition={{
            duration: displayMood === "celebrate" ? 0.6 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            ...(displayMood === "thinking" ? { duration: 3 } : {}),
          }}
          className={interactive ? "cursor-pointer select-none" : ""}
          style={{
            filter: `drop-shadow(0 0 15px ${evo.glow})`,
          }}
        >
          <svg width={effectiveSize} height={effectiveSize} viewBox="0 0 220 220" fill="none">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={expr.color} />
                <stop offset="50%" stopColor={`${expr.color}DD`} />
                <stop offset="100%" stopColor={`${expr.color}BB`} />
              </linearGradient>
              <radialGradient id={shineId} cx="30%" cy="30%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="0.45" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="legendaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD900" />
                <stop offset="33%" stopColor="#FF86D0" />
                <stop offset="66%" stopColor="#CE82FF" />
                <stop offset="100%" stopColor="#1CB0F6" />
              </linearGradient>
            </defs>

            {evo.bodyAccessory === "wings" && (
              <>
                <motion.path
                  d="M30,110 Q5,80 10,120 Q15,150 45,135 Q35,120 30,110 Z"
                  fill={`${evo.capColor}88`}
                  animate={{ rotate: [-5, 5, -5], x: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ transformOrigin: "50px 120px" }}
                />
                <motion.path
                  d="M190,110 Q215,80 210,120 Q205,150 175,135 Q185,120 190,110 Z"
                  fill={`${evo.capColor}88`}
                  animate={{ rotate: [5, -5, 5], x: [0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ transformOrigin: "170px 120px" }}
                />
              </>
            )}

            {evo.bodyAccessory === "cape" && (
              <motion.path
                d="M55,90 Q40,140 50,180 Q75,170 110,175 Q145,170 170,180 Q180,140 165,90 Q140,100 110,95 Q80,100 55,90 Z"
                fill="#1CB0F6"
                opacity="0.7"
                animate={{ scaleY: [1, 1.015, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ transformOrigin: "110px 90px" }}
              />
            )}

            {evo.bodyAccessory === "scarf" && (
              <>
                <rect x="60" y="82" width="100" height="16" rx="8" fill="#FF86D0" />
                <motion.rect
                  x="70"
                  y="90"
                  width="12"
                  height="35"
                  rx="6"
                  fill="#FF86D0"
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ transformOrigin: "76px 92px" }}
                />
              </>
            )}

            <motion.ellipse
              cx="110"
              cy="125"
              rx="72"
              ry="68"
              fill={`url(#${gradId})`}
              filter={`url(#${glowId})`}
              animate={{ scaleY: [1, 1.012, 1], scaleX: [1.004, 0.996, 1.004] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <ellipse cx="110" cy="125" rx="72" ry="68" fill={`url(#${shineId})`} />

            <ellipse cx="110" cy="135" rx="46" ry="42" fill="white" opacity="0.92" />
            <ellipse cx="110" cy="135" rx="46" ry="42" fill={`url(#${shineId})`} />

            <g style={{ transform: `scaleY(${blinkScale})`, transformOrigin: "110px 108px" }}>
              <EyeShapeRenderer
                shape={expr.eyes.left}
                cx={80}
                cy={108}
                pupilScale={expr.eyes.pupilScale}
                exprColor={expr.color}
              />
              <EyeShapeRenderer
                shape={expr.eyes.right}
                cx={140}
                cy={108}
                pupilScale={expr.eyes.pupilScale}
                exprColor={expr.color}
              />
              {expr.eyes.brow && expr.eyes.brow !== "none" && (
                <>
                  <EyeBrowRenderer type={expr.eyes.brow} cx={80} cy={108} color={expr.color} />
                  <EyeBrowRenderer type={expr.eyes.brow} cx={140} cy={108} color={expr.color} />
                </>
              )}
            </g>

            <g style={{ transformOrigin: "110px 150px" }}>
              <motion.path
                d={expr.mouthPath}
                fill={displayMood === "celebrate" || displayMood === "surprised" || displayMood === "proud" || displayMood === "wave" ? "#FF6B9D" : "none"}
                stroke={expr.color}
                strokeWidth={displayMood === "celebrate" || displayMood === "surprised" || displayMood === "proud" || displayMood === "wave" ? 1.5 : 3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ scaleY: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transformOrigin: "110px 150px" }}
              />
            </g>

            {displayMood === "celebrate" && (
              <path d="M 98 154 Q 110 162 122 154 L 118 158 L 114 155 L 110 159 L 106 155 L 102 158 Z" fill="#FF6B9D" />
            )}

            {expr.blush && (
              <>
                <motion.circle
                  cx="62"
                  cy="128"
                  r="14"
                  fill="#FF86D0"
                  opacity="0.35"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle
                  cx="158"
                  cy="128"
                  r="14"
                  fill="#FF86D0"
                  opacity="0.35"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </>
            )}

            {expr.extra === "steam" && (
              <>
                <motion.path
                  d="M 50 80 Q 42 72 50 64 Q 42 56 50 48"
                  fill="none"
                  stroke="#888"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <motion.path
                  d="M 170 80 Q 178 72 170 64 Q 178 56 170 48"
                  fill="none"
                  stroke="#888"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}

            {expr.extra === "zzz" && (
              <g>
                <motion.text
                  x="162"
                  y="64"
                  fontSize="14"
                  fontWeight="900"
                  fill="#6D7480"
                  fontFamily="Poppins, sans-serif"
                  animate={{ y: [0, -10, 0], opacity: [0.2, 1, 0.2], x: [0, 5, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  Z
                </motion.text>
                <motion.text
                  x="174"
                  y="52"
                  fontSize="11"
                  fontWeight="900"
                  fill="#6D7480"
                  fontFamily="Poppins, sans-serif"
                  animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4], x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                >
                  z
                </motion.text>
              </g>
            )}

            {expr.extra === "wavehand" && (
              <motion.g
                animate={{ rotate: [-20, 25, -20, 10, -20], x: [0, 3, 0, -2, 0] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                style={{ transformOrigin: "185px 145px" }}
              >
                <ellipse cx="185" cy="145" rx="15" ry="18" fill={expr.color} stroke="#FFFFFF" strokeWidth={2} />
                <path d="M 174 130 Q 180 122 188 125 Q 194 130 192 138" stroke="#FFFFFF" strokeWidth={1.5} fill="none" opacity={0.7} />
                <path d="M 178 142 L 178 158" stroke="#FFFFFF" strokeWidth={1} opacity={0.5} />
                <path d="M 184 140 L 184 160" stroke="#FFFFFF" strokeWidth={1} opacity={0.5} />
                <path d="M 190 142 L 190 158" stroke="#FFFFFF" strokeWidth={1} opacity={0.5} />
              </motion.g>
            )}

            {evo.cap === "leaf" && (
              <motion.g
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ transformOrigin: "110px 40px" }}
              >
                <path d="M110,40 Q90,15 110,25 Q130,15 110,40" fill={evo.capColor} />
                <path d="M110,35 L110,22" stroke="white" strokeWidth="1.5" opacity="0.5" />
              </motion.g>
            )}

            {evo.cap === "graduation" && (
              <>
                <polygon points="110,35 58,60 110,85 162,60" fill={evo.capColor} />
                <rect x="104" y="35" width="12" height="20" fill={evo.capColor} rx="2" />
                <motion.line
                  x1="162"
                  y1="60"
                  x2="174"
                  y2="86"
                  stroke="#FFD900"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ transformOrigin: "162px 60px" }}
                />
                <circle cx="176" cy="89" r="6" fill="#FFD900" />
                <circle cx="176" cy="89" r="2" fill="#fff" opacity="0.5" />
              </>
            )}

            {evo.cap === "crown" && (
              <>
                <polygon points="78,55 90,22 110,48 130,22 142,55" fill="#FFD900" stroke="#E5A100" strokeWidth="2" />
                <rect x="78" y="50" width="64" height="12" rx="2" fill="#FFD900" stroke="#E5A100" strokeWidth="2" />
                <motion.circle cx="90" cy="26" r="4" fill="#FF4B4B" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <motion.circle cx="110" cy="40" r="5" fill="#1CB0F6" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
                <motion.circle cx="130" cy="26" r="4" fill="#3DD34C" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
                <circle cx="85" cy="56" r="2.5" fill="#fff" opacity="0.7" />
                <circle cx="110" cy="56" r="2.5" fill="#fff" opacity="0.7" />
                <circle cx="135" cy="56" r="2.5" fill="#fff" opacity="0.7" />
              </>
            )}

            {evo.cap === "legendary" && (
              <>
                <motion.polygon
                  points="72,58 84,18 110,46 136,18 148,58"
                  fill="url(#legendaryGrad)"
                  stroke={evo.capColor}
                  strokeWidth="2.5"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <rect x="72" y="52" width="76" height="14" rx="3" fill={evo.capColor} />
                <motion.circle cx="84" cy="22" r="5" fill="#FF4B4B" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                <motion.circle cx="97" cy="32" r="4" fill="#FFD900" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.15 }} />
                <motion.circle cx="110" cy="38" r="6" fill="#1CB0F6" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
                <motion.circle cx="123" cy="32" r="4" fill="#3DD34C" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.45 }} />
                <motion.circle cx="136" cy="22" r="5" fill="#CE82FF" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
              </>
            )}

            {expr.extra === "sparkleAura" && (
              <>
                <motion.g animate={{ y: [0, -8, 0], opacity: [0, 1, 0], rotate: [0, 15, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                  <SparklesIcon size={16} color={{ from: "#FFD900", to: "#FF86D0" }} />
                  <animateTransform attributeName="transform" type="translate" values="25 65;25 57;25 65" dur="1s" repeatCount="indefinite" />
                </motion.g>
                <g transform="translate(178 72)">
                  <motion.g animate={{ y: [0, -10, 0], opacity: [0, 1, 0], rotate: [0, -12, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}>
                    <StarIcon size={13} color={{ from: "#FFD900", to: "#F59F00" }} />
                  </motion.g>
                </g>
                <g transform="translate(28 166)">
                  <motion.g animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }}>
                    <SparklesIcon size={14} color={{ from: "#CE82FF", to: "#1CB0F6" }} />
                  </motion.g>
                </g>
                <g transform="translate(172 170)">
                  <motion.g animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.6 }}>
                    <StarIcon size={15} color={{ from: "#3DD34C", to: "#1CB0F6" }} />
                  </motion.g>
                </g>
                <g transform="translate(14 115)">
                  <motion.g animate={{ y: [0, -6, 0], opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }}>
                    <SparklesIcon size={12} color={{ from: "#FF86D0", to: "#FFD900" }} />
                  </motion.g>
                </g>
                <g transform="translate(194 115)">
                  <motion.g animate={{ y: [0, -7, 0], opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 1.05, repeat: Infinity, delay: 0.55 }}>
                    <SparklesIcon size={12} color={{ from: "#1CB0F6", to: "#CE82FF" }} />
                  </motion.g>
                </g>
              </>
            )}

            {displayMood === "love" && (
              <>
                <g transform="translate(36 58)">
                  <motion.g animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.25, repeat: Infinity }}>
                    <HeartIcon size={16} color={{ from: "#FF86D0", to: "#FF4B4B" }} />
                  </motion.g>
                </g>
                <g transform="translate(164 54)">
                  <motion.g animate={{ y: [0, -16, 0], opacity: [0.5, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.45, repeat: Infinity, delay: 0.3 }}>
                    <HeartIcon size={13} color={{ from: "#FF6B9D", to: "#CE82FF" }} />
                  </motion.g>
                </g>
                <g transform="translate(24 108)">
                  <motion.g animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4], scale: [0.8, 1.15, 0.8] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.15 }}>
                    <SparklesIcon size={11} color={{ from: "#FFD900", to: "#FF86D0" }} />
                  </motion.g>
                </g>
              </>
            )}
          </svg>
        </motion.div>

        <AnimatePresence>
          {floatingParticles.map((p) => {
            const PIcon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: -55 - Math.random() * 35,
                  scale: [0.4, 1.35, 1.15, 0.75],
                  rotate: (Math.random() - 0.5) * 50,
                  x: (Math.random() - 0.5) * 15,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.45, ease: "easeOut" }}
                className="absolute pointer-events-none"
                style={{ left: p.x, top: p.y, width: 26, height: 26 }}
              >
                <PIcon size={26} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        <motion.div
          className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-white dark:border-[var(--surface)]"
          style={{
            background: "linear-gradient(135deg, var(--xp-start, #FFD900) 0%, var(--xp-end, #FF9600) 100%)",
            color: "#8B6914",
            boxShadow: "0 4px 0 var(--xp-shadow, #E5A100), 0 8px 24px var(--xp-glow, rgba(255,217,0,0.35))",
          }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {level}
        </motion.div>
      </div>

      {displayedMessage && (
        <AnimatePresence mode="wait">
          <motion.div
            key={displayedMessage}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="relative px-4 py-3 rounded-[20px] max-w-[240px] text-center speech-bubble"
          >
            <p className="relative text-xs font-bold text-[var(--fg)] leading-relaxed">{displayedMessage}</p>
          </motion.div>
        </AnimatePresence>
      )}

      {interactive && (
        <motion.div
          className="flex items-center gap-1.5"
          animate={{ opacity: [0.45, 1, 0.45], y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <HandClickIcon size={14} color={{ from: "#3DD34C", to: "#1CB0F6" }} />
          <span className="text-[10px] text-[var(--fg-muted)] font-semibold">klik aku!</span>
        </motion.div>
      )}
    </div>
  );
}
