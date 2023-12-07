"use client";
import _ from "lodash";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { GoogleBook } from "../tpyes/model";
import logo from "../../../public/search-logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "./page.style.css";
import { number } from "zod";
import ReactPaginate from "react-paginate";

export default function Page() {
  const [kw, setKw] = useState("");
  const [debouncedValue] = useDebounce(kw, 300);
  const [page, setPage] = useState(1);

  const addMemo = async (googleBookId: string) => {
    const resp = await fetch("/api/memo", {
      method: "POST",
      body: JSON.stringify({ googleBookId }),
    });
    if (!resp.ok) {
      throw resp.status;
    }
    const data = await resp.json();
    if (data.error) {
      throw data.error.msg;
    }
    return data.data.memoId;
  };
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="flex flex-col justify-center items-center min-h-[300px] grow">
        <Image priority src={logo} alt="Logo" />
        <input
          className="input input-bordered focus:outline-none border-solid w-full"
          value={kw}
          onChange={(e) => {
            setKw(e.currentTarget.value);
          }}
        ></input>
        <p className="text-3xl">Add a new book to memo list.</p>
      </div>
      <SearchPage
        kw={debouncedValue}
        page={page}
        addMemo={addMemo}
        setPage={setPage}
      />
    </div>
  );
}

function SearchPage({
  kw,
  page,
  setPage,
  addMemo,
}: {
  kw: string;
  page: number;
  setPage: (page: number) => void;
  addMemo: (googleBookId: string) => Promise<string>;
}) {
  const [maxPage, setMaxPage] = useState(0);
  const { data, isLoading } = useSWR(
    `/api/google_books?kw=${kw || "Karamazov"}&page=${page}`,
    (url: string) =>
      fetch(url, { method: "GET" })
        .then((resp) => resp.json())
        .then((resp) => {
          return resp as { data: { books: GoogleBook[]; count: number } };
        })
  );

  useEffect(() => {
    if (data) {
      setMaxPage(Math.ceil((data?.data.count ?? 0) / 20));
    }
  }, [data]);
  if (isLoading) {
    return <></>;
  }
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

  return (
    <div className="flex justify-center flex-col items-center space-y-2">
      <div className="grid  gap-4 grid-cols-4">
        {data?.data.books?.map((ele) => (
          <BookCard key={ele.id} googleBook={ele} addMemo={addMemo} />
        ))}
      </div>
      {pag}
    </div>
  );
}

function BookCard({
  googleBook,
  addMemo,
}: {
  googleBook: GoogleBook;
  addMemo: (googleBookId: string) => Promise<string>;
}) {
  const router = useRouter();
  const [disable, setDisable] = useState(false);
  return (
    <div className="card w-72 shadow-md">
      <figure className="h-2/5">
        <img
          src={googleBook.volumeInfo.imageLinks?.smallThumbnail}
          alt={googleBook.volumeInfo.title}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{googleBook.volumeInfo.title}</h2>
        <p className="truncate">{googleBook.volumeInfo.description}</p>
        <div className="card-actions justify-end">
          {disable ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <button
              className={`btn btn-neutral ${disable ? "btn-disabled" : ""}`}
              onClick={() => {
                setDisable(true);
                addMemo(googleBook.id)
                  .then((id) => router.push("/memo/" + id))
                  .catch((error) => toast.error(error));
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
