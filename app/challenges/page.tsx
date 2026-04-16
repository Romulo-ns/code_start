import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ChallengeCard } from "@/components/ChallengeCard";
import { DifficultyFilter } from "@/components/DifficultyFilter";
import type { Metadata } from "next";
import { type Difficulty } from "@prisma/client";

export const metadata: Metadata = {
  title: "Desafios de Programação",
  description: "Lista de desafios de programação em JavaScript para iniciantes. Do fácil ao difícil.",
};

interface PageProps {
  searchParams: Promise<{ difficulty?: string }>;
}

export default async function ChallengesPage({ searchParams }: PageProps) {
  const { difficulty } = await searchParams;
  const session = await auth();

  const validDifficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
  const filter = validDifficulties.includes(difficulty as Difficulty)
    ? (difficulty as Difficulty)
    : undefined;

  const [challenges, solvedIds] = await Promise.all([
    prisma.challenge.findMany({
      where: filter ? { difficulty: filter } : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        points: true,
        tags: true,
        _count: { select: { submissions: { where: { isCorrect: true } } } },
      },
      orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
    }),
    session?.user?.id
      ? prisma.submission
          .findMany({
            where: { userId: session.user.id, isCorrect: true },
            select: { challengeId: true },
          })
          .then((s) => new Set(s.map((x) => x.challengeId)))
      : Promise.resolve(new Set<string>()),
  ]);

  const solved = challenges.filter((c) => solvedIds.has(c.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Desafios</h1>
        <p className="text-slate-400">
          {challenges.length} desafios disponíveis
          {session && (
            <span className="ml-2 text-green-400 font-medium">· {solved} resolvidos</span>
          )}
        </p>
      </div>

      {/* Progress bar (only when logged in) */}
      {session && challenges.length > 0 && (
        <div className="mb-8 glass rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Progresso</span>
            <span className="text-green-400 font-semibold">{Math.round((solved / challenges.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#23232f] rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(solved / challenges.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Difficulty filter */}
      <DifficultyFilter active={filter} />

      {/* Challenge grid */}
      {challenges.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Nenhum desafio encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((c, i) => (
            <ChallengeCard
              key={c.id}
              id={c.id}
              title={c.title}
              slug={c.slug}
              description={c.description}
              difficulty={c.difficulty}
              points={c.points}
              tags={c.tags}
              submissionCount={c._count.submissions}
              isSolved={solvedIds.has(c.id)}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
