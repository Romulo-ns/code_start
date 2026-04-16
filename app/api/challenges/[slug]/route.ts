import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/challenges/[slug]">
) {
  const { slug } = await ctx.params;

  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    include: {
      testCases: {
        where: { isHidden: false },
        select: { id: true, input: true, expected: true, isHidden: true, challengeId: true },
      },
    },
  });

  if (!challenge) {
    return NextResponse.json({ error: "Desafio não encontrado" }, { status: 404 });
  }

  return NextResponse.json(challenge);
}
