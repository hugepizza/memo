"use client";
import { useTheme } from "next-themes";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import rough from "roughjs";

import { CharacterEditerContext } from "../../editors/providers/character-provider";
import { createNode, createLine, createTitle } from "../rough";
import { useD3Network } from "./d3";
import { Drawer } from "../../editors/character/drawer";
import { Pannal } from "./pannel";
import { RelationModal } from "../../editors/relation/modal";

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
  console.log("Relation");

  const { theme } = useTheme();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const screenWidth = document.documentElement.clientWidth;
  const screenHeight = document.documentElement.clientHeight;
  const nodeRadius = window.innerWidth >= 768 ? 28 : 18;
  const [forceRadius, setForceRadius] = useState(
    window.innerWidth >= 768 ? 80 : 60
  );

  const { memo } = useContext(CharacterEditerContext);
  console.log("Memo reference:", memo);
  const metaNodes = useMemo(() => {
    return memo?.characters?.map((e) => ({
      data: {
        id: `${e.id}`,
        label: e.name,
        remark: e.remark || undefined,
      },
    }));
  }, [memo]);

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

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.setAttribute("id", "texture");
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("height", "100%");
    filter.setAttribute("width", "100%");

    const feTurbulence = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feTurbulence"
    );
    feTurbulence.setAttribute("type", "fractalNoise");
    feTurbulence.setAttribute("baseFrequency", "0.01");
    feTurbulence.setAttribute("numOctaves", "5");
    feTurbulence.setAttribute("result", "noise");

    const feDisplacementMap = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feDisplacementMap"
    );
    feDisplacementMap.setAttribute("in", "SourceGraphic");
    feDisplacementMap.setAttribute("in2", "noise");
    feDisplacementMap.setAttribute("scale", "10");

    const feComponentTransfer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feComponentTransfer"
    );
    const feFuncA = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feFuncA"
    );
    feFuncA.setAttribute("type", "table");
    feFuncA.setAttribute("tableValues", "0,0.2,0.4,0.6,0.8,1");
    feComponentTransfer.append(feFuncA);

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("height", "100%");
    bg.setAttribute("width", "100%");
    bg.setAttribute("fill", "#FEFAE0");
    bg.setAttribute("filter", "url(#texture)");
    filter.append(feTurbulence);
    filter.append(feDisplacementMap);
    filter.append(feComponentTransfer);
    defs.append(filter);

    containerRef.current?.append(defs);
    containerRef.current?.append(bg);
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
    <div className="" style={{ width: screenWidth, height: screenHeight }}>
      <div
        className="relative"
        style={{ width: screenWidth, height: screenHeight }}
      >
        <Pannal
          downloadElementRef={containerRef}
          setEditorIsVisible={setDrawerIsVisible}
          setEditingCharacterId={setEditingCharacterId}
          forceRadius={forceRadius}
          setForceRadius={setForceRadius}
        ></Pannal>
        {memo.characters.length > 0 ? (
          <svg
            ref={containerRef}
            style={{ width: screenWidth, height: screenHeight }}
          ></svg>
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
