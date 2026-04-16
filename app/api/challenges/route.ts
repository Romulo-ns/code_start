import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Difficulty } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty") as Difficulty | null;

  const challenges = await prisma.challenge.findMany({
    where: difficulty ? { difficulty } : undefined,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      difficulty: true,
      points: true,
      tags: true,
      createdAt: true,
      _count: { select: { submissions: true } },
    },
    orderBy: [
      {
        difficulty: "asc",
      },
      { createdAt: "asc" },
    ],
  });

  return NextResponse.json(challenges);
}
