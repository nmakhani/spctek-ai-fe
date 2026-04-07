"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Reinstatement", href: "/reinstatement" },
    { name: "Problems", href: "/#problems" },
    { name: "Framework", href: "/#framework" },
    { name: "Stack", href: "/#stack" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="relative flex h-20 items-center justify-between overflow-visible border-b border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_22%,rgba(15,17,36,0.72)_55%,rgba(6,8,18,0.82)_100%)] px-8"
        style={{
          backdropFilter: "blur(22px) saturate(145%)",
          boxShadow:
            "0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22)_0%,transparent_32%),radial-gradient(circle_at_bottom_right,rgba(96,107,250,0.18)_0%,transparent_34%)]" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#7f89ff]"
          style={{
            width: `${scrollProgress}%`,
            transition: "width 0.1s ease-out",
          }}
        />

        <div className="relative z-10 flex h-full w-full items-center justify-between">
          {/* Logo Placeholder */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-light.png"
              alt="SPCTEK AI Logo"
              width={120}
              height={40}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          {/* Center/Right-aligned Menu */}
          <nav className="hidden md:flex ml-auto mr-8 gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-light font-poppins text-white hover:text-brand-secondary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(124,134,255,0.98)_0%,rgba(96,107,250,0.98)_100%)] px-8 py-[14px] text-base font-semibold text-white shadow-[0_10px_24px_rgba(96,107,250,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(96,107,250,0.36),inset_0_1px_0_rgba(255,255,255,0.4)]"
            >
              Free Assessment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
