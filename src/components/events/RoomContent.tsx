"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { createRoom, joinRoom, getUserRooms, deleteRoom } from "@/lib/rooms";
import { EVENT_TYPES, type EventType } from "@/lib/events";
import { Copy, Check, Users, Plus, LogIn, Trash2, Swords, Zap, Timer, Brain, Skull, Dice6, CalendarDays, Target, Crown, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const EVENT_ICON_MAP: Record<string, React.ReactNode> = {
  swords: <Swords size={16} />, zap: <Zap size={16} />, timer: <Timer size={16} />,
  brain: <Brain size={16} />, skull: <Skull size={16} />, dice: <Dice6 size={16} />,
  calendar: <CalendarDays size={16} />, target: <Target size={16} />,
};

const EVENT_TYPE_LIST = [
  { id: "boss_battle", icon: "swords" }, { id: "speed_blitz", icon: "zap" },
  { id: "marathon", icon: "timer" }, { id: "trivia_night", icon: "brain" },
  { id: "elimination", icon: "skull" }, { id: "mystery", icon: "dice" },
  { id: "challenge_week", icon: "calendar" },
];

export default function RoomContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"my" | "create" | "join">("my");
  const [joinCode, setJoinCode] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const timersRef = useRef<number[]>([]);

  const scheduleTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timersRef.current = timersRef.current.filter((t) => t !== id); fn(); }, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => { return () => { timersRef.current.forEach(clearTimeout); }; }, []);

  const [form, setForm] = useState({ type: "boss_battle" as EventType, topics: "", difficulty: "medium" as "easy" | "medium" | "hard", questionsCount: 10 });
  const [myRooms, setMyRooms] = useState<import("@/lib/rooms").Room[]>([]);
  const refreshRooms = useCallback(() => { if (user) setMyRooms(getUserRooms(user.id)); }, [user]);
  useEffect(() => { refreshRooms(); }, [refreshRooms]);

  async function handleCreate() {
    if (!user) return;
    setCreating(true);
    try {
      const room = createRoom(user.id, user.name || "Player", { type: form.type, topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean), difficulty: form.difficulty, questionsCount: form.questionsCount });
      toast.success(`Room ${room.code} dibuat!`);
      refreshRooms();
      router.push(`/rooms/${room.code}`);
    } finally { setCreating(false); }
  }

  async function handleJoin() {
    if (!user || !joinCode.trim()) return;
    setJoining(true);
    try {
      const result = joinRoom(joinCode.trim(), user.id, user.name || "Player");
      if (result.error) { toast.error(result.error); return; }
      toast.success("Berhasil join room!");
      router.push(`/rooms/${joinCode.trim().toUpperCase()}`);
    } finally { setJoining(false); }
  }

  function handleCopy(code: string) { navigator.clipboard.writeText(code); setCopiedCode(code); scheduleTimer(() => setCopiedCode(null), 2000); }
  function handleDelete(code: string) { if (!confirm("Yakin ingin menghapus room ini?")) return; deleteRoom(code); refreshRooms(); toast.success("Room dihapus"); }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["my", "create", "join"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${tab === t ? "bg-[var(--duo-green)] text-white" : "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"}`}>
            {t === "my" ? "Room Saya" : t === "create" ? "Buat Room" : "Join Room"}
          </button>
        ))}
      </div>

      {tab === "my" && (
        <div className="space-y-3">
          {myRooms.length === 0 ? (
            <div className="text-center py-12">
              <Users size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-[var(--duo-text)]">Belum ada room</p>
              <p className="text-xs text-[var(--duo-text-muted)] mt-1">Buat room baru atau join room teman</p>
            </div>
          ) : myRooms.map((room) => {
            const typeInfo = EVENT_TYPES[room.config.type];
            const typeIcon = EVENT_TYPE_LIST.find((t) => t.id === room.config.type);
            return (
              <div key={room.code} className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeInfo?.gradient || "from-gray-500 to-gray-600"} flex items-center justify-center text-white shrink-0`}>
                  {EVENT_ICON_MAP[typeIcon?.icon || "target"] || <Target size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-xs font-black text-[var(--duo-text)]">{typeInfo?.label || room.config.type}</h3>
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${room.status === "waiting" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" : room.status === "playing" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>{room.status.toUpperCase()}</span>
                    {room.hostId === user?.id && <Crown size={10} className="text-yellow-400" />}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--duo-text-muted)]">
                    <button onClick={() => handleCopy(room.code)} className="font-mono text-[var(--duo-green)] hover:underline">{room.code}</button>
                    {copiedCode === room.code && <Check size={9} className="text-green-400" />}
                    <span className="flex items-center gap-0.5"><Users size={9} /> {room.players.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => router.push(`/rooms/${room.code}`)} className="px-2.5 py-1 text-[9px] font-bold text-[var(--duo-green)] bg-[var(--duo-green)]/10 rounded-lg hover:bg-[var(--duo-green)]/20">Buka</button>
                  {room.hostId === user?.id && room.status === "waiting" && (
                    <button onClick={() => handleDelete(room.code)} className="p-1.5 text-[var(--duo-text-muted)] hover:text-red-500 rounded-lg"><Trash2 size={12} /></button>
                  )}
                </div>
              </div>
            );
          })}
          <Link href="/rooms" className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[var(--duo-text-muted)] hover:text-[var(--duo-text)] transition-colors">
            Buka Room Lengkap <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {tab === "create" && (
        <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 space-y-3 max-w-lg">
          <h3 className="text-sm font-black text-[var(--duo-text)]">Buat Room Baru</h3>
          <div>
            <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Tipe Game</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(EVENT_TYPES).map(([key, val]) => {
                const typeIcon = EVENT_TYPE_LIST.find((t) => t.id === key);
                return (
                  <button key={key} onClick={() => setForm({ ...form, type: key as EventType })}
                    className={`p-2 rounded-xl border-2 text-center transition-all ${form.type === key ? "border-[var(--duo-green)] bg-[var(--duo-green)]/10" : "border-[var(--duo-border)] hover:border-gray-400"}`}>
                    <div className="flex justify-center mb-1">{EVENT_ICON_MAP[typeIcon?.icon || "target"]}</div>
                    <span className="text-[9px] font-bold text-[var(--duo-text)]">{val.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="rc-topics" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Topik (koma)</label>
            <input id="rc-topics" type="text" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-xs font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]" placeholder="aljabar, geometri" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="rc-diff" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Difficulty</label>
              <select id="rc-diff" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as "easy" | "medium" | "hard" })}
                className="w-full px-3 py-2 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-xs font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label htmlFor="rc-count" className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Jumlah Soal</label>
              <input id="rc-count" type="number" value={form.questionsCount} onChange={(e) => setForm({ ...form, questionsCount: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-xs font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]" />
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating}
            className="w-full py-2.5 bg-gradient-to-r from-[var(--duo-green)] to-emerald-500 text-white rounded-xl text-xs font-black hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-40">
            {creating ? <span className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Membuat...</span> : <><Plus size={14} /> Buat Room</>}
          </button>
        </div>
      )}

      {tab === "join" && (
        <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 space-y-3 max-w-lg">
          <h3 className="text-sm font-black text-[var(--duo-text)]">Join Room</h3>
          <p className="text-xs text-[var(--duo-text-muted)]">Masukkan kode room dari teman kamu</p>
          <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-lg font-black text-center font-mono text-[var(--duo-text)] tracking-[0.3em] focus:outline-none focus:border-[var(--duo-green)] uppercase" placeholder="XXXXXX" maxLength={6} />
          <button onClick={handleJoin} disabled={joining || joinCode.length < 6}
            className="w-full py-2.5 bg-gradient-to-r from-[var(--duo-green)] to-emerald-500 text-white rounded-xl text-xs font-black hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
            {joining ? <span className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Mengirim...</span> : <><LogIn size={14} /> Join Room</>}
          </button>
        </div>
      )}
    </div>
  );
}
