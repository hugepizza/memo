"use client";

import { useContext, useEffect, useState } from "react";

import { Drawer, drawerIsVisible } from "../editors/character/drawer";
import { Pannal } from "./pannel";
import { RelationShowModal } from "../editors/relation/show-modal";
import { ZCOOL_KuaiLe } from "next/font/google";
import NetworkGraph from "./network";
import { useSession } from "next-auth/react";
import { Character } from "@/app/tpyes/memo";
import { StoreContext } from "../providers/store-provider";
import { RelationEditModal } from "../editors/relation/edit-modal";
import { useAtom } from "jotai";

export type MetaNode = {
  data: { id: string; label: string; remark?: string; color?: string };
};

export type MetaEdge = {
  data: { id: string; source: string; target: string; label: string };
};

export default function Relation() {
  const { memo } = useContext(StoreContext);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [forceRadius, setForceRadius] = useState(0);
  useEffect(() => {
    setScreenWidth(document.documentElement.clientWidth);
    setScreenHeight(document.documentElement.clientHeight);
    setForceRadius(document.documentElement.clientWidth >= 768 ? 80 : 60);
  }, []);

  const [hoverCharacterName, setHoverCharacterName] = useState<string | null>(
    null
  );

  return (
    <div
      style={{
        width: screenWidth,
        height: screenHeight,
      }}
    >
      <div
        className="relative"
        style={{
          width: screenWidth,
          height: screenHeight,
        }}
      >
        {memo.characters && memo.characters.length > 0 ? (
          <>
            <NetworkGraph
              height={screenHeight}
              width={screenWidth}
              forceRadius={forceRadius}
              setHoverCharacterName={setHoverCharacterName}
            />
            <CharacterDetail name={hoverCharacterName}></CharacterDetail>
            <Pannal
              elememtId={"download"}
              forceRadius={forceRadius}
              setForceRadius={setForceRadius}
            ></Pannal>
          </>
        ) : (
          <Placeholder />
        )}
      </div>
      <Drawer />
      <RelationShowModal />
      <RelationEditModal />
    </div>
  );
}

function CharacterDetail({ name }: { name: string | null }) {
  let character: Character | undefined = undefined;
  const { memo } = useContext(StoreContext);
  if (name) {
    character = memo.characters?.find((e) => e.name === name);
  }
  return (
    <div
      className={`${
        character ? "opacity-100" : "opacity-0"
      } w-[200px] min-h-[120px]  absolute flex top-1 right-1 transform -translate-x-1/2 flex-col px-6 p-4 rounded-md items-center`}
    >
      <div className="text-2xl flex flex-row items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#FFF7D4"
          className="w-5 h-5"
        >
          <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 00.572.729 6.016 6.016 0 002.856 0A.75.75 0 0012 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8.863 17.414a.75.75 0 00-.226 1.483 9.066 9.066 0 002.726 0 .75.75 0 00-.226-1.483 7.553 7.553 0 01-2.274 0z" />
        </svg>{" "}
        {character?.name}
      </div>
      <p>{character?.remark || "no remark"}</p>
    </div>
  );
}

function Placeholder() {
  const [, setDrawerIsVisible] = useAtom(drawerIsVisible);
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Create a character</h1>
          <p className="py-6">
            Memo graph is started with two characters and a relationship between
            them, create your characters and them connect them by relation.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setDrawerIsVisible(true);
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
