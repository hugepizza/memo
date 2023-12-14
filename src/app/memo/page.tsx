"use client";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Search from "../components/navbar/search";
import "../globals.css";
import { RawMemo, Memo } from "../tpyes/memo";
import AddModal from "./add-modal";
import CoverModal from "./cover-modal";

import { atom, useAtom } from "jotai";
import DeleteModal from "./delete-modal";
import PullModal from "./pull-modal";
import { listLocalMemo } from "../localstore/memo";

const memo: Memo[] = listLocalMemo();
export const editingTitle = atom("");
export const editingCloud = atom(false);
export const localMemo = atom(memo);
export default function Page() {
  const [tab, setTab] = useState("Local");
  return (
    <div className="flex flex-col justify-center w-full space-y-2 px-2 sm:px-32">
      <div className="block sm:hidden">
        <Search />
      </div>
      <AddButton />
      <div role="tablist" className="tabs tabs-bordered">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Local"
          checked={tab === "Local"}
          onChange={(e) => setTab("Local")}
        />
        <div role="tabpanel" className="tab-content pt-10">
          <Local />
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Cloud"
          checked={tab === "Cloud"}
          onChange={(e) => setTab("Cloud")}
        />
        <div role="tabpanel" className="tab-content pt-10">
          <Cloud />
        </div>
      </div>
      <CoverModal />
      <DeleteModal />
      <PullModal />
    </div>
  );
}

function Local() {
  const [memo] = useAtom(localMemo);
  return (
    <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-4 w-full">
      {memo.map((ele) => (
        <MemoCard key={ele.title} memo={ele} />
      ))}
    </div>
  );
}

function Cloud() {
  const [pageIndex, setPageIndex] = useState(1);
  return (
    <div className="flex flex-col justify-center w-full">
      <MemoPage page={pageIndex} setPage={setPageIndex} />
    </div>
  );
}

function MemoPage({
  page,
  setPage,
}: {
  page: number;
  setPage: (page: number) => void;
}) {
  const [maxPage, setMaxPage] = useState(0);
  const pageSize = 8;
  const { data, isLoading } = useSWR(
    `/api/memo?pageSize=${pageSize}&page=${page}`,
    (url: string) =>
      fetch(url, { method: "GET" })
        .then((resp) => resp.json())
        .then((resp) => resp.data as { memo: Memo[]; count: number })
  );

  useEffect(() => {
    if (data) {
      setMaxPage(Math.ceil((data?.count ?? 0) / pageSize));
    }
  }, [data]);
  console.log("page", page);

  const pag = (
    <ReactPaginate
      previousLabel=<button className="join-item btn">{"<<"}</button>
      nextLabel=<button className="join-item btn">{">>"}</button>
      breakLabel="..."
      breakClassName="join-item btn"
      pageCount={maxPage}
      forcePage={page - 1}
      pageRangeDisplayed={5}
      containerClassName="join self-end"
      pageLinkClassName="join-item btn"
      activeLinkClassName="btn btn-disabled"
      onPageChange={(s) => {
        setPage(s.selected + 1);
      }}
      renderOnZeroPageCount={null}
    />
  );

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-4 w-full">
          <SkeletonGroup />
        </div>
        {pag}
      </>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-4 w-full">
        {data?.memo.map((ele) => (
          <MemoCard key={ele.title} cloud memo={ele} />
        ))}
      </div>
      {pag}
    </>
  );
}

function MemoCard({ memo, cloud }: { memo: Memo; cloud?: boolean }) {
  const [, setTitle] = useAtom(editingTitle);
  const [, setCloud] = useAtom(editingCloud);
  return (
    <div className="flex-grow h-96">
      <Link
        href={"/memo/" + memo.title + "/local" + "#graph"}
        onClick={(e) => {
          if (cloud) {
            e.preventDefault();
            setTitle(memo.title);
            (
              document.getElementById("pull_modal") as HTMLDialogElement
            ).showModal();
          }
        }}
      >
        {memo.cover ? (
          <figure className="w-full h-4/5 relative">
            <Image
              className="rounded-2xl"
              src={memo.cover || ""}
              alt={memo.title}
              layout="fill"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </figure>
        ) : (
          <div className="bg-gradient-to-br from-blue-500 to-red-500 flex w-full h-4/5 px-8 rounded-2xl justify-center items-center text-center bookCover">
            <span className="text-3xl font-semibold justify-center items-center">
              {memo.title}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-row items-center justify-between">
        <p className="truncate">{memo.title}</p>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="m-1 btn btn-sm btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {!cloud && (
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setTitle(memo.title);
                    (
                      document.getElementById(
                        "upload-modal"
                      ) as HTMLDialogElement
                    ).showModal();
                  }}
                >
                  Set Cover
                </a>
              </li>
            )}
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setCloud(cloud || false);
                  setTitle(memo.title);
                  (
                    document.getElementById("delete_modal") as HTMLDialogElement
                  ).showModal();
                }}
              >
                Delete
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SkeletonGroup() {
  const skeleton = (
    <div className="h-96">
      <div className="skeleton flex-grow h-4/5"></div>
      <div className="flex flex-col space-y-1 py-1 w-full h-1/5">
        <div className="skeleton w-4/5 grow"></div>
        <div className="skeleton w-4/6 grow"></div>
      </div>
    </div>
  );
  return (
    <>
      {skeleton}
      {skeleton}
      {skeleton}
      {skeleton}
    </>
  );
}

function AddButton() {
  return (
    <>
      <button
        className="btn"
        onClick={(e) => {
          e.preventDefault();
          (
            document.getElementById("custom_memo") as HTMLDialogElement
          ).showModal();
        }}
      >
        Add New MEMO
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
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <AddModal />
    </>
  );
}
