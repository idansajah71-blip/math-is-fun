"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllRegistryUsers, getRegistryStats, updateUserRegistry, type RegistryUser } from "@/lib/admin/registry";
import { getAllUserProfiles, getDefaultProfile, saveProfileForKey, type UserProfile } from "@/lib/gamification";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Crown, Search, Shield, ArrowUp, Calendar, Zap, Trophy, Flame,
  CheckCircle2, XCircle, RefreshCw, Heart, BookOpen, Star, Gem, Gift,
  Lock, Unlock, ChevronDown, ChevronUp,
} from "lucide-react";
import { getAdminSession } from "@/lib/adminAuth";
import { logAudit } from "@/lib/admin/audit";

interface UserRow extends RegistryUser {
  profile: UserProfile | null;
}

const PREMIUM_BENEFITS = [
  { icon: <Heart size={12} />, label: "Nyawa Tak Terbatas", desc: "Tidak perlu menunggu nyawa pulih" },
  { icon: <Zap size={12} />, label: "2x XP Boost", desc: "Dapat 2 kali lipat XP dari setiap quiz" },
  { icon: <Gem size={12} />, label: "Bonus Gems", desc: "+50 Gems setiap login harian" },
  { icon: <BookOpen size={12} />, label: "Semua Topik Terbuka", desc: "Akses semua topik tanpa batas" },
  { icon: <Star size={12} />, label: "Badge Eksklusif", desc: "Badge premium yang tidak bisa didapat free user" },
  { icon: <Gift size={12} />, label: "Reward Premium", desc: "Event khusus dan hadiah spesial" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterPremium, setFilterPremium] = useState<"all" | "premium" | "free">("all");
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgraded, setUpgraded] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, newUsersToday: 0, activeLastWeek: 0 });
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    const registry = getAllRegistryUsers();
    const profiles = getAllUserProfiles();

    const allProfileRows: Record<string, UserProfile> = { ...profiles };
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("matika-profile-") && key !== "matika-profile") {
          const userId = key.replace("matika-profile-", "");
          if (!allProfileRows[userId]) {
            try {
              const raw = localStorage.getItem(key);
              if (raw) {
                allProfileRows[userId] = { ...getDefaultProfile(), ...JSON.parse(raw) };
              }
            } catch {}
          }
        }
      }
    } catch {}

    const localUsers: Record<string, { id: string; email: string; name: string }> = {};
    try {
      const raw = localStorage.getItem("matika_users");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          for (const u of arr) {
            if (u.id) localUsers[u.id] = { id: u.id, email: u.email || "", name: u.name || "Pelajar" };
          }
        }
      }
    } catch {}

    const rows: UserRow[] = registry.map((reg) => ({
      ...reg,
      profile: allProfileRows[reg.id] || null,
    }));

    for (const [userId, profile] of Object.entries(allProfileRows)) {
      if (!registry.find((r) => r.id === userId)) {
        const localUser = localUsers[userId];
        rows.push({
          id: userId,
          email: localUser?.email || profile.name || userId,
          name: localUser?.name || profile.name,
          createdAt: "",
          lastActive: profile.lastActive,
          isPremium: profile.isPremium,
          profile,
        });
      }
    }

    const sessionRaw = localStorage.getItem("matika_session");
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        if (session.id && !rows.find((r) => r.id === session.id)) {
          const profile = allProfileRows[session.id];
          rows.push({
            id: session.id,
            email: session.email,
            name: session.name,
            createdAt: "",
            lastActive: profile?.lastActive || new Date().toISOString(),
            isPremium: profile?.isPremium || false,
            profile: profile || null,
          });
        }
      } catch {}
    }

    rows.sort((a, b) => (b.lastActive || "").localeCompare(a.lastActive || ""));

    setUsers(rows);
    setStats(getRegistryStats());
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  function handleUpgrade(userId: string, days: number) {
    setUpgrading(userId);
    const session = getAdminSession();

    setTimeout(() => {
      const profileKey = `matika-profile-${userId}`;
      let profile: UserProfile;
      try {
        const raw = localStorage.getItem(profileKey);
        profile = raw ? { ...getDefaultProfile(), ...JSON.parse(raw) } : getDefaultProfile();
      } catch {
        profile = getDefaultProfile();
      }

      profile.isPremium = true;
      profile.premiumActivatedAt = new Date().toISOString().split("T")[0];
      profile.premiumExpiresAt = days >= 9999 ? null : new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
      profile.maxHearts = 99;
      profile.hearts = 99;
      profile.hintTokens = (profile.hintTokens || 0) + 10;

      saveProfileForKey(userId, profile);
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

    const profileKey = `matika-profile-${userId}`;
    try {
      const raw = localStorage.getItem(profileKey);
      if (raw) {
        const profile: UserProfile = { ...getDefaultProfile(), ...JSON.parse(raw) };
        profile.isPremium = false;
        profile.premiumExpiresAt = null;
        profile.maxHearts = 5;
        if (profile.hearts > 5) profile.hearts = 5;
        saveProfileForKey(userId, profile);
      }
    } catch {}

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

  const realStats = {
    totalUsers: users.length,
    premiumUsers: users.filter((u) => u.isPremium).length,
    newUsersToday: stats.newUsersToday,
    activeLastWeek: stats.activeLastWeek,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--fg)] flex items-center gap-3">
            <Users size={24} className="text-[var(--info)]" />
            User Management
          </h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{users.length} user terdaftar</p>
        </div>
        <button onClick={loadUsers}
          className="px-4 py-2.5 bg-white dark:bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--fg)] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: realStats.totalUsers, color: "from-blue-500 to-cyan-400", icon: <Users size={14} /> },
          { label: "Premium", value: realStats.premiumUsers, color: "from-yellow-500 to-orange-400", icon: <Crown size={14} /> },
          { label: "Baru Hari Ini", value: realStats.newUsersToday, color: "from-green-500 to-emerald-400", icon: <Gift size={14} /> },
          { label: "Aktif 7 Hari", value: realStats.activeLastWeek, color: "from-purple-500 to-pink-400", icon: <Flame size={14} /> },
        ].map((s) => (
          <div key={s.label} className="p-3 bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)]">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-1.5 text-white`}>
              {s.icon}
            </div>
            <p className="text-lg font-black text-[var(--fg)]">{s.value}</p>
            <p className="text-[10px] font-bold text-[var(--fg-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border-2 border-yellow-300/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white shrink-0">
            <Crown size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-[var(--fg)] mb-1">Premium Benefits</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PREMIUM_BENEFITS.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-[10px]">
                  <span className="text-yellow-500">{b.icon}</span>
                  <div>
                    <p className="font-bold text-[var(--fg)]">{b.label}</p>
                    <p className="text-[var(--fg-muted)]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl text-sm font-bold text-[var(--fg)] placeholder:text-[var(--fg-disabled)] focus:outline-none focus:border-[var(--info)] transition-colors" />
        </div>
        <div className="flex gap-2">
          {(["all", "premium", "free"] as const).map((f) => (
            <button key={f} onClick={() => setFilterPremium(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterPremium === f
                  ? "bg-[var(--info)] text-white"
                  : "bg-white dark:bg-[var(--surface)] text-[var(--fg-muted)] border border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}>
              {f === "all" ? "Semua" : f === "premium" ? "Premium" : "Free"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((user, i) => {
          const isExpanded = expandedUser === user.id;
          return (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-white dark:bg-[var(--surface)] rounded-2xl border-2 overflow-hidden transition-colors ${
                user.isPremium ? "border-yellow-300/50" : "border-[var(--border)]"
              }`}>
              <div className="p-4 flex items-center gap-4">
                <div className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                  user.isPremium
                    ? "bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/20"
                    : "bg-gradient-to-br from-blue-500 to-cyan-400"
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                  {user.isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Crown size={8} className="text-yellow-900" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-black text-[var(--fg)] truncate">{user.name}</p>
                    {user.isPremium && (
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[8px] font-black rounded-full flex items-center gap-0.5 shrink-0">
                        <Crown size={7} /> PRO
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--fg-muted)] truncate">{user.email}</p>
                </div>

                <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-[var(--fg-muted)] shrink-0">
                  <span className="flex items-center gap-1"><Trophy size={10} className="text-[var(--accent-xp)]" /> Lv.{user.profile?.level ?? 0}</span>
                  <span className="flex items-center gap-1"><Zap size={10} className="text-[var(--accent-xp)]" /> {(user.profile?.xp ?? 0).toLocaleString()} XP</span>
                  <span className="flex items-center gap-1"><Flame size={10} className="text-[var(--orange)]" /> {user.profile?.streak ?? 0}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {upgrading === user.id ? (
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <div className="w-4 h-4 border-2 border-[var(--info)] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-bold text-[var(--info)]">Memproses...</span>
                    </div>
                  ) : upgraded === user.id ? (
                    <span className="px-3 py-1.5 text-[10px] font-bold text-[var(--success)] flex items-center gap-1 bg-[var(--success-bg)] rounded-lg">
                      <CheckCircle2 size={12} /> Berhasil!
                    </span>
                  ) : user.isPremium ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => handleRemovePremium(user.id)}
                        className="px-3 py-1.5 text-[10px] font-bold text-[var(--danger)] bg-[var(--danger-bg)] rounded-lg hover:bg-[var(--danger)]/20 transition-colors flex items-center gap-1">
                        <XCircle size={11} /> Cabut Premium
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <button onClick={() => handleUpgrade(user.id, 7)}
                        className="px-2.5 py-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1">
                        <ArrowUp size={10} /> 7 Hari
                      </button>
                      <button onClick={() => handleUpgrade(user.id, 30)}
                        className="px-2.5 py-1.5 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors flex items-center gap-1">
                        <Crown size={10} /> 30 Hari
                      </button>
                      <button onClick={() => handleUpgrade(user.id, 9999)}
                        className="px-2.5 py-1.5 text-[10px] font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-1">
                        <Shield size={10} /> Forever
                      </button>
                    </div>
                  )}

                  <button onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                    className="p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-lg transition-colors">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-[var(--border-subtle)]">
                    <div className="p-4 bg-[var(--surface-sunken)]/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="text-center p-2 rounded-xl bg-white dark:bg-[var(--surface)] border border-[var(--border-subtle)]">
                          <p className="text-lg font-black text-[var(--fg)]">{user.profile?.level ?? 0}</p>
                          <p className="text-[9px] font-bold text-[var(--fg-muted)]">Level</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white dark:bg-[var(--surface)] border border-[var(--border-subtle)]">
                          <p className="text-lg font-black text-[var(--accent-xp)]">{(user.profile?.xp ?? 0).toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-[var(--fg-muted)]">Total XP</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white dark:bg-[var(--surface)] border border-[var(--border-subtle)]">
                          <p className="text-lg font-black text-[var(--orange)]">{user.profile?.streak ?? 0}</p>
                          <p className="text-[9px] font-bold text-[var(--fg-muted)]">Streak</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white dark:bg-[var(--surface)] border border-[var(--border-subtle)]">
                          <p className="text-lg font-black text-[var(--info)]">{user.profile?.completedTopics?.length ?? 0}</p>
                          <p className="text-[9px] font-bold text-[var(--fg-muted)]">Topik Selesai</p>
                        </div>
                      </div>

                      {user.isPremium && (
                        <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-300/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown size={14} className="text-yellow-500" />
                            <span className="text-xs font-black text-[var(--fg)]">Premium Active</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                            {user.profile?.premiumExpiresAt ? (
                              <span className="text-[var(--fg-muted)]">Expires: {user.profile.premiumExpiresAt}</span>
                            ) : (
                              <span className="text-yellow-600 dark:text-yellow-400">Selamanya</span>
                            )}
                            <span className="text-[var(--fg-muted)]">|</span>
                            <span className="text-[var(--fg-muted)]">Activated: {user.profile?.premiumActivatedAt || "N/A"}</span>
                            <span className="text-[var(--fg-muted)]">|</span>
                            <span className="flex items-center gap-1"><Heart size={10} className="text-[var(--danger)]" /> {user.profile?.hearts ?? 5}/{user.profile?.maxHearts ?? 5} Nyawa</span>
                            <span className="flex items-center gap-1"><Star size={10} className="text-purple-400" /> {user.profile?.hintTokens ?? 0} Hint Tokens</span>
                          </div>
                        </div>
                      )}

                      {!user.isPremium && (
                        <div className="p-3 rounded-xl bg-[var(--border-subtle)] border border-[var(--border)]">
                          <div className="flex items-center gap-2">
                            <Lock size={14} className="text-[var(--fg-muted)]" />
                            <span className="text-xs font-bold text-[var(--fg-muted)]">Free User — Klik tombol premium di atas untuk upgrade</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)]">
            <Users size={48} className="text-[var(--border)] mx-auto mb-4" />
            <p className="text-sm font-bold text-[var(--fg)]">Tidak ada user ditemukan</p>
            <p className="text-xs text-[var(--fg-muted)] mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}
