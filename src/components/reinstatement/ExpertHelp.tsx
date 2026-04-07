"use client";

import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionHeading } from "../ui/SectionHeading";

const suspensionTypes = [
  "Multiple rejections",
  "Section 3 suspensions",
  "IP complaints",
  "Counterfeit claims",
];

const successStats = [
  {
    value: "55+",
    label: "Reinstated",
    subLabel: "Accounts",
  },
  {
    value: "89%",
    label: "Success",
    subLabel: "Rate",
  },
];

const expertServices = [
  "Suspension Analysis & Classification",
  "Appeal Submission & Escalation Management",
  "Reinstatement Strategy Based on Your Case",
  "Post-Reinstatement Compliance Support",
  "Amazon-Compliant Plan of Action (POA)",
  "Up to 100% Money-Back Guarantee",
];

export default function ExpertHelp() {
  return (
    <section className="px-6 md:px-12 font-poppins">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header Section */}
        <SectionHeading size="large">
          Need Expert Help?
          <br />
          Let Us Handle It <span className="text-[#606bfa]">End-to-End</span>
        </SectionHeading>

        {/* Main Feature Container */}
        <div className="mt-16 relative rounded-[40px] p-8 md:p-12 overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Subtle Outer Radial Border Effect */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[40px]"
            style={{
              padding: "2px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              maskComposite: "exclude",
            }}
          />

          {/* Top Corner Light Flares */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#606bfa]/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-white/5 blur-[80px] rounded-full" />
          </div>

          <div className="relative z-10">
            {/* Suspension Tags Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {suspensionTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center min-h-[70px] border border-white rounded-xl px-4 py-2 text-white text-lg font-medium tracking-tight shadow-lg"
                  style={{
                    background:
                      "radial-gradient(circle at center, #2e358b 0%, #131532 100%)",
                  }}
                >
                  {type}
                </div>
              ))}
            </div>

            {/* Success Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {successStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-6 border border-white p-4 md:p-4 rounded-xl transition-all duration-500 hover:scale-[1.01] shadow-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at center, #2e358b -20%, #131532 100%)",
                  }}
                >
                  <span className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
                    {stat.value}
                  </span>
                  <div className="text-left">
                    <p className="text-2xl md:text-4xl font-normal leading-[1.1] text-white">
                      {stat.label}
                      <br />
                      {stat.subLabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Context Text */}
        <p className="mt-12 text-lg md:text-2xl text-white font-light max-w-4xl mx-auto leading-relaxed">
          If your case is complex or your assessment shows low to moderate
          viability, our expert team can step in to take over completely.
        </p>

        {/* Checklist Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 text-left max-w-5xl mx-auto mb-20">
          {expertServices.map((service, index) => (
            <div key={index} className="flex items-start gap-4 group">
              <span className="text-2xl font-bold group-hover:scale-110 transition-transform">
                ✓
              </span>
              <span className="text-lg md:text-xl font-medium text-white/90 leading-snug">
                {service}
              </span>
            </div>
          ))}
        </div>

        <PrimaryButton href="/#contact">
          Reinstate My Amazon Account
        </PrimaryButton>
      </div>
    </section>
  );
}
