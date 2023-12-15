import { useState } from "react";

export function Color({
  onColorSelected,
}: {
  onColorSelected: (color: string) => void;
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
  const [selectedColor, setSelectedColor] = useState("");
  return (
    <div className="flex flex-wrap sm:space-x-2 space-x-1 items-center">
      {group.map((ele) => (
        <div key={ele.color} className="flex flex-col items-center">
          <button
            className={`btn btn-xs btn-square`}
            style={{ background: ele.color }}
            onClick={() => {
              setSelectedColor(ele.color);
              onColorSelected(ele.color);
            }}
          >
            {ele.color === selectedColor ? (
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
  );
}
