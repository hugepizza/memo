"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useLocalMemo from "../localstore/memo";

export default function AddModal() {
  const { create } = useLocalMemo();
  const [title, setTitle] = useState("");
  const router = useRouter();

  return (
    <dialog id="custom_memo" className="modal modal-middle">
      <div className="modal-box space-y-2">
        <h3 className="font-bold text-lg">
          {"Hello! Your're creating a custom memo"}
        </h3>
        <input
          type="text"
          className="input bg-base-200 w-full"
          placeholder="custom memo name ..."
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value.trim())}
        ></input>
        <button
          className="btn float-right"
          onClick={() => {
            try {
              create(title);
              setTitle("");
              router.push("/memo/" + title);
            } catch (error) {
              toast.error((error as any).toString());
            }
          }}
        >
          Add
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
