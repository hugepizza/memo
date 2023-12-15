import { atom, useAtom } from "jotai";
import { CharacterForm } from "./form";

export const drawerCharacterName = atom<string | null>(null);
export const drawerIsVisible = atom(false);

export function Drawer() {
  const [isVisible, setIsVisible] = useAtom(drawerIsVisible);
  return (
    <div className="drawer z-20">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isVisible}
        onChange={() => {}}
      />

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => {
            setIsVisible(false);
          }}
        ></label>
        <ul className="menu p-4 w-4/5 sm:w-2/5 min-h-full bg-base-100 text-base-content">
          <CharacterForm />
        </ul>
      </div>
    </div>
  );
}
