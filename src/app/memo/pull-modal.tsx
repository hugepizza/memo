"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { editingTitle } from "./page";
import { useAtom } from "jotai";
import useLocalMemo from "../localstore/memo";

export default function PullModal() {
  const [title] = useAtom(editingTitle);
  const router = useRouter();
  const { get, pull } = useLocalMemo();
  const m = get(title);
  return (
    <dialog id="pull_modal" className="modal">
      <div className="modal-box space-y-2">
        <h3 className="font-bold text-lg">
          {"Your're visiting a memo in cloud"}
        </h3>
        <h3>{"It will be pull to your device"}</h3>
        {m && (
          <p className="flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8 m-1"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {
              "It is existing in your device, data in your device will be overwritten by cloud data"
            }
          </p>
        )}
        <button
          className="btn btn-warning float-right"
          onClick={() => {
            toast
              .promise(pull(title), {
                success: "downloaded",
                loading: "downloading",
                error: (d) => d,
              })
              .then((t) => router.push("/memo/" + title));
          }}
        >
          Confirm
        </button>
        <div className="modal-action">
          <form method="dialog">
            <div className="space-x-2"></div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
