"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Plus, Trophy, Swords, Zap, Clock, Trash2, Edit3,
  Heart, Target, Timer, Brain, Skull, Dice6, CalendarDays,
  ChevronLeft, ChevronRight, Check, Users, Flame,
} from "lucide-react";

export interface EventData {
  id: string;
  name: string;
  type: "boss_battle" | "speed_blitz" | "marathon" | "trivia_night" | "elimination" | "mystery" | "challenge_week";
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  topics: string[];
  difficulty: "easy" | "medium" | "hard";
  questionsCount: number;
  lives: number;
  rewards: { xp: number; gems: number; badge: string | null };
  maxParticipants: number;
  status: "draft" | "scheduled" | "active" | "ended";
  createdBy: string;
  createdAt: string;
}

const EVENT_TYPES: {
  id: EventData["type"];
  label: string;
  icon: React.ReactNode;
  gradient: string;
  desc: string;
}[] = [
  { id: "boss_battle", label: "Boss Battle", icon: <Swords size={22} />, gradient: "from-red-500 to-orange-500", desc: "Lawan boss dengan soal matematika!" },
  { id: "speed_blitz", label: "Speed Blitz", icon: <Zap size={22} />, gradient: "from-yellow-500 to-amber-500", desc: "Jawab secepat mungkin dalam waktu terbatas!" },
  { id: "marathon", label: "Marathon", icon: <Timer size={22} />, gradient: "from-blue-500 to-cyan-500", desc: "Quiz panjang, selesaikan semua soal!" },
  { id: "trivia_night", label: "Trivia Night", icon: <Brain size={22} />, gradient: "from-purple-500 to-pink-500", desc: "Soal campuran dari berbagai topik!" },
  { id: "elimination", label: "Elimination", icon: <Skull size={22} />, gradient: "from-gray-600 to-gray-800", desc: "Salah jawab = opsi berkurang!" },
  { id: "mystery", label: "Mystery", icon: <Dice6 size={22} />, gradient: "from-emerald-500 to-teal-500", desc: "Soal tersembunyi, tebak jawabannya!" },
  { id: "challenge_week", label: "Challenge Week", icon: <CalendarDays size={22} />, gradient: "from-indigo-500 to-violet-500", desc: "7 hari challenge, selesaikan semua!" },
];

const EVENTS_KEY = "matika-admin-events";
const PARTICIPANTS_KEY = "matika_event_participants";

