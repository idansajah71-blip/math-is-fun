"use client";

import { useRouter } from "next/navigation";
import MemoryPairsGame from "@/components/game/MemoryPairsGame";

export default function MemoryPairsPage() {
  const router = useRouter();
  return <MemoryPairsGame onExit={() => router.push("/games")} />;
}
