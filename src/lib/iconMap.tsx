"use client";

import {
  // Math & Education
  Sigma, Calculator, Pi, Percent, Hash, Ruler, Compass, Triangle, Shapes, Hexagon, Pentagon, Circle,
  Variable, Divide, Plus, Minus, ListOrdered,
  // Science
  FlaskConical, Atom, Microscope, Zap, Waves, Magnet,
  // Academic
  BookOpen, BookMarked, GraduationCap, School, Library, FileText, Notebook, Pen, Pencil, Edit,
  // Charts & Data
  BarChart2, BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity,
  // UI & Navigation
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  Target, Lightbulb, Rocket, Star, Sparkles, Crown, Trophy, Medal, Award, Flag,
  // Social & Emotion
  Heart, ThumbsUp, Smile, PartyPopper, Gift,
  // Objects
  Gem, Diamond, Flame, Snowflake, Sun, Moon, Clock, Timer, Bell, Coffee,
  Coins, Link, Infinity,
  // Status
  CheckCircle, CheckCircle2, XCircle, AlertCircle, Info, Lock, Unlock,
  // Gamification
  Gamepad2, Dices, Brain, Pointer,
  // Person
  User, UserCheck, Bot, Rabbit, Sprout, Dumbbell, Wind,
  // Misc
  Box, Package, Layers, Grid, Map, Navigation, Route, Footprints,
  MousePointerClick, Equal, PencilRuler,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

// ── Name → Icon ───────────────────────────────────────────────────────────────
const NAME_TO_ICON: Record<string, LucideIcon> = {
  Sigma, Calculator, Pi, Percent, Hash, Ruler, Compass, Triangle, Shapes, Hexagon, Pentagon, Circle,
  Variable, Divide, Plus, Minus, Equal,
  FlaskConical, Atom, Microscope, Zap, Waves, Magnet,
  BookOpen, BookMarked, GraduationCap, School, Library, FileText, Notebook, Pen, Pencil, Edit,
  BarChart2, BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  Target, Lightbulb, Rocket, Star, Sparkles, Crown, Trophy, Medal, Award, Flag,
  Heart, ThumbsUp, Smile, PartyPopper, Gift,
  Gem, Diamond, Flame, Snowflake, Sun, Moon, Clock, Timer, Bell, Coffee,
  CheckCircle, CheckCircle2, XCircle, AlertCircle, Info, Lock, Unlock,
  Gamepad2, Dices, Brain, Pointer,
  User, UserCheck, Bot, Rabbit, Sprout, Dumbbell, Wind,
  Box, Package, Layers, Grid, Map, Navigation, Route, Footprints,
  MousePointerClick,

  // ── Phosphor Icons → Lucide equivalents (used in topics.json) ────────────
  // Exact matches
  PencilRuler,        // PencilRuler (Lucide has this)
  Infinity,           // Infinity
  // Mapped names
  NumberCircleOne:  ListOrdered,
  CirclesThree:     Shapes,
  CirclesFour:      Shapes,
  Function:         Sigma,
  Scales:           Layers,
  WarningCircle:    AlertCircle,
  Warning:          AlertCircle,
  ListNumbers:      ListOrdered,
  Graph:            LineChart,
  CompassTool:      Compass,
  ChartBar:         BarChart3,
  ChartBarHorizontal: BarChart2,
  ChartDonut:       PieChart,
  ChartLine:        LineChart,
  CircleNotch:      Circle,
  DiceSix:          Dices,
  LightbulbFilament: Lightbulb,
  RocketLaunch:     Rocket,
  Sphere:           Circle,
  TrendUp:          TrendingUp,
  WaveTriangle:     Waves,
  Cube:             Box,
  Tilde:            Sigma,
};

// ── Emoji → Icon ──────────────────────────────────────────────────────────────
const EMOJI_TO_ICON: Record<string, LucideIcon> = {
  "➕": Plus, "➖": Minus, "✖️": Calculator, "➗": Divide, "=": Equal,
  "📊": BarChart3, "📈": TrendingUp, "📉": TrendingDown,
  "📐": Ruler, "📏": Ruler, "🧮": Calculator, "🔢": Hash, "🔣": Sigma,
  "📖": BookOpen, "📚": BookOpen, "📓": Notebook, "📝": Edit, "🖊️": Pen, "✏️": Pencil, "📄": FileText,
  "⚗️": FlaskConical, "🔬": Microscope, "⚛️": Atom, "🧪": FlaskConical,
  "🔺": Triangle, "🔻": Triangle, "⬛": Box, "🔷": Diamond, "🔶": Diamond, "⭕": Circle, "🔵": Circle,
  "✅": CheckCircle2, "❌": XCircle, "⚠️": AlertCircle, "ℹ️": Info, "🔒": Lock, "🔓": Unlock,
  "🏆": Trophy, "🥇": Medal, "🥈": Medal, "🥉": Medal, "🏅": Award,
  "⭐": Star, "🌟": Sparkles, "💫": Sparkles, "✨": Sparkles, "👑": Crown, "💎": Gem,
  "🎁": Gift, "🎊": PartyPopper, "🎉": PartyPopper, "🎓": GraduationCap,
  "🔥": Flame, "❤️": Heart, "💜": Heart, "💙": Heart, "💚": Heart, "💛": Heart,
  "👍": ThumbsUp, "😊": Smile, "😄": Smile, "☕": Coffee,
  "🕐": Clock, "⏱️": Timer, "⏰": Clock, "🧠": Brain, "💡": Lightbulb, "🚀": Rocket,
  "⚡": Zap, "🎯": Target, "🎮": Gamepad2, "🎲": Dices,
  "❄️": Snowflake, "☀️": Sun, "🌙": Moon, "🔔": Bell,
  "👆": Pointer, "☝️": Pointer, "👉": ArrowRight, "👋": Wind,
  "💪": Dumbbell, "🤖": Bot, "🐰": Rabbit, "🌱": Sprout,
  "🗺️": Map, "🧭": Compass, "📍": Target, "🚩": Flag,
  "🪙": Gem, "💰": Gem,
  // Common Indonesian edu app emojis
  "😀": Smile, "😃": Smile, "😁": Smile, "🙂": Smile, "🤩": Sparkles,
  "🤝": ThumbsUp, "🙌": ThumbsUp,
  "📌": Target, "🗒️": Notebook, "🗂️": Layers, "📋": FileText,
  "🔑": Unlock, "🗝️": Unlock, "🧩": Shapes, "🎨": Shapes, "🎪": Gamepad2,
  "🎭": Shapes, "🎬": Gamepad2, "🎤": Bell, "🎵": Bell, "🎶": Bell,
  "🌈": Sparkles, "🌅": Sun, "🌄": Sun, "🌇": Sun, "🌃": Moon, "🌆": Sun,
  "🏔️": Triangle, "⛰️": Triangle, "🌋": Triangle,
  "📡": Navigation, "🛸": Rocket, "🚁": Navigation,
};

const FALLBACK: LucideIcon = Circle;

/* ─────────────────────────────────────────────
   PUBLIC API
───────────────────────────────────────────── */

export function getIcon(name: string): LucideIcon {
  if (!name) return FALLBACK;
  if (NAME_TO_ICON[name]) return NAME_TO_ICON[name];
  if (EMOJI_TO_ICON[name]) return EMOJI_TO_ICON[name];
  const lower = name.toLowerCase();
  const nameKey = Object.keys(NAME_TO_ICON).find((k) => k.toLowerCase() === lower);
  if (nameKey) return NAME_TO_ICON[nameKey];
  return FALLBACK;
}

export function renderIcon(
  name: string,
  size?: number,
  className?: string,
  strokeWidth = 2.2
): React.ReactElement {
  const Icon = getIcon(name);
  return <Icon size={size} className={className} strokeWidth={strokeWidth} />;
}

export function renderTopicIcon(icon: string, size = 24, className?: string) {
  return renderIcon(icon, size, className, 2.2);
}

interface InlineIconProps {
  emoji: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** Drop-in replacement for any raw emoji in JSX */
export function InlineIcon({
  emoji,
  size = 14,
  className = "",
  strokeWidth = 2.4,
}: InlineIconProps) {
  const Comp = getIcon(emoji);
  return (
    <span
      className={`inline-flex items-center justify-center align-middle shrink-0 ${className}`}
      style={{ width: size, height: size, lineHeight: 1 }}
      aria-hidden="true"
    >
      <Comp size={size} strokeWidth={strokeWidth} />
    </span>
  );
}
