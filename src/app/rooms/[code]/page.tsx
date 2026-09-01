"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { getRoomByCode, startRoom, deleteRoom } from "@/lib/rooms";
import type { Room } from "@/lib/rooms";
import { EVENT_TYPES } from "@/lib/events";
import { Crown, Users, Copy, Check, Play, Trash2, ArrowLeft, Swords, Zap, Timer, Brain, Skull, Dice6, CalendarDays, Target } from "lucide-react";
import toast from "react-hot-toast";

const EVENT_ICON_MAP: Record<string, React.ReactNode> = {
  swords: <Swords size={18} />,
  zap: <Zap size={18} />,
  timer: <Timer size={18} />,
  brain: <Brain size={18} />,
  skull: <Skull size={18} />,
  dice: <Dice6 size={18} />,
  calendar: <CalendarDays size={18} />,
  target: <Target size={18} />,
};

const EVENT_TYPE_LIST: Record<string, string> = {
  boss_battle: "swords",
  speed_blitz: "zap",
  marathon: "timer",
  trivia_night: "brain",
  elimination: "skull",
  mystery: "dice",
  challenge_week: "calendar",
};

export default function RoomLobbyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = getRoomByCode(code);
    if (!r) {
      toast.error("Room tidak ditemukan");
      router.replace("/rooms");
      return;
    }
    setRoom(r);
    setLoading(false);
  }, [code, router]);

  useEffect(() => {
    if (room?.status === "playing") {
      router.replace(`/rooms/${code}/play`);
    }
  }, [room, code, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const r = getRoomByCode(code);
      if (r) setRoom(r);
    }, 1000);
    return () => clearInterval(interval);
  }, [code]);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleStart() {
    if (!user || !room) return;
    const result = startRoom(code, user.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Mulai!");
    router.replace(`/rooms/${code}/play`);
  }

  function handleDelete() {
    if (!user || !room) return;
    deleteRoom(code);
    toast.success("Room dihapus");
    router.replace("/rooms");
  }

  function handleLeave() {
    router.replace("/rooms");
  }

  if (loading || !room) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)] items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--duo-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isHost = room.hostId === user?.id;
  const typeInfo = EVENT_TYPES[room.config.type];
  const typeIcon = EVENT_TYPE_LIST[room.config.type] || "target";

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <main className="flex-1 max-w-lg mx-auto px-4 py-6 flex flex-col">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <button onClick={handleLeave} className="flex items-center gap-2 text-xs font-bold text-[var(--duo-text-muted)] hover:text-[var(--duo-text)]">
            <ArrowLeft size={14} /> Kembali
          </button>

          <div className={`bg-gradient-to-br ${typeInfo?.gradient || "from-gray-500 to-gray-600"} rounded-2xl p-6 text-white text-center`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              {EVENT_ICON_MAP[typeIcon] || <Target size={24} />}
            </div>
            <h1 className="text-xl font-black">{typeInfo?.label || room.config.type}</h1>
            <p className="text-sm opacity-80 mt-1">{room.config.questionsCount} soal &bull; {room.config.difficulty}</p>
          </div>

          <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 text-center space-y-4">
            <div>
              <p className="text-xs font-bold text-[var(--duo-text-muted)] mb-1">Kode Room</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black font-mono text-[var(--duo-green)] tracking-[0.2em]">{code}</span>
                <button onClick={handleCopy} aria-label="Salin kode" className="p-2 hover:bg-[var(--duo-bg)] rounded-lg transition-colors">
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-[var(--duo-text-muted)]" />}
                </button>
              </div>
              <p className="text-[10px] text-[var(--duo-text-muted)] mt-1">Bagikan kode ini ke teman</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[var(--duo-text)]">Pemain ({room.players.length})</h3>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                room.status === "waiting" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              }`}>{room.status.toUpperCase()}</span>
            </div>
            <div className="space-y-2">
              {room.players.map((p, i) => (
                <div key={p.userId} className="flex items-center gap-3 p-3 bg-[var(--duo-bg)] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--duo-green)] to-emerald-400 flex items-center justify-center text-white text-sm font-black">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--duo-text)] truncate">{p.name}</p>
                    <p className="text-[10px] text-[var(--duo-text-muted)]">
                      {p.status === "waiting" ? "Menunggu..." : p.status === "playing" ? "Sedang main..." : `Skor: ${p.score}`}
                    </p>
                  </div>
                  {room.hostId === p.userId && <Crown size={14} className="text-yellow-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {isHost && room.status === "waiting" && (
            <div className="flex gap-3">
              <button onClick={handleDelete}
                className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2">
                <Trash2 size={14} /> Hapus
              </button>
              <button onClick={handleStart} disabled={room.players.length < 2}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--duo-green)] to-emerald-500 text-white rounded-xl text-sm font-black shadow-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                <Play size={16} /> Mulai ({room.players.length}/2 minimal)
              </button>
            </div>
          )}

          {!isHost && room.status === "waiting" && (
            <p className="text-center text-xs font-bold text-[var(--duo-text-muted)]">Menunggu host memulai...</p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
