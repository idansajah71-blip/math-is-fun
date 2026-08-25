"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
  getEventById,
  getEventParticipants,
  isEventJoined,
  joinEvent,
  updateParticipant,
  getParticipant,
} from "@/lib/events";
import type { EventParticipant } from "@/lib/events";
import { EVENT_TYPES } from "@/lib/events";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  HelpCircle,
  Heart,
  Trophy,
  Gem,
  Award,
  ArrowLeft,
  Zap,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const gradientMap: Record<string, string> = {
  "from-red-500 to-orange-500": "from-red-500 to-orange-500",
  "from-yellow-500 to-amber-500": "from-yellow-500 to-amber-500",
  "from-blue-500 to-cyan-500": "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500": "from-purple-500 to-pink-500",
  "from-gray-700 to-gray-900": "from-gray-700 to-gray-900",
  "from-emerald-500 to-teal-500": "from-emerald-500 to-teal-500",
  "from-indigo-500 to-violet-500": "from-indigo-500 to-violet-500",
};

const difficultyConfig = {
  easy: { label: "Mudah", color: "bg-[var(--duo-green)]/15 text-[var(--duo-green)]" },
  medium: { label: "Sedang", color: "bg-[var(--duo-xp)]/15 text-[var(--duo-xp)]" },
  hard: { label: "Sulit", color: "bg-red-500/15 text-red-500" },
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const event = useMemo(() => getEventById(id), [id]);
  const participants = useMemo(() => (event ? getEventParticipants(event.id) : []), [event]);
  const isJoined = useMemo(
    () => (user && event ? isEventJoined(event.id, user.id) : false),
    [event, user]
  );
  const participant: EventParticipant | undefined = useMemo(
    () => (user && event ? getParticipant(event.id, user.id) : undefined),
    [event, user]
  );

  if (!event) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
          <div className="max-w-2xl mx-auto px-8 py-16 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 bg-[var(--duo-card)] rounded-full flex items-center justify-center border-2 border-[var(--duo-border)]">
                <Calendar size={40} className="text-[var(--duo-text-muted)]" />
              </div>
            </div>
            <h2 className="text-lg font-black text-[var(--duo-text)] mb-2">Event Tidak Ditemukan</h2>
            <p className="text-sm text-[var(--duo-text-muted)] mb-6">
              Event yang kamu cari tidak tersedia atau sudah dihapus.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all"
            >
              <ArrowLeft size={16} />
              Kembali ke Event
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const eventType = EVENT_TYPES[event.type];
  const gradientClass = gradientMap[eventType.gradient] || "from-gray-500 to-gray-700";
  const diff = difficultyConfig[event.difficulty];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const formatDateTime = (date: string, time: string) => {
    const d = new Date(`${date}T${time}`);
    return d.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleJoin = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    joinEvent(event.id, user.id);
    router.push(`/events/${event.id}/play`);
  };

  const handleStart = () => {
    if (!user || !event) return;
    updateParticipant(event.id, user.id, { status: "playing" });
    router.push(`/events/${event.id}/play`);
  };

  const renderActionButton = () => {
    if (!user) {
      return (
        <button
          onClick={handleJoin}
          className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          Masuk untuk Join
        </button>
      );
    }

    if (!participant) {
      return (
        <button
          onClick={handleJoin}
          className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          Join Event
        </button>
      );
    }

    if (participant.status === "completed") {
      return (
        <div className="space-y-3">
          <div className="p-4 bg-[var(--duo-green)]/10 rounded-2xl border border-[var(--duo-green)]/30 text-center">
            <CheckCircle2 size={24} className="text-[var(--duo-green)] mx-auto mb-1" />
            <p className="text-sm font-bold text-[var(--duo-green)]">Selesai ✓</p>
            <p className="text-xs text-[var(--duo-text-muted)] mt-1">
              Skor: {participant.score} | XP: +{participant.xpEarned} | Gems: +{participant.gemsEarned}
            </p>
          </div>
          <Link
            href="/events"
            className="block w-full py-3 bg-[var(--duo-card)] text-[var(--duo-text)] rounded-xl text-sm font-bold border-2 border-[var(--duo-border)] text-center hover:brightness-110 transition-all"
          >
            Kembali ke Event
          </Link>
        </div>
      );
    }

    if (participant.status === "failed") {
      return (
        <div className="space-y-3">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/30 text-center">
            <p className="text-sm font-bold text-red-500">Gagal</p>
            <p className="text-xs text-[var(--duo-text-muted)] mt-1">
              Skor: {participant.score} | Coba lagi untuk hasil lebih baik!
            </p>
          </div>
          <button
            onClick={handleJoin}
            className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Coba Lagi
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleStart}
        className="w-full py-3 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_3px_0_var(--duo-green-dark)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
      >
        <Zap size={16} />
        Mulai Event
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-8 py-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--duo-text-muted)] hover:text-[var(--duo-text)] transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Kembali
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 bg-gradient-to-r ${gradientClass} mb-6`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{eventType.icon}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  {eventType.label}
                </span>
                <h1 className="text-2xl font-black text-white">{event.name}</h1>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{event.description}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <InfoCard icon={<Calendar size={16} />} label="Tipe" value={eventType.label} />
            <InfoCard icon={<Trophy size={16} />} label="Difficulties" value={diff.label} />
            <InfoCard icon={<HelpCircle size={16} />} label="Jumlah Soal" value={`${event.questionsCount} soal`} />
            <InfoCard icon={<Heart size={16} />} label="Nyawa" value={`${event.lives} nyawa`} />
            <InfoCard
              icon={<Clock size={16} />}
              label="Mulai"
              value={formatDateTime(event.startDate, event.startTime)}
            />
            <InfoCard
              icon={<Clock size={16} />}
              label="Selesai"
              value={formatDateTime(event.endDate, event.endTime)}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 mb-6"
          >
            <h3 className="text-sm font-black text-[var(--duo-text)] mb-3">Reward</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--duo-xp)]/10 rounded-xl">
                <Zap size={16} className="text-[var(--duo-xp)]" />
                <span className="text-sm font-bold text-[var(--duo-xp)]">{event.rewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--duo-info)]/10 rounded-xl">
                <Gem size={16} className="text-[var(--duo-info)]" />
                <span className="text-sm font-bold text-[var(--duo-info)]">{event.rewards.gems} Gems</span>
              </div>
              {event.rewards.badge && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--duo-green)]/10 rounded-xl">
                  <Award size={16} className="text-[var(--duo-green)]" />
                  <span className="text-sm font-bold text-[var(--duo-green)]">{event.rewards.badge}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[var(--duo-text-muted)]" />
                <span className="text-sm font-bold text-[var(--duo-text)]">
                  {participants.length} peserta
                </span>
              </div>
              {event.maxParticipants > 0 && (
                <span className="text-xs font-bold text-[var(--duo-text-muted)]">
                  Max {event.maxParticipants}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {renderActionButton()}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[var(--duo-text-muted)]">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--duo-text-muted)]">{label}</span>
      </div>
      <p className="text-sm font-bold text-[var(--duo-text)]">{value}</p>
    </div>
  );
}
