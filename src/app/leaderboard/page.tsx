"use client";

import Sidebar from "@/components/Sidebar";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const data = [
    { rank: 1, name: "Rina Sari", xp: 2450, level: 8 },
    { rank: 2, name: "Budi Santoso", xp: 1980, level: 7 },
    { rank: 3, name: "Citra Dewi", xp: 1650, level: 6 },
    { rank: 4, name: "Andi Pratama", xp: 1320, level: 5 },
    { rank: 5, name: "Dian Kusuma", xp: 980, level: 4 },
    { rank: 6, name: "Eka Putri", xp: 750, level: 3 },
    { rank: 7, name: "Fajar Nugroho", xp: 520, level: 3 },
    { rank: 8, name: "Gita Sari", xp: 380, level: 2 },
    { rank: 9, name: "Hendra Wijaya", xp: 250, level: 2 },
    { rank: 10, name: "Indah Permata", xp: 120, level: 1 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1a73e8] rounded-lg flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Peringkat</h1>
              <p className="text-xs text-gray-500">Berdasarkan total XP</p>
            </div>
          </div>

          {/* Top 3 */}
          <div className="flex items-end justify-center gap-3 mb-8">
            {[2, 0, 1].map((idx) => {
              const e = data[idx];
              const heights = ["h-24", "h-32", "h-20"];
              const widths = ["w-24", "w-28", "w-24"];
              const medals = ["2nd", "1st", "3rd"];
              const medalColors = ["bg-gray-300", "bg-yellow-400", "bg-orange-400"];
              return (
                <div key={e.rank} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#1a73e8] rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">
                    {e.name.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mb-0.5">{e.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-gray-500 mb-2">{e.xp} XP</p>
                  <div className={`${widths[idx]} ${heights[idx]} bg-white border-2 border-gray-200 rounded-t-lg flex items-start justify-center pt-3 relative`}>
                    <span className={`text-[10px] font-bold ${idx === 0 ? "text-yellow-600" : "text-gray-500"}`}>{medals[idx]}</span>
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 ${medalColors[idx]} rounded-full flex items-center justify-center text-[10px] font-bold text-white`}>
                      {e.rank}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {data.map((e) => (
              <div key={e.rank} className={`flex items-center gap-4 px-5 py-3 ${e.rank !== 10 ? "border-b border-gray-100" : ""} ${e.rank <= 3 ? "bg-[#f8faff]" : ""}`}>
                <span className="w-6 text-center text-sm font-semibold text-gray-400">{e.rank}</span>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                  {e.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{e.name}</p>
                  <p className="text-[10px] text-gray-400">Level {e.level}</p>
                </div>
                <span className="text-sm font-semibold text-[#1a73e8]">{e.xp} <span className="text-[10px] text-gray-400 font-normal">XP</span></span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
