import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPCTEK AI",
  description: "Advanced AI Solutions Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">SPCTEK AI</h1>
            <ul className="flex gap-6">
              <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="/dashboard" className="hover:text-blue-400 transition">Dashboard</a></li>
              <li><a href="/users" className="hover:text-blue-400 transition">Users</a></li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto px-4">
          {children}
        </main>
        <footer className="bg-slate-900 text-gray-400 text-center py-8 mt-16">
          <p>&copy; 2026 SPCTEK AI. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
