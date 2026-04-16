import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateSubmission } from "@/lib/executor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { code, challengeId, language = "javascript" } = await request.json();

  if (!code || !challengeId) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Fetch ALL test cases including hidden ones
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { testCases: true },
  });

  if (!challenge) {
    return NextResponse.json({ error: "Desafio não encontrado" }, { status: 404 });
  }

  // Evaluate the submission
  const { results, isCorrect } = evaluateSubmission(code, challenge.testCases);

  // Save submission to DB
  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      challengeId,
      code,
      language,
      isCorrect,
      results: JSON.parse(JSON.stringify(results)),
    },
  });

  // Award points if correct and not already solved
  if (isCorrect) {
    const previousCorrect = await prisma.submission.findFirst({
      where: {
        userId: session.user.id,
        challengeId,
        isCorrect: true,
        id: { not: submission.id },
      },
    });

    if (!previousCorrect) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { points: { increment: challenge.points } },
      });
    }
  }

  return NextResponse.json({ submission, results, isCorrect });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    include: {
      challenge: {
        select: { title: true, slug: true, difficulty: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(submissions);
}
