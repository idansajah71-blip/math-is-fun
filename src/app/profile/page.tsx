"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import UserAvatar from "@/components/UserAvatar";
import ProgressRing from "@/components/ui/ProgressRing";
import XPBar from "@/components/ui/XPBar";
import { getProfile, setProfileName, LEVEL_NAMES, getXpForCurrentLevel, getXpForNextLevel, BADGES, UserProfile, SHOP_ITEMS } from "@/lib/gamification";
import { getAllTopics } from "@/lib/data";
import { motion } from "framer-motion";
import { Zap, BookOpen, Flame, Award, Edit3, Gem, Heart, Target, Clock, Share2, Check, Crown, Camera, Trash2, Shield, Swords, Wand2, Frame, X, Snowflake, Sprout } from "lucide-react";
import { renderIcon } from "@/lib/iconMap";
import ActivityHeatmap from "@/components/ui/ActivityHeatmap";
import { isPremiumActive, saveProfile } from "@/lib/gamification";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [borderEditor, setBorderEditor] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);

  const scheduleTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    return () => { timersRef.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setName(p.name);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!name.trim()) {
        setNameError("Nama tidak boleh kosong");
        return;
      }
      if (name.trim().length < 2) {
        setNameError("Nama minimal 2 karakter");
        return;
      }
      if (name.trim().length > 20) {
        setNameError("Nama maksimal 20 karakter");
        return;
      }
      setNameError("");
      const updated = setProfileName(name.trim());
      setProfile(updated);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const TARGET = 200;
        canvas.width = TARGET;
        canvas.height = TARGET;
        const ctx = canvas.getContext("2d");
        if (!ctx) { setUploading(false); return; }

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, TARGET, TARGET);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        const updated = { ...profile, avatarUrl: dataUrl };
        saveProfile(updated);
        setProfile(updated);
        setUploading(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAvatarRemove = () => {
    if (!profile) return;
    const updated = { ...profile, avatarUrl: undefined };
    saveProfile(updated);
    setProfile(updated);
  };

  if (!profile) return null;

  const topics = getAllTopics();
  const completed = profile.completedTopics.length;
  const total = topics.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const badges = BADGES.filter(b => profile.badges.includes(b.id));
  const ownedItems = SHOP_ITEMS.filter(i => profile.purchasedItems.includes(i.id));

  const stats = [
    { icon: Zap, label: "Total XP", value: profile.xp, color: "text-[var(--duo-xp)]", bg: "bg-[var(--duo-xp)]/10" },
    { icon: Gem, label: "Gems", value: profile.gems, color: "text-[var(--duo-purple)]", bg: "bg-[var(--duo-purple)]/10" },
    { icon: Heart, label: "Hearts", value: isPremiumActive() ? "∞" : `${profile.hearts}/${profile.maxHearts}`, color: "text-[var(--duo-danger)]", bg: "bg-red-50 dark:bg-red-950/30" },
    { icon: BookOpen, label: "Materi", value: `${completed}/${total}`, color: "text-[var(--duo-green)]", bg: "bg-[var(--duo-green-bg)]" },
    { icon: Flame, label: "Streak", value: `${profile.streak} hari`, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { icon: Award, label: "Badge", value: `${badges.length}/${BADGES.length}`, color: "text-[var(--duo-pink)]", bg: "bg-pink-50 dark:bg-pink-950/30" },
    { icon: Target, label: "Quiz Score", value: `${Object.values(profile.quizScores).length > 0 ? Math.round(Object.values(profile.quizScores).reduce((a: number, b: number) => a + b, 0) / Object.values(profile.quizScores).length) : 0}%`, color: "text-[var(--duo-info)]", bg: "bg-[var(--duo-info)]/10" },
    { icon: Clock, label: "Waktu Belajar", value: `${Math.round(profile.totalStudyTime / 60)}j`, color: "text-[var(--duo-orange)]", bg: "bg-orange-50 dark:bg-orange-950/30" },
  ];

  const shareText = `Matika Progress\n\nLevel: ${LEVEL_NAMES[profile.level]}\nXP: ${profile.xp}\nStreak: ${profile.streak} hari\nMateri: ${completed}/${total}\nBadge: ${badges.length}/${BADGES.length}\n\nHalo Alisya Kuy join Sigmatika belajar matematika!\nlink:Sigmatika.co.id`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Matika Progress", text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      scheduleTimer(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-0">
        {/* Header */}
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <h1 className="text-2xl font-black text-[var(--duo-text)]">Profil</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-6 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-[28px] border-2 border-[var(--duo-border)] p-6"
          >
            <div className="flex items-start gap-5">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="relative cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
                  <ProgressRing progress={pct} size={100} strokeWidth={6}>
                    <UserAvatar profile={profile} size={80} />
                  </ProgressRing>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--duo-green)] rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-md">
                    {pct}%
                  </div>
                  <div className="absolute top-[10px] left-[10px] w-[80px] h-[80px] rounded-full bg-black/0 hover:bg-black/40 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                    {uploading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin pointer-events-auto" />
                    ) : (
                      <Camera size={20} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setBorderEditor(true)}
                  className="mt-2 w-full py-1.5 text-[10px] font-bold text-[var(--duo-text-muted)] bg-[var(--duo-bg)] border border-[var(--duo-border)] rounded-lg hover:border-[var(--duo-green)] hover:text-[var(--duo-green)] transition-all flex items-center justify-center gap-1"
                >
                  <Frame size={10} />
                  Edit Border
                </button>
              </div>

              <div className="flex-1">
                {profile.avatarUrl && (
                  <button
                    onClick={handleAvatarRemove}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--duo-danger)] bg-red-50 dark:bg-red-950/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors mb-2"
                  >
                    <Trash2 size={12} />
                    Hapus Foto
                  </button>
                )}
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setNameError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        className={`w-full px-4 py-2 rounded-xl border-2 text-sm font-bold focus:outline-none ${
                          nameError
                            ? "border-[var(--duo-danger)] focus:border-[var(--duo-danger)]"
                            : "border-[var(--duo-border)] focus:border-[var(--duo-green)]"
                        }`}
                        autoFocus
                        maxLength={20}
                      />
                      {nameError && (
                        <p className="text-[10px] text-[var(--duo-danger)] mt-1 font-bold">{nameError}</p>
                      )}
                    </div>
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-[var(--duo-green)] text-white text-xs font-black rounded-xl hover:brightness-110 disabled:opacity-40"
                      whileTap={{ scale: 0.95 }}
                    >
                      {saving ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Menyimpan...
                        </span>
                      ) : (
                        "Simpan"
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text-muted)] text-xs font-bold rounded-xl"
                      whileTap={{ scale: 0.95 }}
                    >
                      Batal
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-[var(--duo-text)]">{profile.name}</h2>
                      {isPremiumActive() && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[9px] font-black rounded-full flex items-center gap-0.5">
                          <Crown size={8} /> PRO
                        </span>
                      )}
                      <motion.button
                        onClick={() => setEditMode(true)}
                        aria-label="Edit"
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--duo-text-muted)]"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                      <Edit3 size={14} />
                    </motion.button>
                    </div>
                    {profile.purchasedItems.includes("title-myth") && (
                      <p className="text-xs font-bold text-yellow-500 dark:text-yellow-400 mt-0.5">Mitos</p>
                    )}
                    {profile.purchasedItems.includes("title-master") && !profile.purchasedItems.includes("title-myth") && (
                      <p className="text-xs font-bold text-purple-500 dark:text-purple-400 mt-0.5">Master Matematika</p>
                    )}
                  </div>
                )}

                <div className="mt-3">
                  <XPBar
                    currentXp={profile.xp}
                    levelXp={getXpForCurrentLevel(profile.level)}
                    nextLevelXp={getXpForNextLevel(profile.level)}
                    level={profile.level}
                    levelName={LEVEL_NAMES[profile.level] || "Pemula"}
                  />
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-bold text-[var(--duo-text-muted)]">
                    {LEVEL_NAMES[profile.level] || "Pemula"}
                  </span>
                  <span className="text-xs font-bold text-[var(--duo-xp)]">{profile.xp} XP</span>
                  <span className="text-xs font-bold text-[var(--duo-purple)] flex items-center gap-1">{profile.gems} <Gem size={12} /></span>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <motion.button
              onClick={handleShare}
              className="mt-4 w-full py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-[var(--duo-text)] font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? <Check size={16} className="text-[var(--duo-green)]" /> : <Share2 size={16} />}
              {copied ? "Tersalin!" : "Bagikan Progress"} 
            </motion.button>
          </motion.div>

          {/* Premium Showcase */}
          {isPremiumActive() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-[28px] border-2 border-yellow-400/30 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--duo-text)]">Player Sultan</h3>
                  <p className="text-xs font-bold text-[var(--duo-text-muted)]">
                    {profile.premiumExpiresAt
                      ? `Premium aktif sampai ${profile.premiumExpiresAt}`
                      : "Premium Selamanya"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 text-center"
                  whileHover={{ y: -4 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${s.bg}`}>
                    <Icon size={18} className={s.color} />
                  </div>
                  <p className="text-lg font-black text-[var(--duo-text)]">{s.value}</p>
                  <p className="text-[10px] font-bold text-[var(--duo-text-muted)]">{s.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4"
          >
            <ActivityHeatmap dailyXpHistory={profile.dailyXpHistory || {}} />
          </motion.div>

          {/* Badges */}
          {badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-5"
            >
              <h3 className="text-sm font-black text-[var(--duo-text)] mb-3">Badge Terbaru</h3>
              <div className="flex flex-wrap gap-2">
                {badges.slice(0, 6).map(b => (
                  <div key={b.id} className="flex items-center gap-1.5 px-3 py-2 bg-[var(--duo-xp)]/10 rounded-xl">
                    {renderIcon(b.icon, 16, "text-[var(--duo-xp)]")}
                    <span className="text-xs font-bold text-[var(--duo-xp)]">{b.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Owned Items */}
          {ownedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-5"
            >
              <h3 className="text-sm font-black text-[var(--duo-text)] mb-3">Item Dimiliki</h3>
              <div className="flex flex-wrap gap-2">
                {ownedItems.map(item => (
                  <div key={item.id} className="flex items-center gap-1.5 px-3 py-2 bg-[var(--duo-purple)]/10 rounded-xl">
                    {renderIcon(item.icon, 16, "text-[var(--duo-purple)]")}
                    <span className="text-xs font-bold text-[var(--duo-purple)]">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Border Editor Modal */}
          {borderEditor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setBorderEditor(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-[var(--duo-card)] rounded-3xl border-2 border-[var(--duo-border)] p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-black text-[var(--duo-text)]">Edit Border Avatar</h3>
                  <button onClick={() => setBorderEditor(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--duo-text-muted)]">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex justify-center mb-5">
                  <UserAvatar profile={profile} size={96} showLevel level={profile.level} />
                </div>

                <div className="space-y-2">
                  {([
                    { id: undefined, name: "Default", desc: "Tanpa border", icon: null, owned: true },
                    { id: "frame-gold", name: "Frame Emas", desc: "Border emas berkilau", icon: <Award size={14} className="text-yellow-500" />, owned: profile.purchasedItems.includes("frame-gold") },
                    { id: "border-ninja", name: "Border Ninja", desc: "Border gelap ala ninja", icon: <Swords size={14} className="text-indigo-500" />, owned: profile.purchasedItems.includes("border-ninja") || profile.purchasedItems.includes("avatar-ninja") },
                    { id: "border-wizard", name: "Border Wizard", desc: "Border ajaib penyihir", icon: <Wand2 size={14} className="text-purple-500" />, owned: profile.purchasedItems.includes("border-wizard") || profile.purchasedItems.includes("avatar-wizard") },
                    { id: "border-fire", name: "Border Api", desc: "Border bernyala alam api", icon: <Flame size={14} className="text-red-500" />, owned: profile.purchasedItems.includes("border-fire") },
                    { id: "border-ice", name: "Border Es", desc: "Border beku kristal es", icon: <Snowflake size={14} className="text-cyan-500" />, owned: profile.purchasedItems.includes("border-ice") },
                    { id: "border-nature", name: "Border Alam", desc: "Border hijau alam liar", icon: <Sprout size={14} className="text-green-500" />, owned: profile.purchasedItems.includes("border-nature") },
                    { id: "border-neon", name: "Border Neon", desc: "Border cyberpunk neon", icon: <Zap size={14} className="text-emerald-400" />, owned: profile.purchasedItems.includes("border-neon") },
                    { id: "border-royal", name: "Border Royal", desc: "Border kerajaan mewah", icon: <Crown size={14} className="text-fuchsia-500" />, owned: profile.purchasedItems.includes("border-royal") },
                  ] as const).map(b => {
                    const active = b.id === profile.activeBorder || (!profile.activeBorder && !b.id);
                    return (
                      <button
                        key={b.id || "none"}
                        disabled={!b.owned}
                        onClick={() => {
                          if (!b.owned) return;
                          const updated = { ...profile, activeBorder: b.id };
                          saveProfile(updated);
                          setProfile(updated);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                          active
                            ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10"
                            : !b.owned
                            ? "border-[var(--duo-border)] opacity-40 cursor-not-allowed"
                            : "border-[var(--duo-border)] hover:border-[var(--duo-green)]/50"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-[var(--duo-green)]/20" : "bg-[var(--duo-bg)]"}`}>
                          {b.icon || <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--duo-text)]">{b.name}</p>
                          <p className="text-[10px] text-[var(--duo-text-muted)]">{b.desc}</p>
                        </div>
                        {active && <Check size={16} className="text-[var(--duo-green)] shrink-0" />}
                        {!b.owned && (
                          <span className="text-[9px] font-bold text-[var(--duo-text-muted)] shrink-0">Belum dimiliki</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Aktivitas Mingguan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-5"
          >
            <h3 className="text-sm font-black text-[var(--duo-text)] mb-3">Aktivitas Mingguan</h3>
            <div className="flex items-end gap-2 h-24">
              {profile.weeklyXp.map((xp, i) => {
                const max = Math.max(...profile.weeklyXp, 1);
                const height = Math.max((xp / max) * 100, 8);
                const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
                const today = (new Date().getDay() + 6) % 7;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className={`w-full rounded-t-lg ${i === today ? "bg-[var(--duo-green)]" : "bg-[var(--duo-green)]/30"}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                    <span className={`text-[9px] font-bold ${i === today ? "text-[var(--duo-green)]" : "text-[var(--duo-text-muted)]"}`}>
                      {dayNames[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
