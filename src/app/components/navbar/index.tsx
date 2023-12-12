"use client";
import logo from "../../../../public/nav-logo.svg";
import Link from "next/link";
import Search from "./search";
import ThemeSwitch from "./theme-switch";
import User, { UnAuthUser } from "./user";
import { useSession } from "next-auth/react";
import LoginModal from "./login-modal";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Navbar() {
  const session = useSession();
  return (
    <section className="navbar bg-base-100  px-2 sm:px-32">
      <div className="navbar-start">
        <Link href={"/memo"} className="">
          <Image priority src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-center hidden sm:block sm:w-[30vw]">
        <Search />
      </div>
      <div className="navbar-end   space-x-2">
        {session.data?.user ? (
          <User user={session.data.user} />
        ) : (
          <UnAuthUser />
        )}
        <ThemeSwitch />
      </div>
      <LoginModal />
    </section>
  );
}
