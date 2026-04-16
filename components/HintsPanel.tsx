"use client";

import { useState } from "react";

export function HintsPanel({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState<number[]>([]);

  return (
    <div className="glass rounded-xl p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
        💡 Dicas
      </h2>
      <div className="flex flex-col gap-2">
        {hints.map((hint, i) => (
          <div key={i}>
            {revealed.includes(i) ? (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
                {hint}
              </div>
            ) : (
              <button
                id={`hint-${i}`}
                onClick={() => setRevealed((prev) => [...prev, i])}
                className="w-full text-left p-3 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-sm text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all"
              >
                🔒 Revelar dica {i + 1}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
