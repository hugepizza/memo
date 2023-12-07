"use client";
import { useTheme } from "next-themes";
import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

import { ZCOOL_KuaiLe } from "next/font/google";
import { RoughSVG } from "roughjs/bin/svg";
import { CharacterModal } from "../editors/character-modal";
import CharacterEditerContextProvider from "../editors/character-context";
const font = ZCOOL_KuaiLe({ weight: "400", subsets: ["latin"] });

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
  nodes,
  edges,
}: {
  memoId: string;
  nodes: Node[];
  edges: Edge[];
}) {
  const { theme } = useTheme();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const calcRef = useRef<HTMLDivElement | null>(null);
  const nodeRadius = 50;
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

    const currentContainer = containerRef.current;
    return () => {
      if (currentContainer) {
        while (currentContainer.firstChild) {
          currentContainer.removeChild(currentContainer.firstChild);
        }
      }
    };
  }, [nodes, edges, darkMode]);

  return (
    <CharacterEditerContextProvider memoId={memoId}>
      <div className="w-full h-[600px] border-base-200 border-[2px] border-solid">
        <div className="w-full h-[600px]  relative">
          <Op
            setModalIsVisible={setModalIsVisible}
            setModalCharacterId={setModalCharacterId}
          ></Op>
          <svg ref={containerRef} className="w-full h-[600px] "></svg>
        </div>
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
  setModalIsVisible,
  setModalCharacterId,
}: {
  setModalIsVisible: (v: boolean) => void;
  setModalCharacterId: (id: number) => void;
}) {
  return (
    <div className="absolute flex top-0 right-0 w-[100px] h-[100px] z-[10] justify-center items-center">
      <svg
        onClick={() => {
          setModalIsVisible(true);
          setModalCharacterId(NaN);
        }}
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
    </div>
  );
}

function createNodeText({
  position,
  content,
  spacing,
  color,
}: {
  position: { x: number; y: number };
  content: string;
  spacing?: number;
  color?: string;
}) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", (position.x + (spacing ?? 0)).toString());
  text.setAttribute("y", position.y.toString());
  text.setAttribute("font-family", font.style.fontFamily);
  text.setAttribute("font-size", "18px");
  if (color) {
    text.setAttribute("fill", color);
  }
  text.textContent = content;
  return text;
}

function createLineText({
  position,
  content,
  spacing,
  color,
}: {
  position: { x1: number; y1: number; x2: number; y2: number };
  content: string;
  spacing?: number;
  color?: string;
}) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

  const midX = (position.x1 + position.x2) / 2;
  const midY = (position.y1 + position.y2) / 2;

  text.setAttribute("x", (midX + (spacing ?? 0)).toString());
  text.setAttribute("y", midY.toString());
  text.setAttribute("font-family", "Arial");
  text.setAttribute("font-size", "18px");
  if (color) {
    text.setAttribute("fill", color);
  }
  text.textContent = content;
  return text;
}

function createNode({
  rc,
  position,
  radius,
  color,
  text,
  onclick,
}: {
  rc: RoughSVG;
  position: { x: number; y: number };
  radius: number;
  color: string;
  text: string;
  onclick: (e: MouseEvent) => void;
}) {
  const nodeEle = rc.circle(position.x, position.y, radius, {
    stroke: color,
    fill: color,
  });
  const textEle = createNodeText({
    content: text,
    position: { x: position.x, y: position.y },
    spacing: radius / 2 + radius / 10,
    color: color,
  });
  const f = document.createElementNS("http://www.w3.org/2000/svg", "g");
  f.setAttribute("x", position.x.toString());
  f.setAttribute("y", position.y.toString());
  f.setAttribute("style", "pointer-events: visible;");
  f.onclick = onclick;
  f.appendChild(nodeEle);
  f.appendChild(textEle);
  return f;
}

function createLine({
  rc,
  position,
  color,
  text,
  nodeRadius,
}: {
  rc: RoughSVG;
  position: { x1: number; y1: number; x2: number; y2: number };
  color: string;
  text: string;
  nodeRadius: number;
}) {
  const lineEle = rc.line(position.x1, position.y1, position.x2, position.y2, {
    stroke: color,
    fill: color,
  });

  const textEle = createLineText({
    content: text,
    position: { ...position },
    spacing: nodeRadius / 2 + nodeRadius / 10,
    color: color,
  });
  const f = document.createElementNS("http://www.w3.org/2000/svg", "g");
  f.setAttribute("x", "100");
  f.setAttribute("y", "100");
  f.appendChild(lineEle);
  f.appendChild(textEle);
  return f;
}
