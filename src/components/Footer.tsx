import Link from "next/link";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";

export default function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-32 border-b border-white/5 pb-32">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight max-w-4xl mx-auto">
            Ready to transform your business with AI?
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book a complementary consultation today.
          </p>
          <PrimaryButton onClick={() => window.open("#contact", "_self")}>
            Book Your Strategy Session
          </PrimaryButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-16 mb-20 px-4">
          {/* Brand & Socials */}
          <div className="space-y-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-white font-extrabold text-[12px]">
                S
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                SPCTEK <span className="text-accent">AI</span>
              </span>
            </Link>
            <p className="text-base text-slate-400 leading-relaxed max-w-xs">
              Empowering businesses with strategic, secure, and high-impact AI
              solutions.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-slate-400 hover:text-accent transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-accent transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-8 tracking-wide text-lg">
              Company
            </h4>
            <div className="flex flex-col gap-4">
              <Link
                href="/about"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                About Us
              </Link>
              <Link
                href="/careers"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                Careers
              </Link>
              <Link
                href="#contact"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-8 tracking-wide text-lg">
              Services
            </h4>
            <div className="flex flex-col gap-4">
              <Link
                href="/services/process-diagnostic"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                Process Diagnostic
              </Link>
              <Link
                href="/services/ai-playbook"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                AI Playbook
              </Link>
              <Link
                href="/services/private-stack"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                Private AI Stack
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-8 tracking-wide text-lg">
              Resources
            </h4>
            <div className="flex flex-col gap-4">
              <Link
                href="/blog"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                Blog
              </Link>
              <Link
                href="/case-studies"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                Case Studies
              </Link>
              <Link
                href="/whitepapers"
                className="text-slate-400 hover:text-accent transition-colors no-underline"
              >
                Whitepapers
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Spctek AI. All rights reserved.
          </p>
          <div className="flex items-center gap-10">
            <Link
              href="/privacy"
              className="text-slate-500 hover:text-white transition-colors text-sm no-underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 hover:text-white transition-colors text-sm no-underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
