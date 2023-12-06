import prisma from "@/app/prisma/prisma";
import { MemoSearchResult } from "@/app/tpyes/api";
import { SearchMode, GoogleBook } from "@/app/tpyes/model";
import { NextRequest, NextResponse } from "next/server";
async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kw = searchParams.get("kw")?.trim();
  if (!kw) {
    return NextResponse.json({ data: { works: [] } });
  }
  let results: MemoSearchResult[] = [];
  const mode = (searchParams.get("mode") as SearchMode) ?? "works";

  console.log("mode", mode);

  const keywords: string = kw.replace(/ +/g, " ").replaceAll(" ", "+");
  try {
    if (mode === "works") {
      const items = await prisma.memo.findMany({
        where: { worksTitle: { contains: keywords } },
        include: { characters: true, characterRelations: true, events: true },
        take: 5,
      });

      results = items.map((ele) => ({
        memoId: ele.id,
        kwTitle: ele.worksTitle,
        worksTitle: ele.worksTitle,
        charactersCount: ele.characters.length,
        eventCount: ele.events.length,
        relationCount: ele.characterRelations.length,
      }));
    } else if (mode === "character") {
      const items = await prisma.character.findMany({
        where: { name: { contains: keywords } },
        include: {
          memo: {
            include: {
              characters: true,
              characterRelations: true,
              events: true,
            },
          },
        },
        take: 5,
      });
      results = items.map((ele) => ({
        memoId: ele.memo.id,
        kwTitle: ele.name,
        worksTitle: ele.memo.worksTitle,
        charactersCount: ele.memo.characters.length,
        eventCount: ele.memo.events.length,
        relationCount: ele.memo.characterRelations.length,
      }));
    }
    return NextResponse.json({ data: { memo: results } });
  } catch (error) {
    return NextResponse.error();
  }
}

export { GET };
