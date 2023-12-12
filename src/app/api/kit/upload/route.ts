import upload from "@/app/kits/s3";
import { NextRequest, NextResponse } from "next/server";

// add with google book id
async function POST(request: NextRequest) {
  const d = await request.formData();
  const file: File | null = d.get("file") as File;
  if (!file) {
    return NextResponse.error();
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = `memo/${new Date().getTime()}${Math.ceil(Math.random() * 1000)}`;
  const url = await upload(buffer, path);
  console.log(`open ${path} to see the uploaded file`);

  return NextResponse.json({ data: { url } });
}

export { POST };
