"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getEventById, getParticipant, updateParticipant, calculateRewards } from "@/lib/events";
import type { EventData } from "@/lib/events";
import { addXp, saveProfile } from "@/lib/gamification";
import EventPlay from "@/components/events/EventPlay";
import EventResult from "@/components/events/EventResult";
import { motion } from "framer-motion";

interface ResultData {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  gemsEarned: number;
  badgeEarned: string | null;
  isWin: boolean;
}

export default function EventPlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [event, setEvent] = useState<EventData | undefined>(undefined);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const ev = getEventById(id);
    if (!ev) {
      router.replace("/events");
      return;
    }

    if (!user) {
      router.replace("/events");
      return;
    }

    const participant = getParticipant(id, user.id);
    if (!participant || (participant.status !== "playing" && participant.status !== "joined")) {
      router.replace(`/events/${id}`);
      return;
    }

    if (participant.status === "joined") {
      updateParticipant(id, user.id, { status: "playing" });
    }

    setEvent(ev);
    setLoading(false);
  }, [id, user, router, authLoading]);

  const handleComplete = (score: number, isWin: boolean) => {
    if (!event || !user) return;

    const totalQuestions = event.questionsCount;

    const rewards = calculateRewards(event, score, totalQuestions, 0);

    updateParticipant(event.id, user.id, {
      status: "completed",
      score,
      xpEarned: rewards.xp,
      gemsEarned: rewards.gems,
      badgeEarned: rewards.badge,
      completedAt: new Date().toISOString(),
    });

    const updated = addXp(rewards.xp);
    updated.gems += rewards.gems;
    saveProfile(updated);

    setResultData({
      score,
      totalQuestions,
      xpEarned: rewards.xp,
      gemsEarned: rewards.gems,
      badgeEarned: rewards.badge,
      isWin,
    });
    setPhase("result");
  };

  const handleBackToEvent = () => {
    router.push(`/events/${id}`);
  };

  if (loading || !event) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[var(--duo-green)] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (phase === "result" && resultData) {
    return (
      <div className="flex min-h-screen bg-[var(--duo-bg)]">
        <main className="flex-1 flex items-center justify-center p-4">
          <EventResult
            eventName={event.name}
            eventType={event.type}
            score={resultData.score}
            totalQuestions={resultData.totalQuestions}
            xpEarned={resultData.xpEarned}
            gemsEarned={resultData.gemsEarned}
            badgeEarned={resultData.badgeEarned}
            isWin={resultData.isWin}
            onBack={handleBackToEvent}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6">
        <EventPlay
          event={event}
          userId={user?.id || "local"}
          onComplete={handleComplete}
        />
      </main>
    </div>
  );
}
