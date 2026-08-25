"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, BookOpen, Calendar, Megaphone, Flag,
  BarChart3, History, Shield, LogOut,
} from "lucide-react";
import { adminLogout } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: BookOpen },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/flags", label: "Feature Flags", icon: Flag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/audit", label: "Audit Log", icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    adminLogout();
    router.push("/admin/login");
  }

  return (
    <aside className="w-[240px] bg-[var(--surface)] border-r border-[var(--border-subtle)] flex flex-col fixed h-full z-30">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border-subtle)]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--grad-primary)" }}>
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-[var(--fg)] leading-tight">BelajarMTK</p>
          <p className="text-[10px] font-bold text-[var(--primary)] uppercase leading-tight">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 group ${
                isActive
                  ? "bg-[var(--primary-bg)] text-[var(--primary)]"
                  : "text-[var(--fg-muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--fg)]"
              }`}>
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="admin-nav-pill"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--primary)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isActive
                  ? "bg-white dark:bg-[var(--surface-elevated)] shadow-sm"
                  : ""
              }`}>
                <item.icon size={16} />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <LogOut size={16} />
          </div>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
