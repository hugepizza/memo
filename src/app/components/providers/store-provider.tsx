import useLocalMemo from "@/app/localstore/memo";
import { Memo } from "@/app/tpyes/memo";
import { createContext, ReactNode, useEffect, useState } from "react";

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
  const { update, get, localMemo } = useLocalMemo();
  const [memo, setMemo] = useState<Memo>(m);

  // useEffect(() => {
  //   setMemo(get(memo.title)!);
  // }, [localMemo]);

  function updateMemo(memo: Memo) {
    update(memo);
    setMemo(memo);
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
