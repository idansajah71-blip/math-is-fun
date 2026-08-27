"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllRegistryUsers, getRegistryStats, updateUserRegistry, type RegistryUser } from "@/lib/admin/registry";
import { getAllUserProfiles, getDefaultProfile, saveProfileForKey, type UserProfile } from "@/lib/gamification";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Crown, Search, Shield, ArrowUp, Calendar, Zap, Trophy, Flame,
  CheckCircle2, XCircle, RefreshCw, Heart, BookOpen, Star, Gem, Gift,
  Lock, ChevronDown, ChevronUp, AlertCircle,
} from "lucide-react";
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
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<UserRow | null>(null);

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
    let profile: UserProfile;

    // Find the correct profile key by scanning ALL localStorage keys
    let profileKey = "";
    let rawProfile = "";
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("matika-profile-") && k !== "matika-profile") {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.name?.toLowerCase() === users.find((u) => u.id === userId)?.name?.toLowerCase()
              || k === `matika-profile-${userId}`) {
              profileKey = k;
              rawProfile = raw;
              break;
            }
          }
        } catch {}
      }
    }

    // Fallback: try the userId-based key
    if (!profileKey) {
      profileKey = `matika-profile-${userId}`;
      rawProfile = localStorage.getItem(profileKey) || "";
    }

    try {
      profile = rawProfile ? { ...getDefaultProfile(), ...JSON.parse(rawProfile) } : getDefaultProfile();
    } catch {
      profile = getDefaultProfile();
    }

    profile.isPremium = true;
    profile.premiumActivatedAt = new Date().toISOString().split("T")[0];
    profile.premiumExpiresAt = days >= 9999 ? null : new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
    profile.maxHearts = 99;
    profile.hearts = 99;
    profile.hintTokens = (profile.hintTokens || 0) + 10;

    // Save to the found key
    localStorage.setItem(profileKey, JSON.stringify(profile));

    // Also scan and save to ALL matika-profile-* keys that match this user
    const userName = users.find((u) => u.id === userId)?.name?.toLowerCase() || "";
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("matika-profile-") && k !== "matika-profile" && k !== profileKey) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.name?.toLowerCase() === userName) {
              localStorage.setItem(k, JSON.stringify(profile));
            }
          }
        } catch {}
      }
    }

    // Also save to fallback key (for users without matika_session)
    const fallbackRaw = localStorage.getItem("matika-profile");
    if (fallbackRaw) {
      try {
        const fallbackParsed = JSON.parse(fallbackRaw);
        if (fallbackParsed.name?.toLowerCase() === userName) {
          localStorage.setItem("matika-profile", JSON.stringify(profile));
        }
      } catch {}
    }

    updateUserRegistry(userId, { isPremium: true });

    const session = getAdminSession();
    if (session) {
      logAudit(session.email, session.name, "upgrade_premium", "user", userId,
        { isPremium: false }, { isPremium: true, days });
    }

    // Update state directly so UI reflects immediately
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isPremium: true, profile: { ...u.profile!, ...profile } } : u
      )
    );

    setUpgraded(userId);
    setTimeout(() => setUpgraded(null), 3000);
  }

  function handleRemovePremium(userId: string) {
    const profileKey = `matika-profile-${userId}`;
    try {
      const raw = localStorage.getItem(profileKey);
      if (raw) {
        const profile: UserProfile = { ...getDefaultProfile(), ...JSON.parse(raw) };
        profile.isPremium = false;
        profile.premiumExpiresAt = null;
        profile.maxHearts = 5;
        if (profile.hearts > 5) profile.hearts = 5;
        localStorage.setItem(profileKey, JSON.stringify(profile));
        saveProfileForKey(userId, profile);
      }
    } catch {}

    updateUserRegistry(userId, { isPremium: false });
    const session = getAdminSession();
    if (session) {
      logAudit(session.email, session.name, "remove_premium", "user", userId,
        { isPremium: true }, { isPremium: false });
    }

    // Update state directly so UI reflects immediately
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isPremium: false } : u
      )
    );
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
                  : "bg-white dark:bg-[var(--surface)] text-[var(--fg-muted)] border border-[var(--border)]"
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
            <div key={user.id}
              className={`bg-white dark:bg-[var(--surface)] rounded-2xl border-2 transition-colors ${
                user.isPremium ? "border-yellow-300/50" : "border-[var(--border)]"
              }`}>
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                    user.isPremium
                      ? "bg-gradient-to-br from-yellow-500 to-orange-500"
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
                    {upgraded === user.id ? (
                      <span className="px-3 py-1.5 text-[10px] font-bold text-green-500 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Tersimpan!
                      </span>
                    ) : user.isPremium ? (
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemovePremium(user.id); }}
                        className="px-3 py-1.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1 cursor-pointer">
                        <XCircle size={11} /> Cabut
                      </button>
                    ) : (
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModalUser(user); }}
                        className="px-3 py-1.5 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors flex items-center gap-1 cursor-pointer">
                        <Crown size={11} /> Kasih Premium
                      </button>
                    )}

                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedUser(isExpanded ? null : user.id); }}
                      className="p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-lg transition-colors cursor-pointer">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="text-center p-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
                        <p className="text-lg font-black text-[var(--fg)]">{user.profile?.level ?? 0}</p>
                        <p className="text-[9px] font-bold text-[var(--fg-muted)]">Level</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
                        <p className="text-lg font-black text-[var(--accent-xp)]">{(user.profile?.xp ?? 0).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-[var(--fg-muted)]">Total XP</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
                        <p className="text-lg font-black text-[var(--orange)]">{user.profile?.streak ?? 0}</p>
                        <p className="text-[9px] font-bold text-[var(--fg-muted)]">Streak</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
                        <p className="text-lg font-black text-[var(--info)]">{user.profile?.completedTopics?.length ?? 0}</p>
                        <p className="text-[9px] font-bold text-[var(--fg-muted)]">Topik Selesai</p>
                      </div>
                    </div>

                    {user.isPremium ? (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-300/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Crown size={14} className="text-yellow-500" />
                          <span className="text-xs font-black text-[var(--fg)]">Premium Active</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[var(--fg-muted)]">
                          {user.profile?.premiumExpiresAt && <span>Expires: {user.profile.premiumExpiresAt}</span>}
                          {!user.profile?.premiumExpiresAt && <span className="text-yellow-600">Selamanya</span>}
                          <span>|</span>
                          <span className="flex items-center gap-1"><Heart size={10} className="text-red-400" /> {user.profile?.hearts ?? 5}/{user.profile?.maxHearts ?? 5}</span>
                          <span className="flex items-center gap-1"><Star size={10} className="text-purple-400" /> {user.profile?.hintTokens ?? 0} Hints</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <Lock size={14} className="text-[var(--fg-muted)]" />
                          <span className="text-xs font-bold text-[var(--fg-muted)]">Free User</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)]">
            <Users size={48} className="text-[var(--border)] mx-auto mb-4" />
            <p className="text-sm font-bold text-[var(--fg)]">Tidak ada user ditemukan</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setModalUser(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl mx-auto mb-3">
                  {modalUser.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-black text-[var(--fg)]">{modalUser.name}</h3>
                <p className="text-xs text-[var(--fg-muted)]">{modalUser.email}</p>
              </div>

              <p className="text-xs font-bold text-[var(--fg-muted)] text-center mb-3">Pilih Durasi Premium:</p>

              <div className="space-y-2">
                <button onClick={() => { handleUpgrade(modalUser.id, 7); setModalUser(null); }}
                  className="w-full px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer">
                  <ArrowUp size={18} />
                  <div className="text-left flex-1">
                    <p className="font-black">7 Hari</p>
                    <p className="text-[10px] opacity-70">Trial premium selama seminggu</p>
                  </div>
                </button>

                <button onClick={() => { handleUpgrade(modalUser.id, 30); setModalUser(null); }}
                  className="w-full px-4 py-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 font-bold text-sm flex items-center gap-3 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors cursor-pointer">
                  <Crown size={18} />
                  <div className="text-left flex-1">
                    <p className="font-black">30 Hari</p>
                    <p className="text-[10px] opacity-70">Premium selama sebulan</p>
                  </div>
                </button>

                <button onClick={() => { handleUpgrade(modalUser.id, 9999); setModalUser(null); }}
                  className="w-full px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-bold text-sm flex items-center gap-3 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer">
                  <Shield size={18} />
                  <div className="text-left flex-1">
                    <p className="font-black">Selamanya</p>
                    <p className="text-[10px] opacity-70">Premium permanen</p>
                  </div>
                </button>
              </div>

              <button onClick={() => setModalUser(null)}
                className="w-full mt-3 px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--fg-muted)] font-bold text-xs hover:bg-[var(--border-subtle)] transition-colors cursor-pointer">
                Batal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
