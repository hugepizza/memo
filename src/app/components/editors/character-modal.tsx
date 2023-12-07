import { useContext, useEffect, useState } from "react";
import "../../globals.css";
import useSWR from "swr";
import { Character } from "@/app/tpyes/model";
import toast from "react-hot-toast";
import CharacterEditerContextProvider, {
  CharacterEditerContext,
} from "./character-context";
export function CharacterModal({
  id,
  isVisible,
  setIsVisible,
}: {
  id: number;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
}) {
  const {
    memoId,
    isRequesting,
    updateCharacter,
    deleteCharacter,
    addCharacter,
  } = useContext(CharacterEditerContext);
  console.log("updateCharacter", updateCharacter);

  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const { data } = useSWR("/api/character/" + id.toString(), (url) => {
    if (isNaN(id)) {
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

  return (
    <dialog
      className={`modal ${
        isVisible ? "modal-open" : "modal-backdrop"
      } transform`}
    >
      <div className="modal-box">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            className="input bg-base-200"
            placeholder={isNaN(id) ? "new character name" : ""}
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
        <div className="modal-action">
          <form method="dialog">
            <div className="space-x-2">
              {!isNaN(id) && (
                <button
                  className={`btn ${
                    isRequesting ? "btn-disabled" : "btn-warning"
                  }`}
                  onClick={() => {
                    deleteCharacter(id)
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
                  (isNaN(id)
                    ? addCharacter(memoId, name, remark)
                    : updateCharacter(id, name, remark)
                  )
                    .then(() => toast.success("Saved!"))
                    .then(() => setIsVisible(false))
                    .catch((e) => toast.error("Saved failed!"));
                }}
              >
                Save
              </button>
              <button
                className={`btn ${isRequesting ? "btn-disabled" : ""}`}
                onClick={() => {
                  setIsVisible(false);
                }}
              >
                Close
              </button>
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
