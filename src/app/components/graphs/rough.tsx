/*
use rough.js and position to generate svg elements
 */

import { RoughSVG } from "roughjs/bin/svg";

function createNodeText({
  position,
  content,
  fontSize,
  spacing,
  color,
}: {
  position: { x: number; y: number };
  content: string;
  fontSize: number;
  spacing?: number;
  color?: string;
}) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", (position.x - (spacing ?? 0)).toString());
  text.setAttribute("y", (position.y - (spacing ?? 0)).toString());
  text.setAttribute("font-size", fontSize.toString());
  if (color) {
    text.setAttribute("fill", color);
  }
  text.textContent = content;
  return text;
}

export function createTitle({
  content,
  color,
  fontSize,
}: {
  content: string;
  fontSize: number;
  color?: string;
}) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", (fontSize / 2).toString());
  text.setAttribute("y", fontSize.toString());
  text.setAttribute("font-size", fontSize.toString());
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
  fontSize,
}: {
  position: { x1: number; y1: number; x2: number; y2: number };
  content: string;
  spacing?: number;
  color?: string;
  fontSize: number;
}) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const midX = (position.x1 + position.x2) / 2;
  const midY = (position.y1 + position.y2) / 2;

  text.setAttribute("x", (midX + (spacing ?? 0)).toString());
  text.setAttribute("y", midY.toString());
  text.setAttribute("z-index", "-1");
  text.setAttribute("font-size", fontSize.toString());
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
  fontSize,
  onclick,
  onmouseover,
  onmouseout,
}: {
  rc: RoughSVG;
  position: { x: number; y: number };
  radius: number;
  color: string;
  text: string;
  fontSize: number;
  onclick: (e: MouseEvent) => void;
  onmouseover: (e: MouseEvent) => void;
  onmouseout: (e: MouseEvent) => void;
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
    fontSize,
  });
  textEle.onmouseover = onmouseover;
  textEle.onmouseout = onmouseout;
  const f = document.createElementNS("http://www.w3.org/2000/svg", "g");
  f.setAttribute("x", position.x.toString());
  f.setAttribute("y", position.y.toString());
  f.onclick = onclick;
  f.appendChild(nodeEle);
  f.appendChild(textEle);

  return f;
}

export function createLine({
  rc,
  position,
  color,
  text,
  nodeRadius,
  fontSize,
  onclick,
}: {
  rc: RoughSVG;
  position: { x1: number; y1: number; x2: number; y2: number };
  color: string;
  text: string;
  nodeRadius: number;
  fontSize: number;
  onclick: (e: MouseEvent) => void;
}) {
  const lineEle = rc.line(position.x1, position.y1, position.x2, position.y2, {
    stroke: color,
    fill: color,
  });

  const textEle = createLineText({
    content: text,
    position: { ...position },
    spacing: nodeRadius / 10,
    color: color,
    fontSize,
  });
  const f = document.createElementNS("http://www.w3.org/2000/svg", "g");
  f.appendChild(lineEle);
  f.appendChild(textEle);
  f.setAttribute("z-index", "-1");
  f.onclick = onclick;
  return f;
}
