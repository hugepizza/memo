import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../providers/store-provider";
import { atom, useAtom } from "jotai";
import { produce } from "immer";
import { Color } from "../../color";

export const groupModalSelectedNames = atom<string[]>([]);
export const groupModalIsVisible = atom(false);
export function GroupEditModal() {
  const [names, setNames] = useAtom(groupModalSelectedNames);
  const [selectedColor, setSelectedColor] = useState("");
  const [isVisible, setIsVisible] = useAtom(groupModalIsVisible);
  const { memo, setMemo } = useContext(StoreContext);

  return (
    <dialog
      className={`modal ${
        isVisible ? "modal-open" : "modal-backdrop"
      } transform`}
    >
      <div className="modal-box">
        <div className="flex flex-col space-y-4">
          <div className="flex w-full">
            <Color onColorSelected={setSelectedColor} />
          </div>
          {names.join(",")}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <div className="space-x-2">
              <button
                className={`btn float-right ${
                  selectedColor === "" ? "btn-disabled" : ""
                }`}
                onClick={() => {
                  setMemo(
                    produce(memo, (draft) => {
                      draft.characters.forEach((ele) => {
                        if (names.findIndex((e) => ele.name === e) >= 0) {
                          if (ele.group) {
                            ele.group.color = selectedColor;
                          } else {
                            ele.group = {
                              name: "",
                              color: selectedColor,
                            };
                          }
                        }
                      });
                    })
                  );
                  setIsVisible(false);
                }}
              >
                save
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
