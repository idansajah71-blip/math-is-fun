"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    eyes: { left: "round", right: "closed", pupilScale: 1.05 },
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
  shape: EyeShape["left"];
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
        <circle
          cx={cx + 1.5}
          cy={cy + 1}
          r={baseR * 0.55 * pupilScale}
          fill={pupilColor}
          className="mascot-pupil"
        />
        <circle cx={cx - 4} cy={cy - 4} r={3.5} fill="#FFFFFF" opacity={0.85} />
        <circle cx={cx + 3} cy={cy - 2} r={1.8} fill="#FFFFFF" opacity={0.5} />
      </g>
    );
  }

  if (shape === "heart") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR} ry={baseR * 0.95} fill={eyeColor} />
        <path
          d={`M ${cx} ${cy + 3} C ${cx - 10} ${cy - 5} ${cx - 18} ${cy + 2} ${cx} ${cy + 14} C ${cx + 18} ${cy + 2} ${cx + 10} ${cy - 5} ${cx} ${cy + 3} Z`}
          fill="#FF4B4B"
          className="mascot-pupil"
        />
        <ellipse cx={cx - 4} cy={cy + 1} rx={4} ry={3} fill="#FF86D0" opacity={0.6} />
      </g>
    );
  }

  if (shape === "star") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR} ry={baseR * 0.95} fill={eyeColor} />
        <polygon
          points={`${cx},${cy - 8} ${cx + 3},${cy - 2} ${cx + 9},${cy - 2} ${cx + 4.5},${cy + 2} ${cx + 6},${cy + 8} ${cx},${cy + 4} ${cx - 6},${cy + 8} ${cx - 4.5},${cy + 2} ${cx - 9},${cy - 2} ${cx - 3},${cy - 2}`}
          fill="#FFD900"
          className="mascot-pupil"
        />
        <circle cx={cx - 2} cy={cy - 3} r={2} fill="#FFF" opacity={0.7} />
      </g>
    );
  }

  if (shape === "crescent") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR} ry={baseR * 0.95} fill={eyeColor} />
        <ellipse cx={cx + 1} cy={cy + 1} r={baseR * 0.5 * pupilScale} fill={pupilColor} />
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

  if (shape === "slantDown") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR} ry={baseR * 0.95} fill={eyeColor} />
        <circle cx={cx + 1} cy={cy + 1} r={baseR * 0.5 * pupilScale} fill={pupilColor} className="mascot-pupil" />
        <circle cx={cx - 4} cy={cy - 4} r={3} fill="#FFF" opacity={0.7} />
      </g>
    );
  }

  if (shape === "slantUp") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR} ry={baseR * 0.95} fill={eyeColor} />
        <circle cx={cx + 1} cy={cy + 1} r={baseR * 0.55 * pupilScale} fill={pupilColor} className="mascot-pupil" />
        <circle cx={cx - 3} cy={cy - 3} r={2.5} fill="#FFF" opacity={0.7} />
      </g>
    );
  }

  if (shape === "narrow") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR * 0.9} ry={baseR * 0.4} fill={eyeColor} />
        <ellipse cx={cx + 1} cy={cy + 1} rx={baseR * 0.35 * pupilScale} ry={baseR * 0.25 * pupilScale} fill={pupilColor} />
      </g>
    );
  }

  if (shape === "closed") {
    return (
      <path
        d={`M ${cx - 12} ${cy} Q ${cx} ${cy + 7} ${cx + 12} ${cy}`}
        fill="none"
        stroke={pupilColor}
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  }

  if (shape === "dot") {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={baseR * 0.9} ry={baseR * 0.85} fill={eyeColor} />
        <circle cx={cx} cy={cy + 1} r={baseR * 0.82 * pupilScale} fill={pupilColor} />
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

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          onClick={handleClick}
          className={`mascot-${displayMood} ${interactive ? "cursor-pointer select-none" : ""}`}
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
              <linearGradient id="legendaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD900" />
                <stop offset="33%" stopColor="#FF86D0" />
                <stop offset="66%" stopColor="#CE82FF" />
                <stop offset="100%" stopColor="#1CB0F6" />
              </linearGradient>
            </defs>

            {evo.bodyAccessory === "wings" && (
              <>
                <path
                  d="M30,110 Q5,80 10,120 Q15,150 45,135 Q35,120 30,110 Z"
                  fill={`${evo.capColor}88`}
                  className="mascot-wing-l"
                />
                <path
                  d="M190,110 Q215,80 210,120 Q205,150 175,135 Q185,120 190,110 Z"
                  fill={`${evo.capColor}88`}
                  className="mascot-wing-r"
                />
              </>
            )}

            {evo.bodyAccessory === "cape" && (
              <path
                d="M55,90 Q40,140 50,180 Q75,170 110,175 Q145,170 170,180 Q180,140 165,90 Q140,100 110,95 Q80,100 55,90 Z"
                fill="#1CB0F6"
                opacity="0.7"
                className="mascot-cape"
              />
            )}

            {evo.bodyAccessory === "scarf" && (
              <>
                <rect x="60" y="82" width="100" height="16" rx="8" fill="#FF86D0" />
                <rect
                  x="70"
                  y="90"
                  width="12"
                  height="35"
                  rx="6"
                  fill="#FF86D0"
                  className="mascot-scarf"
                />
              </>
            )}

            <ellipse
              cx="110"
              cy="125"
              rx="72"
              ry="68"
              fill={`url(#${gradId})`}
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
              <path
                d={expr.mouthPath}
                fill={displayMood === "celebrate" || displayMood === "surprised" || displayMood === "proud" || displayMood === "wave" ? "#FF6B9D" : "none"}
                stroke={expr.color}
                strokeWidth={displayMood === "celebrate" || displayMood === "surprised" || displayMood === "proud" || displayMood === "wave" ? 1.5 : 3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mascot-mouth"
              />
            </g>

            {displayMood === "celebrate" && (
              <path d="M 98 154 Q 110 162 122 154 L 118 158 L 114 155 L 110 159 L 106 155 L 102 158 Z" fill="#FF6B9D" />
            )}

            {expr.blush && (
              <>
                <circle
                  cx="62"
                  cy="128"
                  r="14"
                  fill="#FF86D0"
                  opacity="0.35"
                  className="mascot-blush"
                />
                <circle
                  cx="158"
                  cy="128"
                  r="14"
                  fill="#FF86D0"
                  opacity="0.35"
                  className="mascot-blush"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}

            {expr.extra === "steam" && (
              <>
                <path
                  d="M 50 80 Q 42 72 50 64 Q 42 56 50 48"
                  fill="none"
                  stroke="#888"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="mascot-steam"
                />
                <path
                  d="M 170 80 Q 178 72 170 64 Q 178 56 170 48"
                  fill="none"
                  stroke="#888"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="mascot-steam-r"
                />
              </>
            )}

            {expr.extra === "zzz" && (
              <g>
                <text
                  x="162"
                  y="64"
                  fontSize="14"
                  fontWeight="900"
                  fill="#6D7480"
                  fontFamily="Poppins, sans-serif"
                  className="mascot-zzz"
                >
                  Z
                </text>
                <text
                  x="174"
                  y="52"
                  fontSize="11"
                  fontWeight="900"
                  fill="#6D7480"
                  fontFamily="Poppins, sans-serif"
                  className="mascot-zzz-s"
                >
                  z
                </text>
              </g>
            )}

            {expr.extra === "wavehand" && (
              <g className="mascot-wave-hand">
                <ellipse cx="185" cy="145" rx="15" ry="18" fill={expr.color} stroke="#FFFFFF" strokeWidth={2} />
                <path d="M 174 130 Q 180 122 188 125 Q 194 130 192 138" stroke="#FFFFFF" strokeWidth={1.5} fill="none" opacity={0.7} />
                <path d="M 178 142 L 178 158" stroke="#FFFFFF" strokeWidth={1} opacity={0.5} />
                <path d="M 184 140 L 184 160" stroke="#FFFFFF" strokeWidth={1} opacity={0.5} />
                <path d="M 190 142 L 190 158" stroke="#FFFFFF" strokeWidth={1} opacity={0.5} />
              </g>
            )}

            {evo.cap === "leaf" && (
              <g className="mascot-leaf">
                <path d="M110,40 Q90,15 110,25 Q130,15 110,40" fill={evo.capColor} />
                <path d="M110,35 L110,22" stroke="white" strokeWidth="1.5" opacity="0.5" />
              </g>
            )}

            {evo.cap === "graduation" && (
              <>
                <polygon points="110,35 58,60 110,85 162,60" fill={evo.capColor} />
                <rect x="104" y="35" width="12" height="20" fill={evo.capColor} rx="2" />
                <line
                  x1="162"
                  y1="60"
                  x2="174"
                  y2="86"
                  stroke="#FFD900"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="mascot-graduation"
                />
                <circle cx="176" cy="89" r="6" fill="#FFD900" />
                <circle cx="176" cy="89" r="2" fill="#fff" opacity="0.5" />
              </>
            )}

            {evo.cap === "crown" && (
              <>
                <polygon points="78,55 90,22 110,48 130,22 142,55" fill="#FFD900" stroke="#E5A100" strokeWidth="2" />
                <rect x="78" y="50" width="64" height="12" rx="2" fill="#FFD900" stroke="#E5A100" strokeWidth="2" />
                <circle cx="90" cy="26" r="4" fill="#FF4B4B" className="mascot-crown-gem" />
                <circle cx="110" cy="40" r="5" fill="#1CB0F6" className="mascot-crown-gem" style={{ animationDelay: "0.3s" }} />
                <circle cx="130" cy="26" r="4" fill="#3DD34C" className="mascot-crown-gem" style={{ animationDelay: "0.6s" }} />
                <circle cx="85" cy="56" r="2.5" fill="#fff" opacity="0.7" />
                <circle cx="110" cy="56" r="2.5" fill="#fff" opacity="0.7" />
                <circle cx="135" cy="56" r="2.5" fill="#fff" opacity="0.7" />
              </>
            )}

            {evo.cap === "legendary" && (
              <>
                <polygon
                  points="72,58 84,18 110,46 136,18 148,58"
                  fill="url(#legendaryGrad)"
                  stroke={evo.capColor}
                  strokeWidth="2.5"
                  className="mascot-legendary-scale"
                />
                <rect x="72" y="52" width="76" height="14" rx="3" fill={evo.capColor} />
                <circle cx="84" cy="22" r="5" fill="#FF4B4B" className="mascot-legendary-gem" />
                <circle cx="97" cy="32" r="4" fill="#FFD900" className="mascot-legendary-gem-d1" />
                <circle cx="110" cy="38" r="6" fill="#1CB0F6" className="mascot-legendary-gem-d2" />
                <circle cx="123" cy="32" r="4" fill="#3DD34C" className="mascot-legendary-gem-d3" />
                <circle cx="136" cy="22" r="5" fill="#CE82FF" className="mascot-legendary-gem-d4" />
              </>
            )}

            {expr.extra === "sparkleAura" && (
              <>
                <g className="mascot-sparkle" style={{ transform: "translate(25px, 65px)" }}>
                  <SparklesIcon size={16} color={{ from: "#FFD900", to: "#FF86D0" }} />
                </g>
                <g className="mascot-sparkle-d1" style={{ transform: "translate(178px, 72px)" }}>
                  <StarIcon size={13} color={{ from: "#FFD900", to: "#F59F00" }} />
                </g>
                <g className="mascot-sparkle-d2" style={{ transform: "translate(28px, 166px)" }}>
                  <SparklesIcon size={14} color={{ from: "#CE82FF", to: "#1CB0F6" }} />
                </g>
                <g className="mascot-sparkle-d3" style={{ transform: "translate(172px, 170px)" }}>
                  <StarIcon size={15} color={{ from: "#3DD34C", to: "#1CB0F6" }} />
                </g>
                <g className="mascot-sparkle-d4" style={{ transform: "translate(14px, 115px)" }}>
                  <SparklesIcon size={12} color={{ from: "#FF86D0", to: "#FFD900" }} />
                </g>
                <g className="mascot-sparkle" style={{ transform: "translate(194px, 115px)", animationDelay: "0.55s" }}>
                  <SparklesIcon size={12} color={{ from: "#1CB0F6", to: "#CE82FF" }} />
                </g>
              </>
            )}

            {displayMood === "love" && (
              <>
                <g className="mascot-heart" style={{ transform: "translate(36px, 58px)" }}>
                  <HeartIcon size={16} color={{ from: "#FF86D0", to: "#FF4B4B" }} />
                </g>
                <g className="mascot-heart-d1" style={{ transform: "translate(164px, 54px)" }}>
                  <HeartIcon size={13} color={{ from: "#FF6B9D", to: "#CE82FF" }} />
                </g>
                <g className="mascot-love-sparkle" style={{ transform: "translate(24px, 108px)" }}>
                  <SparklesIcon size={11} color={{ from: "#FFD900", to: "#FF86D0" }} />
                </g>
              </>
            )}
          </svg>
        </div>

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

        <div
          className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-white dark:border-[var(--surface)]"
          style={{
            background: "linear-gradient(135deg, var(--xp-start, #FFD900) 0%, var(--xp-end, #FF9600) 100%)",
            color: "#8B6914",
            boxShadow: "0 4px 0 var(--xp-shadow, #E5A100), 0 8px 24px var(--xp-glow, rgba(255,217,0,0.35))",
          }}
        >
          {level}
        </div>
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
        <div className="mascot-hint flex items-center gap-1.5">
          <HandClickIcon size={14} color={{ from: "#3DD34C", to: "#1CB0F6" }} />
          <span className="text-[10px] text-[var(--fg-muted)] font-semibold">klik aku!</span>
        </div>
      )}
    </div>
  );
}
