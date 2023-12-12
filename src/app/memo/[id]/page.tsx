import { Memo } from "@/app/tpyes/model";
import { Metadata, ResolvingMetadata } from "next";
import Content from "../client-side";
import prisma from "@/app/prisma/prisma";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const memo = await prisma.memo.findFirst({
    where: { id: params.id, visibility: "PUBLIC", deletedAt: { equals: null } },
    include: {
      characters: true,
      works: true,
    },
  });
  const p = await parent;
  if (!memo) {
    return {
      title: p.title,
      description: p.description,
    };
  }
  return {
    title: `${memo?.worksTitle} | Hand-Drawn Novel Character Relationship Charts Online`,
    description: `${
      memo?.worksTitle
    } Character Relationship Network Charts ${memo?.characters
      ?.slice(0, 5)
      .map((e) => e.name)
      .join(", ")}`,
    applicationName: "Memo",
    openGraph: {
      images: [{ url: memo?.works.thumbnail! }],
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <Content params={params}></Content>;
}
