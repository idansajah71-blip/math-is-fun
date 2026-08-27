"use client";

import type { QuizQuestion } from "@/lib/types";
import { getAllQuizzes } from "@/lib/data";
import type { EventType } from "@/lib/events";

const ROOMS_KEY = "matika-rooms";

export interface RoomPlayer {
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  timeSpent: number;
  status: "waiting" | "playing" | "finished";
  completedAt?: string;
}

export interface Room {
  code: string;
  hostId: string;
  hostName: string;
  config: {
    type: EventType;
    topics: string[];
    difficulty: "easy" | "medium" | "hard";
    questionsCount: number;
  };
  players: RoomPlayer[];
  status: "waiting" | "playing" | "finished";
  createdAt: string;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getRooms(): Room[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRooms(rooms: Room[]) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

export function createRoom(
  hostId: string,
  hostName: string,
  config: Room["config"]
): Room {
  const rooms = getRooms();
  let code = generateCode();
  while (rooms.some((r) => r.code === code)) {
    code = generateCode();
  }

  const room: Room = {
    code,
    hostId,
    hostName,
    config,
    players: [{ userId: hostId, name: hostName, score: 0, timeSpent: 0, status: "waiting" }],
    status: "waiting",
    createdAt: new Date().toISOString(),
  };

  rooms.push(room);
  saveRooms(rooms);
  return room;
}

export function getRoomByCode(code: string): Room | undefined {
  return getRooms().find((r) => r.code === code.toUpperCase());
}

export function joinRoom(code: string, userId: string, name: string): { room?: Room; error?: string } {
  const rooms = getRooms();
  const idx = rooms.findIndex((r) => r.code === code.toUpperCase());
  if (idx === -1) return { error: "Room tidak ditemukan" };

  const room = rooms[idx];
  if (room.status !== "waiting") return { error: "Room sudah dimulai" };
  if (room.players.some((p) => p.userId === userId)) return { room };

  room.players.push({ userId, name, score: 0, timeSpent: 0, status: "waiting" });
  rooms[idx] = room;
  saveRooms(rooms);

  try {
    const { addNotification } = require("@/lib/notifications");
    addNotification("room_invite", `${name} join room ${code}`, `${name} ingin challenge kamu!`, `/rooms/${code}`);
  } catch {}

  return { room };
}

export function startRoom(code: string, hostId: string): { room?: Room; error?: string } {
  const rooms = getRooms();
  const idx = rooms.findIndex((r) => r.code === code.toUpperCase());
  if (idx === -1) return { error: "Room tidak ditemukan" };

  const room = rooms[idx];
  if (room.hostId !== hostId) return { error: "Hanya host yang bisa memulai" };
  if (room.players.length < 2) return { error: "Minimal 2 pemain" };

  room.status = "playing";
  room.players = room.players.map((p) => ({ ...p, status: "playing" as const }));
  rooms[idx] = room;
  saveRooms(rooms);
  return { room };
}

export function finishPlayer(code: string, userId: string, score: number, timeSpent: number): { room?: Room; error?: string } {
  const rooms = getRooms();
  const idx = rooms.findIndex((r) => r.code === code.toUpperCase());
  if (idx === -1) return { error: "Room tidak ditemukan" };

  const room = rooms[idx];
  const pidx = room.players.findIndex((p) => p.userId === userId);
  if (pidx === -1) return { error: "Pemain tidak ditemukan" };

  room.players[pidx] = { ...room.players[pidx], score, timeSpent, status: "finished", completedAt: new Date().toISOString() };

  const allFinished = room.players.every((p) => p.status === "finished");
  if (allFinished) {
    room.status = "finished";
    try {
      const { addNotification } = require("@/lib/notifications");
      addNotification("room_result", "Room selesai!", `Semua pemain sudah selesai. Lihat hasilnya!`, `/rooms/${code}/play`);
    } catch {}
  }

  rooms[idx] = room;
  saveRooms(rooms);
  return { room };
}

export function getRoomQuestions(room: Room): QuizQuestion[] {
  const allQuizzes = getAllQuizzes();
  let pool = allQuizzes.filter((q) => room.config.topics.includes(q.topicSlug));

  if (pool.length === 0) pool = [...allQuizzes];

  const diffFiltered = pool.filter((q) => q.difficulty === room.config.difficulty);
  if (diffFiltered.length >= room.config.questionsCount) pool = diffFiltered;

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, room.config.questionsCount);
}

export function getRoomResults(code: string): { winner: RoomPlayer; players: RoomPlayer[] } | undefined {
  const room = getRoomByCode(code);
  if (!room || room.status !== "finished") return undefined;

  const sorted = [...room.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpent - b.timeSpent;
  });

  return { winner: sorted[0], players: sorted };
}

export function getUserRooms(userId: string): Room[] {
  return getRooms().filter((r) => r.players.some((p) => p.userId === userId));
}

export function deleteRoom(code: string): void {
  const rooms = getRooms().filter((r) => r.code !== code);
  saveRooms(rooms);
}
