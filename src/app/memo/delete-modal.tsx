"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import toast from "react-hot-toast";
import { editingCloud, editingTitle } from "./page";
import { useAtom } from "jotai";
import { useSWRConfig } from "swr";
import useLocalMemo from "../localstore/memo";

export default function DeleteModal() {
  const { mutate } = useSWRConfig();
  const { delet } = useLocalMemo();

  const [title] = useAtom(editingTitle);
  const [cloud] = useAtom(editingCloud);
  const deleteLocal = () => {
    try {
      delet(title);
      toast.success("deleted!");
      (document.getElementById("delete_modal") as HTMLDialogElement).close();
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
    <dialog id="delete_modal" className="modal ">
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
