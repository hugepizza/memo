function createTexture({}: {}) {
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

  //   containerRef.current?.append(defs);
  //   containerRef.current?.append(bg);
}

export function createImgBackground({ url }: { url: string }) {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  const pattern = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  pattern.setAttribute("id", "background");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("height", "100%");
  pattern.setAttribute("width", "100%");

  const image = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  image.setAttribute("href", url);
  image.setAttribute("height", "100%");
  image.setAttribute("width", "100%");

  pattern.append(image);
  defs.append(pattern);
  return defs;
}

export function createBackgroundRect() {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("height", "100%");
  rect.setAttribute("width", "100%");
  rect.setAttribute("fill", "url(#background)");
  return rect;
}
