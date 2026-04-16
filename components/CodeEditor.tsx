"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { runCode } from "@/lib/executor";
import { type TestCase, type TestResult } from "@/lib/types";

interface CodeEditorProps {
  challengeId: string;
  testCases: TestCase[];
  defaultCode?: string;
  language?: string;
}

const DEFAULT_CODE = `function solution() {
  // Escreva seu código aqui
  
}`;

export function CodeEditor({ challengeId, testCases, defaultCode = DEFAULT_CODE, language = "javascript" }: CodeEditorProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [code, setCode] = useState(defaultCode);
  const [runResults, setRunResults] = useState<TestResult[] | null>(null);
  const [submitResults, setSubmitResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"run" | "submit">("run");

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setRunResults(null);
    setActiveTab("run");
    try {
      const results = await runCode(code, testCases, language);
      setRunResults(results);
    } finally {
      setIsRunning(false);
    }
  }, [code, testCases, language]);

  const handleSubmit = useCallback(async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setIsSubmitting(true);
    setIsCorrect(null);
    setSubmitResults(null);
    setActiveTab("submit");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, challengeId, language }),
      });
      const data = await res.json();
      setSubmitResults(data.results);
      setIsCorrect(data.isCorrect);
      if (data.isCorrect) router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }, [code, challengeId, language, session, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      setCode(code.substring(0, start) + "  " + code.substring(end));
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      }, 0);
    }
  };

  const displayResults = activeTab === "submit" ? submitResults : runResults;

  return (
    <div className="flex flex-col gap-4">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] rounded-t-xl border border-[#2a2a3a] border-b-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-slate-500 font-mono ml-2">solution.{language === "javascript" ? "js" : "c"}</span>
        </div>
        <span className="text-xs text-slate-500 px-2 py-0.5 bg-[#1a1a24] rounded border border-[#2a2a3a]">
          {language === "javascript" ? "JavaScript" : "C"}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        id="code-editor"
        className="code-editor rounded-t-none"
        style={{ minHeight: "280px", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          id="run-btn"
          onClick={handleRun}
          disabled={isRunning}
          className="flex-1 py-2.5 rounded-lg border border-[#2a2a3a] bg-[#1a1a24] text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Executando...
            </>
          ) : (
            <>▶ Executar</>
          )}
        </button>
        <button
          id="submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black text-sm font-semibold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Submetendo...
            </>
          ) : (
            <>✓ Submeter Solução</>
          )}
        </button>
      </div>

      {/* Results panel */}
      {(runResults || submitResults) && (
        <div className="glass rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#2a2a3a]">
            {(["run", "submit"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "run" ? "▶ Execução" : "✓ Submissão"}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Submission verdict */}
            {activeTab === "submit" && isCorrect !== null && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  isCorrect
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {isCorrect ? "🎉 Parabéns! Todos os testes passaram!" : "❌ Alguns testes falharam. Tente novamente!"}
              </div>
            )}

            {/* Test results */}
            <div className="flex flex-col gap-2">
              {displayResults?.map((result, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-xs font-mono border ${
                    result.passed
                      ? "bg-green-500/8 border-green-500/20"
                      : "bg-red-500/8 border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>{result.passed ? "✅" : "❌"}</span>
                    <span className={`font-semibold ${result.passed ? "text-green-400" : "text-red-400"}`}>
                      Teste {i + 1} — {result.passed ? "Passou" : "Falhou"}
                    </span>
                  </div>
                  {result.input !== "hidden" && (
                    <div className="grid grid-cols-3 gap-2 text-slate-400">
                      <div>
                        <span className="text-slate-500">Entrada:</span> <span className="text-white">{result.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Esperado:</span> <span className="text-green-300">{result.expected}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Obtido:</span>{" "}
                        <span className={result.passed ? "text-green-300" : "text-red-300"}>{result.actual}</span>
                      </div>
                    </div>
                  )}
                  {result.error && (
                    <div className="mt-1.5 text-red-400">⚠ {result.error}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
