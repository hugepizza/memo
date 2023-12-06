import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/prisma";
import { Prisma } from "@prisma/client";
import { LRUCache } from "lru-cache";
import { z } from "zod";
import { GoogleBook } from "@/app/tpyes/model";
import { env } from "process";
import { words } from "lodash";

async function GET(request: NextRequest) {
  const userId = "wll";
  const q: Prisma.MemoWhereInput = { userId, deletedAt: { equals: null } };
  const memo = await prisma.memo.findMany({
    where: q,
    include: {
      characterRelations: true,
      characters: true,
      events: true,
      works: true,
    },
  });
  return NextResponse.json({ data: { memo } });
}

const input = z.object({
  googleBookId: z.string(),
});
// add with google book id
async function POST(request: NextRequest) {
  const userId = "wll";
  const data = await request.json();

  let googleBookId = "";
  try {
    const params = input.parse(data);
    googleBookId = params.googleBookId;
  } catch (error) {
    return NextResponse.json({}, { status: 400 });
  }

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

    const book = await getBookInfoFromGoogle(googleBookId);
    if (!book) {
      return NextResponse.json({ error: { msg: "book not found" } });
    }

    const works = {
      authors: book.volumeInfo.authors,
      publishedDate: book.volumeInfo.publishedDate,
      publisher: book.volumeInfo.publisher,
      description: book.volumeInfo.description,
      pageCount: book.volumeInfo.pageCount,
      smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail,
    };
    const newWorks = await prisma.works.upsert({
      where: { googleId: googleBookId },
      update: {
        ...works,
      },
      create: {
        googleId: googleBookId,
        title: book.volumeInfo.title,
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

async function getBookInfoFromGoogle(id: string) {
  const requestUrl = `https://www.googleapis.com/books/v1/volumes/${id}`;
  console.log('requestUrl',requestUrl);
  
  try {
    const resp = await fetch(requestUrl, {
      method: "GET",
    });
    const book = (await resp.json()) as GoogleBook;
    return book;
  } catch (error) {
    console.log("fetch book from google failed, " + error);
    return null;
  }
}

export { GET, POST };