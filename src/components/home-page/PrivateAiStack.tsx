import React from "react";

import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowBackground } from "../ui/GlowBackground";

type StackComponent = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const stackComponents: StackComponent[] = [
  {
    title: "User Interface",
    description: "Simple interface designed for non-technical users",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-11 h-11"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "API Gateway",
    description: "Secure gateway controlling internal AI access",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-11 h-11"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Local LLM",
    description: "AI models run directly on your infrastructure",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-11 h-11"
      >
        <path d="M12 3l1.9 5.8a1 1 0 00.9.7H21l-4.8 3.5a1 1 0 00-.4 1.1l1.9 5.8-4.8-3.5a1 1 0 00-1.2 0l-4.8 3.5 1.9-5.8a1 1 0 00-.4-1.1L3 9.5h6.2a1 1 0 00.9-.7L12 3z" />
      </svg>
    ),
  },
  {
    title: "Vector Store",
    description: "Vector database enabling contextual semantic search",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-11 h-11"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    title: "Business Data Integration",
    description: "Secure connection to internal business data",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-11 h-11"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
];

export default function PrivateAiStack() {
  return (
    <section className="px-6 md:px-12 relative font-poppins">
      <GlowBackground
        style={{
          top: "50%",
          left: "60%",
          width: "150%",
          height: "120%",
          background:
            "radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)",
          transform: "translate(-50%, -50%) rotate(-40deg) scale(1.25)",
          filter: "blur(100px)",
          opacity: 0.8,
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <SectionHeading size="large">
            Private <span className="text-[#606bfa]">AI Stack</span> Built for
            Your
            <br />
            Infrastructure
          </SectionHeading>
          <p className="mx-auto mt-8 max-w-3xl font-medium leading-relaxed text-white/80 md:text-[1.3rem]">
            Every component runs inside your infrastructure. Your data never
            <br className="hidden md:block" />
            leaves your network, and there are no third-party dependencies.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-2 md:gap-0 mt-16 mb-12 relative">
          {stackComponents.map((item, index) => (
            <React.Fragment key={item.title}>
              <div className="w-full md:w-[170px] flex flex-col items-center">
                {/* Icon Glass Card */}
                <div
                  className="w-[106px] h-[106px] mb-5 rounded-[12px] p-[5px] text-white relative group transition-all duration-500 hover:scale-[1.04]"
                  style={{
                    background: "transparent",
                    backdropFilter: "blur(14px) saturate(120%)",
                    border: "0.55px solid rgba(190, 205, 255, 0.26)",
                    boxShadow:
                      "0 12px 22px rgba(3, 7, 22, 0.42), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]"
                    style={{
                      backgroundImage: `
                        radial-gradient(
                          circle at top right, 
                          rgba(255, 255, 255, 0.5) 0%, 
                          transparent 20%
                        ),
                        radial-gradient(
                          circle at bottom left, 
                          rgba(255, 255, 255, 0.4) 0%, 
                          transparent 20%
                        )
                      `,
                    }}
                  />
                  {/* Inner nested tile */}
                  <div
                    className="relative h-full w-full rounded-[10px] flex items-center justify-center overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "0.7px solid rgba(170, 184, 245, 0.2)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    {/* The Icon */}
                    <div className="relative z-10 opacity-95 drop-shadow-[0_0_8px_rgba(255,255,255,0.22)]">
                      {item.icon}
                    </div>
                  </div>

                  {/* Subtle Bottom Glow on Hover */}
                  <div className="absolute -bottom-2 inset-x-8 h-4 bg-[#606bfa]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Text Content */}
                <div className="text-center px-1">
                  <h4 className="text-white font-bold text-lg mb-2 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-white font-light text-sm leading-snug max-w-[150px] mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Arrow Spacer */}
              {index < stackComponents.length - 1 && (
                <div className="hidden md:flex h-24 w-6 items-center justify-center opacity-70">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="mx-[-4px]"
                  >
                    <path
                      d="M2 12h20M15 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Sub-Bullets */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-24 text-center">
          <p className="text-white/30 text-[12px] font-normal tracking-wide">
            No dependency on third-party AI APIs
          </p>
          {/* Optional: subtle dot separator for desktop */}
          {/* <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" /> */}
          <p className="text-white/30 text-[12px] font-normal tracking-wide">
            No external data transfer
          </p>
          {/* <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" /> */}
          <p className="text-white/30 text-[12px] font-normal tracking-wide">
            Secure access for internal teams only
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <PrimaryButton href="/#contact">Explore Solutions</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
