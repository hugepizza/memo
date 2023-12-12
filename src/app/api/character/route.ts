import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { z } from "zod";
async function GET(request: NextRequest) {
  const memoId = "klmzf";
  const userId = "wll";
  const characters = await prisma.character.findMany({
    where: { memoId, userId, deletedAt: { equals: null } },
  });
  return NextResponse.json({ data: { characters } });
}

const input = z.object({
  name: z.string(),
  memoId: z.string(),
  remark: z.string().optional(),
});

async function POST(request: NextRequest) {
  console.log("create");
  const userId = "wll";
  const data = await request.json();
  try {
    const params = input.parse(data);
    await prisma.character.create({
      data: {
        name: params.name,
        memoId: params.memoId,
        userId,
        remark: params.remark,
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

export { GET, POST };
