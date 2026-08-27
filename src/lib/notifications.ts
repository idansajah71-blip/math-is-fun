"use client";

const NOTIF_KEY = "matika-notifications";

export type NotificationType = "event_active" | "event_ending" | "event_done" | "room_invite" | "room_result";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

function getNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveNotifications(list: Notification[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
}

export function addNotification(type: NotificationType, title: string, message: string, href?: string): void {
  const notifications = getNotifications();
  const notif: Notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    message,
    href,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(notif);
  if (notifications.length > 50) notifications.splice(50);
  saveNotifications(notifications);
  window.dispatchEvent(new Event("notif-updated"));
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

export function getAllNotifications(): Notification[] {
  return getNotifications();
}

export function markAsRead(id: string): void {
  const notifications = getNotifications().map((n) => n.id === id ? { ...n, read: true } : n);
  saveNotifications(notifications);
  window.dispatchEvent(new Event("notif-updated"));
}

export function markAllAsRead(): void {
  const notifications = getNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(notifications);
  window.dispatchEvent(new Event("notif-updated"));
}

export function clearOldNotifications(days: number = 7): void {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const notifications = getNotifications().filter((n) => new Date(n.createdAt) > cutoff);
  saveNotifications(notifications);
}
