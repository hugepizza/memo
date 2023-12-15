import { useContext, useEffect, useState } from "react";
import { AddButton, DeleteButton, UpdateButton } from "../../button";
import { StoreContext } from "../../providers/store-provider";
import { Character } from "@/app/tpyes/memo";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { useAtom } from "jotai";
import { drawerCharacterName, drawerIsVisible } from "./drawer";
import { produce } from "immer";
export function CharacterForm({}: {}) {
  const group = [
    { color: "#000000" },
    { color: "#F97B22" },
    { color: "#F1C27B" },
    { color: "#711DB0" },
    { color: "#A2CDB0" },
    { color: "#85A389" },
    { color: "#001B79" },
    { color: "#FF4B91" },
    { color: "#FFCD4B" },
  ];

  // character name when open the drawer
  const [characterName, setCharacterName] = useAtom(drawerCharacterName);
  const [, setIsVisible] = useAtom(drawerIsVisible);
  const [newName, setNewName] = useState(characterName || "");
  const [newRemark, setNewRemark] = useState("");

  const { memo, setMemo } = useContext(StoreContext);
  const [newColor, setNewColor] = useState(group[0].color);
  useEffect(() => {
    if (characterName) {
      const character = memo.characters.findLast(
        (e) => e.name === characterName
      );
      if (character) {
        setNewName(character.name);
        setNewRemark(character.remark ?? "");
        setNewColor(character.group?.color ?? "");
      }
    } else {
      setNewName("");
      setNewRemark("");
      setNewColor("");
    }
  }, [memo, characterName]);

  // save on change
  useEffect(() => {
    if (characterName) {
      const newMemo = produce(memo, (draft) => {
        draft.characters.forEach((ele) => {
          if (ele.name === characterName) {
            ele.remark = newName;
            if (!ele.group) {
              ele.group = { name: "", color: newColor };
            } else {
              ele.group.color = newColor;
            }
          }
        });
      });
      setMemo(newMemo);
    }
  }, [newRemark, newColor]);

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <div className="flex flex-col space-y-2">
          <p className="text-2xl">
            {characterName}
            {characterName && (
              <div className="float-right">
                <DeleteButton
                  disable={false}
                  action={() => {
                    const ch = memo.characters.filter(
                      (e) => e.name != characterName
                    );
                    setMemo({
                      ...memo,
                      characters: ch,
                    });
                    toast.success("success");
                    setIsVisible(false);
                    setCharacterName(null);
                  }}
                />
              </div>
            )}
          </p>
          <div className="divider">Character Infomation</div>
          <div className="w-full relative flex items-center">
            <input
              type="text"
              className="input bg-base-200 w-full"
              placeholder={characterName ? "" : "new character name"}
              value={newName}
              onChange={(e) => setNewName(e.currentTarget.value)}
            ></input>
            <button
              className={`btn btn-sm  absolute right-1 self-center ${
                characterName === newName || !newName ? "btn-disabled" : ""
              }`}
              onClick={() => {
                const newMemo = produce(memo, (draft) => {
                  draft.characters.forEach((ele) => {
                    if (ele.name === characterName) {
                      ele.name = newName;
                    }
                  });
                  draft.relations.forEach((ele) => {
                    if (ele.source === characterName) {
                      ele.source = newName;
                    }
                    if (ele.target === characterName) {
                      ele.target = newName;
                    }
                  });
                });
                setMemo(newMemo);
                setCharacterName(newName);
              }}
            >
              save
            </button>
          </div>
          <textarea
            className="textarea bg-base-200"
            value={newRemark}
            placeholder="add remark here..."
            onChange={(e) => setNewRemark(e.currentTarget.value)}
          ></textarea>
        </div>
        <div className="flex flex-wrap sm:space-x-2 space-x-1 items-center">
          {group.map((ele) => (
            <div key={ele.color} className="flex flex-col items-center">
              <button
                className={`btn btn-xs btn-square`}
                style={{ background: ele.color }}
                onClick={() => setNewColor(ele.color)}
              >
                {ele.color === newColor ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="gray"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  ""
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2 justify-end">
          {newName && !characterName && (
            <button
              className={`btn`}
              onClick={() => {
                const c: Character = {
                  name: newName,
                  remark: newRemark,
                  group: { name: "", color: newColor },
                };
                const ch = memo.characters.concat(c);
                setMemo({ ...memo, characters: ch });
              }}
            >
              Save
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="divider">Relations</div>
        {characterName && (
          <RelationList characterName={characterName}></RelationList>
        )}
      </div>
    </div>
  );
}

function RelationList({ characterName }: { characterName: string }) {
  const { memo } = useContext(StoreContext);
  const relations = memo.relations?.filter((e) => e.source === characterName);
  const r = relations?.map((e) => (
    <ReationUpdate
      key={e.id}
      characterName={characterName}
      relationId={e.id}
    ></ReationUpdate>
  ));
  return (
    <div className="flex flex-col space-y-2">
      {r}
      <ReationUpdate
        characterName={characterName}
        relationId={null}
      ></ReationUpdate>
    </div>
  );
}

function ReationUpdate({
  characterName,
  relationId,
}: {
  characterName: string;
  relationId: string | null;
}) {
  const { memo, setMemo } = useContext(StoreContext);
  const [selectedCharacterName, setSelectedCharacterName] = useState<
    string | null
  >(null);
  const relation = memo.relations.find((e) => e.id === relationId);
  const [newRelationName, setNewRelationName] = useState(relation?.name);
  const [debouncedNewRelationName] = useDebounce(newRelationName, 500);
  useEffect(() => {
    if (relationId && selectedCharacterName) {
      const re = memo.relations.map((e) => {
        if (e.id === relationId) {
          return {
            ...e,
            target: selectedCharacterName,
            name: debouncedNewRelationName!,
          };
        }
        return e;
      });
      setMemo({ ...memo, relations: re });
    }
  }, [debouncedNewRelationName, selectedCharacterName]);

  const oldTarget = relation?.target || "";

  const related = memo.relations
    .filter((e) => e.source === characterName)
    .map((e) => e.target);

  const characters = memo.characters
    .filter((e) => e.name != characterName)
    .filter((e) => related.find((a) => a === e.name) === undefined)
    .map((e) => e.name);

  // .concat(oldTarget);
  const selector = (
    <label className="form-control">
      <select
        className="select select-sm"
        onChange={(e) => setSelectedCharacterName(e.currentTarget.value)}
        defaultValue={relation ? oldTarget : "choose"}
      >
        <option>{relation ? oldTarget : "choose"}</option>
        {characters.map((e) => (
          <option value={e} key={e}>
            {e}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-wrap space-x-4 justify-between grow">
        <div className="flex flex-wrap space-x-4 ">
          <span className="badge badge-lg badge-neutral">{characterName}</span>
          <input
            type="text"
            className="input input-sm"
            placeholder="enter relationship"
            value={newRelationName}
            onChange={(e) => setNewRelationName(e.currentTarget.value)}
          ></input>
        </div>
        <div className="flex  space-x-4 items-center flex-wrap">{selector}</div>
      </div>
      <div className="space-x-1">
        {relation ? (
          <>
            <DeleteButton
              action={() => {
                const re = memo.relations.filter((e) => e.id === relationId);
                setMemo({ ...memo, relations: re });
              }}
              disable={false}
            ></DeleteButton>
          </>
        ) : (
          <>
            <AddButton
              disable={false}
              action={() => {
                if (!newRelationName || !selectedCharacterName) {
                  return;
                }
                const re = memo.relations.concat({
                  id: new Date().getTime().toString(),
                  name: newRelationName,
                  target: selectedCharacterName,
                  source: characterName,
                });
                setMemo({ ...memo, relations: re });
              }}
            ></AddButton>
            <DeleteButton action={() => {}} disable={true}></DeleteButton>
          </>
        )}
      </div>
    </div>
  );
}
