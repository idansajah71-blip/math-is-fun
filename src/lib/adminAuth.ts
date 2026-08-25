"use client";

const ADMIN_STORAGE_KEY = "belajar-mtk-admin";
const ADMIN_USERS_KEY = "belajar-mtk-admin-users";

export interface AdminUser {
  email: string;
  password: string;
  name: string;
  role: "superadmin" | "admin";
  createdAt: string;
}

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  loginAt: string;
}

const DEFAULT_ADMIN: AdminUser = {
  email: "admin@belajar-mtk.com",
  password: "admin123",
  name: "Super Admin",
  role: "superadmin",
  createdAt: new Date().toISOString(),
};

function getAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return [DEFAULT_ADMIN];
  try {
    const stored = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || "[]");
    if (stored.length === 0) {
      stored.push(DEFAULT_ADMIN);
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(stored));
    }
    return stored;
  } catch {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
}

export function adminLogin(email: string, password: string): { error?: string; session?: AdminSession } {
  const users = getAdminUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return { error: "Email atau password salah" };
  }
  const session: AdminSession = {
    email: user.email,
    name: user.name,
    role: user.role,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
  return { session };
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}

export function addAdmin(email: string, password: string, name: string): { error?: string } {
  const users = getAdminUsers();
  if (users.some((u) => u.email === email)) {
    return { error: "Email sudah terdaftar" };
  }
  users.push({
    email,
    password,
    name,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return {};
}

export function removeAdmin(email: string): boolean {
  const users = getAdminUsers();
  const session = getAdminSession();
  if (session?.email === email && session?.role !== "superadmin") return false;
  const filtered = users.filter((u) => u.email !== email);
  if (filtered.length === users.length) return false;
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(filtered));
  return true;
}

export function getAllAdmins(): AdminUser[] {
  return getAdminUsers();
}
