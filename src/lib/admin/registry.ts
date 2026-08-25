"use client";

const REGISTRY_KEY = "belajarmtk_user_registry";

export interface RegistryUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastActive: string;
  isPremium: boolean;
}

function getRegistry(): RegistryUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REGISTRY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRegistry(users: RegistryUser[]) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
}

export function generateUserId(): string {
  return "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function registerUser(id: string, email: string, name: string): void {
  const users = getRegistry();
  const exists = users.find((u) => u.id === id);
  if (!exists) {
    users.push({
      id,
      email: email.toLowerCase(),
      name,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      isPremium: false,
    });
    saveRegistry(users);
  } else {
    exists.lastActive = new Date().toISOString();
    saveRegistry(users);
  }
}

export function updateUserRegistry(id: string, updates: Partial<Pick<RegistryUser, "name" | "email" | "isPremium" | "lastActive">>): void {
  const users = getRegistry();
  const user = users.find((u) => u.id === id);
  if (user) {
    Object.assign(user, updates);
    saveRegistry(users);
  }
}

export function getAllRegistryUsers(): RegistryUser[] {
  return getRegistry();
}

export function getRegistryUser(id: string): RegistryUser | undefined {
  return getRegistry().find((u) => u.id === id);
}

export function removeRegistryUser(id: string): boolean {
  const users = getRegistry();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveRegistry(filtered);
  return true;
}

export function getRegistryStats() {
  const users = getRegistry();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  return {
    totalUsers: users.length,
    premiumUsers: users.filter((u) => u.isPremium).length,
    newUsersToday: users.filter((u) => u.createdAt.startsWith(today)).length,
    activeLastWeek: users.filter((u) => u.lastActive >= weekAgo).length,
  };
}
