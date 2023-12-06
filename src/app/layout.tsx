import type { Metadata } from "next";
import "./globals.css";
import ThemeWrapper from "./providers/theme-wrapper";
import Navbar from "./components/navbar";
import NextThemeProvider from "./providers/next-theme";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={"w-full h-full "}>
      <body className="suppressHydrationWarning w-full h-full px-32">
        <NextThemeProvider>
          <ThemeWrapper>
            <Navbar />
            {children}
          </ThemeWrapper>
        </NextThemeProvider>
      </body>
    </html>
  );
}
