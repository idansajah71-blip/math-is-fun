"use client";

import { useEffect, useState, useCallback } from "react";
import { getProfile, activatePremium, getAllUserProfiles, UserProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Users, Crown, Search, Shield, ArrowUp, Calendar, Zap, Trophy, Flame, CheckCircle2, XCircle } from "lucide-react";

interface UserData {
  key: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  lastActive: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [filterPremium, setFilterPremium] = useState<"all" | "premium" | "free">("all");
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgraded, setUpgraded] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    const profile = getProfile();
    const currentUser: UserData = {
      key: "current",
      name: profile.name,
      email: localStorage.getItem("belajar-mtk-auth-user") ? JSON.parse(localStorage.getItem("belajar-mtk-auth-user") || "{}").email || "local" : "local",
      xp: profile.xp,
      level: profile.level,
      streak: profile.streak,
      isPremium: profile.isPremium,
      premiumExpiresAt: profile.premiumExpiresAt,
      lastActive: profile.lastActive,
    };

    const allUsers: UserData[] = [currentUser];

    try {
      const usersJson = localStorage.getItem("belajar-mtk-all-users");
      if (usersJson) {
        const parsed = JSON.parse(usersJson);
        Object.entries(parsed).forEach(([key, val]) => {
          const p = val as UserProfile;
          if (key !== "current") {
            allUsers.push({
              key,
              name: p.name || "Pelajar",
              email: key,
              xp: p.xp || 0,
              level: p.level || 0,
              streak: p.streak || 0,
              isPremium: p.isPremium || false,
              premiumExpiresAt: p.premiumExpiresAt || null,
              lastActive: p.lastActive || "-",
            });
          }
        });
      }
    } catch {}

    setUsers(allUsers);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  function handleUpgrade(key: string, days: number) {
    setUpgrading(key);
    setTimeout(() => {
      if (key === "current") {
        activatePremium(days);
      } else {
        const profile = getProfile();
        const expires = new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
        profile.isPremium = true;
        profile.premiumActivatedAt = new Date().toISOString().split("T")[0];
        profile.premiumExpiresAt = expires;

        try {
          const usersJson = localStorage.getItem("belajar-mtk-all-users");
          if (usersJson) {
            const parsed = JSON.parse(usersJson);
            if (parsed[key]) {
              parsed[key].isPremium = true;
              parsed[key].premiumActivatedAt = profile.premiumActivatedAt;
              parsed[key].premiumExpiresAt = expires;
              localStorage.setItem("belajar-mtk-all-users", JSON.stringify(parsed));
            }
          }
        } catch {}
      }
      setUpgrading(null);
      setUpgraded(key);
      setTimeout(() => setUpgraded(null), 2000);
      loadUsers();
    }, 800);
  }

  function handleRemovePremium(key: string) {
    if (key === "current") {
      const profile = getProfile();
      profile.isPremium = false;
      profile.premiumExpiresAt = null;
      const { saveProfile } = require("@/lib/gamification");
      saveProfile(profile);
    } else {
      try {
        const usersJson = localStorage.getItem("belajar-mtk-all-users");
        if (usersJson) {
          const parsed = JSON.parse(usersJson);
          if (parsed[key]) {
            parsed[key].isPremium = false;
            parsed[key].premiumExpiresAt = null;
            localStorage.setItem("belajar-mtk-all-users", JSON.stringify(parsed));
          }
        }
      } catch {}
    }
    loadUsers();
  }

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterPremium === "all" || (filterPremium === "premium" && u.isPremium) || (filterPremium === "free" && !u.isPremium);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
          <Users size={24} className="text-blue-500" />
          User Management
        </h1>
        <p className="text-sm text-[var(--duo-text-muted)] mt-1">Kelola akun user dan premium status</p>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--duo-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {([
            { key: "all", label: "Semua" },
            { key: "premium", label: "Premium" },
            { key: "free", label: "Free" },
          ] as const).map((f) => (
            <button key={f.key} onClick={() => setFilterPremium(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterPremium === f.key
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--duo-border)] bg-gray-50 dark:bg-gray-900/30">
                <th className="text-left px-5 py-3 text-xs font-bold text-[var(--duo-text-muted)]">User</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-[var(--duo-text-muted)]">Level</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-[var(--duo-text-muted)]">XP</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-[var(--duo-text-muted)]">Streak</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-[var(--duo-text-muted)]">Premium</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-[var(--duo-text-muted)]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--duo-border)] last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${user.isPremium ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-blue-500 to-cyan-400"}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--duo-text)] flex items-center gap-1.5">
                          {user.name}
                          {user.key === "current" && <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full">YOU</span>}
                        </p>
                        <p className="text-[10px] text-[var(--duo-text-muted)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-[var(--duo-text)]">Lv.{user.level}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-[var(--duo-xp)]">{user.xp.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                      <Flame size={12} /> {user.streak}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {user.isPremium ? (
                      <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                        <Crown size={12} />
                        {user.premiumExpiresAt ? `Sampai ${user.premiumExpiresAt}` : "Selamanya"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400">Free</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {upgrading === user.key ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : upgraded === user.key ? (
                        <span className="text-[10px] font-bold text-green-500 flex items-center gap-1"><CheckCircle2 size={12} /> Berhasil!</span>
                      ) : user.isPremium ? (
                        <button onClick={() => handleRemovePremium(user.key)}
                          className="px-3 py-1.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                          <XCircle size={12} className="inline mr-1" />
                          Cabut
                        </button>
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => handleUpgrade(user.key, 7)}
                            className="px-3 py-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                            <ArrowUp size={12} className="inline mr-1" />
                            7 Hari
                          </button>
                          <button onClick={() => handleUpgrade(user.key, 30)}
                            className="px-3 py-1.5 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors">
                            <Crown size={12} className="inline mr-1" />
                            30 Hari
                          </button>
                          <button onClick={() => handleUpgrade(user.key, 9999)}
                            className="px-3 py-1.5 text-[10px] font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                            <Shield size={12} className="inline mr-1" />
                            Forever
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-sm text-[var(--duo-text-muted)]">Tidak ada user ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
