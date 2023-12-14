"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createLocalMemo,
  deleteLocalMemo,
  listLocalMemo,
} from "../localstore/memo";
import toast from "react-hot-toast";
import { editingCloud, editingTitle, localMemo } from "./page";
import { useAtom } from "jotai";
import { useSWRConfig } from "swr";

export default function DeleteModal() {
  const { mutate } = useSWRConfig();

  const [title] = useAtom(editingTitle);
  const [cloud] = useAtom(editingCloud);
  const [, setMemo] = useAtom(localMemo);
  const deleteLocal = () => {
    try {
      deleteLocalMemo(title);
      toast.success("deleted!");
      (document.getElementById("delete_modal") as HTMLDialogElement).close();
      setMemo(listLocalMemo);
    } catch (error) {
      toast.error((error as any).toString());
    }
  };
  const deleteCloud = () => {
    toast
      .promise(fetch("/api/memo/" + title, { method: "DELETE" }), {
        loading: "deleting...",
        success: "deleted!",
        error: (e) => e,
      })
      .then(() =>
        (document.getElementById("delete_modal") as HTMLDialogElement).close()
      )
      .then(() => {
        mutate(
          (key) =>
            typeof key === "string" && key.startsWith("/api/memo?pageSize=")
        );
      });
  };
  return (
    <dialog id="delete_modal" className="modal">
      <div className="modal-box space-y-2">
        <h3 className="font-bold text-lg">
          {`Your're deleting memo ${cloud ? "in cloud " : ""}: ${title}`}
        </h3>
        <button
          className="btn btn-warning float-right"
          onClick={() => {
            cloud ? deleteCloud() : deleteLocal();
          }}
        >
          Delete
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
