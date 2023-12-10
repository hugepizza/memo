import { CharacterForm } from "./form";
import { RelationModal } from "../relation/modal";

export function Drawer({
  characterId,
  isVisible,
  setIsVisible,
}: {
  characterId: string | null;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
}) {
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
          onClick={() => setIsVisible(false)}
        ></label>
        <ul className="menu p-4 w-4/5 sm:w-3/5 min-h-full bg-base-100 text-base-content">
          <CharacterForm setIsVisible={setIsVisible} id={characterId} />
        </ul>
      </div>
    </div>
  );
}
