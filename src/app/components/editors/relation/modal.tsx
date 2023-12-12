import { useContext, useEffect, useState } from "react";
import { Relation } from "@/app/tpyes/model";
import toast from "react-hot-toast";
import { AddButton, DeleteButton, UpdateButton } from "../../button";
import { RelationEditerContext } from "../../providers/relation-provider";
export function RelationModal({
  relationId,
  isVisible,
  setIsVisible,
}: {
  relationId: string;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
}) {
  const [newRelationNama, setNewRelationNama] = useState("");
  const [newTargetId, setNewTargetId] = useState<null | null>();
  const [newSourceId, setNewSourceId] = useState<null | null>();
  const { memo, updateRelation, deleteRelation, isRequesting } = useContext(
    RelationEditerContext
  );
  const id = parseInt(relationId, 10);
  const relation = memo.characterRelations.find((e) => e.id === id);
  if (!relation) {
    return <></>;
  }
  const reverseRelation = memo.characterRelations.find(
    (ele) =>
      ele.sourceCharacterId === relation.targetCharacterId &&
      ele.targetCharacterId === relation.sourceCharacterId
  );
  return (
    <dialog
      className={`modal ${
        isVisible ? "modal-open" : "modal-backdrop"
      } transform`}
    >
      <div className="modal-box">
        <div className="flex flex-col space-y-4">
          <div className="flex w-full">
            <Card relation={relation} />
          </div>
          {reverseRelation && <Card relation={reverseRelation} />}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <div className="space-x-2">
              {/* <button
                className="btn btn-warning"
                onClick={() => {
                  deleteRelation(id)
                    .then(() => toast.success("Deleted!"))
                    .then(() => setIsVisible(false))
                    .catch((e) => toast.error("Deleted failed!"));
                }}
              >
                Delete
              </button> */}
              {/* <button
                className={`btn ${isRequesting ? "btn-disabled" : ""}`}
                onClick={() => {}}
              >
                Save
              </button> */}
            </div>
          </form>
        </div>
      </div>

      <form
        method="dialog"
        className="modal-backdrop"
        onClick={() => setIsVisible(false)}
      >
        <button>close</button>
      </form>
    </dialog>
  );
}

function Card({ relation }: { relation: Relation }) {
  return (
    <div className="flex w-full">
      <div className="grid h-32 flex-grow card bg-base-300 rounded-box place-items-center">
        {relation.sourceCharacter.name}
      </div>
      <div className="divider divider-horizontal whitespace-normal grow">
        {relation.name}
      </div>
      <div className="grid h-32 flex-grow card bg-base-300 rounded-box place-items-center">
        {relation.targetCharacter.name}
      </div>
    </div>
  );
}
