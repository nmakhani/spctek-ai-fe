import React from "react";

type BusinessType = {
  title: string;
  description: string;
};

const businessTypes: BusinessType[] = [
  {
    title: "E-commerce Businesses",
    description:
      "Marketplace sellers managing Amazon, Shopify, PPC tools, and inventory systems.",
  },
  {
    title: "SaaS Startups",
    description:
      "Companies that are looking to implement AI securely within internal operations.",
  },
  {
    title: "Agencies & Service Businesses",
    description:
      "Teams managing multiple clients, processes, and internal workflows.",
  },
  {
    title: "Operations-Heavy SMBs",
    description:
      "Businesses with complex processes that benefit from automation and intelligent systems.",
  },
];

export default function BusinessAdoption() {
  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-heading text-[2.5rem] tracking-tight text-white md:text-[3.5rem] font-bold">
            For Businesses That Want to Adopt <br />
            <span className="text-[#606bfa]">AI </span>
            the Right Way
          </h2>
          <p className="mx-auto mt-6 max-w-3xl font-light leading-relaxed text-white/80 md:text-[1.3rem]">
            Designed for businesses that want to adopt AI with clarity, manage
            complex operations across multiple tools, and prioritize security
            and real-world workflows.
          </p>
        </div>

        {/* Business Types Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-[900px] mx-auto">
          {businessTypes.map((type) => (
            <div
              key={type.title}
              className="relative flex flex-col h-full rounded-[25px] p-10 transition-all duration-500 hover:scale-[1.01]"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Sharp Diagonal Highlights (Liquid Rim) */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "25px",
                  padding: "1.2px",
                  background:
                    "linear-gradient(135deg, #fff 0%, transparent 20%, transparent 80%, #fff 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  maskComposite: "exclude",
                  opacity: 0.8,
                }}
              />

              {/* Surface Gloss Glows */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[25px]"
                style={{
                  background:
                    "radial-gradient(circle at 0% 100%, rgba(255,255,255,0.3) 0%, transparent 25%)",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0 rounded-[25px]"
                style={{
                  background:
                    "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.3) 0%, transparent 30%)",
                }}
              />

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-[1.4rem] font-bold text-[#7c86fc] tracking-tight">
                  {type.title}
                </h3>
                <p className="mt-4 text-[1.1rem] font-medium leading-relaxed text-white/90">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA Button */}
        <div className="mt-16 flex justify-center">
          <button
            className="font-bold text-white transition-all active:scale-95"
            style={{
              borderRadius: "100px",
              padding: "1.1rem 3.5rem",
              fontSize: "1rem",
              background: "#5e69f8",
              boxShadow:
                "0 10px 25px rgba(94, 105, 248, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            Explore Solutions
          </button>
        </div>
      </div>
    </section>
  );
}
