"use client";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  getLocalMemo,
  listLocalMemo,
  updateLocalMemo,
} from "../localstore/memo";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { editingTitle, localMemo } from "./page";

export default function CoverModal() {
  const [title] = useAtom(editingTitle);
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    if (file && !isValidFileType(file)) {
      toast.error("Only JPEG and PNG formats are supported.");
    }
    if (file && file.size > 4 * 1024 * 1024) {
      toast.error("Maximum file size for uploads is 4MB.");
    }
    setFile(file);
  };

  const isValidFileType = (file: File) => {
    const allowedFileTypes = ["image/jpeg", "image/png"];
    return allowedFileTypes.includes(file.type);
  };
  const [, setMemo] = useAtom(localMemo);
  return (
    <dialog id="upload-modal" className="modal">
      <div className="modal-box space-y-2">
        <h3 className="font-bold text-lg">
          {"Hello! Your're uploading cover image for: " + title}
        </h3>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              {"Choose a cover image (.jpg/.png, < 4MB)."}
            </span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={handleFileChange}
          />
          <div className="label"></div>
        </label>
        <button
          className="btn float-right"
          onClick={() => {
            if (!title) {
              return;
            }
            const memo = getLocalMemo(title);
            if (!memo) {
              return;
            }
            const run = async () => {
              let url = "";
              if (file) {
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const resp = await fetch("/api/kit/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const res = await resp.json();
                  url = res.data.url;
                } catch (error) {
                  throw error;
                }
              }
              return url;
            };
            toast
              .promise(run(), {
                loading: "uploading...",
                success: "uploaded!",
                error: (e) => e,
              })
              .then((url) => {
                if (url) {
                  memo.cover = url;
                  updateLocalMemo(memo);
                  (
                    document.getElementById("upload-modal") as HTMLDialogElement
                  ).close();
                  setMemo(listLocalMemo);
                }
              });
          }}
        >
          Upload
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
