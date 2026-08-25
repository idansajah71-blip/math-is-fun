"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn, getAdminSession, adminLogout } from "@/lib/adminAuth";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Users, Calendar, LogOut, Menu, X, BarChart3, BookOpen, History, Flag, Megaphone } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: BookOpen },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/flags", label: "Flags", icon: Flag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/audit", label: "Audit Log", icon: History },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<ReturnType<typeof getAdminSession>>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const s = getAdminSession();
    if (!s) {
      router.push("/admin/login");
    } else {
      setSession(s);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[var(--duo-bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function handleLogout() {
    adminLogout();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--duo-bg)] flex">
      {/* Sidebar */}
      <aside className={`w-[260px] bg-white dark:bg-[var(--duo-card)] border-r-2 border-[var(--duo-border)] flex flex-col fixed h-full z-30 max-lg:hidden`}>
        <div className="p-5 border-b-2 border-[var(--duo-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-[var(--duo-text)]">Admin Panel</p>
              <p className="text-[10px] text-[var(--duo-text-muted)] font-bold">{session.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-800"
                    : "text-[var(--duo-text-muted)] hover:bg-[var(--duo-bg)] hover:text-[var(--duo-text)]"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t-2 border-[var(--duo-border)]">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs font-bold text-[var(--duo-text)]">{session.name}</p>
            <p className="text-[10px] text-[var(--duo-text-muted)]">{session.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)] z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-red-500" />
          <span className="text-sm font-black text-[var(--duo-text)]">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[var(--duo-text-muted)]">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="w-[260px] bg-white dark:bg-[var(--duo-card)] h-full p-3 space-y-1" onClick={(e) => e.stopPropagation()}>
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive ? "bg-red-50 dark:bg-red-950/30 text-red-500" : "text-[var(--duo-text-muted)]"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 mt-4">
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-[260px] pt-16 lg:pt-0 pb-8">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
