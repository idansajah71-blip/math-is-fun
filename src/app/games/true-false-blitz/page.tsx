"use client";

import { useRouter } from "next/navigation";
import TrueFalseBlitzGame from "@/components/game/TrueFalseBlitzGame";

export default function TrueFalseBlitzPage() {
  const router = useRouter();
  return <TrueFalseBlitzGame onExit={() => router.push("/games")} />;
}
