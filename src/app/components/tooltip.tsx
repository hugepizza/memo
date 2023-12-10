import { ReactNode } from "react";

function Tooltip({ children, text }: { text: string; children: ReactNode }) {
  return (
    <div className="tooltip" data-tip="hello">
      {children}
    </div>
  );
}

export default Tooltip;
