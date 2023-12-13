import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { group } from "console";
// async function GET(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user) {
//     return NextResponse.json({}, { status: 401 });
//   }
//   const userId = session.user.id;
//   const memoId = "klmzf";
//   const userId = "wll";
//   const characters = await prisma.character.findMany({
//     where: { memoId, userId, deletedAt: { equals: null } },
//   });
//   return NextResponse.json({ data: { characters } });
// }

const input = z.object({
  name: z.string(),
  memoId: z.string(),
  remark: z.string().optional(),
  group: z.string().optional(),
});

async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session.user.id;
  const data = await request.json();
  try {
    const params = input.parse(data);
    await prisma.character.create({
      data: {
        name: params.name,
        memoId: params.memoId,
        userId,
        remark: params.remark,
        group: params.group,
      },
    });
    return NextResponse.json({});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({}, { status: 400 });
    } else {
      return NextResponse.error();
    }
  }
}

export { POST };
