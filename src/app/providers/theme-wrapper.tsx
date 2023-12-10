"use client";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const onDark = theme === "dark";

  return (
    <main className="">
      {onDark ? (
        <Toaster
          toastOptions={{ style: { background: "#333", color: "#fff" } }}
        />
      ) : (
        <Toaster />
      )}
      {children}
    </main>
  );
}
