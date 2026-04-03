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
  <div className="relative shrink-0 w-8 h-8 flex items-center justify-center bg-transparent">
    <div
      className="absolute inset-0 rounded-lg border border-white/20"
      style={{
        background: "linear-gradient(145deg, #2a2a2a 0%, #0a0a0a 100%)",
      }}
    />
    <div
      className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
      style={{
        background:
          "linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%)",
      }}
    />
    <span className="relative z-10 text-[#7a85ff] font-bold text-xl tracking-tighter">
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

        {/* Left Column: List of Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start">
            <div className="w-full max-w-[280px] md:max-w-[340px] divide-y divide-white/2">
              {issuesList.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-4 transition-all duration-300 hover:bg-white/[0.05]"
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

            <div className="relative animate-float w-full flex justify-center">
              <Image
                width={500}
                height={500}
                src="/home-page/ai-robot.png"
                alt="3D AI Robot Illustration"
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* Final text and CTA */}
        <div className="mt-24 text-center flex flex-col items-center">
          <p className="text-lg text-white/60 font-light max-w-xl mx-auto mb-10 leading-relaxed">
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

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
