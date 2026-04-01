import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="pt-16 pb-8 px-4 sm:px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-14">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline mb-4 group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-white font-extrabold text-[11px]">
                S
              </div>
              <span className="font-semibold text-white text-sm">
                SPCTEK <span className="text-accent">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[280px]">
              Build a System. Not a Spreadsheet. Intelligent AI infrastructure
              for operations-driven businesses.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-5 tracking-wider uppercase">
              Solutions
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="/reinstatement"
                className="text-sm text-slate-600 hover:text-accent transition-colors duration-300 no-underline"
              >
                Reinstatement Estimator
              </a>
              <a
                href="/local-llm-setup"
                className="text-sm text-slate-600 hover:text-accent transition-colors duration-300 no-underline"
              >
                Local AI Setup
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-5 tracking-wider uppercase">
              Company
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="#contact"
                className="text-sm text-slate-600 hover:text-accent transition-colors duration-300 no-underline"
              >
                Get AI Playbook
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 hover:text-accent transition-colors duration-300 no-underline"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 hover:text-accent transition-colors duration-300 no-underline"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between pt-7 flex-wrap gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span className="text-xs text-slate-700">
            &copy; {new Date().getFullYear()} SPCTEK AI. All rights reserved.
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            Systems Online
          </div>
        </div>
      </div>
    </footer>
  );
}
