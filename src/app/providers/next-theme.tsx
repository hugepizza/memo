"use client";
import { ThemeProvider } from "next-themes";
const NextThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider  defaultTheme="light" storageKey="theme" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
};
export default NextThemeProvider;
