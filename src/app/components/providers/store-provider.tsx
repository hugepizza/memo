import { getLocalMemo, updateLocalMemo } from "@/app/localstore/memo";
import { Memo } from "@/app/tpyes/memo";
import { createContext, ReactNode, useState } from "react";

interface StoreContextProps {
  memo: Memo;
  setMemo: (m: Memo) => void;
}
export const StoreContext = createContext<StoreContextProps>(
  {} as StoreContextProps
);

export default function StoreContextProvider({
  m,
  children,
}: {
  m: Memo;
  children: ReactNode;
}) {
  const [memo, setMemo] = useState<Memo>(m);

  function updateMemo(memo: Memo) {
    updateLocalMemo(memo);
    const newMemo = getLocalMemo(memo.title);
    if (!newMemo) {
      throw new Error("memo not exists in local");
    }
    setMemo(newMemo);
  }

  const contextValue = {
    memo: memo,
    setMemo: updateMemo,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}
