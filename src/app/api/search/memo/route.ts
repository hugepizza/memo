import prisma from "@/app/prisma/prisma";
import { GetPayload, Memo } from "@/app/tpyes/memo";
import { NextRequest, NextResponse } from "next/server";
async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kw = searchParams.get("kw")?.trim();
  if (!kw) {
    return NextResponse.json({ data: { works: [] } });
  }
  const keywords: string = kw.replace(/ +/g, " ");
  try {
    const items = await prisma.memo.findMany({
      where: {
        title: { contains: keywords, mode: "insensitive" },
        visibility: "PUBLIC",
      },
      take: 5,
    });
    const ms: Memo[] = items
      .map((ele) => {
        return GetPayload(ele);
      })
      .filter((ele): ele is Memo => ele !== null);
    return NextResponse.json({ data: { memo: ms } });
  } catch (error) {
    return NextResponse.error();
  }
}

export { GET };
