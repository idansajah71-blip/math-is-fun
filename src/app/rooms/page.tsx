"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import FeatureGuard from "@/components/admin/FeatureGuard";
import { createRoom, joinRoom, getUserRooms, deleteRoom } from "@/lib/rooms";
import { EVENT_TYPES, type EventType } from "@/lib/events";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Copy, Check, Users, Plus, LogIn, Trash2, Swords, Zap, Timer, Brain, Skull, Dice6, CalendarDays, Target, Crown } from "lucide-react";
import toast from "react-hot-toast";

const EVENT_ICON_MAP: Record<string, React.ReactNode> = {
  swords: <Swords size={16} />,
  zap: <Zap size={16} />,
  timer: <Timer size={16} />,
  brain: <Brain size={16} />,
  skull: <Skull size={16} />,
  dice: <Dice6 size={16} />,
  calendar: <CalendarDays size={16} />,
  target: <Target size={16} />,
};

const EVENT_TYPE_LIST = [
  { id: "boss_battle", icon: "swords" },
  { id: "speed_blitz", icon: "zap" },
  { id: "marathon", icon: "timer" },
  { id: "trivia_night", icon: "brain" },
  { id: "elimination", icon: "skull" },
  { id: "mystery", icon: "dice" },
  { id: "challenge_week", icon: "calendar" },
];

export default function RoomsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"my" | "create" | "join">("my");
  const [joinCode, setJoinCode] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "boss_battle" as EventType,
    topics: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    questionsCount: 10,
  });

  const [myRooms, setMyRooms] = useState<import("@/lib/rooms").Room[]>([]);
  const refreshRooms = useCallback(() => {
    if (user) setMyRooms(getUserRooms(user.id));
  }, [user]);

  useEffect(() => { refreshRooms(); }, [refreshRooms]);

  function handleCreate() {
    if (!user) return;
    const room = createRoom(user.id, user.name || "Player", {
      type: form.type,
      topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean),
      difficulty: form.difficulty,
      questionsCount: form.questionsCount,
    });
    toast.success(`Room ${room.code} dibuat!`);
    refreshRooms();
    router.push(`/rooms/${room.code}`);
  }

  function handleJoin() {
    if (!user || !joinCode.trim()) return;
    const result = joinRoom(joinCode.trim(), user.id, user.name || "Player");
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Berhasil join room!");
    router.push(`/rooms/${joinCode.trim().toUpperCase()}`);
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function handleDelete(code: string) {
    deleteRoom(code);
    refreshRooms();
    toast.success("Room dihapus");
  }

  return (
    <FeatureGuard flag="events">
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
          <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
            <div className="max-w-5xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[var(--duo-green)]/10 rounded-2xl flex items-center justify-center">
                  <Users size={24} className="text-[var(--duo-green)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[var(--duo-text)]">Room Challenge</h1>
                  <p className="text-sm text-[var(--duo-text-muted)]">Buat room, ajak teman, adu skor!</p>
                </div>
              </div>
              <div className="flex gap-2">
                {(["my", "create", "join"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      tab === t ? "bg-[var(--duo-green)] text-white" : "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
                    }`}>
                    {t === "my" ? "Room Saya" : t === "create" ? "Buat Room" : "Join Room"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-8 py-6">
            {tab === "my" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
                {myRooms.length === 0 ? (
                  <div className="text-center py-16">
                    <Users size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-[var(--duo-text)]">Belum ada room</p>
                    <p className="text-xs text-[var(--duo-text-muted)] mt-1">Buat room baru atau join room teman</p>
                  </div>
                ) : (
                  myRooms.map((room) => {
                    const typeInfo = EVENT_TYPES[room.config.type];
                    const typeIcon = EVENT_TYPE_LIST.find((t) => t.id === room.config.type);
                    return (
                      <motion.div key={room.code} variants={staggerItem}
                        className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo?.gradient || "from-gray-500 to-gray-600"} flex items-center justify-center text-white shrink-0`}>
                            {EVENT_ICON_MAP[typeIcon?.icon || "target"] || <Target size={18} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-black text-[var(--duo-text)]">{typeInfo?.label || room.config.type}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                room.status === "waiting" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : room.status === "playing" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              }`}>{room.status.toUpperCase()}</span>
                              {room.hostId === user?.id && <Crown size={12} className="text-yellow-400" />}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--duo-text-muted)]">
                              <span className="flex items-center gap-1">Code: <button onClick={() => handleCopy(room.code)} className="font-mono text-[var(--duo-green)] hover:underline">{room.code}</button>
                                {copiedCode === room.code ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                              </span>
                              <span className="flex items-center gap-1"><Users size={10} /> {room.players.length} pemain</span>
                              <span>{room.config.questionsCount} soal</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => router.push(`/rooms/${room.code}`)}
                              className="px-3 py-1.5 text-[10px] font-bold text-[var(--duo-green)] bg-[var(--duo-green)]/10 rounded-lg hover:bg-[var(--duo-green)]/20 transition-colors">
                              Buka
                            </button>
                            {room.hostId === user?.id && room.status === "waiting" && (
                              <button onClick={() => handleDelete(room.code)}
                                className="p-2 text-[var(--duo-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {tab === "create" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6 space-y-4 max-w-lg">
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
                  <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Topik (koma)</label>
                  <input type="text" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]"
                    placeholder="aljabar, geometri" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Difficulty</label>
                    <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as "easy" | "medium" | "hard" })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Jumlah Soal</label>
                    <input type="number" value={form.questionsCount} onChange={(e) => setForm({ ...form, questionsCount: parseInt(e.target.value) || 10 })}
                      className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--duo-green)]" />
                  </div>
                </div>
                <button onClick={handleCreate}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[var(--duo-green)] to-emerald-500 text-white rounded-xl text-sm font-black shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Buat Room
                </button>
              </motion.div>
            )}

            {tab === "join" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-6 space-y-4 max-w-lg">
                <h3 className="text-sm font-black text-[var(--duo-text)]">Join Room</h3>
                <p className="text-xs text-[var(--duo-text-muted)]">Masukkan kode room dari teman kamu</p>
                <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-4 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-xl font-black text-center font-mono text-[var(--duo-text)] tracking-[0.3em] focus:outline-none focus:border-[var(--duo-green)] uppercase"
                  placeholder="XXXXXX" maxLength={6} />
                <button onClick={handleJoin} disabled={joinCode.length < 6}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[var(--duo-green)] to-emerald-500 text-white rounded-xl text-sm font-black shadow-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                  <LogIn size={16} /> Join Room
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </FeatureGuard>
  );
}
