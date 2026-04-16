import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking Global",
  description: "Veja quem são os melhores programadores da plataforma CodeStart.",
};

export default async function RankingPage() {
  const session = await auth();

  const users = await prisma.user.findMany({
    orderBy: { points: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      points: true,
      createdAt: true,
      _count: {
        select: { submissions: { where: { isCorrect: true } } },
      },
    },
  });

  const ranking = users.map((u, i) => ({ ...u, rank: i + 1, solvedCount: u._count.submissions }));
  const myRank = session?.user?.id ? ranking.find((u) => u.id === session.user?.id) : null;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🏆 Ranking Global</h1>
        <p className="text-slate-400">Top {ranking.length} desenvolvedores por pontuação</p>
      </div>

      {/* My position (if logged in and outside top-10) */}
      {myRank && myRank.rank > 10 && (
        <div className="mb-6 glass rounded-xl p-4 border-green-500/20 bg-green-500/5">
          <p className="text-sm text-slate-400 mb-2">Sua posição</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
              #{myRank.rank}
            </div>
            <div>
              <p className="text-white font-medium">{myRank.name ?? "Você"}</p>
              <p className="text-green-400 text-sm">{myRank.points} pts · {myRank.solvedCount} resolvidos</p>
            </div>
          </div>
        </div>
      )}

      {/* Ranking table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-[#2a2a3a]">
          <span>#</span>
          <span>Desenvolvedor</span>
          <span className="text-center">Resolvidos</span>
          <span className="text-right">Pontos</span>
        </div>

        {ranking.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <div className="text-4xl mb-3">🏜️</div>
            <p>Nenhum usuário no ranking ainda. Seja o primeiro!</p>
          </div>
        )}

        {ranking.map((user) => {
          const isMe = session?.user?.id === user.id;
          return (
            <div
              key={user.id}
              id={`ranking-row-${user.rank}`}
              className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-[#2a2a3a] last:border-0 transition-colors ${
                isMe ? "bg-green-500/8" : "hover:bg-[#1a1a24]"
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center">
                {user.rank <= 3 ? (
                  <span className="text-xl">{medals[user.rank - 1]}</span>
                ) : (
                  <span className={`text-sm font-bold ${isMe ? "text-green-400" : "text-slate-500"}`}>
                    #{user.rank}
                  </span>
                )}
              </div>

              {/* User */}
              <div className="flex items-center gap-3 min-w-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "avatar"}
                    width={36}
                    height={36}
                    className="rounded-full shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-semibold text-sm shrink-0">
                    {user.name?.[0] ?? "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className={`font-medium truncate ${isMe ? "text-green-400" : "text-white"}`}>
                    {user.name ?? "Anônimo"} {isMe && <span className="text-xs text-green-500">(você)</span>}
                  </p>
                </div>
              </div>

              {/* Solved */}
              <div className="text-center">
                <span className="text-sm text-slate-300 font-medium">{user.solvedCount}</span>
                <p className="text-xs text-slate-500">resolvidos</p>
              </div>

              {/* Points */}
              <div className="text-right">
                <span className="text-sm font-bold text-green-400">{user.points}</span>
                <p className="text-xs text-slate-500">pontos</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
