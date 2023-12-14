import { ZCOOL_KuaiLe } from "next/font/google";
import { createLine, createNode, createTitle } from "./rough";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import rough from "roughjs";
import { useD3Network } from "./d3";
import { useTheme } from "next-themes";
import { StoreContext } from "../providers/store-provider";

const font = ZCOOL_KuaiLe({ weight: "400", subsets: ["latin"] });
function randColor(dark: boolean) {
  const colors = dark
    ? ["#5F6F52", "#A9B388", "#FEFAE0", "#B99470"]
    : ["#219C90", "#E9B824", "#EE9322", "#D83F31"];
  return colors[Math.floor(Math.random() * 4)];
}
export default function NetworkGraph({
  setEditingCharacterName,
  setEditingRelationName,
  setDrawerIsVisible,
  setModalIsVisible,
  setHoverCharacterName,
  width,
  height,
  forceRadius,
}: {
  setEditingCharacterName: (v: string | null) => void;
  setEditingRelationName: (v: string) => void;
  setDrawerIsVisible: (v: boolean) => void;
  setModalIsVisible: (v: boolean) => void;
  setHoverCharacterName: (v: string | null) => void;
  forceRadius: number;
  width: number;
  height: number;
}) {
  const { theme } = useTheme();
  const containerRef = useRef<SVGSVGElement | null>(null);
  // const [backgroundData, setBackgroundData] = useState<string | null>(null);
  const nodeRadius = width >= 768 ? 28 : 18;

  const { memo } = useContext(StoreContext);
  const metaNodes = useMemo(() => {
    return (
      memo.characters?.map((e) => ({
        data: {
          id: `${e.name}`,
          label: e.name,
          remark: e.remark || undefined,
          color: e.group?.color || "#000000",
        },
      })) || []
    );
  }, [memo]);

  const metaEdges = useMemo(() => {
    return (
      memo.relations?.map((e) => ({
        data: {
          id: `${e.name}`,
          label: e.name ?? "",
          source: `${e.source}`,
          target: `${e.target}`,
        },
      })) || []
    );
  }, [memo]);

  const { d3NodeData, d3EdgeData } = useD3Network({
    metaNodes: metaNodes,
    metaEdges: metaEdges,
    width: width,
    height: height,
    forceRadius: forceRadius,
  });

  const darkMode = theme === "dark";
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
    
    const roughNodes = d3NodeData.map((e) => {
      const node = createNode({
        rc,
        position: { x: e.x, y: e.y },
        radius: nodeRadius,
        color: metaNodes.find((ef) => ef.data.id === e.id)?.data.color ?? "",
        fontSize: 14,
        text: metaNodes.find((ef) => ef.data.id === e.id)?.data.label ?? "",
        onclick: (evt: MouseEvent) => {
          setEditingCharacterName(e.id);
          setDrawerIsVisible(true);
        },
        onmouseover: (evt: MouseEvent) => setHoverCharacterName(e.id),
        onmouseout: (evt: MouseEvent) => setHoverCharacterName(null),
      });

      return node;
    });
    containerRef.current?.append(...roughNodes);

    const roughLinks: SVGGElement[] = d3EdgeData.map((e) => {
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
        fontSize: 16,
        onclick: (evt: MouseEvent) => {
          setEditingRelationName(e.id);
          setModalIsVisible(true);
        },
      });
      return lines;
    });

    containerRef.current?.append(...roughLinks);

    const fontSize = width >= 678 ? 36 : 24;
    const ntitle = createTitle({
      content: memo.title,
      color: baseColor,
      fontSize: fontSize,
    });
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
    <svg
      id="download"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <style type="text/css">
        {`
    text {
      font-family: ${font.style.fontFamily};
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
            // href="/texture/paper-2.jpg"
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
  );
}
