/*
use rough.js and position to generate svg elements
 */
import { ZCOOL_KuaiLe } from "next/font/google";
const font = ZCOOL_KuaiLe({ weight: "400", subsets: ["latin"] });
import { RoughSVG } from "roughjs/bin/svg";

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
  text.setAttribute("x", (position.x - (spacing ?? 0)).toString());
  text.setAttribute("y", (position.y - (spacing ?? 0)).toString());
  text.setAttribute("font-family", font.style.fontFamily);
  text.setAttribute("font-size", window.innerWidth >= 678 ? "18px" : "12px");
  if (color) {
    text.setAttribute("fill", color);
  }
  text.textContent = content;
  return text;
}

export function createTitle({
  content,
  color,
}: {
  content: string;
  color?: string;
}) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", "5");
  text.setAttribute("y", "24");
  text.setAttribute("font-family", font.style.fontFamily);
  text.setAttribute("font-size", window.innerWidth >= 678 ? "24px" : "16px");
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
  text.setAttribute("z-index", "-1");
  text.setAttribute("font-family", "Arial");
  text.setAttribute("font-size", window.innerWidth >= 678 ? "18px" : "12px");
  if (color) {
    text.setAttribute("fill", color);
  }
  text.textContent = content;
  return text;
}

export function createNode({
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
  f.setAttribute("abc", text);
  f.onclick = onclick;
  f.appendChild(nodeEle);
  f.appendChild(textEle);

  // const tooltip = document.createElement("div");
  // tooltip.setAttribute("className", "tooltip");
  // tooltip.setAttribute("data-tip", "12123");
  // tooltip.append(f);
  return f;
}

export function createLine({
  rc,
  position,
  color,
  text,
  nodeRadius,
  onclick,
}: {
  rc: RoughSVG;
  position: { x1: number; y1: number; x2: number; y2: number };
  color: string;
  text: string;
  nodeRadius: number;
  onclick: (e: MouseEvent) => void;
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
  f.onclick = onclick;
  return f;
}
