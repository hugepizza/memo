import { Memo } from "@/app/tpyes/memo";
import Link from "next/link";
import { ReactNode } from "react";

export function SearchResultGroup({ children }: { children: ReactNode }) {
  return (
    <ul
      tabIndex={0}
      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      {children}
    </ul>
  );
}

export function SearchResultItem({ result }: { result: Memo }) {
  return (
    <li className="flex flex-col text-left">
      <Link href={`/memo/${result.title}#graph`}>
        <div className="block">{result.title}</div>

        <div className="text-right">{result.characters.length} characters</div>
      </Link>
    </li>
  );
}

export function SearchResultEmpty() {
  return (
    <li>
      <a>{"no result"}</a>
    </li>
  );
}

export function SearchResultLoading() {
  return (
    <li>
      <a>{"loading"}</a>
    </li>
  );
}
