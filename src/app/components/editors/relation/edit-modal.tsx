import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../providers/store-provider";
import { atom, useAtom } from "jotai";
import { produce } from "immer";

export const relationEditModalSource = atom("");
export const relationEditModalTarget = atom("");
export const relationEditModalIsVisible = atom(false);
export function RelationEditModal() {
  const [source] = useAtom(relationEditModalSource);
  const [target] = useAtom(relationEditModalTarget);
  const [isVisible, setIsVisible] = useAtom(relationEditModalIsVisible);
  const { memo, setMemo } = useContext(StoreContext);
  const [newRelationName, setNewRelationName] = useState("");

  useEffect(() => {
    const relation = memo.relations.find(
      (e) => e.source === source && e.target === target
    );
    setNewRelationName(relation ? relation.name : "");
  }, [source, target, memo]);

  return (
    <dialog
      className={`modal ${
        isVisible ? "modal-open" : "modal-backdrop"
      } transform`}
    >
      <div className="modal-box">
        <div className="flex flex-col space-y-4">
          <div className="flex w-full">
            <div className="flex w-full">
              <div className="grid h-32 flex-grow card bg-base-300 rounded-box place-items-center">
                {source}
              </div>
              <div className="divider divider-horizontal whitespace-normal grow  z-10">
                <input
                  type="text"
                  className="input py-1"
                  placeholder="set a relation"
                  value={newRelationName}
                  onChange={(e) => setNewRelationName(e.currentTarget.value)}
                ></input>
                <button
                  className={`btn btn-sm ${
                    newRelationName === "" ? "btn-disabled" : ""
                  }`}
                  onClick={() => {
                    const prevIndex = memo.relations.findIndex(
                      (e) => e.target === target && e.source === source
                    );
                    const nextState = produce(memo, (draft) => {
                      if (prevIndex < 0) {
                        draft.relations.push({
                          id: new Date().getTime().toString(),
                          target,
                          source,
                          name: newRelationName,
                        });
                      } else {
                        draft.relations[prevIndex].name = newRelationName;
                      }
                    });
                    setMemo(nextState);
                    setIsVisible(false);
                  }}
                >
                  save
                </button>
              </div>
              <div className="grid h-32 flex-grow card bg-base-300 rounded-box place-items-center">
                {target}
              </div>
            </div>
          </div>
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
