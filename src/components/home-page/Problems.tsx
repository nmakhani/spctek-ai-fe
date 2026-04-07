"use client";

import { SectionHeading } from "../ui/SectionHeading";
import { GlowBackground } from "../ui/GlowBackground";

const stats = [
  {
    stat: "43%",
    title: "of SMBs",
    description: "cite operations as the top bottleneck.",
  },
  {
    stat: "7+",
    title: "tools",
    description: "The average SMB uses daily.",
  },
  {
    stat: "78%",
    title: "of teams",
    description: "fail to deploy AI effectively.",
  },
];

const GlassBadge = ({ stat }: { stat: string }) => (
  <div className="relative shrink-0 w-[64px] h-[64px] flex items-center justify-center">
    {/* Outer Housing */}
    <div
      className="absolute inset-0 rounded-xl border border-white/10 overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.3) 100%)",
        boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.2)",
      }}
    />

    {/* Inner Acrylic Panel */}
    <div
      className="relative z-10 w-[46px] h-[46px] rounded-xl flex items-center justify-center overflow-hidden shadow-lg"
      style={{
        background: "linear-gradient(135deg, #5865F2 0%, #3b44a3 100%)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)",
        }}
      />
      <span className="text-white font-bold text-lg tracking-tight drop-shadow-md">
        {stat}
      </span>
    </div>

    {/* Top-Left Specular Flare */}
    <div
      className="absolute -top-4 -left-12 w-36 h-8 blur rounded-full pointer-events-none"
      style={{
        mixBlendMode: "screen",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
      }}
    />
  </div>
);

export default function Problems() {
  return (
    <section className="px-6 md:px-12 font-poppins">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <SectionHeading size="large">
            The Problem Isn&apos;t Lack of{" "}
            <span className="text-[#a0a6fc]">AI Tools.</span>
            <br />
            It&apos;s Lack of Systems
          </SectionHeading>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6 lg:pl-20 xl:pl-36">
            <p className="text-xl md:text-2xl text-white/90 leading-[1.3] font-light tracking-tight max-w-[600px]">
              Most SMBs are already juggling more tools and dashboards than they
              can manage. The real challenge is connecting data, workflows, and
              decisions into a system that brings clarity, consistency, and
              control.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8 relative">
            <GlowBackground
              style={{
                top: "25%",
                left: "50%",
                width: "90%",
                height: "80%",
                background:
                  "radial-gradient(ellipse at center, rgba(96, 107, 250, 0.5) 0%, rgba(96, 107, 250, 0.5) 50%, transparent 80%)",
                transform: "translate(-50%, -50%) rotate(-55deg) scale(1.2)",
                filter: "blur(40px)",
              }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#606bfa]/5 blur-[120px] -z-10" />
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex items-center gap-4 p-0 rounded-xl transition-all duration-500 hover:bg-white/[0.03] max-w-[360px]"
                style={{
                  background: "rgba(10, 10, 20, 0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    padding: "1px", // Border width
                    background: `
                      radial-gradient(circle at 0% 0%, rgba(255,255,255,0.6) 0%, transparent 50%),
                      radial-gradient(circle at 100% 100%, rgba(255,255,255,0.5) 0%, transparent 50%)`,
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />

                <GlassBadge stat={item.stat} />

                <div className="flex flex-col pr-4">
                  <span className="text-white font-bold text-[16px] leading-tight">
                    {item.title}
                  </span>
                  <span className="text-white/60 text-[14px] leading-snug mt-0.5">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
