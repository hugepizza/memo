import { Canvg } from "canvg";
import { MutableRefObject } from "react";

export function Pannal({
  downloadElementRef,
  setEditorIsVisible,
  setEditingCharacterId,
}: {
  downloadElementRef: MutableRefObject<SVGSVGElement | null>;
  setEditorIsVisible: (v: boolean) => void;
  setEditingCharacterId: (id: string | null) => void;
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
            setEditorIsVisible(true);
            setEditingCharacterId(null);
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
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
