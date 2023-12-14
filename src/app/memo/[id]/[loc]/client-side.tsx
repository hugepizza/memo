"use client";
import useSWR from "swr";
import Relation from "../../../components/graphs";
import StoreContextProvider, {
  StoreContext,
} from "../../../components/providers/store-provider";
import { useContext, useEffect, useState } from "react";
import { getLocalMemo } from "../../../localstore/memo";
import { Memo, RawMemo } from "../../../tpyes/memo";
import { notFound } from "next/navigation";

export default function Local({ title }: { title: string }) {
  const memo = getLocalMemo(title);
  if (!memo) {
    return notFound();
  }
  return (
    <div className="w-full flex flex-col" id="graph">
      <StoreContextProvider m={memo}>
        <Relation />
      </StoreContextProvider>
    </div>
  );
}

export function Cloud({ params }: { params: { id: string } }) {
  const { data: memo, isLoading } = useSWR(
    "/api/memo/" + params.id,
    (url: string) =>
      fetch(url, { method: "GET" })
        .then((resp) => resp.json())
        .then((resp) => resp.data.memo as RawMemo)
  );

  if (isLoading) {
    return <progress className="w-full progress "></progress>;
  }
  if (!memo) {
    return notFound();
  }
  const m = JSON.parse(memo.content?.toString() || "{}") as Memo;
  if (!m) {
    return notFound();
  }
  return (
    <div className="w-full flex flex-col" id="graph">
      <StoreContextProvider m={m}>
        <Relation />
      </StoreContextProvider>
    </div>
  );
}
