import { Prisma } from "@prisma/client";

export type RawMemo = Prisma.MemoGetPayload<{}>;

export function GetPayload(rawMemo: RawMemo) {
  let m: Memo;
  if (rawMemo.content) {
    const memo = JSON.parse(rawMemo.content?.toString() || "{}") as Memo;
    if (!memo) {
      throw new Error("invalid memo content");
    }
    m = memo;
  } else {
    m = {
      title: rawMemo.title,
      cover: rawMemo.cover || undefined,
      relations: [],
      characters: [],
    };
  }
  return m ? m : null;
}
export type Memo = {
  title: string;
  characters: Character[];
  relations: Relation[];
  cover?: string;
};

export type Character = {
  name: string;
  remark?: string;
  group?: {
    name: string;
    color: string;
  };
};

export type Relation = {
  id: string;
  source: string;
  target: string;
  name: string;
  remak?: string;
};
