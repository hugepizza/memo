"use client";
import { notFound } from "next/navigation";
import useSWR from "swr";
import RelationEditerContextProvider from "../components/providers/relation-provider";
import CharacterEditerContextProvider from "../components/providers/character-provider";
import Relation from "../components/graphs";
import { Memo } from "../tpyes/model";

export default function Content({ params }: { params: { id: string } }) {
  const { data: memo, isLoading } = useSWR(
    "/api/memo/" + params.id,
    (url: string) =>
      fetch(url, { method: "GET" })
        .then((resp) => resp.json())
        .then((resp) => resp.data.memo as Memo)
  );

  if (isLoading) {
    return <progress className="w-full progress "></progress>;
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
