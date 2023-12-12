import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";

// async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user) {
//     return NextResponse.json({}, { status: 401 });
//   }
//   const userId = session.user.id;
//   const id = parseInt(params.id, 10);
//   const character = await prisma.character.findFirst({
//     where: { id, userId, deletedAt: { equals: null } },
//   });
//   return NextResponse.json({ data: { character } });
// }

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
    await prisma.character.delete({
      where: { id, userId },
    });
  } catch (error) {
    return NextResponse.error();
  }
  return NextResponse.json({});
}

const updateInput = z.object({
  name: z.string(),
  remark: z.string(),
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
    await prisma.character.update({
      where: { id, userId },
      data: {
        remark: params.remark,
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
