import Image from "next/image";

import { SectionDivider } from "@/components/ui/SectionDivider";

export default function OperationalFramework() {
  const headingStyles =
    "text-[2.2rem] md:text-[3.8rem] font-bold tracking-tight leading-[1.1] text-white";
  const paragraphStyles =
    "mx-auto mt-8 max-w-2xl font-light leading-relaxed text-white md:text-[1.25rem]";

  return (
    <section className="px-6 md:px-12 overflow-hidden text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className={headingStyles}>
            We Fix Your Operations First So <br />
            <span className="text-[#606bfa]">AI Automation</span>{" "}
            <br className="md:hidden" /> Actually Works
          </h2>

          <p className={paragraphStyles}>
            Most agencies try to implement AI on top of broken operations,
            creating more chaos than clarity. We fix the operations first.
          </p>
        </div>

        <SectionDivider />

        <div className="relative">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h3 className={headingStyles}>
              The <span className="text-[#606bfa]">Spctek</span> Operational{" "}
              <br className="md:hidden" /> Intelligence Framework
            </h3>
            <p className={paragraphStyles}>
              Our Operational Intelligence Framework focuses on building strong
              operational systems first, ensuring that AI automation delivers
              real impact rather than adding complexity.
            </p>
          </div>

          {/* Framework Image & Overlays */}
          <div className="relative mx-auto w-full max-w-5xl">
            <Image
              src="/home-page/framework.png"
              alt="Operational Framework"
              width={1200}
              height={800}
              priority
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Mobile Fallback */}
          <div className="mt-12 space-y-8 md:hidden px-4">
            {[
              {
                t: "Diagnose Operational Gaps",
                d: "We analyze how your business actually operates and identify inefficiencies.",
              },
              {
                t: "Structure the Systems",
                d: "We design operational systems that connect your data and workflows.",
              },
              {
                t: "Automate the Workflows",
                d: "We introduce automation to remove repetitive tasks.",
              },
              {
                t: "Apply Practical AI",
                d: "We deploy secure AI systems and intelligent tools.",
              },
            ].map((item, i) => (
              <div key={i} className="border-l-2 border-[#606bfa] pl-4">
                <h4 className="font-bold text-[#606bfa]">
                  {i + 1}. {item.t}
                </h4>
                <p className="text-white text-sm mt-1 opacity-80">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-20 flex justify-center">
          <button
            className="font-bold text-white transition-all active:scale-95 hover:brightness-110 rounded-full py-4 px-12 text-base shadow-[0_10px_25px_rgba(96,107,250,0.4)]"
            style={{
              background: "#606bfa",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            Talk to an Automation Expert
          </button>
        </div>
      </div>
    </section>
  );
}
