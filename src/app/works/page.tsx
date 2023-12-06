"use client";
import _ from "lodash";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import useSWR from "swr";
import { GoogleBook } from "../tpyes/model";
import logo from "../../../public/search-logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "./page.style.css";

export default function Page() {
  const [kw, setKw] = useState("");
  const [debouncedValue] = useDebounce(kw, 300);
  const { data } = useSWR(
    `/api/google_books?kw=${debouncedValue || "Karamazov"}`,
    (url: string) =>
      fetch(url, { method: "GET" })
        .then((resp) => resp.json())
        .then((resp) => resp.data.books as GoogleBook[])
  );

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
      <SearchResult books={data} addMemo={addMemo} />
    </div>
  );
}

function SearchResult({
  books,
  addMemo,
}: {
  books: GoogleBook[] | undefined;
  addMemo: (googleBookId: string) => Promise<string>;
}) {
  return (
    <div className="flex justify-center items-center">
      <div className="grid  gap-4 grid-cols-4">
        {books?.map((ele) => (
          <BookCard key={ele.id} googleBook={ele} addMemo={addMemo} />
        ))}
      </div>
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
    <div className="card w-72 shadow-xl">
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
