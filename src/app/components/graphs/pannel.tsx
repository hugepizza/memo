import { Canvg } from "canvg";
import { useContext } from "react";
import { useSession } from "next-auth/react";
import { StoreContext } from "../providers/store-provider";
import toast from "react-hot-toast";
import { push } from "@/app/localstore/memo";

export function Pannal({
  elememtId,
  setEditorIsVisible,
  setEditingCharacterName,
  forceRadius,
  setForceRadius,
}: {
  elememtId: string;
  setEditorIsVisible: (v: boolean) => void;
  setEditingCharacterName: (id: string | null) => void;
  forceRadius: number;
  setForceRadius: (r: number) => void;
}) {
  const { memo } = useContext(StoreContext);
  const session = useSession();
  // const isOwner = session.data?.user?.id === memo.userId;

  return (
    <div className="w-10/12 sm:w-auto fixed flex bottom-10 left-1/2 transform -translate-x-1/2 flex-row z-[10] space-x-6 bg-base-200 px-6 py-4 rounded-3xl items-center">
      <ForceRange forceRadius={forceRadius} setForceRadius={setForceRadius} />

      <>
        <Svg elememtId={elememtId} />{" "}
        <Edit
          setEditingCharacterName={setEditingCharacterName}
          setEditorIsVisible={setEditorIsVisible}
        />
        <Cloud />
        <Json />
      </>
    </div>
  );
}

function ForceRange({
  forceRadius,
  setForceRadius,
}: {
  forceRadius: number;
  setForceRadius: (r: number) => void;
}) {
  return (
    <div>
      <div className="flex flex-col items-center space-y-1">
        <div className="h-8 flex items-center">
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
        </div>
        <span className="text-xs text-neutral-500">Gap</span>
      </div>
    </div>
  );
}

function Svg({ elememtId }: { elememtId: string }) {
  const download = async (elememtId: string) => {
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
              console.log("href", href);
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

      // if (context) {
      //   context.scale(scaleFactor, scaleFactor);
      //   const v = await Canvg.from(
      //     context,
      //     new XMLSerializer().serializeToString(cloned)
      //   );
      //   v.start();
      //   const dataUrl = canvas.toDataURL("image/png");
      //   const downloadLink = document.createElement("a");
      //   downloadLink.href = dataUrl;
      //   downloadLink.download = "downloaded.png";
      //   document.body.appendChild(downloadLink);
      //   downloadLink.click();
      //   document.body.removeChild(downloadLink);
      // }

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
  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => {
          download(elememtId);
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
      <span className="text-xs text-neutral-500">SVG</span>
    </div>
  );
}

function Edit({
  setEditorIsVisible,
  setEditingCharacterName,
}: {
  setEditorIsVisible: (v: boolean) => void;
  setEditingCharacterName: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => {
          setEditorIsVisible(true);
          setEditingCharacterName(null);
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
      <span className="text-xs text-neutral-500">Add</span>
    </div>
  );
}

function Cloud({}: {}) {
  const session = useSession();
  const { memo } = useContext(StoreContext);
  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={async () => {
          if (!session.data?.user) {
            toast.error("need to log in");
          }
          toast.promise(push(memo?.title), {
            success: "uploaded",
            loading: "loading",
            error: (d) => d,
          });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <span className="text-xs text-neutral-500">Cloud</span>
    </div>
  );
}
function Json({}: {}) {
  const { memo } = useContext(StoreContext);
  return (
    <>
      <div className="flex flex-col items-center space-y-1">
        <button
          className="btn btn-sm btn-ghost btn-circle"
          onClick={() =>
            (
              document.getElementById("show_json") as HTMLDialogElement
            ).showModal()
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="text-xs text-neutral-500">JSON</span>
      </div>
      <dialog id="show_json" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">{JSON.stringify(memo)}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
