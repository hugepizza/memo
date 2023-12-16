const downloadSVG = async (elememtId: string) => {
  const ele = document.getElementById(elememtId);
  if (ele instanceof SVGSVGElement) {
    const downloadElement = ele as SVGSVGElement;
    const cloned = downloadElement.cloneNode(true) as SVGSVGElement;
    const images = cloned.getElementsByTagNameNS(
      "http://www.w3.org/2000/svg",
      "image"
    );

    const bgHandle = () =>
      new Promise(async (resolve) => {
        if (images.length > 0) {
          const href = images[0].getAttribute("href");
          if (href) {
            const bgBlob = await (await fetch(href)).blob();
            const reader = new FileReader();

            reader.onloadend = function () {
              if (typeof reader.result === "string") {
                const base64String = reader.result.split(",")[1];
                images[0].setAttribute(
                  "href",
                  "data:image/jpeg;base64," + base64String
                );
              }
              resolve(1);
            };
            reader.readAsDataURL(bgBlob);
          } else {
            resolve(1);
          }
        } else {
          resolve(1);
        }
      });

    await bgHandle();

    const svgString = new XMLSerializer().serializeToString(cloned);
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const dataUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "downloaded.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};
