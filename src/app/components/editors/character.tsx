"use client";
import { useContext, useState } from "react";
import SaveButton, { DeleteButton, UpdateButton } from "../button";
import toast from "react-hot-toast";
import CharacterEditerContextProvider, {
  CharacterEditerContext,
} from "./character-context";
import { Character } from "@/app/tpyes/model";

export default function CharacterEditor({
  memoId,
  characters,
}: {
  memoId: string;
  characters: Character[];
}) {
  return (
    <CharacterEditerContextProvider memoId={memoId}>
      <div className="flex flex-row w-full justify-center items-center space-y-1 py-4">
        <div className="flex flex-col min-w-[60%] space-y-1 ">
          {characters?.map((c, index) => (
            <SingleCharacterEditor key={c.id} c={c} index={index} />
          ))}
        </div>
        <AddCharacter />
      </div>
    </CharacterEditerContextProvider>
  );
}

function AddCharacter() {
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const { memoId, isRequesting, addCharacter } = useContext(
    CharacterEditerContext
  );
  return (
    <div className="flex flex-col w-full justify-center items-center space-y-1">
      <input
        className="input bg-base-200"
        type="text"
        placeholder="name"
        value={name}
        onChange={(evt) => {
          setName(evt.currentTarget.value);
        }}
      />
      <textarea
        className="textarea textarea-lg bg-base-200"
        placeholder="remark"
        value={remark}
        onChange={(evt) => {
          setRemark(evt.currentTarget.value);
        }}
      />
      <SaveButton
        disable={isRequesting}
        action={() => {
          addCharacter(memoId, name, remark)
            .then(() => toast.success("Added!"))
            .catch((e) => toast.error("Added failed!"));
        }}
      ></SaveButton>
    </div>
  );
}

function SingleCharacterEditor({ c, index }: { c: Character; index: number }) {
  const { isRequesting, deleteCharacter, updateCharacter } = useContext(
    CharacterEditerContext
  );
  return (
    <div className="flex flex-row space-x-1">
      <div tabIndex={index} className="collapse bg-base-200 collapse-arrow">
        <div className="collapse-title text-xl font-medium">{c.name}</div>
        <div className="collapse-content">
          <p>{c.remark ?? "no remark"}</p>
        </div>
      </div>
      <DeleteButton
        disable={isRequesting}
        action={() => {
          deleteCharacter(c.id)
            .then(() => toast.success("Deleted!"))
            .catch((e) => {
              toast.error("Deleted failed!");
            });
        }}
      ></DeleteButton>
      <UpdateButton
        disable={isRequesting}
        action={() => {
          updateCharacter(c.id, "", "relation.targetCharacter.id")
            .then(() => toast.success("Updated!"))
            .catch((e) => toast.error("Updated failed!"));
        }}
      ></UpdateButton>
    </div>
  );
}
