"use client";

const AUDIT_KEY = "matika_audit_log";

export interface AuditEntry {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  target: string;
  targetId: string;
  before: unknown;
  after: unknown;
  timestamp: string;
}

function getAuditLog(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAuditLog(entries: AuditEntry[]) {
  const capped = entries.slice(-500);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(capped));
}

export function logAudit(
  adminEmail: string,
  adminName: string,
  action: string,
  target: string,
  targetId: string,
  before?: unknown,
  after?: unknown
): void {
  const entries = getAuditLog();
  entries.push({
    id: `log_${Date.now().toString(36)}`,
    adminEmail,
    adminName,
    action,
    target,
    targetId,
    before: before ?? null,
    after: after ?? null,
    timestamp: new Date().toISOString(),
  });
  saveAuditLog(entries);
}

export function getAuditEntries(filters?: {
  admin?: string;
  action?: string;
  target?: string;
  from?: string;
  to?: string;
  limit?: number;
}): AuditEntry[] {
  let entries = getAuditLog();

  if (filters) {
    if (filters.admin) {
      entries = entries.filter((e) => e.adminEmail === filters.admin || e.adminName.toLowerCase().includes(filters.admin!.toLowerCase()));
    }
    if (filters.action) {
      entries = entries.filter((e) => e.action.toLowerCase().includes(filters.action!.toLowerCase()));
    }
    if (filters.target) {
      entries = entries.filter((e) => e.target.toLowerCase().includes(filters.target!.toLowerCase()));
    }
    if (filters.from) {
      entries = entries.filter((e) => e.timestamp >= filters.from!);
    }
    if (filters.to) {
      entries = entries.filter((e) => e.timestamp <= filters.to!);
    }
  }

  entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  if (filters?.limit) {
    entries = entries.slice(0, filters.limit);
  }

  return entries;
}

export function clearAuditLog(): void {
  localStorage.removeItem(AUDIT_KEY);
}

export function getAuditStats() {
  const entries = getAuditLog();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const admins = new Set(entries.map((e) => e.adminEmail));

  return {
    totalEntries: entries.length,
    todayEntries: entries.filter((e) => e.timestamp.startsWith(today)).length,
    uniqueAdmins: admins.size,
    lastAction: entries.length > 0 ? entries[entries.length - 1].timestamp : null,
  };
}
