import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeWrapper from "./providers/theme-wrapper";
import Navbar from "./components/navbar";
import NextThemeProvider from "./providers/next-theme";
import SessionProvider from "./providers/session";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title:
    "Create Hand-Drawn Novel Character Relationship Charts Online | Character Addition, Relationship Mapping, and Unique Hand-Drawn Network Diagram Generation",
  description:
    "Bring your novel to life with our creative tool for drawing character relationship charts. Add characters, establish connections, and instantly generate beautifully hand-drawn network diagrams. Unleash your creativity, depict the intricate bonds between your characters, break through creative barriers, and provide readers with a deeper understanding of your story. Try it for free and effortlessly share your imaginative world!",
  applicationName: "Memo",
};

export const viewPort: Viewport = {
  userScalable: false,
  maximumScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={"w-full h-full "}>
      <body className="suppressHydrationWarning w-full h-full">
        <SessionProvider>
          <NextThemeProvider>
            <ThemeWrapper>
              <Navbar />
              {children}
              <Analytics />
            </ThemeWrapper>
          </NextThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
