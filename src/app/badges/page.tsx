"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Award, CheckCircle2 } from "lucide-react";
import { getProfile, BADGES, UserProfile } from "@/lib/gamification";

export default function BadgesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => { setProfile(getProfile()); }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1a73e8] rounded-lg flex items-center justify-center">
              <Award size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pencapaian</h1>
              <p className="text-xs text-gray-500">{profile?.badges.length || 0} dari {BADGES.length} terbuka</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const unlocked = profile?.badges.includes(badge.id);
              return (
                <div key={badge.id} className={`relative p-5 rounded-xl border text-center transition-all ${
                  unlocked
                    ? "bg-white border-[#1a73e8]/20 shadow-sm"
                    : "bg-gray-50 border-gray-200 opacity-50"
                }`}>
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    unlocked ? "bg-[#e8f0fe] text-[#1a73e8]" : "bg-gray-200 text-gray-400"
                  }`}>
                    <Award size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{badge.name}</h4>
                  <p className="text-[11px] text-gray-500">{badge.desc}</p>
                  {unlocked && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
