import { ReactNode, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { Memo, SearchMode } from "../../../tpyes/model";
import { MemoSearchResult } from "@/app/tpyes/api";
import { result } from "lodash";
import {
  SearchResultEmpty,
  SearchResultGroup,
  SearchResultItem,
  SearchResultLoading,
} from "./result";

export default function Search() {
  const [mode, setMode] = useState<SearchMode>("books");

  return (
    <div className="form-control relative grow">
      <ModeSwitchGroup
        on="books"
        off="character"
        mode={mode}
        setMode={(mode: SearchMode) => setMode(mode)}
      />
      <SearchInput mode={mode} />
    </div>
  );
}
function SearchInput({ mode }: { mode: SearchMode }) {
  const [kw, setKw] = useState("");
  const [debouncedWkValue] = useDebounce(kw, 100);
  const [suggestion, setSuggestion] = useState(false);
  const getKey = () => {
    return `/api/search/memo?kw=${debouncedWkValue.toLowerCase()}&mode=${mode}`;
  };
  const { data: results, isLoading } = useSWR(getKey(), (url: string) => {
    if (!debouncedWkValue) {
      return null;
    }
    return fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.memo as MemoSearchResult[])
      .then((resp) => {
        if (resp.length > 0) {
          setSuggestion(true);
        }
        return resp;
      });
  });

  let resultItems: React.ReactNode = <SearchResultEmpty />;
  if (isLoading) {
    resultItems = <SearchResultLoading />;
  } else if (results && results.length > 0) {
    resultItems = results.map((ele) => (
      <SearchResultItem key={ele.memoId} result={ele} mode={mode} />
    ));
  }
  const g = <SearchResultGroup>{resultItems}</SearchResultGroup>;
  let blurTimeoutId: NodeJS.Timeout;
  return (
    <div className="dropdown w-full">
      <input
        placeholder={"Search Memo By"}
        type="text"
        className="input bg-base-200 w-full"
        value={kw}
        onFocus={() => {
          if (kw.trim()) setSuggestion(true);
        }}
        onBlur={() => {
          blurTimeoutId = setTimeout(() => {
            setSuggestion(false);
          }, 200);
        }}
        onChange={(e) => {
          if (e.currentTarget.value.trim() != "") {
            setSuggestion(true);
          }
          setKw(e.currentTarget.value);
          if (e.currentTarget.value === "") {
            setSuggestion(false);
            return;
          } else {
            console.log(e.currentTarget.value);
          }
        }}
      ></input>
      {suggestion && g}
    </div>
  );
}

function ModeSwitchGroup({
  on,
  off,
  mode,
  setMode,
}: {
  on: SearchMode;
  off: SearchMode;
  mode: SearchMode;
  setMode: (mode: SearchMode) => void;
}) {
  return (
    <div className="z-10 absolute inset-y-0 right-0 flex items-center pr-3">
      <label className="swap">
        <input
          type="checkbox"
          defaultChecked={true}
          onChange={(e) => setMode(e.currentTarget.checked ? on : off)}
        />
        <div className="btn hover:bg-inherit hover:border-none hover:shadow-inherit btn-sm swap-on">
          {on}
        </div>
        <div className="btn hover:bg-inherit hover:border-none hover:shadow-inherit btn-sm swap-off">
          {off}
        </div>
      </label>
    </div>
  );
}
