import { CharacterForm } from "./form";

export function Drawer({
  characterName,
  isVisible,
  setIsVisible,
}: {
  characterName: string | null;
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
        <ul className="menu p-4 w-4/5 sm:w-2/5 min-h-full bg-base-100 text-base-content">
          <CharacterForm setIsVisible={setIsVisible} characterName={characterName} />
        </ul>
      </div>
    </div>
  );
}
