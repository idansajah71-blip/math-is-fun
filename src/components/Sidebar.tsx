"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getProfile,
  LEVEL_NAMES,
  getXpForCurrentLevel,
  getXpForNextLevel,
} from "@/lib/gamification";
import {
  Home,
  Trophy,
  Award,
  User,
  Flame,
  Target,
  FileText,
  Volume2,
  VolumeX,
  ShoppingBag,
  Menu,
  X,
  Gem,
  Sigma,
  AlertTriangle,
  Bookmark,
  Sparkles,
  Brain,
  Swords,
  Shield,
  Crown,
  Calendar,
} from "lucide-react";
import { useTheme } from "next-themes";
import XPBar from "./ui/XPBar";
import ThemeToggle from "./ui/ThemeToggle";
import AccentColorPicker from "./ui/AccentColorPicker";
import { useSoundManager } from "@/hooks/useSoundManager";
import type { UserProfile } from "@/lib/gamification";
import { isPremiumActive } from "@/lib/gamification";
import { isFlagEnabled } from "@/lib/admin/flags";

const NAV = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/practice", label: "Latihan", icon: Target },
  { href: "/tryout", label: "Try Out", icon: Trophy },
  { href: "/formulas", label: "Rumus", icon: FileText },
  { href: "/leaderboard", label: "Peringkat", icon: Trophy },
  { href: "/daily-quiz", label: "Quiz Harian", icon: Sparkles },
  { href: "/shop", label: "Toko", icon: ShoppingBag },
  { href: "/badges", label: "Pencapaian", icon: Award },
  { href: "/review", label: "Review Salah", icon: AlertTriangle },
  { href: "/bookmark", label: "Bookmark", icon: Bookmark },
  { href: "/spaced-repetition", label: "Ulangan", icon: Brain },
  { href: "/friends", label: "Teman", icon: Swords },
  { href: "/events", label: "Event", icon: Calendar },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/admin", label: "Admin", icon: Shield, hidden: true },
];

const NAV_COLORS: Record<string, string> = {
  "/": "var(--primary)",
  "/practice": "var(--info)",
  "/tryout": "var(--accent-xp)",
  "/formulas": "var(--purple)",
  "/leaderboard": "var(--orange)",
  "/daily-quiz": "var(--info)",
  "/shop": "var(--pink)",
  "/badges": "var(--purple)",
  "/review": "var(--danger)",
  "/bookmark": "var(--yellow)",
  "/spaced-repetition": "var(--purple)",
  "/friends": "var(--info)",
  "/events": "var(--primary)",
  "/profile": "var(--primary)",
  "/admin": "var(--danger)",
};

