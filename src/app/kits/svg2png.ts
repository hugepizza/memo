import { Canvg } from "canvg";

export async function svg2png(ele: HTMLElement, bgColor?: string) {
  if (!(ele instanceof SVGSVGElement)) {
    throw new Error("invalid svg element");
  }
  const desiredWidth = window.innerWidth * 1;
  const baseWidth = ele.width.baseVal.value;
  const baseHeight = ele.height.baseVal.value;
  const scaleFactor = desiredWidth / baseWidth;

  const canvas = document.createElement("canvas");
  canvas.width = baseWidth * scaleFactor;
  canvas.height = baseHeight * scaleFactor;
  const context = canvas.getContext("2d");
  if (context) {
    if (bgColor) {
      context.fillStyle = bgColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    const v = await Canvg.from(
      context,
      new XMLSerializer().serializeToString(ele),
      {
        ignoreClear: true,
        ignoreAnimation: true,
        ignoreMouse: true,
      }
    );
    await v.render();
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
  } else {
    throw new Error("invalid svg element");
  }
}
