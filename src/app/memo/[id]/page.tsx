"use client";

import CharacterEditor from "@/app/components/editors/character";
import Relation, { MetaEdge, MetaNode } from "@/app/components/graphs/relation";
import useSWR from "swr";
import { notFound } from "next/navigation";
import RelationEditor from "@/app/components/editors/relation";
import {
  Memo,
  Event,
  Relation as RelationType,
  Character,
} from "@/app/tpyes/model";
import Events from "@/app/components/graphs/event";

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
  const nodes = memo?.characters?.map((e) => ({
    data: {
      id: `${e.id}`,
      label: e.name,
      remark: e.remark || undefined,
    },
  }));
  const edges = memo?.characterRelations?.map((e) => ({
    data: {
      id: `${e.id}`,
      label: e.name ?? "",
      source: `${e.sourceCharacter?.id}`,
      target: `${e.targetCharacter?.id}`,
    },
  }));

  if (isLoading) {
    return <></>;
  }
  if (!memo?.id) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col">
      <Relation
        title={memo.worksTitle}
        memoId={memo.id}
        edges={edges || ([] as MetaEdge[])}
        nodes={nodes || ([] as MetaNode[])}
      ></Relation>
      {/* <Events events={memo?.events as Event[]} /> */}
      <RelationEditor
        memoId={memo.id}
        characters={memo.characters}
        relations={memo.characterRelations || ([] as RelationType[])}
      />
    </div>
  );
}
