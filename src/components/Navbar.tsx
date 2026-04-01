import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Reinstatement", href: "/reinstatement" },
    { name: "Local AI", href: "/local-ai" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6 md:px-12">
        {/* Logo Placeholder */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="SPCTEK AI Logo"
            width={120}
            height={40}
            className="object-contain"
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
            href="/free-assessment"
            className="bg-brand-primary text-white font-semibold text-base py-[14px] px-8 rounded-full hover:shadow-[0_0_24px_rgba(96,107,250,0.4)] transition-shadow duration-300"
          >
            Free Assessment
          </Link>
        </div>
      </div>
    </header>
  );
}
