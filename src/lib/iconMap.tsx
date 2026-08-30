"use client";

import {
  Sprout, Flame, Star, GraduationCap, Trophy, Dumbbell, Crown, Gem, Medal, Award,
  Brain, Diamond, Zap, Sparkles, Snowflake, Heart, Bot, Rabbit, Smile, Wind, PartyPopper,
  BookOpen, Calculator, Sigma, TrendingUp, BarChart3, Target, Lightbulb, Rocket,
  Shapes, Ruler, Pi, Percent, Hash, ArrowRight, BarChart2, Activity, CircleDot,
  Box, Package, Clock, FileText, Compass, Triangle, Hexagon, Pentagon, Scale, Timer,
  Pointer, Gamepad2, Dices, ThumbsUp, Coffee, CheckCircle, XCircle, MousePointerClick,
  Shield, Swords, CheckCircle2, FlameKindling, Hourglass, Mountain, ShoppingBag,
  BookmarkCheck, RotateCcw, Infinity, CircleDashed,
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

// Phosphor Icons — bold weight for world map nodes
import {
  NumberCircleOne as PhNumberCircleOne,
  CirclesThree as PhCirclesThree,
  Function as PhFunction,
  Scales as PhScales,
  WarningCircle as PhWarningCircle,
  Ruler as PhRuler,
  Coins as PhCoins,
  ListNumbers as PhListNumbers,
  Link as PhLink,
  Graph as PhGraph,
  CompassTool as PhCompassTool,
  Triangle as PhTriangle,
  PencilRuler as PhPencilRuler,
  Circle as PhCircle,
  Cube as PhCube,
  Sphere as PhSphere,
  ChartBar as PhChartBar,
  DiceSix as PhDiceSix,
  Compass as PhCompass,
  Rocket as PhRocket,
  Calculator as PhCalculator,
  Warning as PhWarning,
  CirclesFour as PhCirclesFour,
  Magnet as PhMagnet,
  Tilde as PhTilde,
  WaveTriangle as PhWaveTriangle,
  TrendUp as PhTrendUp,
  RocketLaunch as PhRocketLaunch,
  Infinity as PhInfinity,
  ChartBarHorizontal as PhChartBarHorizontal,
  ChartLine as PhChartLine,
  Lightbulb as PhLightbulb,
  CircleNotch as PhCircleNotch,
  Atom as PhAtom,
  Sigma as PhSigma,
  LightbulbFilament as PhLightbulbFilament,
  ChartDonut as PhChartDonut,
} from "@phosphor-icons/react";

const NAME_TO_ICON: Record<string, LucideIcon | React.FC<any>> = {
  Sprout, Flame, Star, GraduationCap, Trophy, Dumbbell, Crown, Gem, Medal, Award,
  Brain, Diamond, Zap, Sparkles, Snowflake, Heart, Bot, Rabbit, Smile, Wind, PartyPopper,
  BookOpen, Calculator, Sigma, TrendingUp, BarChart3, Target, Lightbulb, Rocket,
  Shapes, Ruler, Pi, Percent, Hash, ArrowRight, BarChart2, Activity, CircleDot,
  Box, Package, Clock, FileText, Compass, Triangle, Hexagon, Pentagon, Scale, Timer,
  Pointer, Gamepad2, Dices, ThumbsUp, Coffee, CheckCircle, XCircle, MousePointerClick,
  Shield, Swords, CheckCircle2, FlameKindling, Hourglass, Mountain, ShoppingBag,
  BookmarkCheck, RotateCcw, Infinity, CircleDashed,
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

// Phosphor icon mapping — used for world map topic icons
const PHOSPHOR_ICONS: Record<string, React.FC<any>> = {
  NumberCircleOne: PhNumberCircleOne,
  CirclesThree: PhCirclesThree,
  Function: PhFunction,
  Scales: PhScales,
  WarningCircle: PhWarningCircle,
  Ruler: PhRuler,
  Coins: PhCoins,
  ListNumbers: PhListNumbers,
  Link: PhLink,
  Graph: PhGraph,
  CompassTool: PhCompassTool,
  Triangle: PhTriangle,
  PencilRuler: PhPencilRuler,
  Circle: PhCircle,
  Cube: PhCube,
  Sphere: PhSphere,
  ChartBar: PhChartBar,
  DiceSix: PhDiceSix,
  Compass: PhCompass,
  Rocket: PhRocket,
  Calculator: PhCalculator,
  Warning: PhWarning,
  CirclesFour: PhCirclesFour,
  Magnet: PhMagnet,
  Tilde: PhTilde,
  WaveTriangle: PhWaveTriangle,
  TrendUp: PhTrendUp,
  RocketLaunch: PhRocketLaunch,
  Infinity: PhInfinity,
  ChartBarHorizontal: PhChartBarHorizontal,
  ChartLine: PhChartLine,
  Lightbulb: PhLightbulb,
  CircleNotch: PhCircleNotch,
  Atom: PhAtom,
  Sigma: PhSigma,
  LightbulbFilament: PhLightbulbFilament,
  ChartDonut: PhChartDonut,
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
  return PHOSPHOR_ICONS[name] ?? EMOJI_TO_ICON[name] ?? NAME_TO_ICON[name] ?? CircleDot;
}

export function renderIcon(name: string, size?: number, className?: string, strokeWidth: number = 2.2) {
  const Icon = getIcon(name);
  const isPhosphor = name in PHOSPHOR_ICONS;
  const isCustom = Object.values(NAME_TO_ICON).slice(56).includes(Icon as any) ||
    Object.values(EMOJI_TO_ICON).includes(Icon as any);

  if (isPhosphor) {
    const PhComp = Icon as React.FC<any>;
    return <PhComp size={size} className={className} weight="bold" />;
  }

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
  const isPhosphor = emoji in PHOSPHOR_ICONS;
  const isCustom = Object.values(NAME_TO_ICON).slice(56).includes(Comp as any) ||
    Object.values(EMOJI_TO_ICON).includes(Comp as any);

  const RenderComp = Comp as React.FC<any>;
  return (
    <span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      style={{ width: size, height: size, lineHeight: 1 }}
      aria-hidden="true"
    >
      {isPhosphor ? (
        <RenderComp size={size} weight="bold" />
      ) : isCustom ? (
        <RenderComp size={size} />
      ) : (
        <RenderComp size={size} strokeWidth={strokeWidth} />
      )}
    </span>
  );
}
