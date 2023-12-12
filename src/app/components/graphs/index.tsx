"use client";
import { useTheme } from "next-themes";

import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
const font = ZCOOL_KuaiLe({ weight: "400", subsets: ["latin"] });

import rough from "roughjs";

import { CharacterEditerContext } from "../editors/providers/character-provider";
import { createNode, createLine, createTitle } from "./rough";
import { useD3Network } from "./d3";
import { Drawer } from "../editors/character/drawer";
import { Pannal } from "./pannel";
import { RelationModal } from "../editors/relation/modal";
import { createBackgroundRect, createImgBackground } from "./texture";
import { ZCOOL_KuaiLe } from "next/font/google";

export type MetaNode = {
  data: { id: string; label: string; remark?: string };
};

export type MetaEdge = {
  data: { id: string; source: string; target: string; label: string };
};
function randColor(dark: boolean) {
  const colors = dark
    ? ["#5F6F52", "#A9B388", "#FEFAE0", "#B99470"]
    : ["#219C90", "#E9B824", "#EE9322", "#D83F31"];
  return colors[Math.floor(Math.random() * 4)];
}

export default function Relation() {
  const { theme } = useTheme();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [backgroundData, setBackgroundData] = useState<string | null>(null);
  const screenWidth = document.documentElement.clientWidth;
  const screenHeight = document.documentElement.clientHeight;
  const nodeRadius = window.innerWidth >= 768 ? 28 : 18;
  const [forceRadius, setForceRadius] = useState(
    window.innerWidth >= 768 ? 80 : 60
  );

  const { memo } = useContext(CharacterEditerContext);
  const metaNodes = useMemo(() => {
    return memo?.characters?.map((e) => ({
      data: {
        id: `${e.id}`,
        label: e.name,
        remark: e.remark || undefined,
      },
    }));
  }, [memo]);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(
          "https://fonts.gstatic.com/s/zcoolkuaile/v19/tssqApdaRQokwFjFJjvM6h2Wo4z1oXkYxd0yTHEClH7DwjDMeAhAgE_3sefnUmd6tMyz-no9BA.5.woff2"
        );
        const blob = await response.blob();
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          if (typeof reader.result === "string") {
            setBackgroundData(reader.result as string);
          }
        };
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };
    loadImage();
  }, []);
  const metaEdges = useMemo(() => {
    return memo?.characterRelations?.map((e) => ({
      data: {
        id: `${e.id}`,
        label: e.name ?? "",
        source: `${e.sourceCharacter?.id}`,
        target: `${e.targetCharacter?.id}`,
      },
    }));
  }, [memo]);

  const { d3NodeData, d3EdgeData } = useD3Network({
    metaNodes,
    metaEdges,
    width: screenWidth,
    height: screenHeight,
    forceRadius: forceRadius,
  });

  const darkMode = theme === "dark";
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
    null
  );
  const [editingRelationId, setEditingRelationId] = useState<string>("");
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [edgeClolrs, setEdgeClolrs] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [edgeDarkClolrs, setEdgeDarkClolrs] = useState<Map<string, string>>(
    new Map<string, string>()
  );

  useEffect(() => {
    const light = new Map<string, string>();
    metaEdges.forEach((e) => {
      light.set(e.data.id, randColor(false));
    });
    setEdgeClolrs(light);

    const dark = new Map<string, string>();
    metaEdges.forEach((e) => {
      dark.set(e.data.id, randColor(true));
    });
    setEdgeClolrs(light);
    setEdgeDarkClolrs(dark);
  }, [metaEdges]);

  useEffect(() => {
    const baseColor = darkMode ? "white" : "black";
    const rc = rough.svg(containerRef.current!);

    const nnodes = d3NodeData.map((e) => {
      const node = createNode({
        rc,
        position: { x: e.x, y: e.y },
        radius: nodeRadius,
        color: baseColor,
        text: metaNodes.find((ef) => ef.data.id === e.id)?.data.label ?? "",
        onclick: (evt: MouseEvent) => {
          setEditingCharacterId(e.id);
          setDrawerIsVisible(true);
        },
      });

      return node;
    });
    containerRef.current?.append(...nnodes);

    const nlinks: SVGGElement[] = d3EdgeData.map((e) => {
      const lines = createLine({
        rc,
        position: {
          x1: e.source.x,
          y1: e.source.y,
          x2: e.target.x,
          y2: e.target.y,
        },
        color:
          (darkMode ? edgeDarkClolrs : edgeClolrs).get(
            metaEdges.find((ef) => ef.data.id === e.id)?.data.id ?? ""
          ) ?? "",
        text: metaEdges.find((ef) => ef.data.id === e.id)?.data.label ?? "",
        nodeRadius: nodeRadius,
        onclick: (evt: MouseEvent) => {
          setEditingRelationId(e.id);
          setModalIsVisible(true);
        },
      });
      return lines;
    });

    containerRef.current?.append(...nlinks);

    const ntitle = createTitle({ content: memo.worksTitle, color: baseColor });
    containerRef.current?.append(ntitle);

    return () => {
      if (containerRef?.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, [d3EdgeData, d3NodeData, darkMode, metaEdges, metaNodes]);

  return (
    <div
      className=""
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
        <Pannal
          elememtId={"download"}
          setEditorIsVisible={setDrawerIsVisible}
          setEditingCharacterId={setEditingCharacterId}
          forceRadius={forceRadius}
          setForceRadius={setForceRadius}
        ></Pannal>
        {memo.characters.length > 0 ? (
          <svg
            id="download"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <style type="text/css">
              {`
            @font-face {
              font-family: ${font.style.fontFamily};
              font-style: normal;
              font-weight: 400;
              src: url("data:application/font-woff;charset=utf-8;base64,${backgroundData}");
              unicode-range: U+fee3, U+fef3, U+ff03-ff04, U+ff07, U+ff0a, U+ff17-ff19, U+ff1c-ff1d, U+ff20-ff3a, U+ff3c, U+ff3e-ff5b, U+ff5d, U+ff61-ff65, U+ff67-ff6a, U+ff6c, U+ff6f-ff78, U+ff7a-ff7d, U+ff80-ff84, U+ff86, U+ff89-ff8e, U+ff92, U+ff97-ff9b, U+ff9d-ff9f, U+ffe0-ffe4, U+ffe6, U+ffe9, U+ffeb, U+ffed, U+fffc, U+1f004, U+1f170-1f171, U+1f192-1f195, U+1f198-1f19a, U+1f1e6-1f1e8;
            }
          `}

              {`
            text {
              font-family: ${font.style.fontFamily};
              font-size: 20px;
              fill: black;
            }
          `}
            </style>
            <defs>
              <pattern
                id="paper-pattern"
                patternUnits="userSpaceOnUse"
                width={"100%"}
                height={"100%"}
              >
                <image
                  preserveAspectRatio="none"
                  width="100%"
                  height="100%"
                  href="/texture/paper-2.jpg"
                />
              </pattern>
            </defs>
            <rect width={"100%"} height={"100%"} fill="url(#paper-pattern)" />
            <g
              ref={containerRef}
              style={{
                width: "100%",
                height: "100%",
              }}
            ></g>
          </svg>
        ) : (
          <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">Create a character</h1>
                <p className="py-6">
                  Memo graph is started with two characters and a relationship
                  between them, create your characters and them connect them by
                  relation.
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
        )}
      </div>
      <Drawer
        characterId={editingCharacterId}
        isVisible={drawerIsVisible}
        setIsVisible={setDrawerIsVisible}
      ></Drawer>
      <RelationModal
        relationId={editingRelationId}
        isVisible={modalIsVisible}
        setIsVisible={setModalIsVisible}
      ></RelationModal>
    </div>
  );
}
