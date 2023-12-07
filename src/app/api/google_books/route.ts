import { GoogleBook } from "@/app/tpyes/model";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";
import cache from "../cache/lru";

async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kw = searchParams.get("kw");
  if (!kw?.trim()) {
    return NextResponse.json({ data: { books: [] } });
  }
  const page = parseInt(searchParams.get("page") || "1") || 1;
  const keywords: string = kw.replace(/ +/g, " ").replaceAll(" ", "+");
  const maxResults = 20;
  const startIndex = (page - 1) * 20;
  const orderBy = "relevance";
  const requestUrl = `https://www.googleapis.com/books/v1/volumes?q=${keywords}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=${orderBy}&key=${env.GOOGLE_BOOK_API_KEY}`;
  console.log(requestUrl);

  try {
    const cached = cache.get(requestUrl);
    if (cached) {
      console.log("hit cached data");
      return NextResponse.json({
        data: cached,
        hitCache: true,
      });
    }
    const data = await fetch(requestUrl, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((resp) => ({
        books: resp.items as GoogleBook[],
        count:
          (resp.totalItems as number) > 100 ? 100 : (resp.totalItems as number),
      }));
    cache.set(requestUrl, data);
    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.error();
  }
}
async function POST(request: NextRequest) {}

export { GET, POST };
