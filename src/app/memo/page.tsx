"use client";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Memo } from "../tpyes/model";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Search from "../components/navbar/search";
import "../globals.css";

export default function Page() {
  const [pageIndex, setPageIndex] = useState(1);

  return (
    <div className="flex flex-col justify-center w-full space-y-2 px-2 sm:px-32">
      <div className="block sm:hidden">
        <Search/>
      </div>
      <AddButton />
      <div className="flex flex-col justify-center w-full">
        <MemoPage page={pageIndex} setPage={setPageIndex} />
      </div>
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
          <MemoCard key={ele.id} memo={ele} />
        ))}
      </div>
      {pag}
    </>
  );
}

function MemoCard({ memo }: { memo: Memo }) {
  return (
    <Link className="flex-grow h-96" href={"/memo/" + memo.id + "#graph"}>
      {memo.works.thumbnail || memo.works.smallThumbnail ? (
        <figure className="w-full h-4/5 relative">
          <Image
            className="rounded-2xl"
            src={memo.works.thumbnail || memo.works.smallThumbnail || ""}
            alt={memo.works.title}
            layout="fill"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </figure>
      ) : (
        <div className="bg-gradient-to-br from-blue-500 to-red-500 flex w-full h-4/5 px-8 rounded-2xl justify-center items-center text-center bookCover">
          <span className="text-3xl font-semibold justify-center items-center">
            {memo.worksTitle}
          </span>
        </div>
      )}

      <p className="truncate">{memo.works.title}</p>
      <div className="flex flex-row justify-end space-x-2">
        <CharacterIcon count={memo.characters.length} />
        <RelationIcon count={memo.characterRelations.length} />
        <EventIcon count={memo.events.length} />
      </div>
    </Link>
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
    <Link href={"/works"} className="btn">
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
    </Link>
  );
}

function CharacterIcon({ count }: { count: number }) {
  if (count === 0) {
    return <></>;
  }
  return (
    <div className="lg:tooltip" data-tip={`${count} characters`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    </div>
  );
}

function RelationIcon({ count }: { count: number }) {
  if (count === 0) {
    return <></>;
  }
  return (
    <div className="lg:tooltip" data-tip={`${count} relations`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
    </div>
  );
}

function EventIcon({ count }: { count: number }) {
  if (count === 0) {
    return <></>;
  }
  return (
    <div className="lg:tooltip" data-tip={`${count} events`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    </div>
  );
}
