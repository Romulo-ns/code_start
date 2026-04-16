import Link from "next/link";
import { type Difficulty } from "@prisma/client";

interface ChallengeCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  tags: string[];
  submissionCount?: number;
  isSolved?: boolean;
  index?: number;
}

const difficultyConfig = {
  EASY: { label: "Fácil", className: "badge-easy", icon: "🟢" },
  MEDIUM: { label: "Médio", className: "badge-medium", icon: "🟡" },
  HARD: { label: "Difícil", className: "badge-hard", icon: "🔴" },
};

export function ChallengeCard({
  title,
  slug,
  description,
  difficulty,
  points,
  tags,
  submissionCount = 0,
  isSolved = false,
  index = 0,
}: ChallengeCardProps) {
  const diff = difficultyConfig[difficulty];

  return (
    <Link
      href={`/challenges/${slug}`}
      id={`challenge-card-${slug}`}
      className="group block glass rounded-xl p-5 hover:border-green-500/30 hover:bg-[#1a1a24] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diff.className}`}>
            {diff.icon} {diff.label}
          </span>
          {isSolved && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              ✓ Resolvido
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold shrink-0">
          <span>⭐</span>
          <span>{points} pts</span>
        </div>
      </div>

      <h3 className="text-white font-semibold text-base mb-2 group-hover:text-green-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {description.replace(/[*`#\n]/g, " ").substring(0, 120)}...
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-[#23232f] text-slate-400 border border-[#2a2a3a]"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-500">{submissionCount} soluções</span>
      </div>
    </Link>
  );
}
