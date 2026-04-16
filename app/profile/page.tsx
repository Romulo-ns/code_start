import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil",
  description: "Veja suas estatísticas, pontuação e histórico de desafios resolvidos.",
};

const difficultyLabel = { EASY: "Fácil", MEDIUM: "Médio", HARD: "Difícil" } as const;
const difficultyClass = {
  EASY: "badge-easy",
  MEDIUM: "badge-medium",
  HARD: "badge-hard",
} as const;

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      submissions: {
        where: { isCorrect: true },
        distinct: ["challengeId"],
        include: {
          challenge: { select: { title: true, slug: true, difficulty: true, points: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const challengeCount = await prisma.challenge.count();
  const globalRank = await prisma.user.count({ where: { points: { gt: user.points } } });
  const rank = globalRank + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Meu Perfil</h1>

      {/* Profile card */}
      <div className="glass rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "avatar"}
            width={80}
            height={80}
            className="rounded-full ring-2 ring-green-500/30"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-2xl ring-2 ring-green-500/30">
            {user.name?.[0] ?? "?"}
          </div>
        )}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white">{user.name ?? "Anônimo"}</h2>
          <p className="text-slate-400 mb-4">{user.email}</p>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{user.points}</div>
              <div className="text-xs text-slate-500">Pontos</div>
            </div>
            <div className="w-px bg-[#2a2a3a]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.submissions.length}</div>
              <div className="text-xs text-slate-500">Resolvidos</div>
            </div>
            <div className="w-px bg-[#2a2a3a]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">#{rank}</div>
              <div className="text-xs text-slate-500">Ranking</div>
            </div>
            <div className="w-px bg-[#2a2a3a]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((user.submissions.length / challengeCount) * 100)}%
              </div>
              <div className="text-xs text-slate-500">Concluído</div>
            </div>
          </div>
        </div>
      </div>

      {/* Solved challenges */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Desafios Resolvidos</h2>
        {user.submissions.length === 0 ? (
          <div className="glass rounded-xl p-10 text-center text-slate-500">
            <div className="text-4xl mb-3">💪</div>
            <p className="mb-4">Você ainda não resolveu nenhum desafio.</p>
            <Link
              href="/challenges"
              className="inline-block px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold text-sm transition-all"
            >
              Ver Desafios
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {user.submissions.map((sub) => (
              <Link
                key={sub.challengeId}
                href={`/challenges/${sub.challenge.slug}`}
                className="glass rounded-xl px-5 py-4 flex items-center justify-between hover:border-green-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="text-white font-medium group-hover:text-green-400 transition-colors">
                    {sub.challenge.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${difficultyClass[sub.challenge.difficulty]}`}
                  >
                    {difficultyLabel[sub.challenge.difficulty]}
                  </span>
                  <span className="text-yellow-400 text-sm font-semibold">+{sub.challenge.points} pts</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
