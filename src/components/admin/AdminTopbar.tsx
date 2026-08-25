"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, Shield, LogOut, Settings, User } from "lucide-react";
import { getAdminSession, adminLogout } from "@/lib/adminAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminTopbar() {
  const session = getAdminSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  function handleLogout() {
    adminLogout();
    router.push("/admin/login");
  }

  return (
    <header className="h-16 bg-[var(--surface-glass)] backdrop-blur-xl border-b border-[var(--border-subtle)] flex items-center gap-4 px-6 sticky top-0 z-30">
      {/* Search */}
      <div className={`relative flex-1 max-w-md transition-all duration-200 ${searchFocused ? "max-w-lg" : ""}`}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]" />
        <input
          type="text"
          placeholder="Cari user, soal, topik..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-10 pr-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-medium text-[var(--fg)] placeholder:text-[var(--fg-disabled)] focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary-glow)] transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[var(--fg-muted)] hover:bg-[var(--primary-bg)] hover:text-[var(--primary)] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--danger)] rounded-full ring-2 ring-[var(--surface)]" />
        </button>

        {/* Admin Avatar + Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[var(--primary-bg)] transition-all"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
              style={{ background: "var(--grad-primary)" }}>
              {session?.name?.charAt(0) || "A"}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[var(--fg)] leading-tight">{session?.name || "Admin"}</p>
              <p className="text-[10px] font-bold text-[var(--primary)] uppercase leading-tight">{session?.role}</p>
            </div>
            <ChevronDown size={14} className={`text-[var(--fg-muted)] transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-xl)] overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-[var(--border-subtle)]">
                    <p className="text-sm font-bold text-[var(--fg)]">{session?.name}</p>
                    <p className="text-xs text-[var(--fg-muted)]">{session?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--fg-secondary)] hover:bg-[var(--primary-bg)] hover:text-[var(--primary)] transition-colors">
                      <Settings size={15} /> Pengaturan
                    </button>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors">
                      <LogOut size={15} /> Keluar
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
