import { Canvg } from "canvg";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { StoreContext } from "../providers/store-provider";
import toast from "react-hot-toast";
import useLocalMemo from "@/app/localstore/memo";
import { Memo } from "@/app/tpyes/memo";
import { useAtom } from "jotai";
import {
  drawerCharacterName,
  drawerIsVisible,
} from "../editors/character/drawer";
import { svg2png } from "@/app/kits/svg2png";
import { useTheme } from "next-themes";

export function Pannal({
  elememtId,
  forceRadius,
  setForceRadius,
}: {
  elememtId: string;
  forceRadius: number;
  setForceRadius: (r: number) => void;
}) {
  return (
    <>
      <div className="flex  space-y-1 flex-col w-10/12 sm:w-auto fixed bottom-10 left-1/2 transform -translate-x-1/2  z-[10] bg-base-200 px-6 py-4 rounded-3xl items-center">
        <div className="flex flex-row space-x-2 sm:space-x-6 ">
          <ForceRange
            forceRadius={forceRadius}
            setForceRadius={setForceRadius}
          />
          <>
            <Png elememtId={elememtId} />
            <Edit />
            <Cloud />
            <ShowJson />
            {/* <EditJson /> */}
          </>
        </div>
        <div className="flex flex-col space-y-1 text-xs text-base-content">
          <div>
            Hold <kbd className="kbd kbd-xs">Q</kbd> and click 2 nodes to create
            a link.
          </div>
          <div>
            Hold <kbd className="kbd kbd-xs">W</kbd> and click multiple nodes to
            set group.
          </div>
        </div>
      </div>
      <JsonModal />
      <JsonModifyModal />
    </>
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

function Png({ elememtId }: { elememtId: string }) {
  const { memo } = useContext(StoreContext);
  const downloadPNG = async (elememtId: string) => {
    const ele = document.getElementById(elememtId);
    if (!ele) {
      return;
    }
    const dataUrl = await svg2png(ele, "#ece3cb");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = memo.title + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => {
          downloadPNG(elememtId);
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
      <span className="text-xs text-neutral-500">PNG</span>
    </div>
  );
}

function Edit() {
  const [, setDrawerIsVisible] = useAtom(drawerIsVisible);
  const [, setDrawerCharacterName] = useAtom(drawerCharacterName);
  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => {
          setDrawerIsVisible(true);
          setDrawerCharacterName(null);
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
  const { push } = useLocalMemo();
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
function ShowJson({}: {}) {
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
        <span className="text-xs text-neutral-500">Json</span>
      </div>
    </>
  );
}

function EditJson({}: {}) {
  return (
    <>
      <div className="flex flex-col items-center space-y-1">
        <button
          className="btn btn-sm btn-ghost btn-circle"
          onClick={() =>
            (
              document.getElementById("modify_json") as HTMLDialogElement
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
              d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="text-xs text-neutral-500">Modify</span>
      </div>
    </>
  );
}

function JsonModal() {
  const { memo } = useContext(StoreContext);
  const jsonText = JSON.stringify(memo, null, 2);
  const linesArray = jsonText.split("\n");
  const codes = linesArray.map((e, i) => (
    <pre key={i} data-prefix={i}>
      <code>{e}</code>
    </pre>
  ));
  const [text, setText] = useState("copy");
  return (
    <dialog id="show_json" className="modal modal-middle">
      <div className="modal-box m-0 p-0 relative" style={{ padding: 0 }}>
        <button
          className="btn btn-neutral btn-xs absolute right-2 top-2 z-10"
          onClick={() => {
            navigator.clipboard.writeText(jsonText).then(() => {
              setText("copied");
            });
          }}
        >
          {text}
        </button>
        <div className="mockup-code">{codes}</div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function JsonModifyModal() {
  const { memo } = useContext(StoreContext);
  const { update } = useLocalMemo();
  const [text, setText] = useState(JSON.stringify(memo, null, 2));
  const [valid, setValid] = useState(true);
  return (
    <dialog id="modify_json" className="modal modal-middle">
      <div className="modal-box">
        <textarea
          className="textarea textarea-bordered overflow-y-auto w-full h-full min-h-[60vh]"
          value={text}
          onChange={(e) => {
            setText(e.currentTarget.value);
            setValid(true);
            try {
              const a = JSON.parse(e.currentTarget.value);
              if (!(a as Memo)) {
                throw 1;
              }
            } catch (error) {
              setValid(false);
            }
          }}
        ></textarea>
        <div className="modal-action">
          <button
            onClick={() => {
              setValid(true);
              try {
                const newMemo = JSON.parse(text);
                if (!(newMemo as Memo)) {
                  throw 1;
                }
                update(newMemo);
              } catch (error) {
                if (error === 1) {
                  toast.error("Invalid JSON");
                } else {
                  toast.error((error as any).toString());
                }
                return;
              }
              (
                document.getElementById("modify_json") as HTMLDialogElement
              ).close();
            }}
            className={`btn btn-md float-right ${!valid ? "btn-disabled" : ""}`}
          >
            {valid ? "Save" : "Invalid JSON"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
