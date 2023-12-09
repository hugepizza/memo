"use client";
import { useTheme } from "next-themes";
import cytoscape from "cytoscape";
import { Canvg } from "canvg";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import rough from "roughjs";

import { CharacterModal } from "../../editors/character-modal";
import CharacterEditerContextProvider from "../../editors/character-context";
import { createNode, createLine, createTitle } from "../rough";

export type Node = {
  data: { id: string; label: string; remark?: string };
};

function randColor(dark: boolean) {
  const colors = dark
    ? ["#5F6F52", "#A9B388", "#FEFAE0", "#B99470"]
    : ["#219C90", "#E9B824", "#EE9322", "#D83F31"];
  return colors[Math.floor(Math.random() * 4)];
}
export type Edge = {
  data: { id: string; source: string; target: string; label: string };
};
export default function Relation({
  memoId,
  title,
  nodes,
  edges,
}: {
  memoId: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
}) {
  const { theme } = useTheme();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const calcRef = useRef<HTMLDivElement | null>(null);
  const nodeRadius = window.innerWidth >= 768 ? 48 : 18;

  const darkMode = theme === "dark";
  const [modalCharacterId, setModalCharacterId] = useState(NaN);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  useEffect(() => {
    const baseColor = darkMode ? "white" : "black";
    const cy = cytoscape({
      elements: { nodes, edges },
      container: calcRef.current,
      layout: { name: "circle" },
      style: [
        {
          selector: "node",
          style: {
            width: `${nodeRadius}px`,
            height: `${nodeRadius}px`,
          },
        },
      ],
    });
    const rc = rough.svg(containerRef.current!);

    cy.nodes().forEach((ele) => {
      const node = createNode({
        rc,
        position: { x: ele.position().x, y: ele.position().y },
        radius: nodeRadius,
        color: baseColor,
        text: ele.attr("label") as string,
        onclick: (e: MouseEvent) => {
          setModalCharacterId(parseInt(ele.attr("id") as string, 10));
          setModalIsVisible(true);
        },
      });
      containerRef.current?.appendChild(node);
    });

    cy.edges().forEach((ele) => {
      const line = createLine({
        rc,
        position: {
          x1: ele.sourceEndpoint().x,
          y1: ele.sourceEndpoint().y,
          x2: ele.targetEndpoint().x,
          y2: ele.targetEndpoint().y,
        },
        color: randColor(darkMode),
        text: ele.attr("label") as string,
        nodeRadius: nodeRadius,
      });
      containerRef.current?.appendChild(line);
    });
    containerRef.current?.appendChild(
      createTitle({ content: title, color: baseColor })
    );

    const currentContainer = containerRef.current;
    return () => {
      if (currentContainer) {
        while (currentContainer.firstChild) {
          currentContainer.removeChild(currentContainer.firstChild);
        }
      }
    };
  }, [nodes, edges, darkMode, title]);

  return (
    <CharacterEditerContextProvider memoId={memoId}>
      <div className="w-full h-[600px] border-base-200 border-[1px] border-solid">
        {/* for rendering svg */}
        <div className="w-full h-[600px] relative">
          <Op
            downloadElementRef={containerRef}
            setModalIsVisible={setModalIsVisible}
            setModalCharacterId={setModalCharacterId}
          ></Op>
          <svg ref={containerRef} className="w-full h-[600px] "></svg>
        </div>
        {/* only for position calc */}
        <div
          ref={calcRef}
          className="absolute top-0 left-0 opacity-0 w-full h-[600px] z-[-100]"
        ></div>

        <CharacterModal
          id={modalCharacterId}
          isVisible={modalIsVisible}
          setIsVisible={setModalIsVisible}
        />
      </div>
    </CharacterEditerContextProvider>
  );
}

function Op({
  downloadElementRef,
  setModalIsVisible,
  setModalCharacterId,
}: {
  downloadElementRef: MutableRefObject<SVGSVGElement | null>;
  setModalIsVisible: (v: boolean) => void;
  setModalCharacterId: (id: number) => void;
}) {
  const download = async () => {
    console.log("downloadElement", downloadElementRef.current);
    if (downloadElementRef.current) {
      const desiredWidth = 2400;
      const scaleFactor =
        desiredWidth / downloadElementRef.current.width.baseVal.value;

      const canvas = document.createElement("canvas");
      canvas.width =
        downloadElementRef.current.width.baseVal.value * scaleFactor;
      canvas.height =
        downloadElementRef.current.height.baseVal.value * scaleFactor;
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(scaleFactor, scaleFactor);
        const v = await Canvg.from(
          context,
          new XMLSerializer().serializeToString(downloadElementRef.current)
        );
        v.start();
        const dataUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = "downloaded.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  };

  return (
    <div className="absolute flex top-0 right-0 w-[100px] h-[100px] z-[10]">
      <div className="flex flex-row space-x-1">
        <button
          className="btn btn-circle"
          onClick={() => {
            setModalIsVisible(true);
            setModalCharacterId(NaN);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
            />
          </svg>
        </button>
        <button
          className="btn btn-circle"
          onClick={() => {
            download();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
