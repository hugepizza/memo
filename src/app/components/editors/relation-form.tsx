import { useContext, useEffect, useState } from "react";
import "../../globals.css";
import useSWR from "swr";
import { Character } from "@/app/tpyes/model";
import { CharacterEditerContext } from "./character-context";
export function RelationForm({
  id,
  setIsVisible,
}: {
  id: string | null;
  setIsVisible: (v: boolean) => void;
}) {
  const {
    memoId,
    isRequesting,
    updateCharacter,
    deleteCharacter,
    addCharacter,
  } = useContext(CharacterEditerContext);

  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const { data } = useSWR("/api/relation/" + id, (url) => {
    if (!id) {
      setName("");
      setRemark("");
      return null;
    }
    return fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.character as Character)
      .catch((err) => {
        console.log(err);
      });
  });

  useEffect(() => {
    if (data) {
      setName(data.name);
      setRemark(data.remark ?? "");
    }
  }, [data]);

  return <>{id}</>;
}
