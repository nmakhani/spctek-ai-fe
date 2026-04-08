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
        <div className="mt-16 mx-4 relative rounded-3xl p-8 md:p-8 overflow-hidden">
          {/* Outer Gradient Border - Now White focused */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              padding: "3px",
              background:
                "linear-gradient(135deg, white 0%, transparent 25%, transparent 75%, white 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              maskComposite: "exclude",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 rounded-[25px]"
            style={{
              background: `linear-gradient(110deg, rgba(255, 255, 255, 0.6) 0%, transparent 8%, transparent 92%, rgba(255, 255, 255, 0.6) 100%)`,
            }}
          />

          <div className="relative z-10">
            {/* Suspension Tags Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {suspensionTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center min-h-[70px] border-2 border-white rounded-xl px-4 py-2 text-white text-2xl font-medium shadow-lg"
                  style={{
                    background:
                      "linear-gradient(to bottom, #2e358b 0%, #131532 100%)",
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
                      "linear-gradient(105deg, #131532 0%, #2e358b 30%, #2e358b 70%, #131532 100%)",
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
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-16 text-left max-w-5xl mx-auto mb-20">
          {expertServices.map((service, index) => (
            <div key={index} className="flex items-start gap-2 group">
              <span className="text-2xl font-bold group-hover:scale-110 transition-transform">
                ✓
              </span>
              <span className="text-lg md:text-2xl font-medium text-white/90 leading-snug">
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
