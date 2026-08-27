"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllRegistryUsers, getRegistryStats, updateUserRegistry, type RegistryUser } from "@/lib/admin/registry";
import { getAllUserProfiles, activatePremium, UserProfile } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Users, Crown, Search, Shield, ArrowUp, Calendar, Zap, Trophy, Flame, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { getAdminSession } from "@/lib/adminAuth";
import { logAudit } from "@/lib/admin/audit";

interface UserRow extends RegistryUser {
  profile: UserProfile | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterPremium, setFilterPremium] = useState<"all" | "premium" | "free">("all");
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgraded, setUpgraded] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, newUsersToday: 0, activeLastWeek: 0 });

  const loadUsers = useCallback(() => {
    const registry = getAllRegistryUsers();
    const profiles = getAllUserProfiles();

    const rows: UserRow[] = registry.map((reg) => ({
      ...reg,
      profile: profiles[reg.id] || null,
    }));

    // Also add any profile not in registry (legacy)
    for (const [key, profile] of Object.entries(profiles)) {
      if (!registry.find((r) => r.id === key)) {
        rows.push({
          id: key,
          email: key,
          name: profile.name,
          createdAt: "",
          lastActive: profile.lastActive,
          isPremium: profile.isPremium,
          profile,
        });
      }
    }

    // Add current user session if not in registry
    const sessionRaw = localStorage.getItem("matika_session");
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        if (!rows.find((r) => r.id === session.id)) {
          const profile = profiles[session.id] || profiles["current"];
          if (profile) {
            rows.push({
              id: session.id,
              email: session.email,
              name: session.name,
              createdAt: "",
              lastActive: profile.lastActive,
              isPremium: profile.isPremium,
              profile,
            });
          }
        }
      } catch {}
    }

    setUsers(rows);
    setStats(getRegistryStats());
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  function handleUpgrade(userId: string, days: number) {
    setUpgrading(userId);
    const session = getAdminSession();
    const user = users.find((u) => u.id === userId);

    setTimeout(() => {
      // Upgrade via gamification system
      const profile = user?.profile;
      if (profile) {
        const expires = new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
        profile.isPremium = true;
        profile.premiumActivatedAt = new Date().toISOString().split("T")[0];
        profile.premiumExpiresAt = days >= 9999 ? null : expires;

        // Save to correct profile key
        const profileKey = `matika-profile-${userId}`;
        localStorage.setItem(profileKey, JSON.stringify(profile));
      }

      // Update registry
      updateUserRegistry(userId, { isPremium: true });

      if (session) {
        logAudit(session.email, session.name, "upgrade_premium", "user", userId,
          { isPremium: false }, { isPremium: true, days });
      }

      setUpgrading(null);
      setUpgraded(userId);
      setTimeout(() => setUpgraded(null), 2000);
      loadUsers();
    }, 800);
  }

  function handleRemovePremium(userId: string) {
    const session = getAdminSession();
    const user = users.find((u) => u.id === userId);

    if (user?.profile) {
      user.profile.isPremium = false;
      user.profile.premiumExpiresAt = null;
        const profileKey = `matika-profile-${userId}`;
      localStorage.setItem(profileKey, JSON.stringify(user.profile));
    }

    updateUserRegistry(userId, { isPremium: false });

    if (session) {
      logAudit(session.email, session.name, "remove_premium", "user", userId,
        { isPremium: true }, { isPremium: false });
    }

    loadUsers();
  }

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterPremium === "all" ||
      (filterPremium === "premium" && u.isPremium) ||
      (filterPremium === "free" && !u.isPremium);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
            <Users size={24} className="text-blue-500" />
            User Management
          </h1>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">{users.length} user terdaftar</p>
        </div>
        <button onClick={loadUsers}
          className="px-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] text-[var(--duo-text)] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, color: "from-blue-500 to-cyan-400" },
          { label: "Premium", value: stats.premiumUsers, color: "from-yellow-500 to-orange-400" },
          { label: "Baru Hari Ini", value: stats.newUsersToday, color: "from-green-500 to-emerald-400" },
          { label: "Aktif 7 Hari", value: stats.activeLastWeek, color: "from-purple-500 to-pink-400" },
        ].map((s, i) => (
          <div key={s.label} className="p-4 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)]">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <Users size={14} className="text-white" />
            </div>
            <p className="text-xl font-black text-[var(--duo-text)]">{s.value}</p>
            <p className="text-[10px] font-bold text-[var(--duo-text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--duo-text-muted)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex gap-2">
          {(["all", "premium", "free"] as const).map((f) => (
            <button key={f} onClick={() => setFilterPremium(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterPremium === f
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
              }`}>
              {f === "all" ? "Semua" : f === "premium" ? "Premium" : "Free"}
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
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--duo-border)] last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${user.isPremium ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-blue-500 to-cyan-400"}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--duo-text)]">{user.name}</p>
                        <p className="text-[10px] text-[var(--duo-text-muted)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-[var(--duo-text)]">Lv.{user.profile?.level ?? 0}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-[var(--duo-xp)]">{(user.profile?.xp ?? 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                      <Flame size={12} /> {user.profile?.streak ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {user.isPremium ? (
                      <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                        <Crown size={12} />
                        {user.profile?.premiumExpiresAt ? `Sampai ${user.profile.premiumExpiresAt}` : "Selamanya"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400">Free</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {upgrading === user.id ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : upgraded === user.id ? (
                        <span className="text-[10px] font-bold text-green-500 flex items-center gap-1"><CheckCircle2 size={12} /> Berhasil!</span>
                      ) : user.isPremium ? (
                        <button onClick={() => handleRemovePremium(user.id)}
                          className="px-3 py-1.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                          <XCircle size={12} className="inline mr-1" /> Cabut
                        </button>
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => handleUpgrade(user.id, 7)}
                            className="px-3 py-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                            <ArrowUp size={12} className="inline mr-1" /> 7 Hari
                          </button>
                          <button onClick={() => handleUpgrade(user.id, 30)}
                            className="px-3 py-1.5 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors">
                            <Crown size={12} className="inline mr-1" /> 30 Hari
                          </button>
                          <button onClick={() => handleUpgrade(user.id, 9999)}
                            className="px-3 py-1.5 text-[10px] font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                            <Shield size={12} className="inline mr-1" /> Forever
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