function SidebarInner({
  profile,
  pathname,
  theme,
  soundEnabled,
  toggleSound,
}: {
  profile: UserProfile | null;
  pathname: string;
  theme: string | undefined;
  soundEnabled: boolean;
  toggleSound: () => void;
}) {
  const xp = profile?.xp || 0;
  const level = profile?.level || 0;
  const streak = profile?.streak || 0;

  return (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="px-4 h-[60px] flex items-center border-b border-[var(--border)] shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-[var(--primary)] rounded-[10px] flex items-center justify-center shadow-[0_3px_0_var(--primary-hover)] transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
            <Sigma size={18} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <span className="text-[15px] font-black text-[var(--fg)] leading-none block">
              BelajarMTK
            </span>
            <span className="text-[9px] font-bold text-[var(--fg-muted)] uppercase tracking-widest">
              v2.0
            </span>
          </div>
        </Link>
      </div>

      {/* ── Profile Mini ── */}
      <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3 mb-2.5">
          <Link href="/profile" className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-white font-black text-base border-2 border-white dark:border-[var(--surface)] shadow-md transition-transform duration-150 hover:scale-110 active:scale-95">
              {profile?.name?.charAt(0)?.toUpperCase() || <div className="w-4 h-4 rounded-full bg-white/40 animate-pulse" />}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-black text-[var(--fg)] truncate leading-tight flex items-center gap-1.5">
              {profile ? (
                <>
                  {profile.name}
                  {isFlagEnabled("premium") && isPremiumActive() && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[8px] font-black rounded-full flex items-center gap-0.5">
                      <Crown size={8} /> PRO
                    </span>
                  )}
                </>
              ) : (
                <div className="h-3.5 w-20 bg-[var(--border)] rounded animate-pulse" />
              )}
            </p>
            <p className="text-[10px] font-bold text-[var(--fg-muted)] leading-tight">
              {profile ? (LEVEL_NAMES[level] || "Pemula") : ""}
            </p>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black shrink-0 ${
              streak > 0
                ? "bg-orange-100 dark:bg-orange-950/40 text-orange-500"
                : "bg-[var(--border-subtle)] text-[var(--fg-muted)]"
            }`}
          >
            <Flame size={10} className={streak > 0 ? "flame-anim" : ""} />
            {streak}
          </div>
        </div>

        <XPBar
          currentXp={xp}
          levelXp={getXpForCurrentLevel(level)}
          nextLevelXp={getXpForNextLevel(level)}
          level={level}
          levelName={LEVEL_NAMES[level] || "Pemula"}
          showLabel={false}
        />

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--primary-bg)] text-[var(--primary)] text-[10px] font-black">
            <span className="w-3 h-3 rounded-sm bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white text-[7px] font-black leading-none">XP</span>
            </span>
            {xp}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--purple-bg)] text-[var(--purple-dark)] text-[10px] font-black">
            <Gem size={10} />
            {profile?.gems || 0}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--danger-bg)] text-[var(--danger)] text-[10px] font-black">
            <span className="text-[10px] leading-none">♥</span>
            {profile?.hearts ?? 5}/{profile?.maxHearts ?? 5}
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav
        className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto"
        aria-label="Main navigation"
      >
        {NAV.filter((item) => !item.hidden).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          const accentColor = NAV_COLORS[item.href] || "var(--primary)";

          return (
            <Link key={item.href} href={item.href} aria-label={item.label}>
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 overflow-hidden nav-item ${
                  active
                    ? "bg-[var(--primary-bg)] text-[var(--primary)]"
                    : "text-[var(--fg-muted)] hover:bg-[var(--border-subtle)] hover:text-[var(--fg)] hover:translate-x-[3px]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full transition-colors duration-200"
                    style={{ background: accentColor }}
                  />
                )}

                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    active ? "bg-white dark:bg-[var(--surface)] shadow-sm" : ""
                  }`}
                >
                  <Icon
                    size={16}
                    style={active ? { color: accentColor } : undefined}
                    aria-hidden="true"
                  />
                </span>
                <span>{item.label}</span>

                {active && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom settings ── */}
      <div className="px-3 pb-3 pt-2 border-t border-[var(--border)] space-y-0.5 shrink-0">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold text-[var(--fg-muted)]">
          <span>{theme === "dark" ? "Mode Gelap" : "Mode Terang"}</span>
          <ThemeToggle />
        </div>

        <AccentColorPicker />

        <button
          onClick={toggleSound}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-[var(--fg-muted)] hover:bg-[var(--border-subtle)] hover:text-[var(--fg)] w-full transition-all duration-150 hover:translate-x-[3px]"
          aria-label={soundEnabled ? "Matikan suara" : "Nyalakan suara"}
        >
          {soundEnabled ? (
            <Volume2 size={16} className="text-[var(--primary)]" />
          ) : (
            <VolumeX size={16} />
          )}
          {soundEnabled ? "Suara Aktif" : "Suara Mati"}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { enabled: soundEnabled, toggle: toggleSound } = useSoundManager();

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarProps = useMemo(
    () => ({ profile, pathname, theme, soundEnabled, toggleSound }),
    [profile, pathname, theme, soundEnabled, toggleSound]
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[260px] h-screen bg-[var(--surface)] border-r-2 border-[var(--border)] flex-col fixed left-0 top-0 z-40">
        <SidebarInner {...sidebarProps} />
      </aside>

      {/* ── Mobile Hamburger ── */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 bg-[var(--surface)] rounded-xl border-2 border-[var(--border)] flex items-center justify-center shadow-md active:scale-90 transition-transform duration-100"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? (
          <X size={18} className="text-[var(--fg)]" />
        ) : (
          <Menu size={18} className="text-[var(--fg)]" />
        )}
      </button>

      {/* ── Mobile Overlay + Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="lg:hidden fixed left-0 top-0 w-[280px] h-screen bg-[var(--surface)] border-r-2 border-[var(--border)] flex flex-col z-50 overflow-y-auto"
            >
              <SidebarInner {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t-2 border-[var(--border)] px-1 safe-area-bottom"
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch justify-around h-14">
          {NAV.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const accentColor = NAV_COLORS[item.href] || "var(--primary)";

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="flex-1"
              >
                <div
                  className={`flex flex-col items-center justify-center h-full gap-0.5 transition-colors duration-150 active:scale-90 ${
                    active ? "text-[var(--primary)]" : "text-[var(--fg-muted)]"
                  }`}
                  aria-current={active ? "page" : undefined}
                  style={active ? { color: accentColor } : undefined}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.5 : 1.8}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-black">{item.label}</span>
                  {active && (
                    <div
                      className="w-4 h-[2px] rounded-full"
                      style={{ background: accentColor }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
