"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, BookOpen, Calendar, Megaphone, Flag,
  BarChart3, History, Shield, LogOut, Menu, X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
  }

  function NavContent() {
    return (
      <>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border-subtle)]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--grad-primary)" }}>
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-[var(--fg)] leading-tight">Matika</p>
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
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-lg"
        aria-label="Buka menu admin"
      >
        <Menu size={20} className="text-[var(--fg)]" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[240px] bg-[var(--surface)] border-r border-[var(--border-subtle)] flex-col fixed h-full z-30">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-[var(--surface)] border-r border-[var(--border-subtle)] flex flex-col z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--surface-sunken)]"
                aria-label="Tutup menu"
              >
                <X size={18} className="text-[var(--fg-muted)]" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