function getEvents(): EventData[] {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEvents(events: EventData[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function getParticipantCount(eventId: string): number {
  try {
    const all = JSON.parse(localStorage.getItem(PARTICIPANTS_KEY) || "[]");
    return all.filter((p: { eventId: string }) => p.eventId === eventId).length;
  } catch {
    return 0;
  }
}

function getCountdown(startDate: string, endDate: string, status: string): string {
  if (status === "ended") return "Selesai";
  if (status === "draft") return "Draft";
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  if (status === "active") {
    if (!endDate) return "Aktif";
    const end = new Date(endDate + "T23:59:59");
    const diff = Math.ceil((end.getTime() - now.getTime()) / 86400000);
    if (diff <= 0) return "Hari ini";
    if (diff === 1) return "1 hari lagi";
    return `${diff} hari lagi`;
  }
  if (!startDate) return "Belum dijadwalkan";
  const start = new Date(startDate + "T00:00:00");
  const diff = Math.ceil((start.getTime() - now.getTime()) / 86400000);
  if (diff <= 0) return "Mulai hari ini";
  if (diff === 1) return "Mulai besok";
  return `Mulai dalam ${diff} hari`;
}

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
  hard: { label: "Hard", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  scheduled: { label: "Terjadwal", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  active: { label: "Aktif", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  ended: { label: "Selesai", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    type: "boss_battle" as EventData["type"],
    description: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    topics: "",
    difficulty: "medium" as EventData["difficulty"],
    questionsCount: 10,
    lives: 3,
    xpReward: 100,
    gemsReward: 50,
    badgeReward: "",
    maxParticipants: 100,
  });

  const load = useCallback(() => { setEvents(getEvents()); }, []);
  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({
      name: "", type: "boss_battle", description: "",
      startDate: "", endDate: "", startTime: "09:00", endTime: "17:00",
      topics: "", difficulty: "medium", questionsCount: 10, lives: 3,
      xpReward: 100, gemsReward: 50, badgeReward: "", maxParticipants: 100,
    });
    setEditing(null);
    setShowForm(false);
    setStep(0);
  }

  function handleSubmit() {
    const now = new Date().toISOString();
    const eventData: EventData = {
      id: editing || `evt-${Date.now()}`,
      name: form.name,
      type: form.type,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      startTime: form.startTime,
      endTime: form.endTime,
      topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean),
      difficulty: form.difficulty,
      questionsCount: form.questionsCount,
      lives: form.lives,
      rewards: { xp: form.xpReward, gems: form.gemsReward, badge: form.badgeReward || null },
      maxParticipants: form.maxParticipants,
      status: form.startDate ? "scheduled" : "draft",
      createdBy: "admin@matika.com",
      createdAt: editing ? (events.find((e) => e.id === editing)?.createdAt || now) : now,
    };

    const updated = editing
      ? events.map((e) => (e.id === editing ? eventData : e))
      : [...events, eventData];
    saveEvents(updated);
    setEvents(updated);
    resetForm();
  }

  function handleEdit(id: string) {
    const evt = events.find((e) => e.id === id);
    if (!evt) return;
    setForm({
      name: evt.name, type: evt.type, description: evt.description,
      startDate: evt.startDate, endDate: evt.endDate,
      startTime: evt.startTime, endTime: evt.endTime,
      topics: evt.topics.join(", "), difficulty: evt.difficulty,
      questionsCount: evt.questionsCount, lives: evt.lives,
      xpReward: evt.rewards.xp, gemsReward: evt.rewards.gems,
      badgeReward: evt.rewards.badge || "", maxParticipants: evt.maxParticipants,
    });
    setEditing(id);
    setStep(0);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    const updated = events.filter((e) => e.id !== id);
    saveEvents(updated);
    setEvents(updated);
  }

  function handlePublish(id: string) {
    const updated = events.map((e) => (e.id === id ? { ...e, status: "active" as const } : e));
    saveEvents(updated);
    setEvents(updated);
  }

  function handleEnd(id: string) {
    const updated = events.map((e) => (e.id === id ? { ...e, status: "ended" as const } : e));
    saveEvents(updated);
    setEvents(updated);
  }

  const stats = {
    total: events.length,
    active: events.filter((e) => e.status === "active").length,
    scheduled: events.filter((e) => e.status === "scheduled").length,
    ended: events.filter((e) => e.status === "ended").length,
  };

  const formInputClass = "w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-[var(--purple)] transition-colors placeholder:text-[var(--fg-disabled)]";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
            <Calendar size={24} className="text-[var(--purple)]" />
            Event Management
          </h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{events.length} event terdaftar</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2.5 bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
          <Plus size={16} />
          Buat Event
        </button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "from-blue-500 to-cyan-400" },
          { label: "Aktif", value: stats.active, color: "from-green-500 to-emerald-400" },
          { label: "Terjadwal", value: stats.scheduled, color: "from-yellow-500 to-amber-400" },
          { label: "Selesai", value: stats.ended, color: "from-gray-500 to-gray-400" },
        ].map((s) => (
          <div key={s.label} className="p-3 bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)]">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-1.5`}>
              <Calendar size={12} className="text-white" />
            </div>
            <p className="text-lg font-black text-[var(--fg)]">{s.value}</p>
            <p className="text-[10px] font-bold text-[var(--fg-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--purple)]/30 overflow-hidden">

            <div className="px-6 pt-5 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-[var(--fg)]">{editing ? "Edit Event" : "Event Baru"}</h3>
                <button onClick={resetForm} className="text-[var(--fg-muted)] hover:text-[var(--danger)] transition-colors text-lg leading-none">&times;</button>
              </div>
              <div className="flex items-center gap-1">
                {["Info Dasar", "Jadwal", "Aturan Main", "Reward"].map((label, i) => (
                  <div key={label} className="flex items-center gap-1 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                      i < step ? "bg-[var(--primary)] text-white" : i === step ? "bg-[var(--purple)] text-white" : "bg-[var(--border-subtle)] text-[var(--fg-muted)]"
                    }`}>
                      {i < step ? <Check size={12} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold hidden md:block ${i === step ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>{label}</span>
                    {i < 3 && <div className={`flex-1 h-0.5 rounded mx-1 ${i < step ? "bg-[var(--primary)]" : "bg-[var(--border-subtle)]"}`} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Nama Event *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={formInputClass} placeholder="Boss Battle: Aljabar" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--fg-muted)] block mb-2">Tipe Event *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {EVENT_TYPES.map((t) => (
                        <button key={t.id} type="button"
                          onClick={() => setForm({ ...form, type: t.id })}
                          className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                            form.type === t.id
                              ? "border-[var(--purple)] bg-[var(--purple)]/5 shadow-md"
                              : "border-[var(--border)] bg-white dark:bg-[var(--surface)] hover:border-[var(--border-strong)]"
                          }`}>
                          {form.type === t.id && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--purple)] flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white mb-2`}>
                            {t.icon}
                          </div>
                          <p className="text-xs font-black text-[var(--fg)]">{t.label}</p>
                          <p className="text-[9px] text-[var(--fg-muted)] mt-0.5 leading-tight">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Deskripsi</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`${formInputClass} h-20 resize-none`} placeholder="Deskripsi event..." />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Tanggal Mulai</label>
                      <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        className={formInputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Tanggal Selesai</label>
                      <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        className={formInputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Jam Mulai</label>
                      <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        className={formInputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Jam Selesai</label>
                      <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                        className={formInputClass} />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--info-bg)] border border-[var(--info)]/20">
                    <p className="text-xs font-bold text-[var(--info-ink)]">
                      {form.startDate ? `Event akan dijadwalkan mulai ${form.startDate}` : "Tanpa tanggal = status Draft"}
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Topik (pisah koma)</label>
                    <input type="text" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })}
                      className={formInputClass} placeholder="aljabar, geometri" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--fg-muted)] block mb-2">Difficulty</label>
                    <div className="flex gap-2">
                      {(["easy", "medium", "hard"] as const).map((d) => (
                        <button key={d} type="button"
                          onClick={() => setForm({ ...form, difficulty: d })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${
                            form.difficulty === d
                              ? d === "easy" ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600"
                              : d === "medium" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600"
                              : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600"
                              : "border-[var(--border)] bg-white dark:bg-[var(--surface)] text-[var(--fg-muted)] hover:border-[var(--border-strong)]"
                          }`}>
                          {d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Jumlah Soal</label>
                      <input type="number" value={form.questionsCount} onChange={(e) => setForm({ ...form, questionsCount: parseInt(e.target.value) || 10 })}
                        className={formInputClass} min={1} max={50} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Nyawa</label>
                      <input type="number" value={form.lives} onChange={(e) => setForm({ ...form, lives: parseInt(e.target.value) || 3 })}
                        className={formInputClass} min={1} max={10} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">XP Reward</label>
                      <input type="number" value={form.xpReward} onChange={(e) => setForm({ ...form, xpReward: parseInt(e.target.value) || 100 })}
                        className={formInputClass} min={0} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Gems Reward</label>
                      <input type="number" value={form.gemsReward} onChange={(e) => setForm({ ...form, gemsReward: parseInt(e.target.value) || 50 })}
                        className={formInputClass} min={0} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Badge (opsional)</label>
                      <input type="text" value={form.badgeReward} onChange={(e) => setForm({ ...form, badgeReward: e.target.value })}
                        className={formInputClass} placeholder="boss-slayer" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg-muted)] block mb-1">Max Peserta</label>
                      <input type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 100 })}
                        className={formInputClass} min={1} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--border-subtle)] space-y-2">
                    <p className="text-xs font-black text-[var(--fg)]">Ringkasan Event</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--fg-muted)]">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--purple)]/10 text-[var(--purple)]">{EVENT_TYPES.find((t) => t.id === form.type)?.label}</span>
                      <span className={DIFFICULTY_CONFIG[form.difficulty].color}>{form.difficulty}</span>
                      <span>{form.questionsCount} soal</span>
                      <span>{form.lives} nyawa</span>
                    </div>
                    <p className="text-[10px] text-[var(--fg-muted)]">
                      Reward: +{form.xpReward} XP, +{form.gemsReward} Gems{form.badgeReward ? `, Badge: ${form.badgeReward}` : ""}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-[var(--border-subtle)]">
                <button onClick={() => step > 0 ? setStep(step - 1) : resetForm()}
                  className="px-4 py-2.5 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-1">
                  {step > 0 ? <><ChevronLeft size={14} /> Kembali</> : "Batal"}
                </button>
                <div className="flex gap-2">
                  {step < 3 ? (
                    <button onClick={() => setStep(step + 1)}
                      disabled={step === 0 && !form.name}
                      className="px-5 py-2.5 bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-1">
                      Selanjutnya <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={!form.name}
                      className="px-6 py-2.5 bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2">
                      <Check size={14} /> {editing ? "Simpan Perubahan" : "Buat Event"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)]">
          <Calendar size={48} className="text-[var(--border)] mx-auto mb-4" />
          <p className="text-sm font-bold text-[var(--fg)]">Belum ada event</p>
          <p className="text-xs text-[var(--fg-muted)] mt-1">Klik &quot;Buat Event&quot; untuk mulai</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((evt, i) => {
            const typeInfo = EVENT_TYPES.find((t) => t.id === evt.type);
            const participantCount = getParticipantCount(evt.id);
            const countdown = getCountdown(evt.startDate, evt.endDate, evt.status);
            const statusCfg = STATUS_CONFIG[evt.status];
            return (
              <motion.div key={evt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-[var(--surface)] rounded-2xl border-2 border-[var(--border)] p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo?.gradient || "from-gray-500 to-gray-600"} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                    {typeInfo?.icon || <Target size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-black text-[var(--fg)]">{evt.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusCfg?.color}`}>{statusCfg?.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${DIFFICULTY_CONFIG[evt.difficulty].color}`}>{evt.difficulty}</span>
                    </div>
                    <p className="text-xs text-[var(--fg-muted)] mb-2 line-clamp-1">{evt.description || "Tanpa deskripsi"}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-[var(--fg-muted)]">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {evt.startDate || "Draft"}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {evt.startTime} - {evt.endTime}</span>
                      <span className="flex items-center gap-1"><Zap size={10} className="text-[var(--accent-xp)]" /> {evt.questionsCount} soal</span>
                      <span className="flex items-center gap-1"><Heart size={10} className="text-[var(--danger)]" /> {evt.lives} nyawa</span>
                      <span className="flex items-center gap-1"><Trophy size={10} className="text-[var(--accent-xp)]" /> +{evt.rewards.xp} XP</span>
                      <span className="flex items-center gap-1"><Users size={10} className="text-[var(--info)]" /> {participantCount}/{evt.maxParticipants}</span>
                      <span className="flex items-center gap-1"><Flame size={10} className="text-[var(--orange)]" /> {countdown}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {evt.status === "draft" && (
                      <button onClick={() => handlePublish(evt.id)}
                        className="px-3 py-1.5 text-[10px] font-bold text-[var(--success-ink)] bg-[var(--success-bg)] rounded-lg hover:bg-[var(--success)]/20 transition-colors">
                        Publish
                      </button>
                    )}
                    {evt.status === "active" && (
                      <button onClick={() => handleEnd(evt.id)}
                        className="px-3 py-1.5 text-[10px] font-bold text-[var(--warning-ink)] bg-[var(--warning-bg)] rounded-lg hover:bg-[var(--warning)]/20 transition-colors">
                        Akhiri
                      </button>
                    )}
                    <button onClick={() => handleEdit(evt.id)}
                      className="p-2 text-[var(--fg-muted)] hover:text-[var(--info)] hover:bg-[var(--info-bg)] rounded-lg transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(evt.id)}
                      className="p-2 text-[var(--fg-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
