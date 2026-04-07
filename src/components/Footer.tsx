"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const footerLinks = [
    { name: "Problems", href: "/#problems" },
    { name: "Framework", href: "/#framework" },
    { name: "Stack", href: "/#stack" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/#contact" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-48 relative border-t border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_22%,rgba(15,17,36,0.52)_55%,rgba(6,8,18,0.62)_100%)]"
      style={{
        backdropFilter: "blur(22px) saturate(145%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(96,107,250,0.12)_0%,transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-8 py-4">
        <div className="grid grid-cols-4 gap-12 md:grid-cols-4 mb-6">
          {/* Brand */}
          <div className="col-span-4 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo-light.png"
                alt="SPCTEK AI Logo"
                width={100}
                height={32}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 font-poppins">
              Transformation through intelligent automation.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 font-poppins">
              Explore
            </h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-light text-white/70 hover:text-white transition-colors font-poppins"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 font-poppins">
              Resources
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/#faq"
                className="text-sm font-light text-white/70 hover:text-white transition-colors font-poppins"
              >
                FAQ
              </Link>
              <Link
                href="/#problems"
                className="text-sm font-light text-white/70 hover:text-white transition-colors font-poppins"
              >
                Solutions
              </Link>
            </nav>
          </div>

          {/* CTA */}
          <div className="flex flex-col justify-start">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(124,134,255,0.98)_0%,rgba(96,107,250,0.98)_100%)] px-8 py-[12px] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(96,107,250,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(96,107,250,0.36),inset_0_1px_0_rgba(255,255,255,0.4)] w-fit"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-center text-sm text-white/40 font-poppins">
            © {currentYear} SPCTEK AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
