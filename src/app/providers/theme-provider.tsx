"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { cookies } from "next/headers";

type theme = "light" | "dark";
type themeContextProp = {
  theme: theme;
  setTheme: (theme: theme) => void;
};

export const themeContext = createContext<themeContextProp>(
  {} as themeContextProp
);

export function useTheme() {
  const { theme, setTheme } = useContext(themeContext);
  return { theme: theme, setTheme };
}

export default function ThemeContextProvoder({
  children,
}: {
  children: ReactNode;
}) {
  const value =
    typeof window !== "undefined" ? localStorage.getItem("theme") : "light";
  console.log("local theme", value);
  const curr =
    !value || (value != "light" && value != "dark")
      ? "light"
      : (value as theme);

  const [theme, setStateTheme] = useState(curr);
  useEffect(() => {
    document!.querySelector("body")?.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (theme: theme) => {
    if (typeof window !== "undefined") {
      console.log("set local theme", theme);
      localStorage.setItem("theme", theme);
      setStateTheme(theme);
    }
  };
  return (
    <themeContext.Provider
      value={{
        theme: theme,
        setTheme: (theme: theme) => setTheme(theme),
      }}
    >
      {children}
    </themeContext.Provider>
  );
}
