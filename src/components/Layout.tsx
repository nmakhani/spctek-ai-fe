import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-dark min-h-screen text-white font-poppins relative">
      <Navbar />
      <main className="flex flex-col flex-1">{children}</main>
    </div>
  );
}
