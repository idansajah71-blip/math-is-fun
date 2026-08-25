"use client";

const USERS_KEY = "belajarmtk_users";
const SESSION_KEY = "belajarmtk_session";

export interface LocalUser {
  email: string;
  name: string;
  password: string; // hashed with btoa for basic obfuscation
}

function getUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(pw: string): string {
  return btoa(pw);
}

export function signup(email: string, password: string, name: string): { error?: string } {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { error: "Email sudah terdaftar, coba login" };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }
  users.push({ email: email.toLowerCase(), name: name || "Pelajar", password: hashPassword(password) });
  saveUsers(users);

  // Auto-activate 7-day trial premium for new users
  try {
    import("@/lib/gamification").then(({ grantTrialPremium }) => {
      grantTrialPremium();
    });
  } catch {}

  return {};
}

export function login(email: string, password: string): { error?: string; user?: { email: string; name: string } } {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashPassword(password)
  );
  if (!user) {
    return { error: "Email atau password salah" };
  }
  const session = { email: user.email, name: user.name, loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { user: { email: user.email, name: user.name } };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): { email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function resetPassword(email: string): { error?: string; success?: boolean } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) {
    return { error: "Email tidak ditemukan" };
  }
  // Generate random password and "send" it (show in alert for local mode)
  const newPw = "reset" + Math.floor(1000 + Math.random() * 9000);
  users[idx].password = hashPassword(newPw);
  saveUsers(users);
  alert(`Password baru kamu: ${newPw}\n\n(Simpan! Ini untuk mode local)`);
  return { success: true };
}

export function updateProfile(updates: { name?: string; email?: string }): { error?: string } {
  const session = getCurrentUser();
  if (!session) return { error: "Belum login" };

  const users = getUsers();
  const idx = users.findIndex((u) => u.email === session.email);
  if (idx === -1) return { error: "User tidak ditemukan" };

  if (updates.email && updates.email !== session.email) {
    const exists = users.find((u) => u.email.toLowerCase() === updates.email!.toLowerCase() && u.email !== session.email);
    if (exists) return { error: "Email sudah digunakan" };
    users[idx].email = updates.email.toLowerCase();
  }
  if (updates.name) {
    users[idx].name = updates.name;
  }

  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, ...updates }));
  return {};
}
