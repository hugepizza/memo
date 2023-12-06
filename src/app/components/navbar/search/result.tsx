import { MemoSearchResult } from "@/app/tpyes/api";
import { SearchMode } from "@/app/tpyes/model";
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

export function SearchResultItem({
  result,
  mode,
}: {
  result: MemoSearchResult;
  mode: SearchMode;
}) {
  return (
    <li className="flex flex-col text-left">
      <Link href={"/memo/" + result.memoId}>
        <div className="block">{result.kwTitle}</div>
        {mode === "works" && (
          <div className="text-right">{result.charactersCount} characters</div>
        )}
        {mode === "character" && (
          <div className="text-right">from works {result.worksTitle}</div>
        )}
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
