import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { z } from "zod";

async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.characterRelation.delete({
      where: { id },
    });
  } catch (error) {
    return NextResponse.error();
  }
  return NextResponse.json({});
}

const updateInput = z.object({
  sourceId: z.number(),
  targetId: z.number(),
  name: z.string(),
});

async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const data = await request.json();
  try {
    const params = updateInput.parse(data);
    await prisma.characterRelation.update({
      where: { id },
      data: {
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
      return NextResponse.error();
    }
  }
}

export { DELETE, PUT };
