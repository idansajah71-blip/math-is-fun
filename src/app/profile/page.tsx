"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProgressRing from "@/components/ProgressRing";
import XpBar from "@/components/XpBar";
import { getProfile, LEVEL_NAMES, getXpForCurrentLevel, getXpForNextLevel, BADGES, UserProfile } from "@/lib/gamification";
import { getAllTopics } from "@/lib/mathData";
import { User, Zap, BookOpen, Flame, Award, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setName(p.name);
  }, []);

  const handleSave = () => {
    if (profile && name.trim()) {
      profile.name = name.trim();
      localStorage.setItem("belajar-mtk-profile", JSON.stringify(profile));
      setProfile({ ...profile });
      setEditMode(false);
    }
  };

  if (!profile) return null;

  const topics = getAllTopics();
  const completed = profile.completedTopics.length;
  const total = topics.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const badges = BADGES.filter((b) => profile.badges.includes(b.id));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Profil</h1>

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-start gap-5">
              <div className="relative">
                <ProgressRing progress={pct} size={88} strokeWidth={6}>
                  <div className="w-16 h-16 bg-[#1a73e8] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {profile.name.charAt(0)}
                  </div>
                </ProgressRing>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1a73e8] rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
                  {pct}%
                </div>
              </div>

              <div className="flex-1">
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10"
                      autoFocus />
                    <button onClick={handleSave} className="px-3 py-1.5 bg-[#1a73e8] text-white text-xs font-medium rounded-lg hover:bg-[#1557b0]">Simpan</button>
                    <button onClick={() => setEditMode(false)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200">Batal</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
                    <button onClick={() => setEditMode(true)} className="p-1 text-gray-400 hover:text-[#1a73e8]">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
                <div className="mt-3">
                  <XpBar currentXp={profile.xp} levelXp={getXpForCurrentLevel(profile.level)}
                    nextLevelXp={getXpForNextLevel(profile.level)} level={profile.level}
                    levelName={LEVEL_NAMES[profile.level] || "Pemula"} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { icon: Zap, label: "XP", value: profile.xp, color: "text-[#1a73e8] bg-[#e8f0fe]" },
              { icon: BookOpen, label: "Materi", value: completed, color: "text-emerald-600 bg-emerald-50" },
              { icon: Flame, label: "Streak", value: profile.streak, color: "text-orange-600 bg-orange-50" },
              { icon: Award, label: "Badge", value: badges.length, color: "text-purple-600 bg-purple-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${s.color}`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{s.value}</p>
                  <p className="text-[10px] text-gray-500">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Badge Terbaru</h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <div key={b.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#e8f0fe] rounded-lg">
                    <Award size={12} className="text-[#1a73e8]" />
                    <span className="text-xs font-medium text-[#1a73e8]">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
