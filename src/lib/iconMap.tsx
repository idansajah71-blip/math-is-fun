"use client";

import {
  Sprout, Flame, Star, GraduationCap, Trophy, Dumbbell, Crown, Gem, Medal, Award,
  Brain, Diamond, Zap, Sparkles, Snowflake, Heart, Bot, Rabbit, Smile, Wind, PartyPopper,
  BookOpen, Calculator, Sigma, TrendingUp, BarChart3, Target, Lightbulb, Rocket,
  Shapes, Ruler, Pi, Percent, Hash, ArrowRight, BarChart2, Activity, CircleDot,
  Box, Package, Clock, FileText, Compass, Triangle, Hexagon, Pentagon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Sprout, Flame, Star, GraduationCap, Trophy, Dumbbell, Crown, Gem, Medal, Award,
  Brain, Diamond, Zap, Sparkles, Snowflake, Heart, Bot, Rabbit, Smile, Wind, PartyPopper,
  BookOpen, Calculator, Sigma, TrendingUp, BarChart3, Target, Lightbulb, Rocket,
  Shapes, Ruler, Pi, Percent, Hash, ArrowRight, BarChart2, Activity, CircleDot,
  Box, Package, Clock, FileText, Compass, Triangle, Hexagon, Pentagon,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || CircleDot;
}

export function renderIcon(name: string, size?: number, className?: string) {
  const Icon = getIcon(name);
  return <Icon size={size} className={className} />;
}
