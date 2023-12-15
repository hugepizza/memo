import { ReactNode, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import {
  SearchResultEmpty,
  SearchResultGroup,
  SearchResultItem,
  SearchResultLoading,
} from "./result";
import { Memo } from "@/app/tpyes/memo";

export default function Search() {
  return (
    <div className="form-control relative grow">
      <SearchInput />
    </div>
  );
}
function SearchInput() {
  const [kw, setKw] = useState("");
  const [debouncedWkValue] = useDebounce(kw, 100);
  const [suggestion, setSuggestion] = useState(false);
  const getKey = () => {
    return `/api/search/memo?kw=${debouncedWkValue.toLowerCase()}`;
  };
  const { data: results, isLoading } = useSWR(getKey(), (url: string) => {
    if (!debouncedWkValue) {
      return null;
    }
    return fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.memo as Memo[])
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
      <SearchResultItem key={ele.title} result={ele} />
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
          }
        }}
      ></input>
      {suggestion && g}
    </div>
  );
}
