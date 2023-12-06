"use client";

import Link from "next/link";
import Search from "./search";
import ThemeSwitch from "./theme-switch";
import User from "./user";
export default function Navbar() {
  return (
    <section className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href={"/memo"} className="btn btn-ghost text-xl">
          Memo
        </Link>
      </div>
      <div className="navbar-center">
        <Search />
      </div>
      <div className="navbar-end">
        <User />
        <ThemeSwitch />
      </div>
    </section>
  );
}
