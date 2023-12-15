import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { StoreContext } from "../../providers/store-provider";
import { Relation } from "@/app/tpyes/memo";
import { atom, useAtom } from "jotai";

export const relationShowModalRelationName = atom("");
export const relationShowModalIsVisible = atom(false);

export function RelationShowModal({}: {}) {
  const [relationName] = useAtom(relationShowModalRelationName);
  const [isVisible, setIsVisible] = useAtom(relationShowModalIsVisible);
  const { memo } = useContext(StoreContext);
  const relation = memo.relations.find((e) => e.name === relationName);
  if (!relation) {
    return <></>;
  }
  const reverseRelation = memo.relations.find(
    (ele) => ele.source === relation.target && ele.target === relation.source
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
        {relation.source}
      </div>
      <div className="divider divider-horizontal whitespace-normal grow">
        {relation.name}
      </div>
      <div className="grid h-32 flex-grow card bg-base-300 rounded-box place-items-center">
        {relation.target}
      </div>
    </div>
  );
}
