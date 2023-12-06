import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { z } from "zod";

const addInput = z.object({
  memoId: z.string(),
  sourceId: z.number(),
  targetId: z.number(),
  name: z.string(),
});

async function POST(request: NextRequest) {
  const userId = "wll";
  const data = await request.json();
  try {
    const params = addInput.parse(data);
    await prisma.characterRelation.create({
      data: {
        memoId: params.memoId,
        userId,
        sourceCharacterId: params.sourceId,
        targetCharacterId: params.targetId,
        name: params.name,
      },
    });
    return NextResponse.json({});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({}, { status: 400 });
    } else {
      console.log(error);
      return NextResponse.error();
    }
  }
}

export { POST };
