import { useAtom } from "jotai";
import { Memo } from "../tpyes/memo";
import { atomWithStorage } from "jotai/utils";

const localMemoAtom = atomWithStorage<Memo[]>("memos", []);

export default function useLocalMemo() {
  const [localMemo, setLocalMemo] = useAtom(localMemoAtom);
  function get(title: string) {
    return localMemo.find((e) => e.title === title) || null;
  }

  function update(memo: Memo) {
    const lm = get(memo.title);
    if (!lm) {
      throw new Error("memo not exists in local");
    }
    const after = localMemo.map((e) => {
      if (e.title === memo.title) {
        return memo;
      }
      return e;
    });
    setLocalMemo(after);
  }

  function create(title: string) {
    const lm = get(title);
    if (lm != null) {
      throw new Error("memo exists");
    }
    const memo: Memo = {
      title: title,
      characters: [],
      relations: [],
    };
    setLocalMemo(localMemo.concat(memo));
  }

  function delet(title: string) {
    const after = localMemo.filter((e) => e.title != title);
    setLocalMemo(after);
  }

  async function pull(title: string) {
    const resp = await fetch("/api/memo/" + title, { method: "GET" });
    if (!resp.ok) {
      throw resp.status;
    }
    const data = await resp.json();
    const memo = data.data.memo as Memo | null;
    if (!memo) {
      throw new Error("invalid memo content");
    }
    const existMemo = get(memo.title);
    if (existMemo) {
      update(memo);
    } else {
      setLocalMemo(localMemo.concat(memo));
    }
    return title;
  }

  async function push(title: string) {
    const lm = get(title);
    if (!lm) {
      throw new Error("memo not exists in local");
    }
    const body = {
      title: lm.title,
      cover: lm.cover,
      content: JSON.stringify(lm),
    };
    const resp = await fetch("/api/memo", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      throw resp.status;
    }
  }

  return {
    localMemo,
    get,
    update,
    create,
    delet,
    pull,
    push,
  };
}
