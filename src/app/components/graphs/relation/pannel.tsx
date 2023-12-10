import { Canvg } from "canvg";
import { MutableRefObject } from "react";

export function Pannal({
  downloadElementRef,
  setEditorIsVisible,
  setEditingCharacterId,
  forceRadius,
  setForceRadius,
}: {
  downloadElementRef: MutableRefObject<SVGSVGElement | null>;
  setEditorIsVisible: (v: boolean) => void;
  setEditingCharacterId: (id: string | null) => void;
  forceRadius: number;
  setForceRadius: (r: number) => void;
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
    <div className="w-10/12 sm:w-auto fixed flex bottom-10 left-1/2 transform -translate-x-1/2 flex-row z-[10] space-x-6 bg-base-200 px-6 py-4 rounded-3xl items-center">
      <div>
        <div className="flex flex-col items-center space-y-1">
          <input
            type="range"
            min={20}
            max={100}
            value={forceRadius}
            className="range range-xs"
            step="20"
            onChange={(e) =>
              setForceRadius(parseInt(e.currentTarget.value, 10))
            }
          />
          <span className="text-xs text-neutral-500">Gap</span>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1">
        <button
          className="btn btn-sm btn-ghost btn-circle"
          onClick={() => {
            setEditorIsVisible(true);
            setEditingCharacterId(null);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
        </button>
        <span className="text-xs text-neutral-500">Edit</span>
      </div>
      <div className="flex flex-col items-center space-y-1">
        <button
          className="btn btn-sm btn-ghost btn-circle"
          onClick={() => {
            download();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 011.114 1.004l-3.25 3.5a.75.75 0 01-1.114 0l-3.25-3.5a.75.75 0 111.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 00-1.5 0V7h-3A2.25 2.25 0 004 9.25v7.5A2.25 2.25 0 006.25 19h7.5A2.25 2.25 0 0016 16.75v-7.5A2.25 2.25 0 0013.75 7z" />
          </svg>
        </button>
        <span className="text-xs text-neutral-500">Download</span>
      </div>
    </div>
  );
}