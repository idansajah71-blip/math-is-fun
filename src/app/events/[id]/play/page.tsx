"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getEventById, getParticipant, updateParticipant, calculateRewards } from "@/lib/events";
import type { EventData } from "@/lib/events";
import { addXp, saveProfile, getProfile } from "@/lib/gamification";
import BossBattle from "@/components/events/BossBattle";
import SpeedBlitz from "@/components/events/SpeedBlitz";
import Marathon from "@/components/events/Marathon";
import TriviaNight from "@/components/events/TriviaNight";
import Elimination from "@/components/events/Elimination";
import MysteryEvent from "@/components/events/MysteryEvent";
import ChallengeWeek from "@/components/events/ChallengeWeek";
import EventResult from "@/components/events/EventResult";
import { motion } from "framer-motion";

interface ResultData {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  gemsEarned: number;
  badgeEarned: string | null;
}

export default function EventPlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventData | undefined>(undefined);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    if (!participant || participant.status !== "playing") {
      router.replace(`/events/${id}`);
      return;
    }

    setEvent(ev);
    setLoading(false);
  }, [id, user, router]);

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

    const profile = getProfile();
    const updated = addXp(rewards.xp);
    updated.gems += rewards.gems;
    saveProfile(updated);

    setResultData({
      score,
      totalQuestions,
      xpEarned: rewards.xp,
      gemsEarned: rewards.gems,
      badgeEarned: rewards.badge,
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
            isWin={resultData.score > resultData.totalQuestions / 2}
            onBack={handleBackToEvent}
          />
        </main>
      </div>
    );
  }

  const renderEventComponent = () => {
    switch (event.type) {
      case "boss_battle":
        return <BossBattle event={event} onComplete={handleComplete} />;
      case "speed_blitz":
        return <SpeedBlitz event={event} onComplete={handleComplete} />;
      case "marathon":
        return <Marathon event={event} onComplete={handleComplete} />;
      case "trivia_night":
        return <TriviaNight event={event} onComplete={handleComplete} />;
      case "elimination":
        return <Elimination event={event} onComplete={handleComplete} />;
      case "mystery":
        return <MysteryEvent event={event} onComplete={handleComplete} />;
      case "challenge_week":
        return <ChallengeWeek event={event} onComplete={handleComplete} />;
      default:
        return (
          <div className="text-center py-16">
            <p className="text-[var(--duo-text-muted)]">Tipe event tidak dikenali.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6">
        {renderEventComponent()}
      </main>
    </div>
  );
}
