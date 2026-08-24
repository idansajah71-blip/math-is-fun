"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { useTheme } from "next-themes";
import XPBar from "./ui/XPBar";
import ThemeToggle from "./ui/ThemeToggle";
import AccentColorPicker from "./ui/AccentColorPicker";
import { useSoundManager } from "@/hooks/useSoundManager";
import type { UserProfile } from "@/lib/gamification";

const NAV = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/practice", label: "Latihan", icon: Target },
  { href: "/tryout", label: "Try Out", icon: Trophy },
  { href: "/formulas", label: "Rumus", icon: FileText },
  { href: "/leaderboard", label: "Peringkat", icon: Trophy },
  { href: "/shop", label: "Toko", icon: ShoppingBag },
  { href: "/badges", label: "Pencapaian", icon: Award },
  { href: "/profile", label: "Profil", icon: User },
];

// Nav accent colors per item
const NAV_COLORS: Record<string, string> = {
  "/": "var(--primary)",
  "/practice": "var(--info)",
  "/tryout": "var(--accent-xp)",
  "/formulas": "var(--purple)",
  "/leaderboard": "var(--orange)",
  "/shop": "var(--pink)",
  "/badges": "var(--purple)",
  "/profile": "var(--primary)",
};

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

  const xp = profile?.xp || 0;
  const level = profile?.level || 0;
  const streak = profile?.streak || 0;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="px-4 h-[60px] flex items-center border-b border-[var(--border)] shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="w-9 h-9 bg-[var(--primary)] rounded-[10px] flex items-center justify-center shadow-[0_3px_0_var(--primary-hover)]"
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.92 }}
          >
            <Sigma size={18} className="text-white" strokeWidth={3} />
          </motion.div>
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
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-white font-black text-base border-2 border-white dark:border-[var(--surface)] shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              {profile?.name?.charAt(0)?.toUpperCase() || "P"}
            </motion.div>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-black text-[var(--fg)] truncate leading-tight">
              {profile?.name || "Pelajar"}
            </p>
            <p className="text-[10px] font-bold text-[var(--fg-muted)] leading-tight">
              {LEVEL_NAMES[level] || "Pemula"}
            </p>
          </div>
          {/* Streak pill */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black shrink-0 ${
              streak > 0
                ? "bg-orange-100 dark:bg-orange-950/40 text-orange-500"
                : "bg-[var(--border-subtle)] text-[var(--fg-muted)]"
            }`}
          >
            <Flame size={10} className="flame-anim" />
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

        {/* Gems + XP row */}
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
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          const accentColor = NAV_COLORS[item.href] || "var(--primary)";

          return (
            <Link key={item.href} href={item.href} aria-label={item.label}>
              <motion.div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-colors overflow-hidden ${
                  active
                    ? "bg-[var(--primary-bg)] text-[var(--primary)]"
                    : "text-[var(--fg-muted)] hover:bg-[var(--border-subtle)] hover:text-[var(--fg)]"
                }`}
                whileHover={{ x: active ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                aria-current={active ? "page" : undefined}
              >
                {/* Active left bar */}
                {active && (
                  <motion.div
                    layoutId="sidebarActiveBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: accentColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                    layoutId="sidebarActiveDot"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom settings ── */}
      <div className="px-3 pb-3 pt-2 border-t border-[var(--border)] space-y-0.5 shrink-0">
        {/* Theme toggle row */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold text-[var(--fg-muted)]">
          <span>{theme === "dark" ? "Mode Gelap" : "Mode Terang"}</span>
          <ThemeToggle />
        </div>

        {/* Accent picker */}
        <AccentColorPicker />

        {/* Sound toggle */}
        <motion.button
          onClick={toggleSound}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-[var(--fg-muted)] hover:bg-[var(--border-subtle)] hover:text-[var(--fg)] w-full transition-colors"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          aria-label={soundEnabled ? "Matikan suara" : "Nyalakan suara"}
        >
          {soundEnabled ? (
            <Volume2 size={16} className="text-[var(--primary)]" />
          ) : (
            <VolumeX size={16} />
          )}
          {soundEnabled ? "Suara Aktif" : "Suara Mati"}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[260px] h-screen bg-[var(--surface)] border-r-2 border-[var(--border)] flex-col fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* ── Mobile Hamburger ── */}
      <motion.button
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 bg-[var(--surface)] rounded-xl border-2 border-[var(--border)] flex items-center justify-center shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle navigation menu"
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={18} className="text-[var(--fg)]" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu size={18} className="text-[var(--fg)]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

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
              <SidebarContent />
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
                <motion.div
                  className={`flex flex-col items-center justify-center h-full gap-0.5 transition-colors ${
                    active ? "text-[var(--primary)]" : "text-[var(--fg-muted)]"
                  }`}
                  whileTap={{ scale: 0.88 }}
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
                    <motion.div
                      className="w-4 h-[2px] rounded-full"
                      style={{ background: accentColor }}
                      layoutId="mobileNavLine"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
