export default function SaveButton({
  action,
  disable,
}: {
  disable: boolean;
  action: () => void;
}) {
  return (
    <button
      className={`btn btn-circle ${disable ? "btn-disabled" : ""}`}
      onClick={action}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  );
}

export function DeleteButton({
  action,
  disable,
}: {
  disable: boolean;
  action: () => void;
}) {
  return (
    <button
      className={`btn btn-circle ${disable ? "btn-disabled" : ""}`}
      onClick={action}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}

export function UpdateButton({
  action,
  disable,
}: {
  disable: boolean;
  action: () => void;
}) {
  return (
    <button
      className={`btn btn-circle ${disable ? "btn-disabled" : ""}`}
      onClick={action}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </button>
  );
}
