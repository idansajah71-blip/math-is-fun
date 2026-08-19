"use client";

import { useState, useCallback } from "react";
import { getProfile, addXp as addXpUtil, completeTopic as completeTopicUtil } from "@/lib/gamification";

export function useXP() {
  const [xp, setXp] = useState(() => getProfile().xp);
  const [level, setLevel] = useState(() => getProfile().level);

  const addXp = useCallback((amount: number) => {
    const profile = addXpUtil(amount);
    setXp(profile.xp);
    setLevel(profile.level);
    return profile;
  }, []);

  return { xp, level, addXp };
}
