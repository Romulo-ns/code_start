import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { CodeEditor } from "@/components/CodeEditor";
import { HintsPanel } from "@/components/HintsPanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import type { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const difficultyConfig = {
  EASY: { label: "Fácil", className: "badge-easy", icon: "🟢" },
  MEDIUM: { label: "Médio", className: "badge-medium", icon: "🟡" },
  HARD: { label: "Difícil", className: "badge-hard", icon: "🔴" },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await prisma.challenge.findUnique({ where: { slug }, select: { title: true, description: true } });
  if (!challenge) return { title: "Desafio não encontrado" };
  return { title: challenge.title, description: challenge.description.substring(0, 150) };
}

export default async function ChallengePage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  const [challenge, userSubmission] = await Promise.all([
    prisma.challenge.findUnique({
      where: { slug },
      include: {
        testCases: { where: { isHidden: false } },
      },
    }),
    session?.user?.id
      ? prisma.submission.findFirst({
          where: { challenge: { slug }, userId: session.user.id, isCorrect: true },
          orderBy: { createdAt: "desc" },
          select: { code: true, isCorrect: true },
        })
      : null,
  ]);

  if (!challenge) notFound();

  const diff = difficultyConfig[challenge.difficulty];
  const isSolved = !!userSubmission;

  const defaultCode = challenge.language === "javascript" 
    ? `function solution(/* parâmetros */) {\n  // Escreva sua solução aqui\n  \n}`
    : `void\tft_putchar(char c);\n\nvoid\tft_print_alphabet(void)\n{\n\t// Escreva sua solução aqui\n}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/challenges" className="hover:text-green-400 transition-colors">
          Desafios
        </Link>
        <span>/</span>
        <span className="text-slate-300">{challenge.title}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Problem description */}
        <div className="flex flex-col gap-4">
          {/* Challenge header */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diff.className}`}>
                {diff.icon} {diff.label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-semibold">
                ⭐ {challenge.points} pontos
              </span>
              {isSolved && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  ✓ Resolvido
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">{challenge.title}</h1>
            <div className="prose-dark" dangerouslySetInnerHTML={{ __html: mdToHtml(challenge.description) }} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {challenge.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-[#1a1a24] text-slate-400 border border-[#2a2a3a]">
                {tag}
              </span>
            ))}
          </div>

          {/* Test cases preview */}
          <div className="glass rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-slate-400">
              Exemplos de Teste
            </h2>
            <div className="flex flex-col gap-2">
              {challenge.testCases.slice(0, 3).map((tc, i) => (
                <div key={tc.id} className="p-3 bg-[#0d1117] rounded-lg border border-[#2a2a3a] font-mono text-xs">
                  <span className="text-slate-500">Exemplo {i + 1}: </span>
                  <span className="text-slate-300">solution({tc.input})</span>
                  <span className="text-slate-500"> → </span>
                  <span className="text-green-400">{tc.expected}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hints */}
          {challenge.hints.length > 0 && <HintsPanel hints={challenge.hints} />}

          {/* Explanation (only if solved) */}
          {isSolved && <ExplanationPanel explanation={challenge.explanation} />}
        </div>

        {/* Right: Code editor */}
        <div className="flex flex-col gap-4">
          {!session && (
            <div className="glass rounded-xl p-4 text-center border border-yellow-500/20 bg-yellow-500/5">
              <p className="text-yellow-400 text-sm mb-3">
                🔒 Entre com Google para submeter sua solução e ganhar pontos!
              </p>
              <Link
                href="/login"
                className="inline-block px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black text-sm font-semibold transition-all"
              >
                Entrar com Google
              </Link>
            </div>
          )}

          <CodeEditor
            challengeId={challenge.id}
            testCases={challenge.testCases}
            defaultCode={userSubmission?.code ?? defaultCode}
            language={challenge.language}
          />
        </div>
      </div>
    </div>
  );
}

// Very simple markdown → HTML for description rendering
function mdToHtml(md: string): string {
  return md
    .replace(/```(\w*)\n?([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z])(.+)/gm, "<p>$1</p>");
}
