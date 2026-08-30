"use client";

import { useRouter } from "next/navigation";
import SpeedMathGame from "@/components/game/SpeedMathGame";

export default function SpeedMathPage() {
  const router = useRouter();
  return <SpeedMathGame onExit={() => router.push("/games")} />;
}
