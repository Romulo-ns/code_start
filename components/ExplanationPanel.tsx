"use client";

import { useState } from "react";

export function ExplanationPanel({ explanation }: { explanation: string }) {
  const [open, setOpen] = useState(false);

  // Convert markdown to HTML (simplified)
  const html = explanation
    .replace(/```(\w*)\n?([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z])(.+)/gm, "<p>$1</p>");

  return (
    <div className="glass rounded-xl overflow-hidden border-green-500/20">
      <button
        id="explanation-toggle"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-green-500/5 transition-colors"
      >
        <span className="font-semibold text-green-400 flex items-center gap-2">
          📖 Explicação Didática
        </span>
        <span className="text-slate-400 text-sm">{open ? "▲ Fechar" : "▼ Abrir"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#2a2a3a]">
          <div
            className="prose-dark pt-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  );
}
