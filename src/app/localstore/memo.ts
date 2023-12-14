import exp from "constants";
import { Memo, RawMemo } from "../tpyes/memo";

export function listLocalMemo(): Memo[] {
  const data = localStorage.getItem("memos");
  if (!data) {
    return [];
  }
  const items = JSON.parse(data) as Memo[];
  if (!items) {
    return [];
  }
  return items;
}

export function getLocalMemo(title: string): Memo | null {
  const items = listLocalMemo();
  return items.find((e) => e.title === title) || null;
}

export function updateLocalMemo(memo: Memo) {
  const lm = getLocalMemo(memo.title);
  if (!lm) {
    throw new Error("memo not exists in local");
  }
  const items = listLocalMemo();
  const m = items.find((e) => e.title === memo.title);
  if (!m) {
    throw new Error("memo not exists in local");
  }
  const after = items.map((e) => {
    if (e.title === memo.title) {
      return memo;
    }
    return e;
  });
  localStorage.setItem("memos", JSON.stringify(after));
}

export function createLocalMemo(title: string) {
  const lm = getLocalMemo(title);
  if (lm != null) {
    throw new Error("memo exists");
  }
  const memo: Memo = {
    title: title,
    characters: [],
    relations: [],
  };
  const all = listLocalMemo();
  localStorage.setItem("memos", JSON.stringify(all.concat(memo)));
}

export function deleteLocalMemo(title: string) {
  const items = listLocalMemo();
  const after = items.filter((e) => e.title != title);
  localStorage.setItem("memos", JSON.stringify(after));
}

export async function push(title: string) {
  const lm = getLocalMemo(title);
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

export async function pull(title: string) {
  const resp = await fetch("/api/memo/" + title, { method: "GET" });
  if (!resp.ok) {
    throw resp.status;
  }
  const data = await resp.json();
  const memo = data.data.memo as Memo | null;
  if (!memo) {
    throw new Error("invalid memo content");
  }
  const existMemo = getLocalMemo(memo.title);
  if (existMemo) {
    updateLocalMemo(memo);
  } else {
    const all = listLocalMemo();
    localStorage.setItem("memos", JSON.stringify(all.concat(memo)));
  }
  return title;
}
