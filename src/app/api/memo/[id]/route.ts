import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = "wll";
  const id = params.id;
  const memo = await prisma.memo.findFirst({
    where: { id, userId, deletedAt: { equals: null } },
    include: {
      characterRelations: {
        include: { sourceCharacter: true, targetCharacter: true },
      },
      characters: true,
      events: true,
      works: true,
    },
  });
  return NextResponse.json({ data: { memo } });
}
async function POST(request: NextRequest) {}

export { GET, POST };
