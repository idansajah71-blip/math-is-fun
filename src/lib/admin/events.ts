"use client";

import type { EventData } from "@/app/admin/events/page";

const EVENTS_KEY = "matika-admin-events";

export function getEvents(): EventData[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getVisibleEvents(): EventData[] {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const in30Days = new Date(now.getTime() + 30 * 86400000).toISOString().split("T")[0];

  return getEvents().filter((evt) => {
    if (evt.status === "draft") return false;
    if (evt.status === "ended") return false;
    if (evt.startDate && evt.startDate <= today && evt.endDate && evt.endDate >= today) return true;
    if (evt.startDate && evt.startDate > today && evt.startDate <= in30Days) return true;
    return false;
  });
}
