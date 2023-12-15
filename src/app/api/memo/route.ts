import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { GetPayload, Memo } from "@/app/tpyes/memo";

async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session.user.id;
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "0", 10) || 0;
  const pageSize = parseInt(searchParams.get("pageSize") || "8", 10) || 8;
  const q: Prisma.MemoWhereInput = { userId, deletedAt: { equals: null } };
  const memo = await prisma.memo.findMany({
    where: q,
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const ms: Memo[] = memo
    .map((ele) => {
      return GetPayload(ele);
    })
    .filter((ele): ele is Memo => ele !== null);

  const count = await prisma.memo.count({ where: q });
  return NextResponse.json({ data: { memo: ms, count } });
}

const input = z.object({
  title: z.string(),
  cover: z.string().optional(),
  content: z.string().optional(),
});
async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session.user.id;
  const data = await request.json();
  let params: {
    title: string;
    cover?: string;
    content?: string;
  };
  try {
    params = input.parse(data);
  } catch (error) {
    return NextResponse.json({}, { status: 400 });
  }
  try {
    const newMemo = prisma.memo.upsert({
      where: { userId_title: { userId: userId, title: params.title } },
      create: {
        title: params.title,
        cover: params.cover,
        content: params.content || "{}",
        userId,
      },
      update: {
        cover: params.cover,
        content: params.content || "{}",
      },
    });
    return NextResponse.json({ data: { memoId: (await newMemo).id } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({}, { status: 400 });
    } else {
      console.log(error);
      return NextResponse.error();
    }
  }
}

export { GET, POST };
