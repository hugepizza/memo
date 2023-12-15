import { createElement, useEffect, useState } from "react";
import { MetaEdge, MetaNode } from ".";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
} from "d3";
import { useDebounce } from "use-debounce";

type D3Node = any;
type D3Link = any;
type NodeData = { id: string; x: number; y: number };
type LinkData = {
  id: string;
  source: { x: number; y: number };
  target: { x: number; y: number };
};

export function useD3Network({
  width,
  height,
  metaNodes,
  metaEdges,
  forceRadius,
}: {
  width: number;
  height: number;
  metaNodes: MetaNode[];
  metaEdges: MetaEdge[];
  forceRadius?: number;
}) {
  const [ndata, setNdata] = useState<NodeData[]>([]);
  const [ldata, setLdata] = useState<LinkData[]>([]);

  useEffect(() => {
    const nodes: D3Node[] = metaNodes.map((e, i) => ({
      index: i,
      id: e.data.id,
      group: e.data.color,
    }));
    const links: D3Link[] = metaEdges
      .map((e, i) => {
        const source = nodes.findLast((n) => e.data.source === n.id);
        const target = nodes.findLast((n) => e.data.target === n.id);
        if (!(source && target)) {
          return;
        }
        return {
          id: e.data.id,
          source: source!.id,
          target: target!.id,
          index: i,
        };
      })
      .filter((e) => e !== undefined);
    const container = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    container.setAttribute("height", height.toString());
    container.setAttribute("width", width.toString());

    const svg = select(container)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; max-height: 100%;");

    const linkEles = svg.append("g").selectAll().data(links).join("line");

    const nodeEles = svg
      .append("g")
      .selectAll()
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .data(nodes)
      .join("circle")
      .attr("r", 5);

    function ticked() {
      nodeEles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      linkEles
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      setNdata(nodeEles.data().map((e) => ({ id: e.id, x: e.x, y: e.y })));
      setLdata(
        linkEles.data().map((e) => ({
          id: e.id,
          source: { ...e.source },
          target: { ...e.target },
        }))
      );
    }

    // Add a drag behavior.
    // function dragstarted(event: any) {
    //   if (!event.active) simulation.alphaTarget(0.3).restart();
    //   event.subject.fx = event.subject.x;
    //   event.subject.fy = event.subject.y;
    // }
    // function dragged(event: any) {
    //   event.subject.fx = event.x;
    //   event.subject.fy = event.y;
    // }
    // function dragended(event: any) {
    //   if (!event.active) simulation.alphaTarget(0);
    //   event.subject.fx = null;
    //   event.subject.fy = null;
    // }

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink(links).id((d: any) => d.id)
      )
      .force("charge", forceManyBody())
      .force("collide", forceCollide().radius(forceRadius ?? 70)) // 调整 radius 的值
      .force("x", forceX().strength(0.1).x(width))
      .force("y", forceY().strength(0.1).y(height))
      .force("center", forceCenter(width / 2, height / 2))
      // .alphaDecay(0.1)
      .on("tick", ticked)
      .on("end", () => {});
    simulation.alphaMin(0.1);
  }, [width, height, metaEdges, metaNodes, forceRadius]);
  return { d3NodeData: ndata, d3EdgeData: ldata };
}
