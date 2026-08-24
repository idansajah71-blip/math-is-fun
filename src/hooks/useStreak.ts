"use client";

import { useState, useCallback, useEffect } from "react";
import { getProfile } from "@/lib/gamification";

export function useStreak() {
  const [streak, setStreak] = useState(() => getProfile().streak);
  const [lastActive, setLastActive] = useState(() => getProfile().lastActive);

  useEffect(() => {
    const profile = getProfile();
    setStreak(profile.streak);
    setLastActive(profile.lastActive);
  }, []);

  const isStreakAtRisk = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    return lastActive !== today && lastActive !== yesterday;
  }, [lastActive]);

  return { streak, isAtRisk: isStreakAtRisk() };
}
