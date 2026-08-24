"use client";

import {
  Sprout, Flame, Star, GraduationCap, Trophy, Dumbbell, Crown, Gem, Medal, Award,
  Brain, Diamond, Zap, Sparkles, Snowflake, Heart, Bot, Rabbit, Smile, Wind, PartyPopper,
  BookOpen, Calculator, Sigma, TrendingUp, BarChart3, Target, Lightbulb, Rocket,
  Shapes, Ruler, Pi, Percent, Hash, ArrowRight, BarChart2, Activity, CircleDot,
  Box, Package, Clock, FileText, Compass, Triangle, Hexagon, Pentagon, Scale, Timer,
  Pointer, Gamepad2, Dices, ThumbsUp, Coffee, CheckCircle, XCircle, MousePointerClick,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import {
  NumbersIcon, ChartIcon, AlgebraIcon, ScaleIcon as ScaleSvg, TriangleIcon,
  RulerIcon, CoinIcon, LinkIcon, GraphIcon, FormulaIcon, GeometryIcon,
  StatIcon, MatrixIcon, CircleIcon, ProbabilityIcon, FunctionIcon, VectorIcon,
  DerivativeIcon, IntegralIcon, LimitIcon, SparklesIcon, TrophyIcon as TrophySvg,
  CrownIcon as CrownSvg, HeartIcon, ZapIcon, FlameIcon, GiftIcon, BookIcon,
  BrainIcon, RocketIcon, TargetIcon, StarIcon, CalendarIcon, GemIcon as GemSvg,
  MedalIcon as MedalSvg, CheckIcon, XIcon, HandClickIcon, PartyIcon,
  CoffeeIcon as CoffeeSvg, DiceIcon, GamepadIcon, LightbulbIcon, PlayIcon,
  SmileIcon,
} from "@/components/icons/CustomIcons";

const NAME_TO_ICON: Record<string, LucideIcon | React.FC<any>> = {
  Sprout, Flame, Star, GraduationCap, Trophy, Dumbbell, Crown, Gem, Medal, Award,
  Brain, Diamond, Zap, Sparkles, Snowflake, Heart, Bot, Rabbit, Smile, Wind, PartyPopper,
  BookOpen, Calculator, Sigma, TrendingUp, BarChart3, Target, Lightbulb, Rocket,
  Shapes, Ruler, Pi, Percent, Hash, ArrowRight, BarChart2, Activity, CircleDot,
  Box, Package, Clock, FileText, Compass, Triangle, Hexagon, Pentagon, Scale, Timer,
  Pointer, Gamepad2, Dices, ThumbsUp, Coffee, CheckCircle, XCircle, MousePointerClick,
  Numbers: NumbersIcon,
  NumbersAlt: AlgebraIcon,
  Chart: ChartIcon,
  Graph: GraphIcon,
  Formula: FormulaIcon,
  Geometry: GeometryIcon,
  Stat: StatIcon,
  Matrix: MatrixIcon,
  Circle: CircleIcon,
  Probability: ProbabilityIcon,
  Function: FunctionIcon,
  Vector: VectorIcon,
  Derivative: DerivativeIcon,
  Integral: IntegralIcon,
  Limit: LimitIcon,
  SparklesCustom: SparklesIcon,
  TrophyCustom: TrophySvg,
  CrownCustom: CrownSvg,
  HeartCustom: HeartIcon,
  ZapCustom: ZapIcon,
  FlameCustom: FlameIcon,
  GiftCustom: GiftIcon,
  BookCustom: BookIcon,
  BrainCustom: BrainIcon,
  RocketCustom: RocketIcon,
  TargetCustom: TargetIcon,
  StarCustom: StarIcon,
  CalendarCustom: CalendarIcon,
  GemCustom: GemSvg,
  MedalCustom: MedalSvg,
  CheckCustom: CheckIcon,
  XCustom: XIcon,
  HandClick: HandClickIcon,
  PartyCustom: PartyIcon,
  CoffeeCustom: CoffeeSvg,
  DiceCustom: DiceIcon,
  GamepadCustom: GamepadIcon,
  LightbulbCustom: LightbulbIcon,
  PlayCustom: PlayIcon,
  SmileCustom: SmileIcon,
  Coin: CoinIcon,
  Link: LinkIcon,
  RulerCustom: RulerIcon,
  TriangleCustom: TriangleIcon,
  ScaleCustom: ScaleSvg,
  Algebra: AlgebraIcon,
};

const EMOJI_TO_ICON: Record<string, LucideIcon | React.FC<any>> = {
  "🔢": NumbersIcon,
  "📊": ChartIcon,
  "📈": StatIcon,
  "⚖️": ScaleSvg,
  "📐": TriangleIcon,
  "📏": RulerIcon,
  "💰": CoinIcon,
  "🔗": LinkIcon,
  "📖": BookIcon,
  "📚": BookIcon,
  "🔤": AlgebraIcon,
  "🧭": TargetIcon,
  "💯": TargetIcon,
  "⭐": StarIcon,
  "🌟": SparklesIcon,
  "💫": SparklesIcon,
  "✨": SparklesIcon,
  "🎯": TargetIcon,
  "🏆": TrophySvg,
  "🥇": MedalSvg,
  "🏅": MedalSvg,
  "👑": CrownSvg,
  "💎": GemSvg,
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
  "☕": CoffeeSvg,
  "✅": CheckIcon,
  "❌": XIcon,
  "🧠": BrainIcon,
  "⏱️": CalendarIcon,
  "📍": TargetIcon,
  "🪙": CoinIcon,
  "📝": FormulaIcon,
  "✍️": FormulaIcon,
  "🎓": TrophySvg,
  "😊": SmileIcon,
  "😉": SmileIcon,
};

export function getIcon(name: string): LucideIcon | React.FC<any> {
  return EMOJI_TO_ICON[name] ?? NAME_TO_ICON[name] ?? CircleDot;
}

export function renderIcon(name: string, size?: number, className?: string, strokeWidth: number = 2.2) {
  const Icon = getIcon(name);
  const isCustom = Object.values(NAME_TO_ICON).slice(56).includes(Icon as any) ||
    Object.values(EMOJI_TO_ICON).includes(Icon as any);

  if (isCustom) {
    const CustomComp = Icon as React.FC<any>;
    return <CustomComp size={size} className={className} />;
  }
  const LucideComp = Icon as LucideIcon;
  return <LucideComp size={size} className={className} strokeWidth={strokeWidth} />;
}

export function renderTopicIcon(emoji: string, size: number = 24, className?: string) {
  return renderIcon(emoji, size, className);
}

interface InlineIconProps {
  emoji: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}
export function InlineIcon({ emoji, size = 14, className = "", strokeWidth = 2.4 }: InlineIconProps) {
  const Comp = getIcon(emoji);
  const isCustom = Object.values(NAME_TO_ICON).slice(56).includes(Comp as any) ||
    Object.values(EMOJI_TO_ICON).includes(Comp as any);

  const RenderComp = Comp as React.FC<any>;
  return (
    <span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      style={{ width: size, height: size, lineHeight: 1 }}
      aria-hidden="true"
    >
      {isCustom ? (
        <RenderComp size={size} />
      ) : (
        <RenderComp size={size} strokeWidth={strokeWidth} />
      )}
    </span>
  );
}
