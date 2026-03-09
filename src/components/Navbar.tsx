"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "h-14 border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl shadow-glass"
          : "h-16 border-b border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center px-5 md:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-white font-extrabold text-xs overflow-hidden shadow-glow-cyan group-hover:shadow-glow-mixed transition-shadow duration-500">
            <span className="relative z-10">S</span>
            <div className="absolute inset-0 bg-gradient-to-br from-purple to-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight hidden sm:inline">
            SPCTEK <span className="text-cyan">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="ml-auto hidden md:flex items-center gap-1">
          {[
            { href: "/#solutions", label: "Solutions" },
            { href: "/reinstatement", label: "Reinstatement" },
            { href: "/local-llm-setup", label: "Local AI" },
            { href: "/#contact", label: "Contact" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-white transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute bottom-0.5 left-4 right-4 h-px bg-gradient-to-r from-cyan to-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
          <a
            href="/process-diagnostic"
            className="ml-3 glow-btn !py-2 !px-5 !text-xs !rounded-lg"
          >
            Free Assessment
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          aria-label="Menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-white/70 transition-all duration-300 origin-center ${
              mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white/70 transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white/70 transition-all duration-300 origin-center ${
              mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-2xl border-b border-white/[0.06] p-5 flex flex-col gap-1 md:hidden transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {[
          { href: "/#solutions", label: "Solutions" },
          { href: "/reinstatement", label: "Reinstatement" },
          { href: "/process-diagnostic", label: "Assessment" },
          { href: "/local-llm-setup", label: "Local AI" },
          { href: "/#contact", label: "Contact" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="text-sm text-slate-400 hover:text-white py-2.5 px-4 hover:bg-white/[0.03] rounded-lg transition-all duration-200"
          >
            {link.label}
          </a>
        ))}
        <a
          href="/process-diagnostic"
          onClick={() => setMobileOpen(false)}
          className="glow-btn mt-3 justify-center !text-xs"
        >
          Free Assessment
        </a>
      </div>
    </nav>
  );
}
