import { Character, Relation } from "@/app/tpyes/model";
import { createContext, ReactNode, useState } from "react";
import { useSWRConfig } from "swr";

interface RelationEditerContextProps {
  memoId: string;
  characters: Character[];
  relations: Relation[];
  addRelation: (
    memoId: string,
    sourceId: number,
    targetId: number,
    name: string
  ) => Promise<void>;
  updateRelation: (
    relationId: number,
    sourceId: number,
    targetId: number,
    name: string
  ) => Promise<void>;
  deleteRelation: (relationId: number) => Promise<void>;
  isRequesting: boolean;
}
export const EditerContext = createContext<RelationEditerContextProps>(
  {} as RelationEditerContextProps
);

export default function RelationEditerContextProvider({
  memoId,
  characters,
  relations,
  children,
}: {
  memoId: string;
  characters: Character[];
  relations: Relation[];
  children: ReactNode;
}) {
  const [isRequesting, setIsRequesting] = useState(false);
  const { mutate } = useSWRConfig();
  async function addRelation(
    memoId: string,
    sourceId: number,
    targetId: number,
    name: string
  ) {
    setIsRequesting(true);
    try {
      const resp = await fetch("/api/relation", {
        method: "POST",
        body: JSON.stringify({ name, memoId, sourceId, targetId }),
      });
      if (!resp.ok) {
        throw resp.status;
      }
      await mutate("/api/memo/" + memoId);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsRequesting(false);
    }
  }

  async function updateRelation(
    relationId: number,
    sourceId: number,
    targetId: number,
    name: string
  ) {
    setIsRequesting(true);
    try {
      const resp = await fetch("/api/relation/" + relationId.toString(), {
        method: "PUT",
        body: JSON.stringify({ name, relationId, sourceId, targetId }),
      });
      if (!resp.ok) {
        throw resp.status;
      }
      await mutate("/api/memo/" + memoId);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsRequesting(false);
    }
  }

  async function deleteRelation(relationId: number) {
    setIsRequesting(true);
    try {
      const resp = await fetch("/api/relation/" + relationId.toString(), {
        method: "DELETE",
      });
      if (!resp.ok) {
        throw resp.status;
      }
      await mutate("/api/memo/" + memoId);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsRequesting(false);
    }
  }

  const contextValue = {
    memoId,
    characters,
    relations,
    updateRelation,
    addRelation,
    deleteRelation,
    isRequesting,
  };

  return (
    <EditerContext.Provider value={contextValue}>
      {children}
    </EditerContext.Provider>
  );
}
