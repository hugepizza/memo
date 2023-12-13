import { useContext, useEffect, useState } from "react";
import { Relation } from "@/app/tpyes/model";
import toast from "react-hot-toast";
import { CharacterEditerContext } from "../../providers/character-provider";
import { AddButton, DeleteButton, UpdateButton } from "../../button";
import { RelationEditerContext } from "../../providers/relation-provider";
import { set } from "lodash";
export function CharacterForm({
  id,
  setIsVisible,
}: {
  id: string | null;
  setIsVisible: (v: boolean) => void;
}) {
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
  const {
    memoId,
    isRequesting,
    updateCharacter,
    deleteCharacter,
    addCharacter,
  } = useContext(CharacterEditerContext);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const { memo } = useContext(CharacterEditerContext);
  const [color, setColor] = useState(group[0].color);
  useEffect(() => {
    if (id) {
      const character = memo.characters.findLast(
        (e) => e.id === parseInt(id, 10)
      );
      if (character) {
        setName(character.name);
        setRemark(character.remark ?? "");
        setColor(character.group ?? "");
      }
    } else {
      setName("");
      setRemark("");
      setColor("");
    }
  }, [memo, id]);

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <div className="flex flex-col space-y-2">
          <p className="text-2xl">{name}</p>
          <div className="divider">Character Infomation</div>

          <input
            type="text"
            className="input bg-base-200"
            placeholder={id ? "" : "new character name"}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          ></input>
          <textarea
            className="textarea bg-base-200"
            value={remark}
            placeholder="add remark here..."
            onChange={(e) => setRemark(e.currentTarget.value)}
          ></textarea>
        </div>
        <div className="flex flex-wrap sm:space-x-2 space-x-1 items-center">
          {group.map((ele) => (
            <div key={ele.color} className="flex flex-col items-center">
              <button
                className={`btn btn-xs btn-square`}
                style={{ background: ele.color }}
                onClick={() => setColor(ele.color)}
              >
                {ele.color === color ? (
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
          {id && (
            <button
              className={`btn ${isRequesting ? "btn-disabled" : "btn-warning"}`}
              onClick={() => {
                deleteCharacter(parseInt(id, 10))
                  .then(() => toast.success("Deleted!"))
                  .then(() => setIsVisible(false))
                  .catch((e) => toast.error("Deleted failed!"));
              }}
            >
              Delete
            </button>
          )}
          <button
            className={`btn ${isRequesting ? "btn-disabled" : ""}`}
            onClick={() => {
              (!id
                ? addCharacter(memoId, name, remark, color)
                : updateCharacter(parseInt(id, 10), name, remark, color)
              )
                .then(() => toast.success("Saved!"))
                .then(() => setIsVisible(false))
                .catch((e) => toast.error("Saved failed!"));
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="divider">Relations</div>
        {id && <RelationList characterId={id}></RelationList>}
      </div>
    </div>
  );
}

function RelationList({ characterId }: { characterId: string }) {
  const { memo } = useContext(RelationEditerContext);
  const id = parseInt(characterId, 10);
  const relations = memo.characterRelations.filter(
    (e) => e.sourceCharacterId === id
  );
  const r = relations.map((e) => (
    <ReationUpdate
      key={e.id}
      characterId={characterId}
      relation={e}
    ></ReationUpdate>
  ));
  return (
    <div className="flex flex-col space-y-2">
      {r}
      <ReationUpdate characterId={characterId} relation={null}></ReationUpdate>
    </div>
  );
}

function ReationUpdate({
  characterId,
  relation,
}: {
  characterId: string;
  relation: Relation | null;
}) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  );
  const [newRelationName, setNewRelationName] = useState(
    relation ? relation.name! : ""
  );
  const { isRequesting, updateRelation, deleteRelation, addRelation } =
    useContext(RelationEditerContext);
  const { memo } = useContext(RelationEditerContext);
  const id = parseInt(characterId, 10);

  const oldTarget = relation?.targetCharacterId;
  const oldTargetName = relation?.targetCharacter.name;

  const character = memo.characters.find((e) => id === e.id);
  if (!character) {
    return <></>;
  }
  const characters = memo.characters.filter(
    (e) => e.id != id && e.id != oldTarget
  );
  const selector = (
    <label className="form-control">
      <select
        className="select select-sm"
        onChange={(e) =>
          setSelectedCharacterId(parseInt(e.currentTarget.value, 10))
        }
        defaultValue={relation ? oldTargetName : "choose"}
      >
        <option>{relation ? oldTargetName : "choose"}</option>

        {characters.map((e) => (
          <option value={e.id} key={e.id}>
            {e.name}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-wrap space-x-4 justify-between grow">
        <div className="flex flex-wrap space-x-4 ">
          <span className="badge badge-lg badge-neutral">{character.name}</span>
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
            <UpdateButton
              action={() => {
                let newTargetId = selectedCharacterId;
                if (newRelationName.trim() === "") {
                  return;
                }
                if (!newTargetId && relation.name === newRelationName) {
                  return;
                }
                if (!newTargetId) {
                  newTargetId = relation.targetCharacterId;
                }
                updateRelation(relation?.id!, id, newTargetId, newRelationName)
                  .then(() => toast.success("Updated!"))
                  .catch((e) => toast.error("Updated failed!"));
              }}
              disable={
                newRelationName.trim() === "" ||
                (newRelationName === relation.name && !selectedCharacterId)
              }
            ></UpdateButton>
            <DeleteButton
              action={() => {
                deleteRelation(relation?.id!)
                  .then(() => toast.success("Deleted!"))
                  .catch((e) => toast.error("Deleted failed!"));
              }}
              disable={false}
            ></DeleteButton>
          </>
        ) : (
          <>
            <AddButton
              disable={false}
              action={() => {
                if (!selectedCharacterId) {
                  toast.error("select a target!");
                  return;
                }
                if (newRelationName === "") {
                  toast.error("enter a relationship name!");
                  return;
                }
                addRelation(
                  memo.id,
                  character.id,
                  selectedCharacterId,
                  newRelationName
                )
                  .then(() => toast.success("Added!"))
                  .then(() => {
                    setNewRelationName("");
                    setSelectedCharacterId(null);
                  })
                  .catch((e) => toast.error("Added failed!"));
              }}
            ></AddButton>
            <DeleteButton action={() => {}} disable={true}></DeleteButton>
          </>
        )}
      </div>
    </div>
  );
}
