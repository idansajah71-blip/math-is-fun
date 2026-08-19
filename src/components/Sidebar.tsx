"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, LEVEL_NAMES, getXpForCurrentLevel, getXpForNextLevel } from "@/lib/gamification";
import { Home, Trophy, Award, User, Zap, Flame, Target, FileText, Moon, Sun, Volume2, VolumeX, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import XPBar from "./ui/XPBar";

const NAV = [
  { href: "/", label: "Beranda", icon: Home, color: "text-[var(--duo-green)]" },
  { href: "/practice", label: "Latihan", icon: Target, color: "text-[var(--duo-info)]" },
  { href: "/tryout", label: "Try Out", icon: Trophy, color: "text-[var(--duo-xp)]" },
  { href: "/formulas", label: "Rumus", icon: FileText, color: "text-[var(--duo-purple)]" },
  { href: "/leaderboard", label: "Peringkat", icon: Trophy, color: "text-[var(--duo-orange)]" },
  { href: "/shop", label: "Toko", icon: ShoppingBag, color: "text-[var(--duo-purple)]" },
  { href: "/badges", label: "Pencapaian", icon: Award, color: "text-[var(--duo-pink)]" },
  { href: "/profile", label: "Profil", icon: User, color: "text-[var(--duo-green)]" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const xp = profile?.xp || 0;
  const level = profile?.level || 0;
  const streak = profile?.streak || 0;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-[var(--duo-border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <motion.div
            className="w-9 h-9 bg-[var(--duo-green)] rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white font-black text-sm">M</span>
          </motion.div>
          <span className="text-[15px] font-black text-[var(--duo-text)]">BelajarMTK</span>
        </Link>
      </div>

      {/* Profile Mini */}
      <div className="px-4 py-4 border-b border-[var(--duo-border)]">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--duo-green)] to-[var(--duo-green-dark)] flex items-center justify-center text-white font-black text-sm border-2 border-white dark:border-[var(--duo-card)] shadow-md"
            whileHover={{ scale: 1.1 }}
          >
            {profile?.name?.charAt(0) || "P"}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--duo-text)] truncate">
              {profile?.name || "Pelajar"}
            </p>
            <p className="text-[10px] font-bold text-[var(--duo-text-muted)]">
              {LEVEL_NAMES[level] || "Pemula"}
            </p>
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
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className={streak > 0 ? "text-orange-500" : "text-gray-400"} />
            <span className={`text-xs font-bold ${streak > 0 ? "text-orange-500" : "text-gray-400"}`}>
              {streak} hari
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--duo-xp)]">{xp} XP</span>
            <span className="text-xs font-bold text-[var(--duo-purple)]">{profile?.gems || 0} 💎</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  active
                    ? "bg-[var(--duo-green-bg)] text-[var(--duo-green)]"
                    : "text-[var(--duo-text-muted)] hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[var(--duo-text)]"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={18} className={active ? item.color : ""} />
                {item.label}
                {active && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 bg-[var(--duo-green)] rounded-full"
                    layoutId="activeNav"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-3 space-y-1 border-t border-[var(--duo-border)] pt-3">
        <motion.button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-[var(--duo-text-muted)] hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
        </motion.button>
        <motion.button
          onClick={() => setMuted(!muted)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-[var(--duo-text-muted)] hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          {muted ? "Unmute" : "Mute"}
        </motion.button>
      </div>

      {/* Version */}
      <div className="px-5 py-3 border-t border-[var(--duo-border)]">
        <p className="text-[10px] font-bold text-[var(--duo-text-muted)]">BelajarMTK v2.0</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] h-screen bg-white dark:bg-[var(--duo-card)] border-r-2 border-[var(--duo-border)] flex-col fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white dark:bg-[var(--duo-card)] rounded-xl border-2 border-[var(--duo-border)] flex items-center justify-center shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
        whileTap={{ scale: 0.9 }}
      >
        {mobileOpen ? <X size={18} className="text-[var(--duo-text)]" /> : <Menu size={18} className="text-[var(--duo-text)]" />}
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 w-[280px] h-screen bg-white dark:bg-[var(--duo-card)] border-r-2 border-[var(--duo-border)] flex flex-col z-50 overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[var(--duo-card)] border-t-2 border-[var(--duo-border)] px-2 py-1 safe-area-bottom">
        <div className="flex items-center justify-around">
          {NAV.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                    active ? "text-[var(--duo-green)]" : "text-[var(--duo-text-muted)]"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[9px] font-bold">{item.label}</span>
                  {active && (
                    <motion.div
                      className="w-1 h-1 bg-[var(--duo-green)] rounded-full"
                      layoutId="mobileNav"
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
