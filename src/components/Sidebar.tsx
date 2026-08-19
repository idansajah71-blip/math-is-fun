"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile, LEVEL_NAMES, getXpForCurrentLevel, getXpForNextLevel } from "@/lib/gamification";
import { Home, Trophy, Award, User, Zap, Flame, BookOpen, Target, FileText, Download, Share2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const NAV = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/practice", label: "Latihan Bebas", icon: Target },
  { href: "/tryout", label: "Try Out", icon: Trophy },
  { href: "/formulas", label: "Rumus Sheet", icon: FileText },
  { href: "/leaderboard", label: "Peringkat", icon: Trophy },
  { href: "/badges", label: "Pencapaian", icon: Award },
  { href: "/profile", label: "Profil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setProfile(getProfile()); setMounted(true); }, []);

  const xp = profile?.xp || 0;
  const level = profile?.level || 0;
  const streak = profile?.streak || 0;
  const xpCurrent = xp - getXpForCurrentLevel(level);
  const xpNeeded = getXpForNextLevel(level) - getXpForCurrentLevel(level);
  const xpPct = xpNeeded > 0 ? Math.min((xpCurrent / xpNeeded) * 100, 100) : 100;

  const handleExport = () => {
    const data = JSON.stringify(profile, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "belajar-mtk-progress.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `Saya sudah belajar ${profile?.completedTopics?.length || 0} topik di BelajarMTK dengan ${profile?.xp || 0} XP! 🎓`;
    if (navigator.share) {
      await navigator.share({ title: "BelajarMTK", text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(text + " " + window.location.href);
      alert("Link sudah disalin!");
    }
  };

  return (
    <aside className="w-[260px] h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-40">
      <div className="px-5 h-16 flex items-center border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-[15px] font-bold text-gray-900 dark:text-gray-100">BelajarMTK</span>
        </Link>
      </div>

      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#1a73e8] rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {profile?.name?.charAt(0) || "P"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{profile?.name || "Pelajar"}</p>
            <p className="text-xs text-gray-500">{LEVEL_NAMES[level] || "Pemula"}</p>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-gray-500"><Zap size={12} className="text-[#1a73e8]" />{xp} XP</span>
            <span className="text-gray-400">{xpCurrent}/{xpNeeded}</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#1a73e8] rounded-full transition-all duration-700" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Flame size={12} className="text-orange-500" />
          <span>{streak} hari</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                active ? "bg-[#e8f0fe] dark:bg-blue-950/30 text-[#1a73e8]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3 space-y-1 border-t border-gray-100 dark:border-gray-800 pt-3">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors">
          <Share2 size={18} /> Bagikan
        </button>
        <button onClick={handleExport}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors">
          <Download size={18} /> Export Data
        </button>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[10px] text-gray-400">BelajarMTK v1.0</p>
      </div>
    </aside>
  );
}
