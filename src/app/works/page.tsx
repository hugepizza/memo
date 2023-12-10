"use client";
import _ from "lodash";
import { useDebounce } from "use-debounce";
import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { GoogleBook } from "../tpyes/model";
import logo from "../../../public/search-logo.svg";
import darkLogo from "../../../public/search-logo-dark.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "./page.style.css";
import ReactPaginate from "react-paginate";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  return (
    <div className="flex flex-col w-full h-auto px-2 sm:px-32">
      <div className="flex flex-col justify-center items-center  grow">
        <Image priority src={theme === "dark" ? darkLogo : logo} alt="Logo" />
        <input
          className="input input-bordered border-solid w-full"
          value={kw}
          placeholder="Find a book..."
          onChange={(e) => {
            setKw(e.currentTarget.value);
          }}
        ></input>
        <div
          className=" flex flex-row link-primary  items-center self-end"
          onClick={() => {
            (
              document.getElementById("custom_memo") as HTMLDialogElement
            ).showModal();
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
              d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
              clipRule="evenodd"
            />
          </svg>
          Or add a custom memo
        </div>
      </div>
      <SearchPage
        kw={debouncedValue}
        page={page}
        addMemo={addMemo}
        setPage={setPage}
      />
      <CustomModal />
      {/* Open the modal using document.getElementById('ID').showModal() method */}
    </div>
  );
}
function CustomModal() {
  const addCustomMemo = async (title: string, cover?: string) => {
    const resp = await fetch("/api/memo/custom", {
      method: "POST",
      body: JSON.stringify({ title, cover }),
      headers: { "Content-Type": "application/json " },
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
  const router = useRouter();
  const [title, setTitle] = useState("");
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

  return (
    <dialog id="custom_memo" className="modal">
      <div className="modal-box space-y-2">
        <h3 className="font-bold text-lg">
          {"Hello! Your're creating a custom memo"}
        </h3>
        <input
          type="text"
          className="input bg-base-200 w-full"
          placeholder="custom memo name ..."
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        ></input>
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
          className="btn "
          onClick={() => {
            toast
              .promise(addCustomMemo(title, ""), {
                loading: "creating memo...",
                success: "created!",
                error: (e) => e,
              })
              .then((id) => {
                router.push(`/memo/${id}#graph`);
              });
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
      <div className="grid sm:gap-4 sm:grid-cols-4 grid-cols-1">
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
    <div className="card shadow-md">
      <figure className="h-2/5 mt-2">
        <img
          src={
            googleBook.volumeInfo.imageLinks?.thumbnail ||
            googleBook.volumeInfo.imageLinks?.smallThumbnail
          }
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
