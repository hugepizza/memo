"use client";

import Relation from "@/app/components/graphs";
import useSWR from "swr";
import { notFound } from "next/navigation";
import { Memo } from "@/app/tpyes/model";
import CharacterEditerContextProvider from "@/app/components/providers/character-provider";
import RelationEditerContextProvider from "@/app/components/providers/relation-provider";

export default function Page({ params }: { params: { id: string } }) {
  const { data: memo, isLoading } = useSWR(
    "/api/memo/" + params.id,
    (url: string) =>
      fetch(url, { method: "GET" })
        .then((resp) => resp.json())
        .then((resp) => resp.data.memo as Memo)
        .catch((err) => {
          console.log(err);
        })
  );

  if (isLoading) {
    return <></>;
  }
  if (!memo?.id) {
    return notFound();
  }
  
  return (
    <div className="w-full flex flex-col" id="graph">
      <CharacterEditerContextProvider memoId={memo.id} memo={memo}>
        <RelationEditerContextProvider memoId={memo.id} memo={memo}>
          <Relation />
        </RelationEditerContextProvider>
      </CharacterEditerContextProvider>
    </div>
  );
}
