import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [challengeCount, userCount, submissionCount] = await Promise.all([
    prisma.challenge.count(),
    prisma.user.count(),
    prisma.submission.count({ where: { isCorrect: true } }),
  ]);
  return { challengeCount, userCount, submissionCount };
}

async function getTopUsers() {
  return prisma.user.findMany({
    orderBy: { points: "desc" },
    take: 3,
    select: { id: true, name: true, image: true, points: true },
  });
}

export default async function HomePage() {
  const session = await auth();
  const [stats, topUsers] = await Promise.all([getStats(), getTopUsers()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-20 md:py-28 text-center relative">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Plataforma de aprendizado para iniciantes
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Aprenda a programar{" "}
            <span className="gradient-text">resolvendo desafios</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Resolva desafios práticos de JavaScript, receba feedback imediato e
            suba no ranking global. A forma mais divertida de aprender a programar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/challenges"
              id="hero-challenges-btn"
              className="px-8 py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-semibold text-base transition-all hover:scale-105 active:scale-95 glow-green-sm"
            >
              Ver Desafios →
            </Link>
            {!session && (
              <Link
                href="/login"
                id="hero-login-btn"
                className="px-8 py-3.5 rounded-xl border border-[#2a2a3a] bg-[#1a1a24] text-white font-semibold text-base transition-all hover:border-green-500/40 hover:bg-[#23232f]"
              >
                Criar Conta Grátis
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 grid grid-cols-3 gap-4 border-y border-[#2a2a3a]">
        {[
          { value: stats.challengeCount, label: "Desafios", icon: "🧩" },
          { value: stats.userCount, label: "Desenvolvedores", icon: "👨‍💻" },
          { value: stats.submissionCount, label: "Soluções Corretas", icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
          Por que o <span className="text-green-400">CodeStart</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Testes Automáticos",
              description:
                "Execute seu código e veja imediatamente se passou nos testes. Feedback instantâneo para aprender mais rápido.",
            },
            {
              icon: "📚",
              title: "Explicações Didáticas",
              description:
                "Após resolver, veja a explicação completa do problema em linguagem simples, perfeita para iniciantes.",
            },
            {
              icon: "🏆",
              title: "Ranking Global",
              description:
                "Ganhe pontos ao resolver desafios e apareça no ranking. Compete de forma saudável com outros devs.",
            },
            {
              icon: "🎯",
              title: "Níveis de Dificuldade",
              description:
                "Do fácil ao difícil — comece do básico e avance no ritmo certo para o seu aprendizado.",
            },
            {
              icon: "💡",
              title: "Dicas Inteligentes",
              description:
                "Travou em um desafio? Use as dicas para não desistir e continuar aprendendo.",
            },
            {
              icon: "🚀",
              title: "100% Gratuito",
              description:
                "Sem planos pagos. Todo o conteúdo é gratuito. Foque apenas em aprender e evoluir.",
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="glass rounded-xl p-6 hover:border-green-500/20 transition-all hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">{feat.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top ranking preview */}
      {topUsers.length > 0 && (
        <section className="py-12 border-t border-[#2a2a3a]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">🏆 Top Ranking</h2>
            <Link href="/ranking" className="text-green-400 text-sm hover:text-green-300 transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {topUsers.map((user, i) => (
              <div
                key={user.id}
                className="glass rounded-xl p-5 flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                    i === 0
                      ? "bg-yellow-500/20 text-yellow-400"
                      : i === 1
                      ? "bg-slate-400/20 text-slate-300"
                      : "bg-amber-700/20 text-amber-600"
                  }`}
                >
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{user.name ?? "Anônimo"}</p>
                  <p className="text-green-400 text-sm font-semibold">{user.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="glass rounded-2xl p-10 md:p-16 border-green-500/10">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Junte-se a centenas de desenvolvedores que estão aprendendo programação de forma prática e divertida.
          </p>
          <Link
            href="/challenges"
            id="cta-btn"
            className="inline-block px-10 py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-semibold text-base transition-all hover:scale-105 glow-green-sm"
          >
            Começar Agora — É Grátis!
          </Link>
        </div>
      </section>
    </div>
  );
}
