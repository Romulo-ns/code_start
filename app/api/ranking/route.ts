import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { points: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      points: true,
      _count: {
        select: {
          submissions: { where: { isCorrect: true } },
        },
      },
    },
  });

  const ranking = users.map((user, index) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    points: user.points,
    rank: index + 1,
    solvedCount: user._count.submissions,
  }));

  return NextResponse.json(ranking);
}
