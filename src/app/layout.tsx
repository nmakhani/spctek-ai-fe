import type { Metadata } from "next";
import { activeTheme, type Theme } from "@/themes";
import { Poppins, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SPCTEK AI - Build a System. Not a Spreadsheet.",
  description:
    "AI-native operations platform. Replace fragmented tools and manual chaos with an intelligent AI operating layer.",
  icons: { icon: "/favicon-dark.png" },
};

function buildThemeCss(t: Theme): string {
  return `
    :root {
      --theme-bg:           ${t.bg};
      --theme-bg-light:     ${t.bgLight};
      --theme-bg-card:      ${t.bgCard};
      --theme-accent:       ${t.accent};
      --theme-accent-rgb:   ${t.accentRgb};
      --theme-accent-light: ${t.accentLight};
      --theme-accent-dark:  ${t.accentDark};
      --theme-accent2:      ${t.accent2};
      --theme-accent2-rgb:  ${t.accent2Rgb};
      --theme-accent2-light:${t.accent2Light};
      --theme-accent2-dark: ${t.accent2Dark};
      --theme-fg:           ${t.fg};
      --theme-muted:        ${t.muted};
      --theme-muted-light:  ${t.mutedLight};
      --theme-muted-dark:   ${t.mutedDark};
    }
  `.trim();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style
          dangerouslySetInnerHTML={{ __html: buildThemeCss(activeTheme) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased text-fg bg-[#030303] min-h-screen relative`}
      >
        {children}
      </body>
    </html>
  );
}
