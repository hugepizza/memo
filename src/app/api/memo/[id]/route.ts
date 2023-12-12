import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id || "";
  const id = params.id;
  const memo = await prisma.memo.findFirst({
    where: { id, deletedAt: { equals: null } },
    include: {
      characterRelations: {
        include: { sourceCharacter: true, targetCharacter: true },
      },
      characters: true,
      events: true,
      works: true,
    },
  });
  if (memo?.visibility === "PRIVATE" && userId != memo.id) {
    return NextResponse.json({ data: { memo: null } });
  }
  return NextResponse.json({ data: { memo } });
}
async function POST(request: NextRequest) {}

export { GET, POST };
