"use client";
import Relation from "../../components/graphs";
import StoreContextProvider from "../../components/providers/store-provider";
import { notFound } from "next/navigation";
import useLocalMemo from "@/app/localstore/memo";

export default function Local({ title }: { title: string }) {
  const { get } = useLocalMemo();
  const memo = get(title);
  if (!memo) {
    return null;
  }
  return (
    <div className="w-full flex flex-col" id="graph">
      <StoreContextProvider m={memo}>
        <Relation />
      </StoreContextProvider>
    </div>
  );
}
