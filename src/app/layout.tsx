import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { activeTheme, type Theme } from "@/themes";

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
        {/* --- HERO SECTION BACKGROUND GLOW --- */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none -z-10 overflow-hidden"
          style={{
            width: "100vw",
            height: "80vh",
            background:
              "radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)",
            filter: "blur(100px)",
          }}
        />

        {/* --- SOLID TILTED OVAL GLOW --- */}
        <div
          className="absolute pointer-events-none -z-10 overflow-hidden"
          style={{
            top: "130vh",
            left: "70%",
            width: "400px",
            height: "200px",
            background:
              "radial-gradient(ellipse at center, rgba(96, 107, 250, 0.5) 0%, rgba(96, 107, 250, 0.5) 50%, transparent 80%)",
            transform: "translate(-50%, -50%) rotate(-55deg) scale(1.2)",

            filter: "blur(40px)",
          }}
        />

        {/* Your Page Content */}
        {children}
      </body>
    </html>
  );
}
