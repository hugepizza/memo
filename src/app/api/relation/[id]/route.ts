import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";

async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session.user.id;
  try {
    const id = parseInt(params.id, 10);
    await prisma.characterRelation.delete({
      where: { id, userId },
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
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session.user.id;
  const id = parseInt(params.id, 10);
  const data = await request.json();
  try {
    const params = updateInput.parse(data);
    await prisma.characterRelation.update({
      where: { id, userId },
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
