import React from "react";

import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionHeading } from "../ui/SectionHeading";

type ToolComparison = {
  capability: string;
  spctek: "yes" | "no" | "partial";
  enterprise: "yes" | "no" | "partial";
  saas: "yes" | "no" | "partial";
  ai: "yes" | "no" | "partial";
};

const comparisons: ToolComparison[] = [
  {
    capability: "Unified ops data layer",
    spctek: "yes",
    enterprise: "yes",
    saas: "yes",
    ai: "no",
  },
  {
    capability: "Workflow orchestration",
    spctek: "yes",
    enterprise: "yes",
    saas: "partial",
    ai: "no",
  },
  {
    capability: "Built-in AI inside ops",
    spctek: "yes",
    enterprise: "partial",
    saas: "yes",
    ai: "yes",
  },
  {
    capability: "Secure local AI",
    spctek: "yes",
    enterprise: "yes",
    saas: "yes",
    ai: "no",
  },
  {
    capability: "SMB-friendly setup",
    spctek: "yes",
    enterprise: "no",
    saas: "no",
    ai: "yes",
  },
  {
    capability: "Cross-tool automation",
    spctek: "yes",
    enterprise: "yes",
    saas: "partial",
    ai: "no",
  },
  {
    capability: "System diagnostics",
    spctek: "yes",
    enterprise: "partial",
    saas: "yes",
    ai: "no",
  },
];

function RenderStatus({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes") {
    return <span className="text-[#39FF14] text-[1.4rem] font-bold">✓</span>;
  }
  if (status === "no") {
    return <span className="text-[#4D5470] text-xl font-bold">X</span>;
  }
  return <span className="text-[#FFD700] font-bold">Partial</span>;
}

export default function Tools() {
  return (
    <section className="px-6 md:px-12 overflow-hidden relative font-poppins">
      <div className="mx-auto max-w-5xl">
        {/* Title */}
        <div className="mx-auto mb-16 text-center text-white">
          <SectionHeading size="large">
            The <span className="text-[#606bfa]">Tools</span> You`re Using
            Weren`t Built for
            <br />
            Complex Business Operations
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-2xl font-medium leading-relaxed md:text-[1.3rem] opacity-100">
            Every tool in your stack was built for one layer of the problem.
            None of them were built for the system.
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] border-[2px] border-white rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-[#1A1F3C]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#0D1127] border-b border-white/30">
                  <th className="py-6 px-4 text-center font-bold text-white w-1/4 border-r border-white/30">
                    Capability
                  </th>
                  <th className="py-6 px-4 font-bold text-white border-r border-white/30 bg-[#2D345E]">
                    SPCTEK
                    <br />
                    AI Platform
                  </th>
                  <th className="py-6 px-4 font-bold text-white border-r border-white/30">
                    Enterprise
                    <br />
                    Platforms
                  </th>
                  <th className="py-6 px-4 font-bold text-white border-r border-white/30">
                    SaaS Tools
                  </th>
                  <th className="py-6 px-4 font-bold text-white">AI Tools</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr
                    key={row.capability}
                    className="border-b border-white/20 last:border-b-0"
                  >
                    <td className="py-4 px-6 text-left text-white/90 border-r border-white/30 font-medium pl-10">
                      {row.capability}
                    </td>
                    <td className="py-4 px-4 border-r border-white/30 bg-[#2D345E]">
                      <RenderStatus status={row.spctek} />
                    </td>
                    <td className="py-4 px-4 border-r border-white/30">
                      <RenderStatus status={row.enterprise} />
                    </td>
                    <td className="py-4 px-4 border-r border-white/30">
                      <RenderStatus status={row.saas} />
                    </td>
                    <td className="py-4 px-4">
                      <RenderStatus status={row.ai} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <PrimaryButton href="/#contact">
            Talk to an Automation Expert
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
