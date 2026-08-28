"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { getRoomByCode, finishPlayer, getRoomResults } from "@/lib/rooms";
import type { Room } from "@/lib/rooms";
import RoomChallenge from "@/components/events/RoomChallenge";
import { Crown, Trophy, Clock, ArrowLeft } from "lucide-react";
import { addXp, saveProfile } from "@/lib/gamification";
import toast from "react-hot-toast";

export default function RoomPlayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const r = getRoomByCode(code);
    if (!r) {
      toast.error("Room tidak ditemukan");
      router.replace("/rooms");
      return;
    }
    if (!user) {
      router.replace("/rooms");
      return;
    }
    const me = r.players.find((p) => p.userId === user.id);
    if (!me || me.status === "waiting") {
      toast.error("Kamu belum bergabung");
      router.replace(`/rooms/${code}`);
      return;
    }
    if (me.status === "finished") {
      setRoom(r);
      setFinished(true);
      setLoading(false);
      return;
    }
    if (r.status === "finished") {
      setRoom(r);
      setFinished(true);
      setLoading(false);
      return;
    }
    setRoom(r);
    setLoading(false);
  }, [code, user, router]);

  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      const r = getRoomByCode(code);
      if (r) setRoom(r);
    }, 1000);
    return () => clearInterval(interval);
  }, [code, finished]);

  function handleComplete(score: number, timeSpent: number) {
    if (!user || !room) return;
    finishPlayer(code, user.id, score, timeSpent);

    const xpEarned = Math.round(score * 10 * (room.config.difficulty === "hard" ? 1.5 : room.config.difficulty === "easy" ? 0.8 : 1));
    const updated = addXp(xpEarned);
    saveProfile(updated);

    setFinished(true);
    toast.success(`+${xpEarned} XP!`);
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading || !room) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)] items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--duo-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (finished) {
    const results = getRoomResults(code);
    const me = room.players.find((p) => p.userId === user?.id);

    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <main className="flex-1 max-w-lg mx-auto px-4 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => router.push("/rooms")} className="flex items-center gap-2 text-xs font-bold text-[var(--duo-text-muted)] hover:text-[var(--duo-text)]">
              <ArrowLeft size={14} /> Kembali
            </button>

            <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6 text-center space-y-4">
              {results && (
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Trophy size={32} className="text-yellow-400" />
                </div>
              )}
              <h2 className="text-xl font-black text-[var(--duo-text)]">Hasil Challenge</h2>
              {me && (
                <p className="text-sm text-[var(--duo-text-muted)]">
                  Skor: <span className="font-black text-[var(--duo-green)]">{me.score}</span> &bull; Waktu: <span className="font-black">{formatTime(me.timeSpent)}</span>
                </p>
              )}
            </div>

            {results && (
              <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 space-y-3">
                <h3 className="text-sm font-black text-[var(--duo-text)]">Peringkat</h3>
                {results.players.map((p, i) => (
                  <div key={p.userId} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? "bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800" : "bg-[var(--duo-bg)]"}`}>
                    <span className="w-8 h-8 rounded-full bg-[var(--duo-card)] flex items-center justify-center text-xs font-black text-[var(--duo-text)]">
                      {i === 0 ? "👑" : `#${i + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--duo-text)] truncate">{p.name}</p>
                      <p className="text-[10px] text-[var(--duo-text-muted)]">{p.score} benar &bull; {formatTime(p.timeSpent)}</p>
                    </div>
                    {p.userId === user?.id && (
                      <span className="px-2 py-0.5 bg-[var(--duo-green)]/10 text-[var(--duo-green)] rounded-full text-[9px] font-bold">Kamu</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => router.push("/rooms")}
              className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-black hover:brightness-110 transition-all">
              Kembali ke Room
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <main className="flex-1 max-w-lg mx-auto px-4 py-6">
        <RoomChallenge room={room} userId={user?.id || ""} userName={user?.name || "Player"} onComplete={handleComplete} />
      </main>
    </div>
  );
}
