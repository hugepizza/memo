import { GoogleBook } from "@/app/tpyes/model";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";
import cache from "../cache/lru";

const getCacheKey = (keyword: string) => {
  return `google_book_keyword_${keyword}`;
};
async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kw = searchParams.get("kw");
  if (!kw?.trim()) {
    return NextResponse.json({ data: { books: [] } });
  }
  const keywords: string = kw.replace(/ +/g, " ").replaceAll(" ", "+");
  const requestUrl = `https://www.googleapis.com/books/v1/volumes?q=${keywords}&key=${env.GOOGLE_BOOK_API_KEY}`;
  console.log("google book request", requestUrl);

  const key = getCacheKey(kw);
  try {
    console.log(1111);

    const cached = cache.get(key);
    if (cached) {
      console.log(2222);
      console.log("hit cached data");
      return NextResponse.json({ data: { books: cached } });
    }
    console.log(3333);
    const volumes = await fetch(requestUrl, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((resp) => resp.items as GoogleBook[]);
    console.log(4444);
    cache.set(key, volumes);
    console.log(5555);
    return NextResponse.json({ data: { books: volumes } });
  } catch (error) {
    console.log("error", error);

    return NextResponse.error();
  }
}
async function POST(request: NextRequest) {}

export { GET, POST };
