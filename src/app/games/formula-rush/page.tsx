"use client";

import { useRouter } from "next/navigation";
import FormulaRushGame from "@/components/game/FormulaRushGame";

export default function FormulaRushPage() {
  const router = useRouter();
  return <FormulaRushGame onExit={() => router.push("/games")} />;
}
