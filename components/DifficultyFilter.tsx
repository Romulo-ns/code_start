"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Difficulty } from "@prisma/client";

const options: { label: string; value: Difficulty | undefined }[] = [
  { label: "Todos", value: undefined },
  { label: "🟢 Fácil", value: "EASY" },
  { label: "🟡 Médio", value: "MEDIUM" },
  { label: "🔴 Difícil", value: "HARD" },
];

export function DifficultyFilter({ active }: { active: Difficulty | undefined }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {options.map((opt) => (
        <Link
          key={opt.label}
          id={`filter-${opt.value ?? "all"}`}
          href={opt.value ? `/challenges?difficulty=${opt.value}` : "/challenges"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            active === opt.value
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-[#1a1a24] text-slate-400 border border-[#2a2a3a] hover:text-white hover:border-slate-500"
          }`}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
