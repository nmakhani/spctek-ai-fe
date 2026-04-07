"use client";

import Image from "next/image";

import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionHeading } from "../ui/SectionHeading";

const issuesList = [
  { number: "1", title: "Disconnected Tools" },
  { number: "2", title: "Operational Blind Spots" },
  { number: "3", title: "Decision Paralysis" },
  { number: "4", title: "AI Adoption Confusion" },
  { number: "5", title: "AI Security Risks" },
  { number: "6", title: "Fragmented Solutions" },
];

const GlassNumber = ({ number }: { number: string }) => (
  <div className="relative shrink-0 w-8 h-8 flex items-center justify-center">
    <div
      className="absolute inset-0 rounded-lg p-[1px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.8) 100%)",
      }}
    >
      <div className="h-full w-full rounded-[7px] bg-[#121212]" />
    </div>

    <div
      className="absolute inset-[1px] rounded-[7px] pointer-events-none overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
      }}
    />

    <div
      className="absolute inset-[1px] rounded-[7px] pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0%, transparent 50%)",
      }}
    />

    <span className="relative z-10 text-[#606bfa] font-bold text-xl tracking-tighter">
      {number}
    </span>
  </div>
);

export default function Issues() {
  return (
    <section className="px-6 md:px-12 font-poppins">
      {/* 1. Added max-w-5xl and mx-auto to squeeze everything toward the center */}
      <div className="max-w-5xl mx-auto">
        <SectionHeading size="large">
          Are These Issues Holding Your
          <br className="hidden md:block" />{" "}
          <span className="text-[#a0a6fc]">Business</span> Back?
        </SectionHeading>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: List of Issues */}
          <div className="flex flex-col items-start">
            <div className="w-full max-w-[280px] md:max-w-[340px] divide-y divide-white/2">
              {issuesList.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-4 transition-all duration-300"
                >
                  <GlassNumber number={issue.number} />
                  <span className="text-white/90 font-medium text-lg tracking-tight">
                    {issue.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Illustration Section */}
          <div className="relative flex justify-center items-center">
            <div className="absolute bg-[#606bfa]/10 blur-[100px] rounded-full w-80 h-80 -z-10" />

            <div className="relative home-issues-float w-full flex justify-center">
              <Image
                width={500}
                height={400}
                src="/home-page/ai-robot.png"
                alt="3D AI Robot Illustration"
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* Final text and CTA */}
        <div className="mt-24 text-center flex flex-col items-center">
          <p className="text-lg text-white/60 font-light max-w-xl mx-auto leading-relaxed">
            If these sound familiar, it&apos;s time to fix how your business
            operates
            <span className="text-white">
              {" "}
              rather than just adding more tools.
            </span>
          </p>
          <PrimaryButton href="/#contact">
            Get a Free Operations Assessment
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
