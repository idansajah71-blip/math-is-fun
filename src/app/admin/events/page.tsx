"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Trophy, Swords, Zap, Clock, Trash2, Edit3, Eye, ChevronRight, Heart, Target, Timer, Brain, Skull, Dice6, CalendarDays } from "lucide-react";
import React from "react";

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

const EVENT_TYPES = [
  { id: "boss_battle", label: "Boss Battle", icon: "swords", color: "from-red-500 to-orange-500" },
  { id: "speed_blitz", label: "Speed Blitz", icon: "zap", color: "from-yellow-500 to-amber-500" },
  { id: "marathon", label: "Marathon", icon: "timer", color: "from-blue-500 to-cyan-500" },
  { id: "trivia_night", label: "Trivia Night", icon: "brain", color: "from-purple-500 to-pink-500" },
  { id: "elimination", label: "Elimination", icon: "skull", color: "from-gray-700 to-gray-900" },
  { id: "mystery", label: "Mystery", icon: "dice", color: "from-emerald-500 to-teal-500" },
  { id: "challenge_week", label: "Challenge Week", icon: "calendar", color: "from-indigo-500 to-violet-500" },
];

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

const EVENTS_KEY = "matika-admin-events";

function getEvents(): EventData[] {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  } catch { return []; }
}

function saveEvents(events: EventData[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
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

    let updated: EventData[];
    if (editing) {
      updated = events.map((e) => (e.id === editing ? eventData : e));
    } else {
      updated = [...events, eventData];
    }
    saveEvents(updated);
    setEvents(updated);
    resetForm();
  }

  function handleEdit(id: string) {
    const evt = events.find((e) => e.id === id);
    if (!evt) return;
    setForm({
      name: evt.name,
      type: evt.type,
      description: evt.description,
      startDate: evt.startDate,
      endDate: evt.endDate,
      startTime: evt.startTime,
      endTime: evt.endTime,
      topics: evt.topics.join(", "),
      difficulty: evt.difficulty,
      questionsCount: evt.questionsCount,
      lives: evt.lives,
      xpReward: evt.rewards.xp,
      gemsReward: evt.rewards.gems,
      badgeReward: evt.rewards.badge || "",
      maxParticipants: evt.maxParticipants,
    });
    setEditing(id);
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

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    scheduled: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    active: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    ended: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
          <Calendar size={24} className="text-purple-500" />
          Event Management
        </h1>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">{events.length} event terdaftar</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
          <Plus size={16} />
          Buat Event
        </button>
      </motion.div>

      {/* Event Type Legend */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((t) => (
          <div key={t.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[var(--duo-card)] rounded-xl border border-[var(--duo-border)]">
            <span>{t.icon}</span>
            <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">{t.label}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 space-y-4">
          <h3 className="text-sm font-black text-[var(--duo-text)]">{editing ? "Edit Event" : "Event Baru"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Nama Event</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500"
                placeholder="Boss Battle: Aljabar" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Tipe Event</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventData["type"] })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500">
                {EVENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500 h-20 resize-none"
                placeholder="Deskripsi event..." />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Tanggal Mulai</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Tanggal Selesai</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Jam Mulai</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Jam Selesai</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Topik (koma)</label>
              <input type="text" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500"
                placeholder="aljabar, geometri" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as EventData["difficulty"] })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Jumlah Soal</label>
              <input type="number" value={form.questionsCount} onChange={(e) => setForm({ ...form, questionsCount: parseInt(e.target.value) || 10 })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Nyawa</label>
              <input type="number" value={form.lives} onChange={(e) => setForm({ ...form, lives: parseInt(e.target.value) || 3 })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">XP Reward</label>
              <input type="number" value={form.xpReward} onChange={(e) => setForm({ ...form, xpReward: parseInt(e.target.value) || 100 })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Gems Reward</label>
              <input type="number" value={form.gemsReward} onChange={(e) => setForm({ ...form, gemsReward: parseInt(e.target.value) || 50 })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Badge (opsional)</label>
              <input type="text" value={form.badgeReward} onChange={(e) => setForm({ ...form, badgeReward: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500"
                placeholder="boss-slayer" />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Max Peserta</label>
              <input type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 100 })}
                className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={resetForm}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text)] rounded-xl text-sm font-bold">
              Batal
            </button>
            <button onClick={handleSubmit} disabled={!form.name}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-40">
              {editing ? "Simpan Perubahan" : "Buat Event"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)]">
          <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-sm font-bold text-[var(--duo-text)]">Belum ada event</p>
          <p className="text-xs text-[var(--duo-text-muted)] mt-1">Klik &quot;Buat Event&quot; untuk mulai</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((evt, i) => {
            const typeInfo = EVENT_TYPES.find((t) => t.id === evt.type);
            return (
              <motion.div key={evt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo?.color || "from-gray-500 to-gray-600"} flex items-center justify-center text-white shrink-0`}>
                    {EVENT_ICON_MAP[typeInfo?.icon || "target"] || <Target size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-black text-[var(--duo-text)]">{evt.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusColors[evt.status]}`}>{evt.status.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-[var(--duo-text-muted)] mb-2">{evt.description || "Tanpa deskripsi"}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-[var(--duo-text-muted)]">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {evt.startDate || "Draft"}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {evt.startTime} - {evt.endTime}</span>
                      <span className="flex items-center gap-1"><Zap size={10} /> {evt.questionsCount} soal</span>
                      <span className="flex items-center gap-1"><Heart size={10} className="text-red-400" /> {evt.lives} nyawa</span>
                      <span className="flex items-center gap-1"><Trophy size={10} className="text-yellow-400" /> +{evt.rewards.xp} XP, +{evt.rewards.gems} Gems</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {evt.status === "draft" && (
                      <button onClick={() => handlePublish(evt.id)}
                        className="px-3 py-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 transition-colors">
                        Publish
                      </button>
                    )}
                    {evt.status === "active" && (
                      <button onClick={() => handleEnd(evt.id)}
                        className="px-3 py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/30 rounded-lg hover:bg-orange-100 transition-colors">
                        End
                      </button>
                    )}
                    <button onClick={() => handleEdit(evt.id)}
                      className="p-2 text-[var(--duo-text-muted)] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(evt.id)}
                      className="p-2 text-[var(--duo-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
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
