import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { GetPayload, Memo } from "@/app/tpyes/memo";
async function GET(
  request: NextRequest,
  { params }: { params: { title: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session?.user?.id;
  const title = params.title;
  const rawMemo = await prisma.memo.findFirst({
    where: {
      title: decodeURIComponent(title),
      userId,
      deletedAt: { equals: null },
    },
  });
  if (!rawMemo) {
    return NextResponse.json({ data: { memo: null } });
  }

  const m = GetPayload(rawMemo);
  if (!m) {
    return NextResponse.json({ data: { memo: null } });
  }
  return NextResponse.json({ data: { memo: m } });
}
async function DELETE(
  request: NextRequest,
  { params }: { params: { title: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session?.user?.id;
  const title = params.title;
  try {
    await prisma.memo.delete({
      where: {
        userId_title: { userId: userId, title: decodeURIComponent(title) },
      },
    });
  } catch (error) {
    return NextResponse.error();
  }

  return NextResponse.json({ data: {} });
}

export { GET, DELETE };
