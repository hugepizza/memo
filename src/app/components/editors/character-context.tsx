import { Character, Memo, Relation } from "@/app/tpyes/model";
import { createContext, ReactNode, useState } from "react";
import { useSWRConfig } from "swr";

interface CharacterEditerContextProps {
  memoId: string;
  memo: Memo;
  addCharacter: (memoId: string, name: string, remark: string) => Promise<void>;
  updateCharacter: (
    characterId: number,
    name: string,
    remark: string
  ) => Promise<void>;
  deleteCharacter: (characterId: number) => Promise<void>;
  isRequesting: boolean;
}
export const CharacterEditerContext =
  createContext<CharacterEditerContextProps>({} as CharacterEditerContextProps);

export default function CharacterEditerContextProvider({
  memoId,
  memo,
  children,
}: {
  memoId: string;
  memo: Memo;
  children: ReactNode;
}) {
  const [isRequesting, setIsRequesting] = useState(false);
  const { mutate } = useSWRConfig();
  async function addCharacter(memoId: string, name: string, remark: string) {
    setIsRequesting(true);
    try {
      const resp = await fetch("/api/character", {
        method: "POST",
        body: JSON.stringify({ name, memoId, remark }),
      });
      if (!resp.ok) {
        throw resp.status;
      }
      await mutate("/api/memo/" + memoId);
    } catch (err) {
      throw err;
    } finally {
      setIsRequesting(false);
    }
  }

  async function updateCharacter(
    characterId: number,
    name: string,
    remark: string
  ) {
    setIsRequesting(true);
    try {
      const resp = await fetch("/api/character/" + characterId.toString(), {
        method: "PUT",
        body: JSON.stringify({ name, characterId, remark }),
      });
      if (!resp.ok) {
        throw resp.status;
      }
      await mutate("/api/memo/" + memoId);
      await mutate("/api/character/" + characterId);
    } catch (err) {
      throw err;
    } finally {
      setIsRequesting(false);
    }
  }

  async function deleteCharacter(characterId: number) {
    setIsRequesting(true);
    try {
      const resp = await fetch("/api/character/" + characterId.toString(), {
        method: "DELETE",
      });
      if (!resp.ok) {
        throw resp.status;
      }
      await mutate("/api/memo/" + memoId);
    } catch (err) {
      throw err;
    } finally {
      setIsRequesting(false);
    }
  }

  const contextValue = {
    memoId,
    memo,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    isRequesting,
  };

  return (
    <CharacterEditerContext.Provider value={contextValue}>
      {children}
    </CharacterEditerContext.Provider>
  );
}
