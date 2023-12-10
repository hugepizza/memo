import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { z } from "zod";

const input = z.object({
  title: z.string(),
  cover: z.string().optional(),
});
// add with google book id
async function POST(request: NextRequest) {
  const userId = "wll";
  const data = await request.json();
  let params: {
    title: string;
    cover?: string | undefined;
  };
  try {
    params = input.parse(data);
  } catch (error) {
    return NextResponse.json({}, { status: 400 });
  }
  const googleBookId = `custom_${userId}_${params.title}`;
  try {
    const existedWorks = await prisma.works.findFirst({
      where: { googleId: googleBookId },
    });
    if (existedWorks) {
      const existMemo = await prisma.memo.count({
        where: { userId, worksId: existedWorks.id },
      });
      if (existMemo > 0) {
        return NextResponse.json({ error: { msg: "memo exists" } });
      }
    }

    const works = {
      smallThumbnail: params.cover,
      thumbnail: params.cover,
    };
    const newWorks = await prisma.works.upsert({
      where: { googleId: googleBookId },
      update: {
        ...works,
      },
      create: {
        googleId: googleBookId,
        title: params.title,
        ...works,
      },
    });

    const newMemo = prisma.memo.create({
      data: {
        worksTitle: newWorks.title,
        worksId: newWorks.id,
        userId,
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

export { POST };
