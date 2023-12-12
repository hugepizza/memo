import { signOut } from "next-auth/react";
import { DefaultUser } from "next-auth";

export default function User({ user }: { user: DefaultUser }) {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img alt={user.name ? user.name[0] : "user"} src={user.image ?? ""} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export function UnAuthUser() {
  return (
    <div
      className="btn"
      onClick={() => {
        (
          window?.document?.getElementById("login_modal") as HTMLDialogElement
        ).showModal();
      }}
    >
      Log in
    </div>
  );
}
